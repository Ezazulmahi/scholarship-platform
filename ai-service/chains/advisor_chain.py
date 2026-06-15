import json
import re
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from rag.vector_store import search_scholarships

_llm = None

def get_llm():
    global _llm
    if _llm is None:
        _llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.4)
    return _llm

def chat_with_advisor(message, profile, history=None):
    llm = get_llm()
    docs = search_scholarships(message, k=3)
    rag_context = "\n\n".join(d.page_content[:600] for d in docs)
    system_prompt = f"""You are ScholarPath's AI advisor — a knowledgeable, warm, and direct scholarship counsellor.

Student profile:
- Name: {profile.get('name', 'Student')}
- CGPA: {profile.get('cgpa', 'Not provided')} / 4.00
- IELTS: {profile.get('ielts', 'Not provided')}
- Field: {profile.get('field', 'Not specified')}
- Target degree: {profile.get('target_degree', "Master's")}
- Preferred countries: {profile.get('preferred_countries', 'Not specified')}

Relevant scholarship knowledge:
{rag_context}

Guidelines:
- Be direct and specific — cite actual scholarship names and numbers
- Keep answers under 150 words unless a detailed breakdown is needed
- Never invent scholarship details not in the context
- Reference the student's actual profile when relevant
"""
    messages = [("system", system_prompt)]
    if history:
        for h in (history or [])[-6:]:
            role = "human" if h["role"] == "user" else "ai"
            messages.append((role, h["text"]))
    messages.append(("human", message))
    prompt = ChatPromptTemplate.from_messages(messages)
    return (prompt | llm | StrOutputParser()).invoke({})

def get_dashboard_insights(profile):
    llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.2)
    docs = search_scholarships(
        f"{profile.get('field', '')} {profile.get('preferred_countries', '')} MSc scholarship",
        k=6,
    )
    rag_context = "\n".join(d.page_content[:300] for d in docs)
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are a scholarship matching engine. Based on the student profile and scholarship database,
return ONLY a valid JSON object with these exact keys:
- profile_strength: integer 0-100
- open_applications: integer
- upcoming_deadlines: integer
- saved_scholarships: integer
- top_match_name: string
- top_match_score: integer 0-100
- top_match_country: string
- top_match_funding: string
- top_match_deadline: string (e.g. "4 days", "3 weeks")
- weekly_insight: string (max 20 words)

Scholarship context:
{rag_context}
"""),
        ("human", """Student: CGPA {cgpa}, IELTS {ielts}, GRE: {gre}, field: {field}, target: {target_degree}, countries: {preferred_countries}
Documents: transcript, CV, IELTS, passport, SOP draft (LORs pending)
Return JSON only:"""),
    ])
    raw = (prompt | llm | StrOutputParser()).invoke({
        "rag_context": rag_context,
        "cgpa": profile.get("cgpa", "3.5"),
        "ielts": profile.get("ielts", "7.0"),
        "gre": profile.get("gre", "not provided"),
        "field": profile.get("field", "Computer Science"),
        "target_degree": profile.get("target_degree", "Master's"),
        "preferred_countries": profile.get("preferred_countries", "Austria, Germany, UK"),
    })
    try:
        match = re.search(r'\{.*\}', raw, re.DOTALL)
        if match:
            return json.loads(match.group())
    except (json.JSONDecodeError, AttributeError):
        pass
    return {
        "profile_strength": 85,
        "open_applications": 5,
        "upcoming_deadlines": 3,
        "saved_scholarships": 16,
        "top_match_name": "Aurora Research Award",
        "top_match_score": 91,
        "top_match_country": "Austria",
        "top_match_funding": "Full tuition + €1,100/mo",
        "top_match_deadline": "4 days",
        "weekly_insight": "Your profile clears eligibility for most EU scholarships — focus on your SOP.",
    }