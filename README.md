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
    components.css       Shared buttons, glass surface, pills, section heads
    motion.css           Reveals + page view transitions
    global.css           Entry: Tailwind + the above
  components/            Header, footer, ledger, marginalia, theme toggle,
                         Sky (the animated night/day background)
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

Covers are optional. A project without one still builds. Projects with no UI to
screenshot get an illustration drawn from what the project is, in the night-sky
palette: add an entry (and a small motif function) to `scripts/make-covers.mjs`,
run `npm run covers`, and point `cover:` at the `<slug>-cover.png` it writes.
Give a redesigned cover a **new filename** -- the dev server caches optimised
images for a year on a URL with no content hash, so re-using a name leaves
browsers showing the old art until a hard refresh.

`coverFit` controls how the image fills its frame. Illustrations and generated
covers crop fine with the default `'cover'`. A **UI screenshot must use
`'contain'`** — cropping one to the 3:2 frame throws away the content that made
it worth showing. `contain` keeps the image's natural proportions and frames it
on the sunken surface.

## Theming

Theme is an attribute on `<html>`: `data-theme="light" | "dark"`.

- `localStorage.theme` holds `"light"` or `"dark"` only. **Absence means
  "follow the system"**, so resetting is `removeItem`. The header has a single
  sun/moon button with no "system" position, so the footer shows a
  **Use system theme** link once a choice has been made.
- A blocking inline script in `<head>` (`components/ThemeScript.astro`) resolves
  the theme before first paint and sets `<meta name="theme-color">`. It **must**
  keep `is:inline`, or Astro bundles it into a deferred file and you get a flash
  of the wrong theme.
- Colours are semantic tokens in `tokens.css`. The two themes are two designed
  skies, not an inversion: a daytime sky (blue → lavender → peach, frosted white
  glass, soft lavender shadow) and a night sky (indigo, navy glass, luminous
  hairline), sharing one purple accent family. `--accent` is for text and
  links; `--accent-fill` is a deeper step for button backgrounds so white text
  on it clears AA.
- Text sits on a moving gradient and on translucent glass, so `npm run
  check:contrast` tests every text colour against **every sky stop and the
  flattened glass** (including the more opaque mobile glass). Adding or changing
  a colour? Run it.
- `make-covers.mjs` hard-codes the night palette for the generated project
  covers. Keep it in step with `tokens.css`, then `npm run covers`.

## The sky (`components/Sky.astro`)

One fixed, `aria-hidden` layer behind every page with two scenes: a night scene
(gradient, twinkling stars, shooting stars) and a day scene (gradient, sun
glow, drifting blurred clouds, floating motes).

- Star, cloud, mote and meteor positions are generated **at build time** from a
  seeded PRNG: no runtime placement JS, identical on every page, stable across
  resizes. Stars are a handful of one-pixel elements whose `box-shadow` carries
  the dots, so the twinkle is a few compositor-only opacity animations, not
  hundreds of nodes.
- Everything animates `transform`/`opacity` only.
- **Sunrise / sunset.** A single `--night` number (0 or 1) is set per theme and
  every part of the sky eases to its end state on its own clock. Because a CSS
  transition uses the timing of the state it is heading *into*, each direction
  has its own choreography, defined as variables on `.sky`: sunset sinks the
  clouds, lowers the sun, floods in the night gradient, brings the star layers
  in one after another, then resumes meteors; sunrise reverses it. The
  transitions sit on wrapper elements, never on the animated children, so they
  cannot fight the keyframes. Text colours ease in step via `html.theme-changing`
  (see `base.css`) -- short and late on purpose, timed to the sky's mid-dusk.
- The scene that is not showing is `visibility: hidden` and its animations are
  paused; every animation pauses while the tab is hidden (`data-sky-paused`).
- Below 48rem: fewer star layers, sparkles, meteors, clouds and motes, a smaller
  cloud blur, and opaque glass instead of `backdrop-filter`.
- `prefers-reduced-motion: reduce`: stars, sun and clouds render as a still
  picture, meteors and motes are removed, and the theme swap is an instant cut.

## Motion

CSS-first. The only client JS is small: the theme toggle, the footer reset, the
header menu's close-on-click, the section index highlight, and the reveal shim.

- Scroll reveals use native scroll-driven animations (`animation-timeline:
  view()`), with a small IntersectionObserver shim for browsers without them.
- The sticky header's frosted layer fades in on scroll (`animation-timeline:
  scroll()`); without support it is simply frosted from the start.
- Page transitions use native cross-document View Transitions -- no client
  router, which is also why the theme survives navigation for free. (The theme
  *change* is deliberately not a view transition: a snapshot would freeze the
  animated sky mid-flight.)
- **Rule: content is visible by default.** Never ship `opacity: 0` that JS or
  an unsupported feature has to undo. The hero's load-in uses a *backwards* fill
  for the same reason.
- Use animation *longhands* for scroll-driven animations. The `animation`
  shorthand resets `animation-duration` to `0s`, which pins the element at its
  first keyframe and makes it permanently invisible.
- Everything sits inside `@media (prefers-reduced-motion: no-preference)` or has
  an explicit `reduce` branch.

## Deploying

Netlify builds with `npm run build` and publishes `dist/` (see `netlify.toml`).
No adapter, no serverless functions.

The contact form uses Netlify Forms. Netlify's build bot only detects forms
present in the emitted HTML, so the form must stay static markup — never move
it into a client-rendered island.
