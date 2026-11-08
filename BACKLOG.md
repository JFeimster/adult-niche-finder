# Adult Niche Finder — Build Backlog

> Saved from the master build-prompt phase. Prioritized roadmap for post-v1 feature work.

## ✅ P0 — Foundation & Compliance (COMPLETE)

| # | Item | Status |
|---|---|---|
| P0-1 | Legal/compliance pages (Privacy, Terms, Cookie, Age Verification, DMCA/NSFW) | ✅ Built (`privacy.html`, `terms.html`, `cookie-policy.html`, `age-verification-policy.html`, `dmca-policy.html`) |
| P0-2 | Shareable persona result pages (`?persona=<archetype>`) | ✅ Built (scoring + app + share wiring) |
| P0-3 | Multi-save / saved-results handling | ✅ Built (save / restore / clear) |
| P0-4 | Interactive Lab toolkit hub (bio, names, pillars, profile, calendar tools) | ✅ Built (`lab.html`, `assets/lab.js`) |
| P0-5 | Privacy-first opt-in analytics | ✅ Built (`assets/analytics.js`, consent toggle, events) |

## 🟠 P1 — Core Product Expansion (COMPLETE)

| # | Item | Status |
|---|---|---|
| P1-1 | Method / lane-mapping deep dive page | ✅ Built (`method.html`) |
| P1-2 | **FAQ page** | ✅ Built (`faq.html`) |
| P1-3 | Comparison pages (subscription vs. live vs. social) | ✅ Built (`comparisons.html`) |
| P1-4 | Programmatic SEO archetype pages | ✅ Built (`archetypes.html`) |
| P1-5 | Content calendar export (30-day) | ✅ Built (Lab: JSON export) |
| P1-6 | Prompt packs per archetype | ✅ Built (Lab: Prompt Pack Builder) |
| P1-7 | Readiness / onboarding tracker | ✅ Built (Lab: Readiness Tracker) |

## 🟡 P2 — Experience & Content Depth

| # | Item | Status |
|---|---|---|
| P2-1 | Blog / Journal | ✅ Built (`blog.html`) |
| P2-2 | Creator Stories (consented) | ✅ Built (`stories.html`) |
| P2-3 | About / Studio page | ✅ Built (`about.html`) |
| P2-4 | Niche research reports | ✅ Built (`reports.html`) |
| P2-5 | Persona Lore Writer | ✅ Built (`lab.html`, `assets/lab.js`) |
| P2-6 | Adaptive follow-up questions | ✅ Built (follow-up round + recompute) |

## 🟢 P3 — Platform & Infrastructure

| # | Item | Status |
|---|---|---|
| P3-1 | Static JSON data API (`archetypes.json`, etc.) | ✅ Built (`archetypes.json`, 10 archetypes) |
| P3-2 | Scoring webhook / callback | ✅ Built (scoring_completed event via pluggable analytics delivery) |
| P3-3 | Creator accounts / saved profiles | ✅ Built (multi-save saved lanes store + UI) |
| P3-4 | Email capture / newsletter | ✅ Built (`assets/newsletter.js`, Lane Letter local-only capture + UI) |
| P3-5 | Analytics infrastructure / delivery hardening | ✅ Built (consistency-checked consent, retry queue, sendBeacon/fetch+keepalive, local fallback) |

## 🔵 P4 — Release Polish (DEFINED)

| # | Item | Status |
|---|---|---|
| P4-1 | Accessibility audit | ✅ Built (sr-only, focus-visible, dialog + trap, live regions, focus management, checklist ARIA) |
| P4-2 | Mobile responsiveness tweaks | ✅ Built (lab-grid breakpoint, scrollable nav, centered orb, 44px targets, fluid forms) |
| P4-3 | SEO meta-tag sweep | ✅ Built (OG/Twitter/robots all 15 pages + favicon + JSON-LD WebSite) |
| P4-4 | Ship prep: docs, structure, final test pass | ✅ Built (README/P4 table/scripts updated, 28/28 tests, serve checks) |
| P4-5 | Social post / share-card generator | ✅ Built (Lab: 3 post variants + copy/download + SVG share card) |
| P4-6 | Platform compliance checker tool | ✅ Built (Lab: platform/type/boundary → checklist) |

## 🟣 P5 — Post-Release Roadmap (DEFINED)

| # | Item | Status |
|---|---|---|
| P5-1 | Deployment to static host | ✅ Deployed (Vercel — https://adult-niche-finder.vercel.app/, auto-deploys from `main`) |
| P5-2 | CI / GitHub Actions workflow | ⬜ Planned (run `npm test` + `npm run check` on every push) |
| P5-3 | PWA / offline support | ⬜ Planned (service worker + manifest) |
| P5-4 | Export result to PDF | ⬜ Planned (print stylesheet / client-side PDF) |
| P5-5 | i18n / language toggle | ⬜ Planned (static JSON locale files) |
| P5-6 | A/B test lanes / variant scoring | ⬜ Planned (experimental question weightings) |
| P5-7 | Dark/light theme toggle | ⬜ Planned (user preference beyond neon-dark) |

---

## Backlog source notes (from phase planning)

### Pages (suggested)
1. Creator Archetype Library + detail pages — **P0** ✅/done
2. The Lab interactive toolkit hub — **P0** ✅ done
3. Method / science-ish deep dive — **P1** ✅ done
4. Safety & Ethics / Compliance hub — **P0** ✅ done
5. Creator Stories (consented) — **P2**
6. Comparison pages (subscription/live/social) — **P1**
7. Blog / Journal — **P2**
8. About / Studio — **P2**
9. FAQ — **P1** (next)
10. Legal footer pages — **P0** ✅ done

### Features (suggested)
1. Shareable persona result pages — **P0** ✅ done
2. Multi-save / results history — **P0** ✅ done
3. Adaptive follow-up questions — **P2**
4. Content calendar export (30-day) — **P1**
5. Social post / share-card generator — **P1**
6. Prompt packs per archetype — **P1**
7. Readiness / onboarding tracker — **P1**
8. Local progress tracking — **P3**

### API / Backend / Infrastructure (suggested)
1. Static JSON data API — **P3**
2. Scoring webhook/callback — **P3**
3. Creator accounts / saved profiles — **P3**
4. Email capture / newsletter — **P3**
5. Opt-in analytics — **P0** ✅ done (module added)

### AI Toolkit expansion (suggested)
1. Live AI Creator Bio Builder — **P0** ✅ done
2. Live Creator Brand Name Generator — **P0** ✅ done
3. Live Content Pillar Generator — **P0** ✅ done
4. Live Profile Optimization Assistant — **P0** ✅ done
5. Content Calendar Builder — **P0** ✅ done
6. Persona Lore Writer — **P2**

### Growth / SEO (suggested)
1. Programmatic SEO archetype pages — **P1**
2. Comparison / alternative pages — **P1**
3. Niche research reports — **P2**
4. Follow-up quiz funnel extensions — **P2**

### Trust & Compliance (suggested)
1. Privacy Policy / Terms / Age Policy / DMCA — **P0** ✅ done
2. Consent & boundaries education section — **P1**
3. Platform compliance checker tool — **P2**

---

## How to reference / update this list
- This file lives at: `C:\Users\jason\Projects\adult-niche-finder\BACKLOG.md`
- Priorities: **P0** (foundation/compliance — complete) → **P1** (core product — in progress) → **P2** (content depth) → **P3** (platform/infrastructure).
- Next action: **P0–P4 complete and deployed.** P5 defined (deployment done via Vercel). Next: **P5-2 CI / GitHub Actions**, then PWA/offline, PDF export, i18n, theme toggle per priority.
