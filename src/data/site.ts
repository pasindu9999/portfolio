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

export const EDUCATION = {
  qualification: 'BSc. (Hons) in Information Technology',
  institution: 'University of Moratuwa, Sri Lanka',
  period: 'Jan 2020 – Dec 2024',
  result: 'Second Upper-Class Honours — GPA 3.62',
  thesis:
    'Final year thesis: “Automated Movie Content Rating System” — an AI-based system for assessing movie content.',
} as const;

export const EXPERIENCE = [
  {
    title: 'Software Engineer',
    company: 'Avonet Technologies',
    period: 'Aug 2025 – Present',
    duration: 'Current',
    summary:
      'Two parallel tracks: modernising a legacy Clarion application into C# .NET MVC, and building the shared platform layer behind a no-code machine-learning studio.',
    highlights: [
      'Converting legacy Clarion application logic into a modern C# .NET MVC architecture, including migration and refactoring of stored procedures and core business logic.',
      'Built responsive grid views and reusable UI components with Kendo UI, wiring dynamic in-grid data loading to backend stored procedures through MVC patterns.',
      'On Kinetix ML Studio, contributed to the shared application platform — a pnpm/Turborepo monorepo with a NestJS API and a Next.js front end.',
      'Implemented authentication and role-based access control, enforcing a database-driven privilege matrix (CASL) across API routes with Keycloak and Auth.js session handling.',
      'Built master-data and audit-trail modules on Prisma over PostgreSQL, with Zod schemas shared across backend and frontend so validation, typing and API docs derive from a single contract.',
      'Covered platform endpoints with automated integration tests using Jest and Testcontainers.',
    ],
    stack: [
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
    company: 'Sitecore',
    period: 'Sep 2024 – Jul 2025',
    duration: '11 months',
    summary:
      'Built and maintained scalable web applications on .NET 7 and Angular, and supported partner implementations across the Moosend, Send, Discover and Sitecore Search products.',
    highlights: [
      'Developed and maintained scalable web applications using .NET 7 and Angular, improving overall system efficiency.',
      'Provided technical support for Moosend, Send, Discover and Sitecore Search, diagnosing and resolving partner implementation issues.',
      'Deconstructed and analysed partner implementations to identify and resolve technical issues.',
      'Worked in Agile ceremonies — sprint planning, stand-ups and retrospectives — tracking work in JIRA.',
    ],
    stack: ['.NET 7', 'Angular', 'TypeScript', 'SQL Server'],
  },
  {
    title: 'Software Engineer Intern',
    company: 'IFS R&D International (Pvt) Ltd',
    period: 'Dec 2022 – Jul 2023',
    duration: '8 months',
    summary:
      'Built and optimised features for Team ALE on Angular and .NET, with a focus on performance, maintainability and code quality.',
    highlights: [
      'Developed and optimised new features for Team ALE using Angular and .NET, ensuring high performance and scalability.',
      'Enhanced application functionality for better maintainability and efficiency.',
      'Performed unit testing and took part in peer code reviews to raise code quality and compliance with best practice.',
    ],
    stack: ['Angular', '.NET Framework', 'C#', 'SQL Server'],
  },
] as const;

/** Grouped as on the CV. */
export const SKILLS = [
  {
    group: 'Languages',
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
    items: ['Azure', 'AWS', 'Docker', 'Azure DevOps', 'Git', 'GitHub'],
  },
  {
    group: 'Tools & Practices',
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
