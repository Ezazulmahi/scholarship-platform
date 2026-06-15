import os
import json
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

def _parse_json(raw: str) -> dict | list:
    """Strip markdown fences and parse JSON safely."""
    clean = raw.strip()
    for fence in ("```json", "```"):
        clean = clean.removeprefix(fence)
    clean = clean.removesuffix("```").strip()
    return json.loads(clean)


# ── Static data ───────────────────────────────────────────────────────────────

COUNTRIES = [
    {"country": "Germany",     "flag": "🇩🇪"},
    {"country": "Austria",     "flag": "🇦🇹"},
    {"country": "Italy",       "flag": "🇮🇹"},
    {"country": "UK",          "flag": "🇬🇧"},
    {"country": "Netherlands", "flag": "🇳🇱"},
    {"country": "Sweden",      "flag": "🇸🇪"},
    {"country": "France",      "flag": "🇫🇷"},
    {"country": "USA",         "flag": "🇺🇸"},
    {"country": "Canada",      "flag": "🇨🇦"},
    {"country": "Australia",   "flag": "🇦🇺"},
]

# Static gross yearly cost estimates (tuition avg + living + insurance + visa + one-off)
COUNTRY_GROSS_EUR = {
    "Germany":     14_958,
    "Austria":     16_050,
    "Italy":       14_100,
    "UK":          28_700,
    "Netherlands": 18_500,
    "Sweden":      13_050,
    "France":      13_450,
    "USA":         34_000,
    "Canada":      26_100,
    "Australia":   29_000,
}

# Per-country living/insurance/visa breakdown used in estimate
LIVING_EUR = {
    "Germany": 10_800, "Austria": 11_400, "Italy":  9_600,
    "UK":      14_400, "Netherlands": 12_000, "Sweden": 11_400,
    "France":  10_200, "USA": 18_000,    "Canada": 15_600, "Australia": 16_800,
}
INSURANCE_EUR = {
    "Germany": 1_200, "Austria": 900,  "Italy":  700,
    "UK":      0,     "Netherlands": 1_100, "Sweden": 300,
    "France":  600,   "USA": 2_400,    "Canada": 800, "Australia": 700,
}
VISA_EUR = {
    "Germany": 450, "Austria": 350, "Italy":  300,
    "UK":      800, "Netherlands": 400, "Sweden": 350,
    "France":  350, "USA": 600,     "Canada": 500, "Australia": 700,
}
BLOCKED_ACCOUNTS = {
    "Germany": {"required": True,  "amount": 11_208},
    "Austria": {"required": True,  "amount": 14_400},
    "Italy":   {"required": False, "amount": None},
    "UK":      {"required": False, "amount": None},
    "Netherlands": {"required": False, "amount": None},
    "Sweden":  {"required": False, "amount": None},
    "France":  {"required": False, "amount": None},
    "USA":     {"required": False, "amount": None},
    "Canada":  {"required": False, "amount": None},
    "Australia": {"required": False, "amount": None},
}


# ── Public functions (called by FastAPI routes) ───────────────────────────────

def get_countries() -> dict:
    return {"countries": COUNTRIES}


def get_countries_summary() -> dict:
    return {
        "countries": [
            {
                "country": c["country"],
                "flag": c["flag"],
                "gross_eur": COUNTRY_GROSS_EUR.get(c["country"], 15_000),
                "label": f"€{round(COUNTRY_GROSS_EUR.get(c['country'], 15_000) / 1_000):.0f}k",
            }
            for c in COUNTRIES
        ]
    }


def get_universities(country: str) -> dict:
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are a university database for international students.
Return ONLY a valid JSON object — no markdown, no explanation, no backticks.
Schema:
{{
  "country": "{country}",
  "universities": [
    {{
      "id": "<lowercase-slug>",
      "name": "<full official English name>",
      "city": "<city>",
      "rank_qs": <integer or null>,
      "type": "public" or "private",
      "tuition_range_eur": "<e.g. €0–€1,500/yr>",
      "notable_for": "<one sentence strength>",
      "website": "<official university homepage URL e.g. https://www.tum.de>"
    }}
  ]
}}
List 6–8 real universities in {country} that accept international Master's students and have English-taught programmes.
Order by QS world ranking ascending (best first).
For website, provide the real official homepage URL of each university."""),
        ("human", "List universities in {country}."),
    ])
    try:
        raw = (prompt | get_llm() | StrOutputParser()).invoke({"country": country})
        return _parse_json(raw)
    except Exception as e:
        print(f"[get_universities] {country}: {e}")
        return {"country": country, "universities": []}


def get_subjects(country: str, university_id: str, university_name: str) -> dict:
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are a university programme advisor.
Return ONLY a valid JSON object — no markdown, no explanation, no backticks.
Schema:
{{
  "university": "{university_name}",
  "programmes": [
    {{
      "id": "<lowercase-slug>",
      "title": "<exact programme name>",
      "degree": "MSc" or "MA" or "MEng" or "MBA" or "PhD",
      "duration_years": <number>,
      "language": "English",
      "tuition_eur_per_year": <integer>,
      "scholarship_available": true or false,
      "scholarship_name": "<name or null>",
      "application_deadline": "<e.g. Jan 15 or Rolling>",
      "programme_url": "<direct URL to this programme page, or null if unsure>"
    }}
  ]
}}
List 6–10 Master's and PhD programmes taught FULLY IN ENGLISH at {university_name} in {country}.
Only include programmes that genuinely exist. Be accurate with tuition fees.
For programme_url, provide the real direct link to the programme page if you know it, otherwise null."""),
        ("human", "List English-taught programmes at {university_name} in {country}."),
    ])
    try:
        raw = (prompt | get_llm() | StrOutputParser()).invoke({
            "country": country,
            "university_name": university_name,
        })
        return _parse_json(raw)
    except Exception as e:
        print(f"[get_subjects] {university_name}: {e}")
        return {"university": university_name, "programmes": []}


def _search_url(query: str) -> str:
    """Generate a Google search URL as a safe fallback."""
    import urllib.parse
    return f"https://www.google.com/search?q={urllib.parse.quote(query)}"


def get_programme_costing(
    country: str,
    university_name: str,
    programme_title: str,
    tuition_eur_per_year: int,
    profile: dict,
    university_website: str = "",
    programme_url: str = "",
) -> dict:
    living  = LIVING_EUR.get(country, 12_000)
    insur   = INSURANCE_EUR.get(country, 800)
    visa    = VISA_EUR.get(country, 400)
    one_off = 1_500  # flights + setup
    gross   = tuition_eur_per_year + living + insur + visa + one_off

    breakdown = [
        {"label": "Tuition",                       "amount": tuition_eur_per_year},
        {"label": "Living + rent (12 mo)",          "amount": living},
        {"label": "Health insurance",               "amount": insur},
        {"label": "Visa + permits",                 "amount": visa},
        {"label": "One-time costs (flight + setup)","amount": one_off},
    ]

    ba = BLOCKED_ACCOUNTS.get(country, {"required": False, "amount": None})

    # AI tip
    try:
        tip_prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a financial advisor for international students. Give ONE practical money-saving tip in max 35 words. Be specific to the country and programme. No preamble, no bullet points."),
            ("human", "Student from Bangladesh applying for {programme} at {university} in {country}. Tuition: €{tuition}/yr, living: €{living}/yr. Budget preference: {budget}."),
        ])
        ai_tip = (tip_prompt | get_llm() | StrOutputParser()).invoke({
            "programme": programme_title,
            "university": university_name,
            "country": country,
            "tuition": tuition_eur_per_year,
            "living": living,
            "budget": profile.get("budget_range", "Fully funded only"),
        }).strip()
    except Exception as e:
        print(f"[get_programme_costing] tip error: {e}")
        ai_tip = "Apply for university-specific scholarships early — many have separate applications from the main admission process."

    # Resolve URLs — use provided ones or fall back to search
    uni_url  = university_website if university_website and university_website.startswith("http") \
               else _search_url(f"{university_name} official website")
    prog_url = programme_url if programme_url and programme_url.startswith("http") \
               else _search_url(f"{programme_title} {university_name} programme")

    return {
        "country": country,
        "university": university_name,
        "programme": programme_title,
        "gross_eur": gross,
        "net_eur": gross,
        "breakdown": breakdown,
        "blocked_account_required": ba["required"],
        "blocked_account_amount": ba["amount"],
        "ai_tip": ai_tip,
        "university_url": uni_url,
        "programme_url": prog_url,
    }