# UniPro Matching API

FastAPI backend that makes SmartMatch real: layout-aware CV extraction
(pdfplumber) and multi-KPI matching (HSCR / SGI / SSSA) instead of hardcoded
scores.

## Endpoints

| Method | Path          | Purpose                                                        |
| ------ | ------------- | -------------------------------------------------------------- |
| GET    | `/health`     | Liveness probe                                                 |
| POST   | `/cv/extract` | Multipart PDF/text upload → taxonomy skills, GPA, edu/exp      |
| POST   | `/match`      | `{skills, top_k}` → ranked jobs with HSCR / SGI / SSSA per job |
| POST   | `/advice`     | Career advice; Gemini server-side, heuristic fallback          |

## KPI definitions

- **HSCR** (Hard Skill Coverage Ratio): `|required ∩ candidate| / |required|`
- **SGI** (Skill Gap Index): `1 − HSCR`
- **SSSA** (Semantic Skill Set Alignment): cosine similarity of mean-pooled
  MiniLM embeddings when `sentence-transformers` is installed; token Jaccard
  fallback otherwise.

## Run locally

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Or with Docker (from the repo root):

```bash
docker compose up backend
```

Then start the frontend with `npm run dev`; it calls `http://localhost:8000`
by default (override with `VITE_API_URL` in `.env.local`).

## Environment variables

| Variable         | Default                 | Purpose                             |
| ---------------- | ----------------------- | ----------------------------------- |
| `CORS_ORIGINS`   | `http://localhost:3000` | Comma-separated allowed origins     |
| `GEMINI_API_KEY` | unset                   | Enables real Gemini on `/advice`    |
| `PORT`           | `8000`                  | Injected by Cloud Run/Fly/Railway   |

The Gemini key lives **only** here — never in the Vite bundle.
