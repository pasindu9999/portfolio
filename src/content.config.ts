import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Stack names are a closed set on purpose. A typo like "Sprint Boot" or
 * "MySQl" then fails the build instead of quietly rendering a one-off tag
 * that never matches a filter. Add new names here deliberately.
 */
const STACK = [
  // Languages
  'C#',
  'TypeScript',
  'JavaScript',
  'Python',
  'Java',
  'SQL',
  'C',
  // .NET / Microsoft
  '.NET 10',
  '.NET 7',
  '.NET Core',
  '.NET MVC',
  '.NET Framework',
  'ASP.NET',
  'ASP.NET Core',
  'SignalR',
  'EF Core',
  'Kendo UI',
  'Telerik Reporting',
  'Azure DevOps',
  // Web
  'Angular',
  'Next.js',
  'React',
  'NestJS',
  'Node.js',
  'Spring Boot',
  'jQuery',
  'TanStack Query',
  'Tailwind CSS',
  'Streamlit',
  'Gradio',
  'Vite',
  // Data
  'SQL Server',
  'PostgreSQL',
  'MySQL',
  'MongoDB',
  'Prisma',
  'TypeORM',
  'ChromaDB',
  'SQLite',
  // Platform / auth
  'Zod',
  'CASL',
  'Keycloak',
  'Docker',
  'Turborepo',
  'Azure Container Apps',
  'Bicep',
  'GitHub Actions',
  'Cloudflare Pages',
  // Optimisation / solvers
  'OR-Tools (CP-SAT)',
  // ML / GenAI
  'PyTorch',
  'HuggingFace Transformers',
  'QLoRA / PEFT',
  'LangChain',
  'Modal',
  'Weights & Biases',
  'Ollama',
  'OpenAI API',
  'Anthropic API',
  'Gemini API',
  'YOLOv8',
  'ONNX Runtime',
  // Testing
  'Jest',
  'Testcontainers',
  'Playwright',
  'pytest',
] as const;

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      // Doubles as the meta description, hence the hard cap.
      blurb: z.string().max(160),
      tags: z.array(z.enum(STACK)).min(1),
      // image() means a missing or misspelled file fails the build rather
      // than 404ing in production. Optional: projects without a screenshot
      // fall back to a typographic cover generated from the design system.
      cover: image().optional(),
      coverAlt: z.string().optional(),
      /**
       * How the cover fills its box. Illustrations and generated covers crop
       * fine ('cover'); a UI screenshot must not lose its edges, so those use
       * 'contain' and sit letterboxed on the sunken surface.
       */
      coverFit: z.enum(['cover', 'contain']).default('cover'),
      year: z.number().int().min(2000).max(2100),
      role: z.string(),
      timeline: z.string(),
      /** Short label for where the work happened, e.g. an employer or course. */
      context: z.string().optional(),
      repo: z.string().url().optional(),
      demo: z.string().url().optional(),
      featured: z.boolean().default(false),
      order: z.number().int(),
      draft: z.boolean().default(false),
    }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    blurb: z.string().max(160),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, posts };
