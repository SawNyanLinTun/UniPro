"""Normalized skill taxonomy with synonym mapping.

HSCR is only as good as skill extraction + synonym mapping (plan Step 1 caveat):
"React" vs "react.js" vs "ReactJS" must resolve to the same canonical SkillId,
otherwise the coverage ratio over-punishes naming differences.
"""

from __future__ import annotations

import re

# canonical skill id -> {display name, synonyms (lowercase)}
TAXONOMY: dict[str, dict] = {
    "react": {"name": "React", "synonyms": ["react", "react.js", "reactjs"]},
    "nodejs": {"name": "Node.js", "synonyms": ["node", "node.js", "nodejs"]},
    "typescript": {"name": "TypeScript", "synonyms": ["typescript", "ts"]},
    "javascript": {"name": "JavaScript", "synonyms": ["javascript", "js", "es6"]},
    "python": {"name": "Python", "synonyms": ["python", "python3"]},
    "go": {"name": "Go", "synonyms": ["go", "golang"]},
    "java": {"name": "Java", "synonyms": ["java"]},
    "sql": {"name": "SQL", "synonyms": ["sql", "postgresql", "postgres", "mysql"]},
    "aws": {"name": "AWS", "synonyms": ["aws", "amazon web services"]},
    "docker": {"name": "Docker", "synonyms": ["docker", "containers"]},
    "kubernetes": {"name": "Kubernetes", "synonyms": ["kubernetes", "k8s"]},
    "redis": {"name": "Redis", "synonyms": ["redis"]},
    "pytorch": {"name": "PyTorch", "synonyms": ["pytorch", "torch"]},
    "scikit-learn": {"name": "Scikit-learn", "synonyms": ["scikit-learn", "sklearn", "scikit learn"]},
    "nlp": {"name": "NLP", "synonyms": ["nlp", "natural language processing"]},
    "llm": {"name": "LLMs", "synonyms": ["llm", "llms", "large language model", "large language models"]},
    "machine-learning": {"name": "Machine Learning", "synonyms": ["machine learning", "ml", "deep learning"]},
    "figma": {"name": "Figma", "synonyms": ["figma"]},
    "framer": {"name": "Framer", "synonyms": ["framer"]},
    "product-design": {"name": "Product Design", "synonyms": ["product design", "ui/ux", "ui ux", "ux", "ui design"]},
    "seo": {"name": "SEO", "synonyms": ["seo", "search engine optimization"]},
    "content-strategy": {"name": "Content Strategy", "synonyms": ["content strategy", "content marketing"]},
    "ads": {"name": "Ads", "synonyms": ["ads", "google ads", "facebook ads", "paid media"]},
    "fintech": {"name": "Fintech", "synonyms": ["fintech", "financial technology"]},
    "strategy": {"name": "Strategy", "synonyms": ["strategy", "business strategy"]},
    "agile": {"name": "Agile", "synonyms": ["agile", "scrum", "kanban"]},
    "git": {"name": "Git", "synonyms": ["git", "github", "gitlab"]},
    "ci-cd": {"name": "CI/CD", "synonyms": ["ci/cd", "ci cd", "continuous integration", "jenkins"]},
    "data-analysis": {"name": "Data Analysis", "synonyms": ["data analysis", "data analytics", "pandas", "numpy"]},
    "excel": {"name": "Excel", "synonyms": ["excel", "spreadsheets", "google sheets"]},
    "communication": {"name": "Communication", "synonyms": ["communication", "presentation", "public speaking"]},
}

_SYNONYM_TO_ID: dict[str, str] = {
    syn: skill_id for skill_id, entry in TAXONOMY.items() for syn in entry["synonyms"]
}

# Longest synonyms first so "machine learning" wins over "ml" substring quirks.
_PATTERN = re.compile(
    r"(?<![a-z0-9+#])("
    + "|".join(re.escape(s) for s in sorted(_SYNONYM_TO_ID, key=len, reverse=True))
    + r")(?![a-z0-9+#])",
    re.IGNORECASE,
)


def display_name(skill_id: str) -> str:
    return TAXONOMY.get(skill_id, {"name": skill_id})["name"]


def normalize(term: str) -> str | None:
    """Map a free-text skill term to a canonical SkillId, or None if unknown."""
    return _SYNONYM_TO_ID.get(term.strip().lower())


def extract_skill_ids(text: str) -> list[str]:
    """Find all taxonomy skills mentioned in free text, deduplicated, in order."""
    found: list[str] = []
    for m in _PATTERN.finditer(text):
        skill_id = _SYNONYM_TO_ID[m.group(1).lower()]
        if skill_id not in found:
            found.append(skill_id)
    return found
