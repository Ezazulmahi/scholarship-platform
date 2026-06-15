import os
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain_core.documents import Document
from .scholarships_data import SCHOLARSHIP_DOCS

PERSIST_DIR = os.getenv("CHROMA_PERSIST_DIR", "./chroma_db")

_store: Chroma | None = None


def _build_documents() -> list[Document]:
    docs = []
    for s in SCHOLARSHIP_DOCS:
        text = (
            f"Scholarship: {s['name']}\n"
            f"Country: {s['country']}\n"
            f"Level: {s['level']}\n"
            f"Field: {s['field']}\n"
            f"Funding: {s['funding']}\n"
            f"Min CGPA: {s['min_cgpa']}\n"
            f"IELTS min: {s['ielts_min']}\n"
            f"GRE required: {s['gre_required']}\n"
            f"Deadline: {s['deadline']}\n"
            f"\n{s['content']}"
        )
        docs.append(
            Document(
                page_content=text,
                metadata={
                    "id": s["id"],
                    "name": s["name"],
                    "country": s["country"],
                    "min_cgpa": s["min_cgpa"],
                    "ielts_min": s["ielts_min"],
                    "gre_required": str(s["gre_required"]),
                },
            )
        )
    return docs


def get_store() -> Chroma:
    global _store
    if _store is not None:
        return _store

    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

    if os.path.exists(PERSIST_DIR) and os.listdir(PERSIST_DIR):
        _store = Chroma(persist_directory=PERSIST_DIR, embedding_function=embeddings)
    else:
        docs = _build_documents()
        _store = Chroma.from_documents(
            documents=docs,
            embedding=embeddings,
            persist_directory=PERSIST_DIR,
        )

    return _store


def search_scholarships(query: str, k: int = 4) -> list[Document]:
    return get_store().similarity_search(query, k=k)
