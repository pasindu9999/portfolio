# Portfolio — Udara Kurukulasooriya

Personal portfolio. Astro 7, static output, deployed to Netlify.

## Commands

| Command | What it does |
| --- | --- |
| `npm install` | Install dependencies (run once) |
| `npm run dev` | Dev server at http://localhost:4321 |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run check:contrast` | WCAG AA audit of every colour token pair, both themes |
| `npm run og` | Regenerate `public/og/default.png` |

Type checking (`astro check`) is not wired up — it needs two extra dev
dependencies (`@astrojs/check`, `typescript`). Add them with
`npm i -D @astrojs/check typescript` if you want it; the build already
validates content-collection frontmatter without it.

If `npm run dev` says a server is already running, stop it with
`npx astro dev stop` — `Ctrl+C` in a detached terminal does not always kill it.

## Where things live

```
src/
  content.config.ts      Zod schemas for projects + posts
  content/projects/*.md  One file per case study (frontmatter + body)
  content/posts/*.md     Writing entries (none yet)
  data/site.ts           Name, links, bio, skills, experience
  assets/                Images that go through the build pipeline
  styles/
    tokens.css           Colour / type / space tokens, both themes
    base.css             Reset and document defaults
    layout.css           The editorial grid
    motion.css           Reveals + view transitions
    global.css           Entry: Tailwind + the above
  components/            Header, footer, ledger, marginalia, theme toggle
  layouts/BaseLayout.astro  <head>, SEO, fonts, theme script
public/                  Served verbatim: favicon, cv.pdf, og/
```

`/styleguide` renders every token and component in both themes side by side.
It is **dev-only** — `getStaticPaths` returns nothing in a production build, so
it is never emitted.

## Adding a project

Create `src/content/projects/<slug>.md`. The slug becomes the URL
(`/work/<slug>/`). The schema is enforced at build time, so a typo in `tags` or
a missing cover image **fails the build** rather than shipping broken.

```yaml
---
title: 'Project name'
blurb: 'One sentence, max 160 chars. Also used as the meta description.'
tags: ['Java', 'Spring Boot']   # must exist in STACK in content.config.ts
cover: '../../assets/projects/<file>.jpg'   # optional
coverAlt: 'What the image actually shows.'
coverFit: 'cover'               # 'contain' for UI screenshots (see below)
year: 2024
role: 'Sole developer'
timeline: 'Mar–Jun 2024'
repo: 'https://github.com/...'  # optional
demo: 'https://...'             # optional
featured: false
order: 4
---
```

Covers are optional. A project without one still builds — or run
`npm run covers` to generate a typographic card from the design tokens for it.

`coverFit` controls how the image fills its frame. Illustrations and generated
covers crop fine with the default `'cover'`. A **UI screenshot must use
`'contain'`** — cropping one to the 3:2 frame throws away the content that made
it worth showing. `contain` keeps the image's natural proportions and frames it
on the sunken surface.

## Theming

Theme is an attribute on `<html>`: `data-theme="light" | "dark"`.

- `localStorage.theme` holds `"light"` or `"dark"` only. **Absence means
  "follow the system"**, so resetting is `removeItem`.
- A blocking inline script in `<head>` (`components/ThemeScript.astro`) resolves
  the theme before first paint. It **must** keep `is:inline`, or Astro bundles
  it into a deferred file and you get a flash of the wrong theme.
- Colours are semantic tokens in `tokens.css`. The two themes are deliberately
  *not* inversions — the accent changes hue, and elevation is a shadow on light
  and a luminous hairline on dark.
- Adding or changing a colour? Run `npm run check:contrast`.

## Motion

CSS-first, so the homepage ships **zero external JavaScript**.

- Scroll reveals use native scroll-driven animations (`animation-timeline:
  view()`), with a small IntersectionObserver shim for browsers without them.
- Page transitions use native cross-document View Transitions — no client
  router, which is also why the theme survives navigation for free.
- **Rule: content is visible by default.** Never ship `opacity: 0` that JS or
  an unsupported feature has to undo.
- Use animation *longhands* for scroll-driven animations. The `animation`
  shorthand resets `animation-duration` to `0s`, which pins the element at its
  first keyframe and makes it permanently invisible.
- Everything sits inside `@media (prefers-reduced-motion: no-preference)`.

## Deploying

Netlify builds with `npm run build` and publishes `dist/` (see `netlify.toml`).
No adapter, no serverless functions.

The contact form uses Netlify Forms. Netlify's build bot only detects forms
present in the emitted HTML, so the form must stay static markup — never move
it into a client-rendered island.
