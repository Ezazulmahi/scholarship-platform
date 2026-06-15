import os
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from rag.vector_store import search_scholarships
from rag.scholarships_data import SCHOLARSHIP_DOCS

def compute_match_score(scholarship, profile):
    score = 50
    reasons = []
    try:
        cgpa = float(str(profile.get("cgpa", "0")).split("/")[0])
        min_cgpa = scholarship.get("min_cgpa", 3.0)
        if cgpa >= min_cgpa + 0.3:
            score += 20
            reasons.append("CGPA well above minimum")
        elif cgpa >= min_cgpa:
            score += 10
            reasons.append("CGPA meets minimum")
        else:
            score -= 20
            reasons.append("CGPA below minimum")
    except (ValueError, TypeError):
        pass
    try:
        ielts = float(str(profile.get("ielts", "0")))
        ielts_min = scholarship.get("ielts_min", 6.5)
        if ielts >= ielts_min + 0.5:
            score += 15
        elif ielts >= ielts_min:
            score += 8
        else:
            score -= 15
    except (ValueError, TypeError):
        pass
    if scholarship.get("gre_required") and not profile.get("gre"):
        score -= 10
        reasons.append("GRE required but not provided")
    profile_countries = [c.strip().lower() for c in str(profile.get("preferred_countries", "")).split(",")]
    if scholarship.get("country", "").lower() in profile_countries or not profile_countries:
        score += 10
    profile_field = str(profile.get("field", "")).lower()
    sch_field = str(scholarship.get("field", "")).lower()
    for word in set(profile_field.split()):
        if len(word) > 3 and word in sch_field:
            score += 5
            break
    return {"score": min(max(score, 10), 99), "reasons": reasons}

def rank_scholarships(profile):
    results = []
    for s in SCHOLARSHIP_DOCS:
        match = compute_match_score(s, profile)
        results.append({
            "id": s["id"],
            "name": s["name"],
            "country": s["country"],
            "level": s["level"],
            "funding": s["funding"],
            "deadline": s["deadline"],
            "url": s.get("url", ""),
            "match": match["score"],
            "reasons": match["reasons"],
            "type": "Fully funded" if "full" in s["funding"].lower() else "Partial",
        })
    results.sort(key=lambda x: x["match"], reverse=True)
    return results

_llm = None

def get_match_insight(profile, top_scholarship):
    global _llm
    if _llm is None:
        _llm = ChatGroq(
            model="llama-3.3-70b-versatile",
            temperature=0.3,
            api_key=os.environ.get("GROQ_API_KEY"),
        )
    docs = search_scholarships(top_scholarship["name"], k=2)
    context = "\n".join(d.page_content[:400] for d in docs)
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a scholarship advisor. Give a single helpful sentence (max 25 words) explaining why this scholarship is the top match for this student. Be specific."),
        ("human", f"Student: CGPA {profile.get('cgpa')}, IELTS {profile.get('ielts')}, field: {profile.get('field')}.\nTop match: {top_scholarship['name']} ({top_scholarship['match']}% match).\nContext: {context}"),
    ])
    return (prompt | _llm | StrOutputParser()).invoke({})