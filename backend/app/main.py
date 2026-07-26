"""UniPro matching API (FastAPI).

Endpoints:
  GET  /health      liveness probe
  POST /cv/extract  multipart CV upload -> taxonomy skills + GPA + sections
  POST /match       candidate skills -> per-job HSCR / SGI / SSSA
  POST /advice      career advice, Gemini server-side (heuristic fallback)

Run locally:  uvicorn app.main:app --reload --port 8000
"""

from __future__ import annotations

import os

from fastapi import FastAPI, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .extraction import parse_cv
from .jobs import JOBS
from .matching.kpi import hscr, sgi, sssa
from .taxonomy import TAXONOMY, display_name, normalize

MAX_UPLOAD_BYTES = 10 * 1024 * 1024

app = FastAPI(title="UniPro Matching API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS", "http://localhost:3000").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


class CvExtractResponse(BaseModel):
    skills: list[str]
    gpa: float | None
    education: list[str]
    experience: list[str]


class MatchRequest(BaseModel):
    skills: list[str] = Field(default_factory=list)
    top_k: int = Field(default=3, ge=1, le=20)


class MatchResult(BaseModel):
    jobId: str
    company: str
    role: str
    hscr: float
    sgi: float
    sssa: float
    matchedSkills: list[str]
    missingSkills: list[str]


class MatchResponse(BaseModel):
    matches: list[MatchResult]


class AdviceRequest(BaseModel):
    query: str


class AdviceResponse(BaseModel):
    recommendedCategories: list[str]
    keySkills: list[str]
    advice: str


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/cv/extract", response_model=CvExtractResponse)
async def extract_cv(file: UploadFile) -> CvExtractResponse:
    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="Empty file")
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="File exceeds 10 MB limit")
    try:
        parsed = parse_cv(data)
    except Exception as exc:  # malformed PDFs land here
        raise HTTPException(status_code=422, detail=f"Could not parse CV: {exc}") from exc
    return CvExtractResponse(**parsed)


@app.post("/match", response_model=MatchResponse)
def match(req: MatchRequest) -> MatchResponse:
    # Accept both canonical ids and free-text skill names from the client.
    candidate: set[str] = set()
    for term in req.skills:
        skill_id = term if term in TAXONOMY else normalize(term)
        if skill_id:
            candidate.add(skill_id)

    candidate_names = [display_name(s) for s in candidate]
    results: list[MatchResult] = []
    for job in JOBS:
        required = set(job["required_skills"])
        required_names = [display_name(s) for s in job["required_skills"]]
        results.append(
            MatchResult(
                jobId=job["id"],
                company=job["company"],
                role=job["role"],
                hscr=round(hscr(required, candidate), 4),
                sgi=round(sgi(required, candidate), 4),
                sssa=round(sssa(candidate_names, required_names), 4),
                matchedSkills=sorted(required & candidate),
                missingSkills=sorted(required - candidate),
            )
        )

    # Rank by hard coverage first, semantic alignment as tiebreaker.
    results.sort(key=lambda r: (r.hscr, r.sssa), reverse=True)
    return MatchResponse(matches=results[: req.top_k])


@app.post("/advice", response_model=AdviceResponse)
def advice(req: AdviceRequest) -> AdviceResponse:
    api_key = os.environ.get("GEMINI_API_KEY")
    if api_key:
        result = _gemini_advice(req.query, api_key)
        if result is not None:
            return result
    return _heuristic_advice(req.query)


def _gemini_advice(query: str, api_key: str) -> AdviceResponse | None:
    try:
        from google import genai

        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=(
                'User is looking for internships in Thailand. Search query: "'
                + query
                + '". Return JSON with keys recommendedCategories (string array), '
                "keySkills (string array), advice (short encouraging string)."
            ),
            config={"response_mime_type": "application/json"},
        )
        import json

        return AdviceResponse(**json.loads(response.text))
    except Exception:
        return None


def _heuristic_advice(query: str) -> AdviceResponse:
    """Taxonomy-based fallback so the endpoint works without a Gemini key."""
    from .taxonomy import extract_skill_ids

    mentioned = extract_skill_ids(query)
    key_skills = [display_name(s) for s in mentioned] or ["Communication", "Git", "SQL"]
    return AdviceResponse(
        recommendedCategories=["Software Development", "Data Science", "Business"],
        keySkills=key_skills[:6],
        advice=(
            "Build one small public project per key skill and link it in your CV — "
            "verified evidence beats keyword lists in every screening round."
        ),
    )
