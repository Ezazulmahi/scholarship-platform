from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from rag.vector_store import search_scholarships


def build_sop_chain():
    llm = ChatOpenAI(model="gpt-4o", temperature=0.7)

    prompt = ChatPromptTemplate.from_messages([
        (
            "system",
            """You are an expert academic writing coach helping students write compelling
Statements of Purpose for graduate scholarship applications.

You have retrieved the following scholarship context from our knowledge base:
{scholarship_context}

Guidelines:
- Write in first person, naturally and authentically
- Match the tone requested: {tone}
- Target approximately {target_words} words
- Ground every claim in the student's actual profile — never invent achievements
- Weave in how this specific scholarship aligns with the student's goals
- Begin with a compelling hook — not "I am applying for..."
- End with a forward-looking paragraph about impact
""",
        ),
        (
            "human",
            """Please write a Statement of Purpose for:

Student Profile:
- Name: {name}
- University: {university}
- Degree: {degree}
- CGPA: {cgpa} / 4.00
- IELTS: {ielts}
- Field of interest: {field}

Target Scholarship / Programme: {scholarship}

Core motivation (in student's own words):
"{motivation}"

Tone: {tone}
Target length: {target_words} words

Write the complete SOP now:""",
        ),
    ])

    return prompt | llm | StrOutputParser()


_chain = None


def generate_sop(scholarship, motivation, tone, target_words, profile):
    global _chain
    if _chain is None:
        _chain = build_sop_chain()

    docs = search_scholarships(f"{scholarship} {profile.get('field', '')}", k=3)
    scholarship_context = "\n\n---\n\n".join(d.page_content for d in docs)

    return _chain.invoke({
        "scholarship_context": scholarship_context,
        "scholarship": scholarship,
        "motivation": motivation,
        "tone": tone,
        "target_words": target_words,
        "name": profile.get("name", "the student"),
        "university": profile.get("university", ""),
        "degree": profile.get("degree", ""),
        "cgpa": profile.get("cgpa", ""),
        "ielts": profile.get("ielts", ""),
        "field": profile.get("field", ""),
    })
