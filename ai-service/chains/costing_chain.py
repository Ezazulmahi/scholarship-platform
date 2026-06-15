from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from rag.scholarships_data import COSTING_DATA


def get_costing_breakdown(country, scholarship_discount=0, profile=None):
    data = COSTING_DATA.get(country)
    if not data:
        return {"error": f"No costing data for {country}"}

    gross = (
        data["tuition_eur"]
        + data["living_eur"]
        + data["insurance_eur"]
        + data["visa_eur"]
        + data["one_time_eur"]
    )
    discount = scholarship_discount if scholarship_discount > 0 else data.get("typical_scholarship_discount", 0)
    net = max(gross - discount, 0)

    breakdown = [
        {"label": "Tuition", "amount": data["tuition_eur"]},
        {"label": "Living + rent (12 mo)", "amount": data["living_eur"]},
        {"label": "Health insurance", "amount": data["insurance_eur"]},
        {"label": "Visa + permits", "amount": data["visa_eur"]},
        {"label": "One-time costs", "amount": data["one_time_eur"]},
    ]
    if discount > 0:
        breakdown.append({"label": "Scholarship discount", "amount": -discount, "isDiscount": True})

    return {
        "country": country,
        "gross_eur": gross,
        "net_eur": net,
        "breakdown": breakdown,
        "blocked_account_required": data.get("blocked_account_required", False),
        "blocked_account_amount": data.get("blocked_account_amount"),
        "notes": data.get("notes", ""),
        "cities": data.get("cities", {}),
    }


def get_all_countries_summary():
    results = []
    for country, data in COSTING_DATA.items():
        gross = (
            data["tuition_eur"] + data["living_eur"]
            + data["insurance_eur"] + data["visa_eur"] + data["one_time_eur"]
        )
        net = max(gross - data.get("typical_scholarship_discount", 0), 0)
        results.append({
            "country": country,
            "gross_eur": gross,
            "net_eur": net,
            "label": f"€{round(net / 1000, 1)}k",
        })
    return results


_llm = None


def get_costing_advice(country, profile):
    global _llm
    if _llm is None:
        _llm = ChatOpenAI(model="gpt-4o-mini", max_tokens=80)

    data = COSTING_DATA.get(country, {})
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a financial advisor for international students. Give ONE practical money-saving tip (max 30 words) for a student studying in this country. Be specific and actionable."),
        ("human", f"Country: {country}. Tuition: €{data.get('tuition_eur', 0)}, living: €{data.get('living_eur', 0)}/yr. Budget preference: {profile.get('budget_range', 'Fully funded only')}."),
    ])
    return (prompt | _llm | StrOutputParser()).invoke({})
