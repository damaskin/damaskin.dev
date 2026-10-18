# damaskin.dev

[![CI / Deploy](https://github.com/damaskin/damaskin.dev/actions/workflows/ci.yml/badge.svg)](https://github.com/damaskin/damaskin.dev/actions/workflows/ci.yml)

CV and portfolio of **Ivan Damaskin** — fullstack developer (Angular / Node.js, AI-assisted development).
Live at **[damaskin.dev](https://damaskin.dev)** (Russian) and **[damaskin.dev/en](https://damaskin.dev/en)** (English).

## What's inside

- **Angular 22** — standalone components, Signals, zoneless change detection, new control flow.
- **Static prerender (SSG)** — both language versions are rendered to HTML at build time (`outputMode: static`),
  hydrated in the browser. Content, meta tags, Open Graph, `hreflang` and JSON-LD are all in the HTML.
- **A CV that reads in 30 seconds** — the first screen answers who, what, where and how to reach; experience opens
  with a career timeline (one bar per job, 2013 → now), then the details. Light "paper" theme by default, dark one
  follows the system or the toggle in the header.
- **No animation library** — small touches are CSS only (scroll-driven reveals, the timeline bars growing in) and
  switch off with `prefers-reduced-motion`; the AI section replays an agent session with an IntersectionObserver.
  Content never depends on JS to be visible.
- **Print-ready** — Ctrl+P gives a clean black-on-white résumé with contacts and URLs spelled out.
- **Accessibility** — keyboard and screen-reader friendly, WCAG AA contrast in both themes.
  Lighthouse (desktop): 100 / 100 / 100 / 100.

## Structure

```
src/app/
  content/         all texts (RU + EN), shared facts and the timeline maths — the only place to edit the CV
  core/            Seo (head tags, JSON-LD, font preloads)
  pages/home.ts    the page: header, 7 sections, footer
  sections/        hero (with key numbers), about, experience (career timeline + jobs), projects,
                   ai-workflow (replayed agent session), stack, contact, header, footer
public/            fonts (self-hosted subsets), images, CV PDF, OG cards, robots / sitemap / llms.txt
deploy/            server side: nginx container, TLS, CI entry point (see below)
scripts/           build check, image pipeline, OG template, infrastructure deploy
```

## Commands

```bash
npm start              # dev server, http://localhost:4200
npm run build          # static build → dist/damaskin-dev/browser
npm run test:ci        # unit tests (Vitest)
npm run lint           # ESLint (angular-eslint, template accessibility rules)
npm run format:check   # Prettier
npm run check:dist     # smoke test of the build: pages, head tags, every referenced asset exists
```

## CI / CD

[GitHub Actions](.github/workflows/ci.yml) on every push and pull request: lint → formatting → unit tests →
static build (commit SHA baked into the footer) → build check → Lighthouse CI with score assertions.
On `main` the build is deployed to the server, then the live page is checked for the new SHA.

Hosting is a Hetzner VPS shared with other projects: a common edge nginx routes TLS by SNI to this site's own
nginx container, which terminates TLS (Let's Encrypt, renewed by cron) and serves the current release.
The CI SSH key is pinned on the server to [`deploy/bin/ci-deploy`](deploy/bin/ci-deploy) with `command=`:
it can only upload a release of static files (validated, switched atomically, last 5 kept for rollback).
Server infrastructure itself is applied from a workstation with `npm run deploy:infra`.
