-- Seed the skill taxonomy and the 7 catalog jobs (mirrors constants.ts /
-- backend/app/jobs.py). Run after 0001_core_schema.sql.

insert into skills (id, name, synonyms) values
  ('react',            'React',            '{react,react.js,reactjs}'),
  ('nodejs',           'Node.js',          '{node,node.js,nodejs}'),
  ('typescript',       'TypeScript',       '{typescript,ts}'),
  ('javascript',       'JavaScript',       '{javascript,js,es6}'),
  ('python',           'Python',           '{python,python3}'),
  ('go',               'Go',               '{go,golang}'),
  ('java',             'Java',             '{java}'),
  ('sql',              'SQL',              '{sql,postgresql,postgres,mysql}'),
  ('aws',              'AWS',              '{aws,"amazon web services"}'),
  ('docker',           'Docker',           '{docker,containers}'),
  ('kubernetes',       'Kubernetes',       '{kubernetes,k8s}'),
  ('redis',            'Redis',            '{redis}'),
  ('pytorch',          'PyTorch',          '{pytorch,torch}'),
  ('scikit-learn',     'Scikit-learn',     '{scikit-learn,sklearn}'),
  ('nlp',              'NLP',              '{nlp,"natural language processing"}'),
  ('llm',              'LLMs',             '{llm,llms,"large language models"}'),
  ('machine-learning', 'Machine Learning', '{"machine learning",ml,"deep learning"}'),
  ('figma',            'Figma',            '{figma}'),
  ('framer',           'Framer',           '{framer}'),
  ('product-design',   'Product Design',   '{"product design","ui/ux",ux,"ui design"}'),
  ('seo',              'SEO',              '{seo,"search engine optimization"}'),
  ('content-strategy', 'Content Strategy', '{"content strategy","content marketing"}'),
  ('ads',              'Ads',              '{ads,"google ads","paid media"}'),
  ('fintech',          'Fintech',          '{fintech,"financial technology"}'),
  ('strategy',         'Strategy',         '{strategy,"business strategy"}'),
  ('agile',            'Agile',            '{agile,scrum,kanban}'),
  ('git',              'Git',              '{git,github,gitlab}'),
  ('ci-cd',            'CI/CD',            '{"ci/cd","continuous integration",jenkins}'),
  ('data-analysis',    'Data Analysis',    '{"data analysis",pandas,numpy}'),
  ('excel',            'Excel',            '{excel,spreadsheets}'),
  ('communication',    'Communication',    '{communication,presentation}')
on conflict (id) do nothing;

with new_jobs as (
  insert into jobs (title, company, location, work_type, duration, category, description, stipend_min, stipend_max, allowed_locations, posted_date, deadline)
  values
    ('Distributed Systems Associate', 'Agoda',               'Bangkok',    'onsite', '3-6 months', 'Software Development', 'Build the backbone of modern infrastructure.',            25000, 25000, '{Bangkok}',        '2024-03-01', '2024-04-15'),
    ('UI/UX Design Intern',           'Lineman Wongnai',     'Bangkok',    'hybrid', '4 months',   'Design',               'Define the physical language of virtual objects.',        18000, 18000, '{Bangkok}',        '2024-03-05', '2024-04-20'),
    ('Data Science Intern',           'SCB 10X',             'Bangkok',    'onsite', '6 months',   'Data Science',         'Fine-tune the future of cognition for SEA languages.',    30000, 30000, '{Bangkok}',        '2024-02-28', '2024-03-30'),
    ('Digital Marketing Strategist',  'Shopee Thailand',     'Bangkok',    'remote', '3 months',   'Marketing',            'Drive user acquisition through data-backed marketing.',   15000, 15000, '{Bangkok,Remote}', '2024-03-10', '2024-05-01'),
    ('Business Development Intern',   'KBTG',                'Nonthaburi', 'hybrid', '6 months',   'Business',             'Analyze digital transformation trends in banking.',       22000, 22000, '{Nonthaburi}',     '2024-03-02', '2024-04-10'),
    ('Full Stack Developer',          'Seven Peaks Software','Bangkok',    'onsite', '4-6 months', 'Software Development', 'Enterprise-grade applications with React and Node.js.',   20000, 20000, '{Bangkok}',        '2024-03-08', '2024-04-25'),
    ('Machine Learning Engineer',     'Omise',               'Phuket',     'remote', '6 months',   'Data Science',         'Fraud detection models and payment routing algorithms.',  28000, 28000, '{Phuket,Remote}',  '2024-03-12', '2024-05-15')
  returning id, title
)
insert into job_skills (job_id, skill_id)
select j.id, s.skill_id
from new_jobs j
join (values
  ('Distributed Systems Associate', 'go'),
  ('Distributed Systems Associate', 'kubernetes'),
  ('Distributed Systems Associate', 'redis'),
  ('Distributed Systems Associate', 'docker'),
  ('UI/UX Design Intern',           'figma'),
  ('UI/UX Design Intern',           'framer'),
  ('UI/UX Design Intern',           'product-design'),
  ('Data Science Intern',           'python'),
  ('Data Science Intern',           'llm'),
  ('Data Science Intern',           'nlp'),
  ('Data Science Intern',           'machine-learning'),
  ('Digital Marketing Strategist',  'seo'),
  ('Digital Marketing Strategist',  'content-strategy'),
  ('Digital Marketing Strategist',  'ads'),
  ('Business Development Intern',   'fintech'),
  ('Business Development Intern',   'strategy'),
  ('Business Development Intern',   'agile'),
  ('Full Stack Developer',          'react'),
  ('Full Stack Developer',          'nodejs'),
  ('Full Stack Developer',          'typescript'),
  ('Full Stack Developer',          'sql'),
  ('Machine Learning Engineer',     'pytorch'),
  ('Machine Learning Engineer',     'scikit-learn'),
  ('Machine Learning Engineer',     'aws'),
  ('Machine Learning Engineer',     'python')
) as s(title, skill_id) on s.title = j.title;
