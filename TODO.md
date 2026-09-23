# Portfolio — outstanding work

Status as of the current branch (`rebuild/astro-editorial`). Nothing is
committed yet.

Built and verified: 12 routes, WCAG AA in both themes, 0 bytes of external JS on
the homepage, all internal links resolving, content visible with JS disabled.

---

## 1. Blocking — must happen before this goes live

- [ ] **Set the real production domain** in `astro.config.mjs` (`site:`). It is
      currently the placeholder `https://udara-portfolio.netlify.app`, and it
      drives every canonical URL, the OG tags and the sitemap. Wrong value =
      wrong canonicals in Google.
- [ ] **Decide on the HRMS project.** `src/content/projects/hrms.md` is
      `draft: true` because it appears in GitHub and on the old site but
      nowhere on the CV — there is no verified description, role, timeline or
      stack. Either fill it in and set `draft: false`, or delete the file.
- [ ] **Verify Netlify Forms on a deploy preview.** Submit the contact form once
      and confirm the entry lands in the Netlify Forms dashboard *before*
      pointing the domain at it. The form must stay static markup — if it ever
      moves into a client-rendered island, Netlify's build-time bot stops
      detecting it and submissions silently vanish.
- [ ] **Check the ALE Portal dates on your CV.** The CV lists the project as
      *Dec 2023 – Jul 2024*, but the IFS role it belongs to ran
      *Dec 2022 – Jul 2023*, and Sitecore did not start until Sep 2024. The site
      currently uses the CV dates verbatim. This likely wants fixing on the CV
      itself, not just here.

## 2. Content you still need to supply

- [ ] **Live demo URLs** — no project currently has a `demo:` link. If any of
      these are deployed anywhere, add it; a working demo is the single
      strongest thing a recruiter can click.
- [ ] **Repos for the two 2026 AI projects.** Agentic AI and AI PDF Chatbot have
      no `repo:` set. If they are public, add them. If they are private,
      consider whether a sanitised public version is worth the effort — they are
      your strongest work and currently have nothing to click through to.
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
