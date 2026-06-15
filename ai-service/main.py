"""
ScholarPath AI Service
FastAPI + LangChain + RAG + Claude API

Endpoints:
  POST /sop/generate         — Generate a personalised SOP
  POST /scholarships/match   — Match + rank scholarships against a profile
  GET  /scholarships/all     — Return all scholarships in the knowledge base
  POST /costing/estimate     — Yearly cost breakdown for a country
  GET  /costing/summary      — All countries summary (for bar chart)
  POST /advisor/chat         — Conversational AI advisor
  POST /dashboard/insights   — AI-generated dashboard stats for a profile
"""

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="ScholarPath AI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5000",
        os.getenv("FRONTEND_URL", "http://localhost:3000"),
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Models ────────────────────────────────────────────────────────────────────

class ProfileModel(BaseModel):
    name: str = "Student"
    university: str = ""
    degree: str = ""
    cgpa: str = ""
    ielts: str = ""
    gre: str = ""
    field: str = ""
    target_degree: str = "Master's"
    preferred_countries: str = ""
    budget_range: str = "Fully funded only"
    short_bio: str = ""


class SopRequest(BaseModel):
    scholarship: str
    motivation: str
    tone: str = "Academic"
    length: str = "800 words"
    profile: ProfileModel = ProfileModel()


class CostingRequest(BaseModel):
    country: str
    scholarship_discount: float = 0
    profile: ProfileModel = ProfileModel()


class AdvisorRequest(BaseModel):
    message: str
    profile: ProfileModel = ProfileModel()
    history: list[dict] = []


class DashboardRequest(BaseModel):
    profile: ProfileModel = ProfileModel()


# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "ScholarPath AI Service running", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/sop/generate")
def generate_sop(req: SopRequest):
    from chains.sop_chain import generate_sop as _generate

    word_targets = {"500 words": 500, "800 words": 800, "1000 words": 1000}
    target_words = word_targets.get(req.length, 800)

    try:
        sop = _generate(
            scholarship=req.scholarship,
            motivation=req.motivation,
            tone=req.tone,
            target_words=target_words,
            profile=req.profile.model_dump(),
        )
        word_count = len(sop.split())
        return {"sop": sop, "word_count": word_count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/scholarships/match")
def match_scholarships(profile: ProfileModel):
    from chains.scholarship_chain import rank_scholarships, get_match_insight

    try:
        ranked = rank_scholarships(profile.model_dump())
        top = ranked[0] if ranked else None
        insight = ""
        if top:
            try:
                insight = get_match_insight(profile.model_dump(), top)
            except Exception:
                insight = f"Your {profile.cgpa} CGPA meets the bar for {top['name']}."
        return {"scholarships": ranked, "top_insight": insight}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/scholarships/all")
def all_scholarships():
    from rag.scholarships_data import SCHOLARSHIP_DOCS
    return {"scholarships": SCHOLARSHIP_DOCS}


@app.post("/costing/estimate")
def costing_estimate(req: CostingRequest):
    from chains.costing_chain import get_costing_breakdown, get_costing_advice

    result = get_costing_breakdown(
        country=req.country,
        scholarship_discount=req.scholarship_discount,
        profile=req.profile.model_dump(),
    )

    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])

    try:
        tip = get_costing_advice(req.country, req.profile.model_dump())
        result["ai_tip"] = tip
    except Exception:
        result["ai_tip"] = ""

    return result


@app.get("/costing/summary")
def costing_summary():
    from chains.costing_chain import get_all_countries_summary
    return {"countries": get_all_countries_summary()}


@app.post("/advisor/chat")
def advisor_chat(req: AdvisorRequest):
    from chains.advisor_chain import chat_with_advisor

    try:
        reply = chat_with_advisor(
            message=req.message,
            profile=req.profile.model_dump(),
            history=req.history,
        )
        return {"reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/dashboard/insights")
def dashboard_insights(req: DashboardRequest):
    from chains.advisor_chain import get_dashboard_insights

    try:
        insights = get_dashboard_insights(req.profile.model_dump())
        return insights
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
