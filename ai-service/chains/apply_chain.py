import os
import json
import re
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

_llm = None

def get_llm():
    global _llm
    if _llm is None:
        _llm = ChatGroq(
            model="llama-3.3-70b-versatile",
            temperature=0.3,
            api_key=os.environ.get("GROQ_API_KEY"),
        )
    return _llm

COUNTRY_STATIC = {
    "Austria": {
        "flag": "🇦🇹",
        "path": "MSc Admission Path",
        "timeline": "~6 months",
        "timelineNote": "Apply 8–10 months before intake",
        "docs": ["Transcript", "Degree cert", "SOP", "2× LOR", "IELTS 6.5+", "Passport", "Apostille", "Proof of funds"],
        "blocked_account": True,
        "blocked_amount": "€1,200/mo",
    },
    "Italy": {
        "flag": "🇮🇹",
        "path": "MSc Admission Path",
        "timeline": "~5 months",
        "timelineNote": "Apply via universitaly.it portal",
        "docs": ["Transcript", "Degree cert", "Dichiarazione di Valore", "SOP", "2× LOR", "IELTS 6+", "Passport"],
        "blocked_account": False,
        "blocked_amount": None,
    },
    "UK": {
        "flag": "🇬🇧",
        "path": "Master's Admission Path",
        "timeline": "~4 months",
        "timelineNote": "Apply through university directly",
        "docs": ["Transcript", "Degree cert", "SOP", "2× LOR", "IELTS 6.5+", "Passport", "Bank statement", "CAS number"],
        "blocked_account": False,
        "blocked_amount": None,
    },
    "USA": {
        "flag": "🇺🇸",
        "path": "Master's/PhD Admission Path",
        "timeline": "~8 months",
        "timelineNote": "Apply Oct–Jan for fall intake",
        "docs": ["Transcript", "Degree cert", "SOP", "3× LOR", "GRE scores", "TOEFL/IELTS", "Passport", "I-20", "SEVIS receipt"],
        "blocked_account": False,
        "blocked_amount": None,
    },
    "Germany": {
        "flag": "🇩🇪",
        "path": "MSc Admission Path",
        "timeline": "~7 months",
        "timelineNote": "Apply via uni-assist for many universities",
        "docs": ["Transcript", "Degree cert", "APS cert", "SOP", "2× LOR", "German B2 / IELTS 6.5+", "Passport", "Blocked account proof"],
        "blocked_account": True,
        "blocked_amount": "€11,208",
    },
}

FALLBACK_STEPS = {
    "Austria": [
        {"n": 1, "title": "Pick programme & check entry", "desc": "Confirm your CGPA meets the minimum and the language of instruction (English-taught vs German)."},
        {"n": 2, "title": "Prepare documents", "desc": "Transcript, degree certificate, CV, SOP, 2 LORs, IELTS/TOEFL, passport. Some need notarised + Apostille."},
        {"n": 3, "title": "Apply online + pay fee", "desc": "Submit via the university portal. Track admission letter (Zulassungsbescheid)."},
        {"n": 4, "title": "Student visa (D-visa)", "desc": "Show proof of funds (~€1,200/mo), insurance, accommodation, admission letter at the Austrian embassy."},
        {"n": 5, "title": "Residence permit on arrival", "desc": "Register address & convert to residence permit within the first weeks."},
    ],
    "Italy": [
        {"n": 1, "title": "Apply via Universitaly", "desc": "Submit pre-enrolment form and documents on universitaly.it before the deadline."},
        {"n": 2, "title": "Dichiarazione di Valore", "desc": "Get your degree recognised via the Italian embassy in your home country."},
        {"n": 3, "title": "Student visa (Type D)", "desc": "Attend visa appointment with acceptance + proof of funds (€6,079/yr min)."},
        {"n": 4, "title": "Permesso di Soggiorno", "desc": "Register for residence permit within 8 days of arrival at police HQ."},
    ],
    "UK": [
        {"n": 1, "title": "Apply via university portal", "desc": "Submit application with all documents. Some universities use a common portal."},
        {"n": 2, "title": "Accept offer + pay deposit", "desc": "Confirm your place and pay any required tuition deposit."},
        {"n": 3, "title": "Student visa (CAS)", "desc": "Get your Confirmation of Acceptance for Studies and apply for a Student visa."},
        {"n": 4, "title": "NHS surcharge + biometrics", "desc": "Pay Immigration Health Surcharge and complete biometric appointment."},
    ],
    "USA": [
        {"n": 1, "title": "Research programmes + GRE", "desc": "GRE scores required by many programmes. Take it 3+ months before applying."},
        {"n": 2, "title": "Submit applications", "desc": "Apply via each university portal. Pay application fee ($50–$100 each)."},
        {"n": 3, "title": "Accept offer + I-20", "desc": "Choose programme, pay deposit, receive I-20 from the university."},
        {"n": 4, "title": "F-1 visa + SEVIS", "desc": "Pay SEVIS fee, schedule visa interview, show I-20 + financial proof."},
        {"n": 5, "title": "Port of entry", "desc": "Carry I-20 and all docs. Enter no earlier than 30 days before programme starts."},
    ],
    "Germany": [
        {"n": 1, "title": "Apply via uni-assist / portal", "desc": "Many German universities use uni-assist. Submit transcripts (with certified translations)."},
        {"n": 2, "title": "Get blocked account (Sperrkonto)", "desc": "Open a blocked bank account with ~€11,208 — required for visa."},
        {"n": 3, "title": "Language cert + APS", "desc": "Bangladeshi students need APS certificate. German or English cert depending on programme."},
        {"n": 4, "title": "Student visa", "desc": "Submit visa at German embassy with blocked account, APS, and admission letter."},
        {"n": 5, "title": "Anmeldung on arrival", "desc": "Register address (Anmeldung) within 2 weeks. Required for all residents."},
    ],
}

def get_apply_guide(country: str, profile: dict) -> dict:
    static = COUNTRY_STATIC.get(country)
    if not static:
        return {"error": f"No application guide available for {country}"}

    tips_fallback = {
        "Austria": "Austria's blocked-account proof and Apostille can take 3–4 weeks — start these before you even get the admission letter.",
        "Italy": "The Dichiarazione di Valore from the Italian embassy can take 2–3 months. Start immediately after admission.",
        "UK": "Apply for the Student visa no earlier than 6 months before your course start date. Allow 3 weeks for processing.",
        "USA": "US visa interviews are in high demand. Book your appointment slot as soon as you receive the I-20, months in advance.",
        "Germany": "The APS certificate (for Bangladeshi students) takes 4–6 weeks and requires submitting original documents.",
    }

    try:
        llm = get_llm()

        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are an expert international student advisor specializing in graduate admissions.
Generate a personalised key tip for a student applying to {country} for a Master's programme.
The tip must be:
- Specific to {country}'s admission/visa process
- Actionable and time-sensitive
- Max 40 words
- Tailored to the student's background if relevant
Return ONLY the tip text, no preamble."""),
            ("human", "Student from Bangladesh. CGPA: {cgpa}, IELTS: {ielts}, field: {field}. Country: {country}. Give the most important tip."),
        ])

        tip = (prompt | llm | StrOutputParser()).invoke({
            "country": country,
            "cgpa": profile.get("cgpa", "3.8"),
            "ielts": profile.get("ielts", "7.5"),
            "field": profile.get("field", "Computer Science"),
        })
        tip = tip.strip()

    except Exception as e:
        print(f"[apply_guide] LLM error for {country}: {e}")
        tip = tips_fallback.get(country, "Start your application process early — most visa steps take longer than expected.")

    steps = FALLBACK_STEPS.get(country, [])

    return {
        "country": country,
        "flag": static["flag"],
        "path": static["path"],
        "timeline": static["timeline"],
        "timelineNote": static["timelineNote"],
        "steps": steps,
        "docs": static["docs"],
        "tip": tip,
        "blocked_account": static["blocked_account"],
        "blocked_amount": static.get("blocked_amount"),
    }

def get_available_countries() -> list:
    return [
        {"country": c, "flag": v["flag"], "timeline": v["timeline"]}
        for c, v in COUNTRY_STATIC.items()
    ]