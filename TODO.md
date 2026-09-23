# Portfolio — outstanding work

Status as of the current branch (`rebuild/astro-editorial`). Nothing is
committed yet.

Live at <https://udara-kurukulasooriya-portolio.netlify.app/>.

Built and verified: 12 routes, WCAG AA in both themes, 0 bytes of external JS on
the homepage, all internal links resolving, content visible with JS disabled.
Confirmed working on the live deploy: security headers and the immutable
`/_astro/*` cache header.

---

## 1. Blocking — must happen before this goes live

- [x] ~~Set the real production domain in `astro.config.mjs`~~ — now
      `https://udara-kurukulasooriya-portolio.netlify.app`. Verified: canonical,
      `og:url` and all 11 sitemap `<loc>` entries point at it.
      **Note the Netlify site name is misspelled — "portolio", missing the f.**
      Worth renaming in Netlify (Site settings → Change site name) before this
      URL goes on a CV; if you do, change `site:` to match on the same day.
- [ ] **Decide on the HRMS project.** `src/content/projects/hrms.md` is
      `draft: true` because it appears in GitHub and on the old site but
      nowhere on the CV — there is no verified description, role, timeline or
      stack. Either fill it in and set `draft: false`, or delete the file.
- [ ] **Redeploy so Netlify registers the form.** Form detection is now
      enabled in the UI, but detection only runs **at deploy time**, scanning
      the built HTML — and no deploy has happened since it was switched on. So
      Netlify has zero forms registered, which is why the notification
      dropdown says *No results found*.

      This also explains the `/thanks/` 404. `GET /thanks/` is healthy
      (verified HTTP 200); the 404 comes from the **POST**. The form does
      `method="POST" action="/thanks/"`, and on a static site there is no POST
      handler — normally Netlify intercepts that POST, stores the submission,
      then serves `/thanks/`. With no form registered it does not intercept,
      the POST falls through to plain static file serving, which only answers
      GET, and you get a 404.

      Fix: **Deploys → Trigger deploy → Clear cache and deploy site** (or just
      push a commit). Then the dropdown will list `contact`, and the POST will
      be captured.

      Verified already correct, so do NOT change the markup chasing this:
      `name="contact"`, `method="POST"`, `action="/thanks/"`,
      `data-netlify="true"`, `netlify-honeypot="bot-field"`, and the hidden
      `form-name=contact` input are all present in the deployed HTML.

      After the deploy: submit once, confirm it lands under
      Forms → contact → Submissions, and add an email notification under
      Forms → Submission notifications or you will never hear about messages.
      Keep the form as static markup — moving it into a client-rendered island
      makes Netlify stop detecting it and submissions vanish silently.
- [x] ~~Check the ALE Portal dates on your CV~~ — fixed in the CV to
      *Dec 2022 – Jul 2023*, and the site now matches.

## 2. Content you still need to supply

- [ ] **Repo for Agentic AI.** AI PDF Chatbot now links to
      `github.com/pasindu9999/AI-chatbot`. Agentic AI & LLM Engineering — the
      project leading the whole ledger — still has no `repo:` and nothing to
      click. Add it if public.
- [ ] **Live demos.** None yet, noted as future work. Whenever one exists, add
      `demo: 'https://...'` to that project's frontmatter — the case study
      template already renders the link.
- [ ] **Confirm the publish dates on the two posts.** I chose
      2026-08-14 (RAG/agents) and 2026-06-05 (Clean Architecture) — change
      `pubDate` in `src/content/posts/*.md` if they should be different.
- [ ] **Project screenshots (optional).** Three projects use generated
      typographic covers (`npm run covers`) because they had no image. Real
      screenshots would be stronger for AI PDF Chatbot and ALE Portal if you
      have any that are safe to publish.
- [ ] **A hero photo (optional).** The masthead is deliberately typographic with
      no portrait. The about page uses `src/assets/portrait-about.jpeg`. Replace
      it if you want a better one.
- [ ] **Update the "My Portfolio" link on your CV** to the new domain once it
      is live.

## 3. Verification not yet run

These need a real browser or a deployed URL, so none of them have been done:

- [ ] Lighthouse on mobile, throttled, for `/` and one `/work/[slug]` — target
      ≥95 across all four categories.
- [ ] axe DevTools on `/`, `/about`, a case study and a post, in **both**
      themes.
- [ ] Full keyboard-only pass — tab every interactive element, confirm visible
      focus throughout and that the skip link works.
- [ ] Safari and Firefox check. Scroll-driven animations and cross-document View
      Transitions degrade gracefully by design, but this has only been verified
      in Chrome.
- [ ] Confirm `prefers-reduced-motion: reduce` disables all motion (the CSS is
      written for it; it has not been eyeballed in a real browser).

## 4. Worth doing, not urgent

- [ ] **RSS feed for `/writing`.** Now that there are two real posts, this is
      cheap (`@astrojs/rss`) and expected by anyone who reads dev blogs.
- [ ] **Decide on more writing.** Two solid posts is a good signal. Two posts
      that stay frozen for a year is a worse signal than none — either keep
      going or drop the section.
- [ ] **Type checking.** `astro check` is not wired up; it needs
      `@astrojs/check` and `typescript` as dev dependencies. The build already
      validates content frontmatter without it.
- [ ] **Tighten CSP.** `netlify.toml` ships the other security headers but no
      Content-Security-Policy, because the no-flash theme script is inline and a
      strict `script-src` would break it. Ship `Report-Only` first, then add a
      script hash.
- [ ] **Analytics.** None installed. Netlify Analytics or Plausible if you want
      to know whether anyone reads the case studies.
- [ ] **Consider adding the Automatic Whiteboard Writer project** (2020–21,
      embedded C). Left out deliberately — it is old enough that it may dilute
      the 2026 AI work rather than add to it.

## 5. Deliberately excluded — do not "fix" these

- **Your phone number.** On the CV, left off the site. A public page invites
  spam; email and LinkedIn are enough.
- **The CV's referees.** Names, phone numbers and emails of third parties do not
  belong on a public page without their consent.
- **Skill proficiency levels.** The old site labelled everything
  Beginner/Intermediate. The CV states no levels, so the site renders skills as
  a tag field instead of inventing ratings.
