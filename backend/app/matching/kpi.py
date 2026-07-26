"""Multi-KPI matching math (plan Step 1 + Step 3).

HSCR / SGI are pure set calculus. SSSA uses sentence-transformer embeddings
when the optional dependency is installed, otherwise a deterministic token
Jaccard fallback so the API works out of the box.
"""

from __future__ import annotations

from functools import lru_cache


def hscr(required: set[str], candidate: set[str]) -> float:
    """Hard Skill Coverage Ratio: |required ∩ candidate| / |required|."""
    if not required:
        return 1.0
    return len(required & candidate) / len(required)


def sgi(required: set[str], candidate: set[str]) -> float:
    """Skill Gap Index: complement of HSCR."""
    return 1.0 - hscr(required, candidate)


@lru_cache(maxsize=1)
def _embedding_model():
    try:
        from sentence_transformers import SentenceTransformer

        return SentenceTransformer("all-MiniLM-L6-v2")
    except ImportError:
        return None


def _token_jaccard(a: list[str], b: list[str]) -> float:
    """Fallback SSSA: Jaccard over skill-name word tokens (no model download)."""
    tokens_a = {tok for skill in a for tok in skill.lower().replace("-", " ").split()}
    tokens_b = {tok for skill in b for tok in skill.lower().replace("-", " ").split()}
    if not tokens_a or not tokens_b:
        return 0.0
    return len(tokens_a & tokens_b) / len(tokens_a | tokens_b)


def sssa(candidate: list[str], required: list[str]) -> float:
    """Semantic Skill Set Alignment: mean-pooled embedding cosine similarity."""
    if not candidate or not required:
        return 0.0

    model = _embedding_model()
    if model is None:
        return _token_jaccard(candidate, required)

    import numpy as np

    a = model.encode(candidate).mean(axis=0)
    b = model.encode(required).mean(axis=0)
    denom = float(np.linalg.norm(a) * np.linalg.norm(b))
    if denom == 0.0:
        return 0.0
    # Cosine can be slightly negative for unrelated sets; clamp for a [0,1] KPI.
    return max(0.0, min(1.0, float(np.dot(a, b)) / denom))
