# Adult Niche Finder

**Find Your Creator Lane Before the Internet Names You.**

An interactive, cinematic creator identity assessment for adults exploring creator-business
opportunities. The experience moves through five rooms: **The Invitation → The Audition → The
Reveal → The Playbook → The Next Move**.

## Run locally

Any static file server works. For example:

```bash
# Python 3
python -m http.server 8080

# then open http://localhost:8080
```

Or with Node:

```bash
npx serve .
```

No build step, no dependencies, no API keys.

## Features

- Age-gate confirmation (front-end only, not identity verification).
- Ten-question interactive assessment with single-select and multi-select cards, progress bar,
  validation, back navigation, and smooth transitions.
- Deterministic weighted persona matching engine with hard boundary constraints and tie-breaking.
- Dramatic persona reveal with fit estimate, strengths, reasons, identity statement, and two
  alternative matches.
- Personalized creator playbook: brand direction, content pillars, platform recommendations, and a
  seven-day starter plan.
- Result actions: save to localStorage, copy niche brief, download playbook, share persona,
  retake quiz.
- Interactive creator protection checklist with copy support.
- Shareable persona result pages (`?persona=<archetype>`).
- The Lab: interactive creator toolkit (bio builder, brand name generator, pillar generator,
  profile optimizer, 30-day calendar builder).
- Legal and compliance pages: Privacy Policy, Terms of Service, Cookie Policy, Age Verification
  Policy, DMCA / NSFW Policy.
- Privacy-first opt-in analytics module with explicit consent toggle and pluggable delivery.
- The Method page explaining the lane-mapping engine, fit estimates, and boundaries. — **P1** ✅ done
- The FAQ page with accessible accordion answers. — **P1** ✅ done
- The Studio page telling the casting-room story. — **P2** ✅ done
- The Blog / Journal page with field notes. — **P2** ✅ done
- The Stories page with consented narratives. — **P2** ✅ done
- The Reports page with research briefs. — **P2** ✅ done
- The Adaptive follow-up questions feature. — **P2** ✅ done
- Static JSON data API for archetypes (`archetypes.json` with all 10 archetypes). — **P3** ✅ done
- Scoring result events (`scoring_completed` webhook-style event) via opt-in analytics delivery. — **P3** ✅ done
- Lane Letter local-only email capture / newsletter. — **P3** ✅ done
- Saved creator profiles / lanes manager (multi-save, restore, delete, clear) via local storage. — **P3** ✅ done
- Hardened opt-in analytics: consent re-checked per event, bounded retry queue with capped backoff, sendBeacon/fetch+keepalive priority, local queue fallback. — **P3** ✅ done
- Lane Letter local-only email capture / newsletter. — **P3** ✅ done
- Accessibility improvements (sr-only, focus management, modal trap, live regions, checklist ARIA). — **P4** ✅ done
- Mobile responsiveness (lab-grid breakpoint, scrollable nav, 44px touch targets, fluid forms). — **P4** ✅ done
- SEO meta-tag sweep (OG/Twitter/robots on all 15 pages, favicon, JSON-LD WebSite). — **P4** ✅ done
- Social post / share-card generator (3 post variants + copy/download + SVG card). — **P4** ✅ done
- Platform compliance checker (platform/type/boundary → checklist). — **P4** ✅ done
- The Lab tools run locally in your browser. — **P0** ✅ done

## Release Polish (P4)

| # | Item | Status |
|---|---|---|
| P4-1 | Accessibility audit | ✅ Built (sr-only, focus-visible, dialog + trap, live regions, focus management, checklist ARIA) |
| P4-2 | Mobile responsiveness tweaks | ✅ Built (lab-grid breakpoint, scrollable nav, centered orb, 44px targets, fluid forms) |
| P4-3 | SEO meta-tag sweep | ✅ Built (OG/Twitter/robots all 15 pages + favicon + JSON-LD WebSite) |
| P4-4 | Ship prep: docs, structure, final test pass | ✅ Built (scripts updated, structure docs, 28/28 tests, serve checks) |
| P4-5 | Social post / share-card generator | ✅ Built (Lab: 3 post variants + copy/download + SVG share card) |
| P4-6 | Platform compliance checker tool | ✅ Built (Lab: platform/type/boundary → checklist) |

## Project structure

```text
adult-niche-finder/
├── index.html
├── lab.html
├── method.html
├── faq.html
├── privacy.html
├── terms.html
├── cookie-policy.html
├── age-verification-policy.html
├── dmca-policy.html
├── assets/
│   ├── styles.css
│   ├── quiz-data.js
│   ├── scoring.js
│   ├── personas.js
│   ├── results.js
│   ├── privacy.js
│   ├── lab.js
│   ├── analytics.js
│   ├── app.js
│   ├── newsletter.js
│   └── favicon.svg
├── tests/
│   ├── scoring.test.js
│   ├── analytics.test.js
│   ├── profiles.test.js
│   ├── newsletter.test.js
│   └── lab.test.js
├── README.md
├── package.json
└── archetypes.json
```

## Testing

```bash
node --test tests/scoring.test.js tests/analytics.test.js tests/profiles.test.js tests/newsletter.test.js tests/lab.test.js
```

Or via npm:

```bash
npm test
```

28 tests total across scoring, analytics, profiles, newsletter, and lab generators.

The scoring engine is a pure module and is covered by automated tests for:

1. Luxury-focused answers producing a glamorous result.
2. Anonymous preferences being respected.
3. Live-video rejection not producing live-only strategies.
4. Couple branding not being recommended without affirmative collaboration interest.
5. All ten archetypes being reachable through appropriate answer combinations.
6. Incomplete quiz answers being handled safely.
7. Deterministic tie-breaking.
8. Generated playbooks containing relevant, nonempty recommendations.

## Notes

- Match scores are exploratory heuristic estimates, not scientific measurements or predictions of
  financial success.
- The assessment never collects personally identifiable information and never transmits answers.
- All user data is kept in memory unless the user explicitly saves a result locally.
- Content remains non-explicit and free of minor-appropriation concerns.
- Platform recommendations always include a reminder to verify current eligibility, identity
  verification, and content policies.
