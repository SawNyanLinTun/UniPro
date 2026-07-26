-- UniPro core schema: students, skills, jobs, applications, hire_events.
-- Apply with: supabase db push  (or paste into the Supabase SQL editor).
--
-- Design notes
-- * skills is the normalized taxonomy (mirrors backend/app/taxonomy.py);
--   students and jobs reference it through join tables so HSCR/SGI set math
--   works on canonical ids, not free-text strings.
-- * hire_events stores salted hashes only (plan Step 4): SHA-256(id + pepper),
--   with the pepper kept server-side, never in this database.
-- * pgvector is enabled up front so CV embeddings (plan Step 6) can land in
--   students.cv_embedding without another migration.

create extension if not exists "pgcrypto";
create extension if not exists "vector";

-- ---------------------------------------------------------------------------
-- Skill taxonomy
-- ---------------------------------------------------------------------------

create table if not exists skills (
  id         text primary key,                 -- canonical id, e.g. 'react'
  name       text not null,                    -- display name, e.g. 'React'
  synonyms   text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Students
-- ---------------------------------------------------------------------------

create table if not exists students (
  id              uuid primary key default gen_random_uuid(),
  auth_user_id    uuid unique references auth.users (id) on delete cascade,
  full_name       text not null,
  university      text,
  degree          text,
  graduation_year int,
  gpa             numeric(3, 2) check (gpa between 0 and 4),
  min_salary      int,                          -- feasibility gate input
  location        text,                         -- feasibility gate input
  visa_ok         boolean not null default true,
  cv_file_path    text,                         -- storage bucket object path
  cv_embedding    vector(384),                  -- MiniLM, for Tier-1 funnel
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table if not exists student_skills (
  student_id uuid not null references students (id) on delete cascade,
  skill_id   text not null references skills (id) on delete cascade,
  source     text not null default 'cv_extract'
             check (source in ('cv_extract', 'self_reported', 'endorsed')),
  created_at timestamptz not null default now(),
  primary key (student_id, skill_id)
);

-- ---------------------------------------------------------------------------
-- Jobs
-- ---------------------------------------------------------------------------

create table if not exists jobs (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  company           text not null,
  location          text,
  work_type         text check (work_type in ('remote', 'hybrid', 'onsite')),
  duration          text,
  category          text,
  description       text,
  stipend_min       int,
  stipend_max       int,
  allowed_locations text[] not null default '{}', -- feasibility gate input
  visa_required     boolean not null default false,
  posted_date       date not null default current_date,
  deadline          date,
  is_active         boolean not null default true,
  created_at        timestamptz not null default now()
);

create table if not exists job_skills (
  job_id     uuid not null references jobs (id) on delete cascade,
  skill_id   text not null references skills (id) on delete cascade,
  required   boolean not null default true,     -- required vs nice-to-have
  primary key (job_id, skill_id)
);

-- ---------------------------------------------------------------------------
-- Applications (pipeline that eventually feeds hire_events)
-- ---------------------------------------------------------------------------

create table if not exists applications (
  id         uuid primary key default gen_random_uuid(),
  student_id uuid not null references students (id) on delete cascade,
  job_id     uuid not null references jobs (id) on delete cascade,
  status     text not null default 'applied'
             check (status in ('applied', 'under_review', 'interview', 'accepted', 'rejected')),
  applied_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_id, job_id)
);

create index if not exists idx_applications_student on applications (student_id);
create index if not exists idx_applications_job on applications (job_id, status);

-- ---------------------------------------------------------------------------
-- Hire events: anonymized market feedback loop (plan Step 4)
-- ---------------------------------------------------------------------------

create table if not exists hire_events (
  id           uuid primary key default gen_random_uuid(),
  student_hash text not null,      -- SHA-256(student_id || pepper), pepper server-side
  company_hash text not null,      -- SHA-256(company_id || pepper)
  role_family  text not null,      -- coarse bucket, e.g. 'backend', 'design'
  skill_ids    text[] not null,    -- canonical taxonomy ids of the hired profile
  hired_at     timestamptz not null default now()
);

create index if not exists idx_hire_events_role on hire_events (role_family);
create index if not exists idx_hire_events_skills on hire_events using gin (skill_ids);

-- Aggregated skill demand. Consumers must apply k-anonymity (n >= 5) before
-- publishing any slice; never expose single-event cohorts.
create or replace view hired_skill_frequency as
select role_family, skill_id, count(*)::int as hires
from hire_events, unnest(skill_ids) as skill_id
group by role_family, skill_id
having count(*) >= 5;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table skills         enable row level security;
alter table students       enable row level security;
alter table student_skills enable row level security;
alter table jobs           enable row level security;
alter table job_skills     enable row level security;
alter table applications   enable row level security;
alter table hire_events    enable row level security;

-- Public catalog data: anyone can read.
create policy "skills are public"       on skills     for select using (true);
create policy "active jobs are public"  on jobs       for select using (is_active);
create policy "job skills are public"   on job_skills for select using (true);

-- Students: owner-only access via the linked auth user.
create policy "students read own row" on students
  for select using (auth.uid() = auth_user_id);
create policy "students update own row" on students
  for update using (auth.uid() = auth_user_id);
create policy "students insert own row" on students
  for insert with check (auth.uid() = auth_user_id);

create policy "student skills owner read" on student_skills
  for select using (
    exists (select 1 from students s where s.id = student_id and s.auth_user_id = auth.uid())
  );
create policy "student skills owner write" on student_skills
  for insert with check (
    exists (select 1 from students s where s.id = student_id and s.auth_user_id = auth.uid())
  );

-- Applications: owner-only.
create policy "applications owner read" on applications
  for select using (
    exists (select 1 from students s where s.id = student_id and s.auth_user_id = auth.uid())
  );
create policy "applications owner insert" on applications
  for insert with check (
    exists (select 1 from students s where s.id = student_id and s.auth_user_id = auth.uid())
  );

-- hire_events: no client policies at all — only the backend service role
-- (which bypasses RLS) may read or write raw hashed events. Clients consume
-- the k-anonymous hired_skill_frequency view via an API endpoint instead.
