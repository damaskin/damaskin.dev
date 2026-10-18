# damaskin.dev

[![CI / Deploy](https://github.com/damaskin/damaskin.dev/actions/workflows/ci.yml/badge.svg)](https://github.com/damaskin/damaskin.dev/actions/workflows/ci.yml)

CV and portfolio of **Ivan Damaskin** — fullstack developer (Angular / Node.js, AI-assisted development).
Live at **[damaskin.dev](https://damaskin.dev)** (Russian) and **[damaskin.dev/en](https://damaskin.dev/en)** (English).

## What's inside

- **Angular 22** — standalone components, Signals, zoneless change detection, new control flow.
- **Static prerender (SSG)** — both language versions are rendered to HTML at build time (`outputMode: static`),
  hydrated in the browser. Content, meta tags, Open Graph, `hreflang` and JSON-LD are all in the HTML.
- **Motion** — GSAP 3 (ScrollTrigger, SplitText, ScrambleText) + Lenis smooth scroll, loaded lazily after the first
  render; nothing animation-related is in the initial bundle. The hero name rises in with pure CSS, so it is on
  screen at first paint.
- **WebGL2 hero** — a ridgeline "signal field" drawn in a single fragment shader
  ([`signal-field.ts`](src/app/sections/hero/signal-field.ts)): lines occlude each other, peaks glow, the pointer
  sends a pulse through them. Pauses off-screen, lowers its resolution on slow GPUs, falls back to CSS without WebGL2.
- **Accessibility** — `prefers-reduced-motion` turns every effect off, content never depends on JS to be visible,
  keyboard and screen-reader friendly. Lighthouse (desktop): 99 / 100 / 100 / 100.

## Structure

```
src/app/
  content/         all texts (RU + EN) and shared facts — the only place to edit the CV
  core/            Motion (GSAP + Lenis loader, useMotion helper), Seo (head tags, JSON-LD)
  pages/home.ts    the page: header, 7 sections, footer
  sections/        hero (+ WebGL field), metrics, about, experience (git-graph timeline), projects (pinned
                   horizontal scroll), ai-workflow (replayed agent session), stack, contact, header, footer
  ui/              cursor, magnetic directive
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
