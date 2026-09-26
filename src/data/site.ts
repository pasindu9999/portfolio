/**
 * Structured records -- not prose, so these live here rather than in a
 * content collection. Sourced from the CV at public/cv.pdf.
 *
 * Deliberately NOT included: the phone number (a public site invites spam --
 * email and LinkedIn are enough) and the CV's referees (third-party personal
 * contact details do not belong on a public page).
 */

export const SITE = {
  name: 'Udara Kurukulasooriya',
  role: 'Software Engineer',
  roleLong: 'Software Engineer — Full-Stack',
  email: 'udarapasindu9999@gmail.com',
  github: 'https://github.com/pasindu9999',
  linkedin: 'https://www.linkedin.com/in/udara-kurukulasuriya',
  location: 'Colombo, Sri Lanka',
  description:
    'Full-stack engineer with three years across .NET and TypeScript, from legacy modernisation to greenfield platforms — now building applied GenAI: RAG, fine-tuning and multi-agent systems.',
} as const;

/** Condensed from the CV profile. */
export const BIO =
  'Software engineer with three years of full-stack experience delivering enterprise web applications across the .NET and modern TypeScript ecosystems — from legacy-system modernisation to greenfield platform development. Strong grounding in relational data design and API architecture, with recent hands-on specialisation in applied GenAI and LLM engineering: retrieval-augmented generation, parameter-efficient fine-tuning and multi-agent systems.';

/**
 * EXPERIENCE and EDUCATION share one shape so Timeline.astro can merge and
 * sort them chronologically. `start` is an ISO-ish 'YYYY-MM' sort key;
 * `period` is the human-readable label actually rendered.
 */
export const EXPERIENCE = [
  {
    title: 'Software Engineer',
    org: 'Avonet Technologies',
    start: '2025-08',
    period: 'Aug 2025 – Present',
    duration: 'Current',
    highlights: [
      'Legacy Clarion → C# .NET MVC modernisation',
      'Kendo UI grid components & data binding',
      'Kinetix ML Studio platform (NestJS + Next.js)',
      'RBAC & auth — CASL, Keycloak, Auth.js',
    ],
    tags: [
      '.NET MVC',
      'C#',
      'Kendo UI',
      'SQL Server',
      'NestJS',
      'Next.js',
      'TypeScript',
      'Prisma',
      'PostgreSQL',
      'Keycloak',
      'Docker',
    ],
  },
  {
    title: 'Software Engineer',
    org: 'Sitecore',
    start: '2024-09',
    period: 'Sep 2024 – Jul 2025',
    duration: '11 months',
    highlights: [
      '.NET 7 & Angular web application development',
      'Partner support — Moosend, Send, Discover, Sitecore Search',
      'Agile delivery — sprint planning & JIRA tracking',
    ],
    tags: ['.NET 7', 'Angular', 'TypeScript', 'SQL Server'],
  },
  {
    title: 'Software Engineer Intern',
    org: 'IFS R&D International (Pvt) Ltd',
    start: '2022-12',
    period: 'Dec 2022 – Jul 2023',
    duration: '8 months',
    highlights: [
      'Angular & .NET feature development — Team ALE',
      'Performance & maintainability improvements',
      'Unit testing & peer code review',
    ],
    tags: ['Angular', '.NET Framework', 'C#', 'SQL Server'],
  },
] as const;

export const EDUCATION = [
  {
    title: 'BSc. (Hons) in Information Technology',
    org: 'University of Moratuwa, Sri Lanka',
    start: '2020-01',
    period: 'Jan 2020 – Dec 2024',
    duration: '5 years',
    highlights: ['Final year thesis — Automated Movie Content Rating System'],
    tags: ['GPA 3.62', 'Second Upper Honours'],
  },
] as const;

/** The filter tabs on the homepage's Skills section, in display order. */
export const SKILL_CATEGORIES = [
  'Languages & Frameworks',
  'Databases',
  'AI/LLM & Data',
  'Cloud & DevOps',
] as const;

/** Grouped as on the CV, with a `category` added for the filter tabs. */
export const SKILLS = [
  {
    group: 'Languages',
    category: 'Languages & Frameworks',
    items: [
      'C#',
      'TypeScript',
      'JavaScript',
      'Python',
      'Java',
      'SQL',
      'C',
    ],
  },
  {
    group: 'Frameworks & Libraries',
    category: 'Languages & Frameworks',
    items: [
      '.NET 7 / Core / MVC',
      'Angular',
      'Next.js',
      'React',
      'NestJS',
      'Node.js',
      'Spring Boot',
      'Kendo UI',
      'Tailwind CSS',
    ],
  },
  {
    group: 'Databases & Data Access',
    category: 'Databases',
    items: [
      'SQL Server',
      'PostgreSQL',
      'MySQL',
      'MongoDB',
      'Prisma',
      'TypeORM',
      'Stored procedures',
    ],
  },
  {
    group: 'GenAI & LLM Engineering',
    category: 'AI/LLM & Data',
    items: [
      'RAG design & evaluation',
      'ChromaDB / embeddings',
      'Semantic chunking & re-ranking',
      'MRR / nDCG, LLM-as-judge',
      'Multi-agent orchestration',
      'Tool calling & agent memory',
      'QLoRA, PEFT/LoRA, 4-bit',
      'HuggingFace, PyTorch',
      'OpenAI / Anthropic / Gemini',
      'Modal serverless GPU',
    ],
  },
  {
    group: 'Cloud & DevOps',
    category: 'Cloud & DevOps',
    items: ['Azure', 'AWS', 'Docker', 'Azure DevOps', 'Git', 'GitHub'],
  },
  {
    group: 'Tools & Practices',
    category: 'Cloud & DevOps',
    items: [
      'Agile / Scrum',
      'JIRA',
      'Jest',
      'Playwright',
      'Testcontainers',
      'pytest',
      'Visual Studio',
      'VS Code',
    ],
  },
] as const;
