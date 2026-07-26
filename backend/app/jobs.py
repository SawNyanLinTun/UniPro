"""Job catalog with canonical required-skill sets.

Mirrors the frontend MOCK_INTERNSHIPS (constants.ts) until jobs live in the
Supabase `jobs` / `job_skills` tables (see supabase/migrations). Skill ids
must exist in taxonomy.TAXONOMY.
"""

JOBS: list[dict] = [
    {
        "id": "1",
        "company": "Agoda",
        "role": "Distributed Systems Associate",
        "required_skills": ["go", "kubernetes", "redis", "docker"],
    },
    {
        "id": "2",
        "company": "Lineman Wongnai",
        "role": "UI/UX Design Intern",
        "required_skills": ["figma", "framer", "product-design"],
    },
    {
        "id": "3",
        "company": "SCB 10X",
        "role": "Data Science Intern",
        "required_skills": ["python", "llm", "nlp", "machine-learning"],
    },
    {
        "id": "4",
        "company": "Shopee Thailand",
        "role": "Digital Marketing Strategist",
        "required_skills": ["seo", "content-strategy", "ads"],
    },
    {
        "id": "5",
        "company": "KBTG",
        "role": "Business Development Intern",
        "required_skills": ["fintech", "strategy", "agile"],
    },
    {
        "id": "6",
        "company": "Seven Peaks Software",
        "role": "Full Stack Developer",
        "required_skills": ["react", "nodejs", "typescript", "sql"],
    },
    {
        "id": "7",
        "company": "Omise",
        "role": "Machine Learning Engineer",
        "required_skills": ["pytorch", "scikit-learn", "aws", "python"],
    },
]
