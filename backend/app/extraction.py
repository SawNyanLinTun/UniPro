"""Layout-aware CV extraction (plan Step 2).

pdfplumber gives geometry + text; we reconstruct reading order per page
(top-to-bottom, left-to-right by word boxes), then apply rule-based
sectioning and taxonomy mapping. Docling can replace layout_extract()
later for complex multi-column CVs without changing the API contract.
"""

from __future__ import annotations

import io
import re

from .taxonomy import extract_skill_ids

_GPA_RE = re.compile(r"(?:gpa|gpax|เกรดเฉลี่ย)\s*[:\-]?\s*([0-4](?:\.\d{1,2})?)", re.IGNORECASE)
_EDU_RE = re.compile(
    r"^.*(university|college|bachelor|master|b\.?eng|b\.?sc|m\.?sc|มหาวิทยาลัย).*$",
    re.IGNORECASE | re.MULTILINE,
)
_EXP_RE = re.compile(
    r"^.*(intern|engineer|developer|analyst|assistant|freelance|co-?op).*$",
    re.IGNORECASE | re.MULTILINE,
)


def layout_extract(data: bytes) -> str:
    """Return text in reading order. PDF via pdfplumber; anything else as UTF-8."""
    if data[:5] == b"%PDF-":
        import pdfplumber

        pages: list[str] = []
        with pdfplumber.open(io.BytesIO(data)) as pdf:
            for page in pdf.pages:
                words = page.extract_words() or []
                # Group words into lines by y position, then sort each line by x.
                lines: dict[int, list] = {}
                for w in words:
                    lines.setdefault(round(w["top"] / 3), []).append(w)
                ordered = [
                    " ".join(w["text"] for w in sorted(ws, key=lambda w: w["x0"]))
                    for _, ws in sorted(lines.items())
                ]
                pages.append("\n".join(ordered))
        return "\n".join(pages)
    return data.decode("utf-8", errors="ignore")


def parse_cv(data: bytes) -> dict:
    """Extract structured profile fields from raw CV bytes."""
    text = layout_extract(data)

    gpa_match = _GPA_RE.search(text)
    education = [m.group(0).strip() for m in _EDU_RE.finditer(text)][:5]
    experience = [
        m.group(0).strip()
        for m in _EXP_RE.finditer(text)
        if m.group(0).strip() not in education
    ][:5]

    return {
        "skills": extract_skill_ids(text),
        "gpa": float(gpa_match.group(1)) if gpa_match else None,
        "education": education,
        "experience": experience,
    }
