# Supabase setup (Phase 1 Auth)

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run, in order:
   - [`migrations/0001_core_schema.sql`](migrations/0001_core_schema.sql)
   - [`migrations/0002_student_on_signup.sql`](migrations/0002_student_on_signup.sql)
3. **Authentication → Providers**: enable Email.
4. For local demos: **Authentication → Providers → Email** → disable **Confirm email** (or confirm via inbox).
5. Copy **Project URL** and **anon public** key into `.env.local` (see root `.env.example`).

Optional later: run [`seed.sql`](seed.sql) for sample jobs/skills.
