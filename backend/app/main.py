from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.frontend_adapter import build_frontend_payload
from app.db import init_db
from app.langchain_service import load_index, build_index_from_pdf, ask_zoning

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AskRequest(BaseModel):
    question: str


@app.on_event("startup")
def startup():
    init_db()
    load_index()


@app.get("/")
def root():
    return {"message": "Backend running"}


@app.get("/frontend-data")
def frontend_data():
    return build_frontend_payload()


@app.post("/ask")
def ask(req: AskRequest):
    try:
        return ask_zoning(req.question)
    except RuntimeError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/build-waterloo-index")
def build_waterloo_index():
    pdf_path = Path(__file__).resolve().parent.parent / "waterloo.pdf"

    if not pdf_path.exists():
        raise HTTPException(
            status_code=400,
            detail="waterloo.pdf not found in backend folder",
        )

    build_index_from_pdf(str(pdf_path))
    return {"status": "ok", "message": "Waterloo index built"}