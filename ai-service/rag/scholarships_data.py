"""
Scholarship knowledge base for RAG.
Real scholarships with current 2025/2026 deadlines and official URLs.
"""

SCHOLARSHIP_DOCS = [
    {
        "id": "oead-grants",
        "name": "OeAD Government of Austria Scholarships",
        "country": "Austria",
        "university": "Austrian universities (TU Wien, University of Vienna, TU Graz)",
        "level": "MSc",
        "field": "STEM, Computer Science, Machine Learning, Engineering",
        "funding": "Full tuition + €1,200/month stipend",
        "duration": "24 months",
        "deadline": "1 March 2026",
        "url": "https://oead.at/en/to-austria/grants-and-scholarships/",
        "min_cgpa": 3.5,
        "ielts_min": 6.5,
        "gre_required": False,
        "requirements": "Transcript, SOP, 2 LORs, CV, language cert, passport",
        "content": """
The OeAD (Austrian Exchange Service) Government Scholarships fund international MSc and PhD
students at Austrian public universities. The scholarship covers full tuition and provides
€1,200/month stipend for living expenses.

Eligibility: Minimum CGPA 3.5/4.00, IELTS 6.5+ or TOEFL 88+. GRE not required.
Documents: Academic transcript, Statement of Purpose, two letters of recommendation,
CV, language certificate, passport copy.

Application via OeAD portal. Deadline is 1 March 2026 for winter semester 2026/27.
Austria requires blocked account (~€1,200/month) for visa — scholarship covers this.
Apostille of degree certificate takes 3–4 weeks. Apply 8–10 months before intake.
Strong CS and ML programmes at TU Wien and TU Graz.
""",
    },
    {
        "id": "italian-govt-maeci",
        "name": "Italian Government MAECI Scholarship",
        "country": "Italy",
        "university": "Politecnico di Milano, University of Bologna, Sapienza University",
        "level": "MSc / PhD",
        "field": "All fields including Engineering, Computer Science, Data Science",
        "funding": "€900/month stipend + full tuition waiver",
        "duration": "12–36 months",
        "deadline": "10 April 2026",
        "url": "https://universitaly.it/index.php/scholarships/inside/governo-italiano",
        "min_cgpa": 3.0,
        "ielts_min": 6.0,
        "gre_required": False,
        "requirements": "Dichiarazione di Valore, SOP, LORs, transcript, language cert",
        "content": """
The Italian Government MAECI (Ministry of Foreign Affairs) Scholarship funds international
students for study in Italy. Provides €900/month stipend plus full tuition waiver.

Eligibility: CGPA 3.0+, IELTS 6.0+ for English-taught programmes.
Key document: Dichiarazione di Valore (recognition of foreign degree by Italian embassy)
— takes 2–3 months, start immediately after admission.

Application via Universitaly portal. Deadline 10 April 2026 for 2026/27 academic year.
Politecnico di Milano is ranked top 50 globally for Engineering and Computer Science.
Bologna and Rome offer excellent ML and Data Science programmes at low tuition.
""",
    },
    {
        "id": "chevening",
        "name": "Chevening Scholarship",
        "country": "UK",
        "university": "Any eligible UK university (UCL, Edinburgh, Manchester, Imperial)",
        "level": "Master's (1 year)",
        "field": "All fields; preference for leadership and public policy",
        "funding": "Full tuition + £1,173/month living allowance + travel",
        "duration": "12 months",
        "deadline": "4 November 2025",
        "url": "https://www.chevening.org/scholarships/",
        "min_cgpa": 3.2,
        "ielts_min": 6.5,
        "gre_required": False,
        "requirements": "4 online essays, 2 LORs, transcript, IELTS, work experience proof",
        "content": """
The Chevening Scholarship is the UK government's flagship international award for future
leaders. Covers full tuition at any eligible UK university, £1,173/month living allowance,
travel costs, and visa fees.

Eligibility: Equivalent of UK 2:1 degree (CGPA 3.2+), IELTS 6.5+ (no band below 5.5),
minimum 2 years work or volunteering experience.

Essays: leadership experience, networking skills, career plan, why this course/university.
Deadline: 4 November 2025 for October 2026 intake. Results announced May 2026.
Highly competitive — roughly 1,500 awards globally per year.
Apply at chevening.org — Bangladeshi students apply through the British Council Dhaka.
""",
    },
    {
        "id": "daad-epos",
        "name": "DAAD EPOS Scholarship",
        "country": "Germany",
        "university": "German public universities (TU Munich, KIT, TU Berlin, RWTH Aachen)",
        "level": "MSc / PhD",
        "field": "Engineering, Computer Science, Natural Sciences, Economics",
        "funding": "€934/month stipend + health insurance + travel allowance",
        "duration": "12–36 months",
        "deadline": "15 October 2025",
        "url": "https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/?detail=50015652",
        "min_cgpa": 3.0,
        "ielts_min": 6.0,
        "gre_required": False,
        "requirements": "DAAD application, transcript, 2 LORs, SOP, language cert, APS certificate",
        "content": """
The DAAD EPOS scholarship funds students from developing countries for postgraduate study
in Germany. Germany charges no tuition at public universities — DAAD provides €934/month
living stipend plus health insurance and travel allowance.

Eligibility: CGPA 3.0+, IELTS 6.0+ or equivalent German cert.
Bangladeshi students must obtain APS certificate (takes 4–6 weeks, submit originals to
German Embassy Dhaka).

Blocked account (Sperrkonto) ~€11,208 required for student visa.
Deadline: 15 October 2025 for winter semester 2026/27.
Strong CS/ML programmes at TU Munich, KIT Karlsruhe, and TU Berlin.
Apply via DAAD portal at daad.de.
""",
    },
    {
        "id": "erasmus-mundus-emjm",
        "name": "Erasmus Mundus Joint Master (EMJM)",
        "country": "Multiple EU",
        "university": "Consortium of 2–3 European universities per programme",
        "level": "MSc (Joint Degree)",
        "field": "Computer Science, Machine Learning, Data Science, AI, Robotics",
        "funding": "€1,400/month + full tuition waiver + travel €8,000",
        "duration": "24 months",
        "deadline": "15 January 2026",
        "url": "https://www.eacea.ec.europa.eu/scholarships/emjm-students_en",
        "min_cgpa": 3.5,
        "ielts_min": 6.5,
        "gre_required": False,
        "requirements": "Motivation letter, 2 LORs, transcript, IELTS, CV",
        "content": """
Erasmus Mundus Joint Masters are European Commission-funded programmes where students
study at 2–3 European universities over 2 years. Third-country scholarship holders
receive €1,400/month + full tuition waiver + €8,000 travel allowance.

Eligibility: CGPA 3.5+, IELTS 6.5+. No GRE.
Top ML/CS programmes: EMJM in Machine Learning for Data Science (MLDS),
Big Data Management and Analytics (BDMA), Computer Vision and Robotics (VIBOT),
Computational Colour and Spectral Imaging (COSI).

Deadline: 15 January 2026 for September 2026 intake.
Apply directly through each programme's website. Results typically May 2026.
Joint degree recognised across all EU member states — excellent for careers in Europe.
""",
    },
    {
        "id": "fulbright-bangladesh",
        "name": "Fulbright Foreign Student Program (Bangladesh)",
        "country": "USA",
        "university": "US universities (placement by Fulbright Commission)",
        "level": "Master's / PhD",
        "field": "All fields including CS, AI, Engineering, Social Sciences",
        "funding": "Full tuition + $2,000–2,500/month stipend + health insurance + travel",
        "duration": "1–2 years",
        "deadline": "15 June 2026",
        "url": "https://bd.usembassy.gov/education-culture/fulbright-program/",
        "min_cgpa": 3.3,
        "ielts_min": 7.0,
        "gre_required": True,
        "requirements": "Application essays, GRE, TOEFL/IELTS, 3 LORs, transcript, research proposal",
        "content": """
The Fulbright Foreign Student Program is the US government's premier international
scholarship. For Bangladeshi students, it covers full tuition at a US university,
monthly stipend of $2,000–2,500, health insurance, and round-trip travel.

Eligibility: CGPA 3.3+, GRE required (aim 155+ Verbal, 160+ Quant for CS/ML),
TOEFL 80+ or IELTS 7.0+. Strong leadership and community involvement.

Apply through USEFB (US-Bangladesh Educational Foundation) at bd.usembassy.gov.
Deadline: 15 June 2026 for 2027 intake. Interviews December–January.
University placement is done by the Fulbright Commission based on your research interests.
Competition is high — roughly 15–20 awards per year for Bangladesh.
""",
    },
    {
        "id": "commonwealth-masters",
        "name": "Commonwealth Masters Scholarship",
        "country": "UK",
        "university": "UK universities (selected by Commonwealth Scholarship Commission)",
        "level": "Master's (1 year)",
        "field": "Development-related fields, STEM, Education, Health",
        "funding": "Full tuition + £1,347/month living allowance + travel",
        "duration": "12 months",
        "deadline": "18 December 2025",
        "url": "https://cscuk.fcdo.gov.uk/apply/masters-scholarships/",
        "min_cgpa": 3.0,
        "ielts_min": 6.5,
        "gre_required": False,
        "requirements": "Online application, personal statement, 2 LORs, transcript, IELTS",
        "content": """
The Commonwealth Masters Scholarship funds students from Commonwealth developing countries
for one-year Master's degrees at UK universities. Covers full tuition, £1,347/month living
allowance, travel, and thesis grant.

Eligibility: Citizen of a Commonwealth country (Bangladesh eligible), CGPA 3.0+,
IELTS 6.5+, commitment to development in home country after graduation.

Personal statement must focus on how the degree will contribute to development in Bangladesh.
Deadline: 18 December 2025 for September 2026 intake.
Apply via the Commonwealth Scholarship Commission portal.
Lower competition than Chevening — approximately 800 awards per year across all countries.
""",
    },
    {
        "id": "swedish-institute",
        "name": "Swedish Institute Scholarship for Global Professionals",
        "country": "Sweden",
        "university": "Swedish universities (KTH, Chalmers, Uppsala, Lund)",
        "level": "Master's (1–2 years)",
        "field": "All fields; preference for sustainability and leadership",
        "funding": "SEK 11,000/month (~€950) + tuition waiver + travel SEK 15,000",
        "duration": "12–24 months",
        "deadline": "10 February 2026",
        "url": "https://si.se/en/apply/scholarships/swedish-institute-scholarships-for-global-professionals/",
        "min_cgpa": 3.0,
        "ielts_min": 6.5,
        "gre_required": False,
        "requirements": "Online application, motivation letter, CV, transcript, IELTS, leadership evidence",
        "content": """
The Swedish Institute Scholarship for Global Professionals (SISGP) funds international
students for Master's programmes at Swedish universities. Covers full tuition, SEK 11,000/month
living allowance, travel grant, and insurance.

Eligibility: CGPA 3.0+, IELTS 6.5+, demonstrated leadership experience,
commitment to returning to home country to contribute to development.

KTH Royal Institute of Technology has strong CS, AI, and ML programmes.
Chalmers University is excellent for Engineering and Data Science.
Deadline: 10 February 2026 for August 2026 intake.
Apply via the Swedish Institute portal — si.se.
Sweden has recently introduced tuition fees for non-EU students; scholarship covers this.
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
        },
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
        },
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
        },
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
        },
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
        },
    },
    "Sweden": {
        "tuition_eur": 13000,
        "living_eur": 10800,
        "insurance_eur": 0,
        "visa_eur": 150,
        "one_time_eur": 400,
        "typical_scholarship_discount": 13000,
        "blocked_account_required": False,
        "notes": "Sweden introduced tuition for non-EU students. Swedish Institute Scholarship covers tuition fully.",
        "cities": {
            "Stockholm": {"monthly_living": 1100, "rent_1br": 900, "transport": 80, "food": 220},
            "Gothenburg": {"monthly_living": 950, "rent_1br": 750, "transport": 70, "food": 200},
        },
    },
    "Multiple EU": {
        "tuition_eur": 0,
        "living_eur": 12000,
        "insurance_eur": 500,
        "visa_eur": 150,
        "one_time_eur": 400,
        "typical_scholarship_discount": 16800,
        "blocked_account_required": False,
        "notes": "Erasmus Mundus covers full tuition and provides €1,400/month stipend across multiple EU countries.",
        "cities": {},
    },
}