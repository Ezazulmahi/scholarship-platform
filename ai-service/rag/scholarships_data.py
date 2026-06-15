"""
Scholarship knowledge base for RAG.
Each entry is a structured document that gets embedded into Chroma.
"""

SCHOLARSHIP_DOCS = [
    {
        "id": "aurora-research-award",
        "name": "Aurora Research Award",
        "country": "Austria",
        "university": "TU Wien / University of Vienna",
        "level": "MSc",
        "field": "STEM, Machine Learning, Computer Science, Physics",
        "funding": "Full tuition + €1,100/month stipend",
        "duration": "24 months",
        "deadline": "Rolling — usually March each year",
        "min_cgpa": 3.5,
        "ielts_min": 6.5,
        "gre_required": False,
        "requirements": "Transcript, SOP, 2 LORs, CV, language cert, passport",
        "content": """
The Aurora Research Award is a fully funded scholarship for international MSc students
at Austrian universities. It covers full tuition and provides a monthly stipend of €1,100
for living expenses. The programme targets students in STEM fields particularly Machine
Learning, AI, Computer Science, and Physics.

Eligibility: Minimum CGPA of 3.5/4.00, IELTS 6.5+ or TOEFL 88+. GRE not required.
Documents: Academic transcript, Statement of Purpose, two letters of recommendation,
CV, language certificate, copy of passport.

Application is done through the university portal directly. Austria uses a blocked account
requirement for visa (~€1,200/month proof of funds), but the scholarship covers this.
Apostille of degree certificate typically takes 3-4 weeks. Apply 8-10 months before intake.
""",
    },
    {
        "id": "italian-govt-maeci",
        "name": "Italian Government MAECI Scholarship",
        "country": "Italy",
        "university": "Politecnico di Milano, University of Bologna, and others",
        "level": "MSc / PhD",
        "field": "All fields including Engineering, Sciences, Humanities",
        "funding": "€9,000/year + tuition waiver",
        "duration": "12–36 months",
        "deadline": "Usually April–May each year",
        "min_cgpa": 3.0,
        "ielts_min": 6.0,
        "gre_required": False,
        "requirements": "Dichiarazione di Valore, SOP, LORs, transcript, language cert",
        "content": """
The Italian Government MAECI (Ministry of Foreign Affairs) Scholarship offers international
students funding for study in Italy. The scholarship provides €9,000/year stipend plus full
tuition waiver at participating Italian universities.

Eligibility: CGPA of 3.0+ preferred. IELTS 6.0+ for English-taught programmes,
B2 Italian for Italian-taught programmes.

Key document: Dichiarazione di Valore (recognition of your foreign degree by the Italian
embassy in your home country). This takes 2-3 months — start immediately after admission.

Application via Universitaly portal. Italy offers excellent value: EU public universities
have low fees (€2,000–3,000/yr) and living costs in cities like Bologna are lower than
Western Europe. Politecnico di Milano is highly ranked for Engineering.
""",
    },
    {
        "id": "chevening",
        "name": "Chevening Scholarship (UK)",
        "country": "United Kingdom",
        "university": "Any eligible UK university",
        "level": "Master's (1 year)",
        "field": "All fields; preference for leadership potential",
        "funding": "Full tuition + living allowance + travel",
        "duration": "12 months",
        "deadline": "November each year (for following autumn intake)",
        "min_cgpa": 3.2,
        "ielts_min": 6.5,
        "gre_required": False,
        "requirements": "Online application, 4 essays, 2 LORs, transcript, English cert",
        "content": """
The Chevening Scholarship is the UK government's flagship international scholarship,
awarded to future leaders. It covers full tuition at any eligible UK university plus
a monthly living allowance and travel costs.

Eligibility: Minimum 2:1 undergraduate degree (equivalent to 3.2+ GPA). IELTS 6.5+
with no component below 5.5. At least 2 years work experience in most fields.
Strong leadership qualities and community involvement required.

Essays focus on: leadership, networking, your future career plans, and why you chose
your specific course. The scholarship is highly competitive (1-2% acceptance rate).

UK costs are high: international tuition £15,000–30,000+. Living in London ~£1,600/month.
Chevening covers it all but you need to show substantial personal statement quality.
Apply November, hear back May/June for October start.
""",
    },
    {
        "id": "fulbright-foreign-student",
        "name": "Fulbright Foreign Student Program",
        "country": "United States",
        "university": "US universities (placement by Fulbright Commission)",
        "level": "Master's / PhD",
        "field": "All fields",
        "funding": "Full tuition + monthly stipend + travel",
        "duration": "1–3 years",
        "deadline": "Varies by country — usually May-August for following year",
        "min_cgpa": 3.3,
        "ielts_min": 7.0,
        "gre_required": True,
        "requirements": "Application essays, GRE, TOEFL/IELTS, LORs, transcript, research proposal",
        "content": """
The Fulbright Foreign Student Program is the US government's premier scholarship for
international students. It covers full tuition, living stipend, health insurance, and
travel costs. Students are placed at US universities based on their research area.

Eligibility: Strong academic record (3.3+ GPA), GRE required for most programmes,
TOEFL 80+ or IELTS 7.0+. Leadership potential and cultural exchange commitment essential.

The application requires personal statements, research proposals, and recommendation letters.
US universities are expensive ($25,000–55,000/year tuition) but Fulbright covers everything.

GRE scores are critical: aim for 155+ Verbal, 160+ Quantitative for CS/ML programmes.
Apply through Bangladesh-US Educational Foundation (USEFB) for Bangladeshi students.
Interviews are typically held December-January for following autumn intake.
""",
    },
    {
        "id": "daad-epos",
        "name": "DAAD EPOS Scholarship",
        "country": "Germany",
        "university": "German universities",
        "level": "MSc / PhD",
        "field": "Development-related fields, Engineering, Natural Sciences, Economics",
        "funding": "€934/month stipend + tuition (Germany has no tuition)",
        "duration": "12–36 months",
        "deadline": "Usually October for winter semester intake",
        "min_cgpa": 3.0,
        "ielts_min": 6.0,
        "gre_required": False,
        "requirements": "DAAD application form, transcript, LORs, SOP, language cert, APS certificate",
        "content": """
The DAAD EPOS (Development-Related Postgraduate Courses) scholarship is funded by the
German government for students from developing countries. Germany charges no tuition at
public universities — the scholarship provides €934/month living stipend plus health
insurance.

Eligibility: Minimum GPA of 3.0/4.00 or equivalent, IELTS 6.0+ or relevant German cert.
For Bangladeshi students: APS certificate required (takes 4-6 weeks, submit originals).

Key requirement: Blocked account (Sperrkonto) with ~€11,208 for student visa.
While the scholarship covers living costs, you need this account for visa purposes.

Germany is excellent value: Munich, Berlin, and Hamburg have strong CS/ML programmes.
Apply through DAAD portal. Strong preference for development-relevant research topics.
Anmeldung (address registration) required within 2 weeks of arrival.
""",
    },
    {
        "id": "erasmus-mundus",
        "name": "Erasmus Mundus Joint Master",
        "country": "Multiple EU countries",
        "university": "Consortium of European universities",
        "level": "MSc (Joint Degree)",
        "field": "Varies by programme — CS, ML, Data Science, and many others available",
        "funding": "€1,400/month + tuition waiver + travel",
        "duration": "24 months",
        "deadline": "Usually January–February each year",
        "min_cgpa": 3.5,
        "ielts_min": 6.5,
        "gre_required": False,
        "requirements": "Online application, motivation letter, 2 LORs, transcript, English cert",
        "content": """
Erasmus Mundus Joint Master Degrees are prestigious European Commission-funded programmes
where students study at 2-3 European universities. Third-country (non-EU) scholarship
holders receive €1,400/month stipend + full tuition waiver + travel allowance.

Eligibility: Strong academic record (3.5+ GPA), IELTS 6.5+. No GRE needed.
You study in multiple countries — excellent for networking and cultural exposure.

Popular programmes for CS/ML students: EMJM in Machine Learning for Data Science,
EMJM in Big Data Management and Analytics (BDMA), EMJM in Computer Vision and Robotics.

The joint degree is highly valued by employers. Application is competitive but straightforward.
Motivation letter should clearly explain why you chose the specific programme.
Results are typically announced in May for September intake.
""",
    },
]


COSTING_DATA = {
    "Austria": {
        "tuition_eur": 1500,
        "living_eur": 11400,
        "insurance_eur": 700,
        "visa_eur": 220,
        "one_time_eur": 500,
        "typical_scholarship_discount": 4620,
        "blocked_account_required": True,
        "blocked_account_amount": 14400,
        "notes": "Austria's public universities have low tuition. Blocked account proof (~€1,200/month) needed for visa.",
        "cities": {
            "Vienna": {"monthly_living": 1100, "rent_1br": 800, "transport": 50, "food": 250},
            "Graz": {"monthly_living": 950, "rent_1br": 650, "transport": 45, "food": 255},
        }
    },
    "Italy": {
        "tuition_eur": 2000,
        "living_eur": 9600,
        "insurance_eur": 400,
        "visa_eur": 150,
        "one_time_eur": 400,
        "typical_scholarship_discount": 4350,
        "blocked_account_required": False,
        "notes": "Italy has low tuition at public universities. Income declaration needed for reduced fee.",
        "cities": {
            "Milan": {"monthly_living": 1200, "rent_1br": 900, "transport": 50, "food": 250},
            "Bologna": {"monthly_living": 900, "rent_1br": 700, "transport": 40, "food": 160},
        }
    },
    "Germany": {
        "tuition_eur": 600,
        "living_eur": 10800,
        "insurance_eur": 1100,
        "visa_eur": 100,
        "one_time_eur": 300,
        "typical_scholarship_discount": 5500,
        "blocked_account_required": True,
        "blocked_account_amount": 11208,
        "notes": "Germany has no tuition at public universities (only semester fees ~€300). Blocked account mandatory for visa.",
        "cities": {
            "Munich": {"monthly_living": 1200, "rent_1br": 900, "transport": 60, "food": 240},
            "Berlin": {"monthly_living": 1000, "rent_1br": 700, "transport": 80, "food": 220},
        }
    },
    "UK": {
        "tuition_eur": 22000,
        "living_eur": 14400,
        "insurance_eur": 776,
        "visa_eur": 490,
        "one_time_eur": 600,
        "typical_scholarship_discount": 18666,
        "blocked_account_required": False,
        "notes": "UK tuition is high for international students. Chevening/Commonwealth covers it. NHS surcharge £1,035/year required.",
        "cities": {
            "London": {"monthly_living": 1600, "rent_1br": 1200, "transport": 180, "food": 220},
            "Edinburgh": {"monthly_living": 1100, "rent_1br": 800, "transport": 100, "food": 200},
        }
    },
    "USA": {
        "tuition_eur": 28000,
        "living_eur": 16800,
        "insurance_eur": 2400,
        "visa_eur": 200,
        "one_time_eur": 800,
        "typical_scholarship_discount": 24400,
        "blocked_account_required": False,
        "notes": "US tuition varies widely. Fulbright/university aid essential. SEVIS fee $350 required.",
        "cities": {
            "New York": {"monthly_living": 2200, "rent_1br": 1800, "transport": 150, "food": 250},
            "Boston": {"monthly_living": 1900, "rent_1br": 1500, "transport": 120, "food": 280},
        }
    },
}
