import os
from pathlib import Path
from typing import Any

from dotenv import load_dotenv

from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_groq import ChatGroq

load_dotenv()

INDEX_DIR = Path(__file__).resolve().parent.parent / "faiss_index"

_vectorstore = None
_retriever = None
_llm = None


def get_embeddings() -> HuggingFaceEmbeddings:
    return HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")


def build_index_from_pdf(pdf_path: str) -> None:
    global _vectorstore, _retriever

    loader = PyPDFLoader(pdf_path)
    docs = loader.load()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
    )
    chunks = splitter.split_documents(docs)

    embeddings = get_embeddings()
    _vectorstore = FAISS.from_documents(chunks, embeddings)
    _vectorstore.save_local(str(INDEX_DIR))
    _retriever = _vectorstore.as_retriever(search_kwargs={"k": 4})


def load_index() -> None:
    global _vectorstore, _retriever
    if not INDEX_DIR.exists():
        return
    embeddings = get_embeddings()
    _vectorstore = FAISS.load_local(
        str(INDEX_DIR),
        embeddings,
        allow_dangerous_deserialization=True,
    )
    _retriever = _vectorstore.as_retriever(search_kwargs={"k": 4})


def ensure_llm() -> ChatGroq:
    global _llm
    if _llm is None:
        _llm = ChatGroq(
            model="llama-3.3-70b-versatile",
            temperature=0,
        )
    return _llm


def ask_zoning(question: str) -> dict[str, Any]:
    if _retriever is None:
        raise RuntimeError("No vector index is loaded. Build or load the index first.")

    docs = _retriever.invoke(question)
    context = "\n\n".join(doc.page_content for doc in docs)

    prompt = f"""
You are answering questions about a municipal zoning by-law.

Use ONLY the context below.
If the answer is not clearly stated in the context, say that it is not clearly stated.
Be concise and specific.

Question:
{question}

Context:
{context}
""".strip()

    llm = ensure_llm()
    response = llm.invoke(prompt)

    answer = response.content if hasattr(response, "content") else str(response)

    sources = []
    for d in docs:
        page = d.metadata.get("page")
        text = d.page_content[:300].replace("\n", " ")
        if page is not None:
            sources.append(f"Page {page + 1}: {text}")
        else:
            sources.append(text)

    return {
        "answer": answer,
        "sources": sources,
    }