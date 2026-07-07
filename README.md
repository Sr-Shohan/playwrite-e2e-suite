# TestPilot E2E Suite

[![Playwright E2E](https://github.com/Sr-Shohan/playwrite-e2e-suite/actions/workflows/playwright.yml/badge.svg)](https://github.com/Sr-Shohan/playwrite-e2e-suite/actions/workflows/playwright.yml)
[![Playwright](https://img.shields.io/badge/Playwright-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Production-grade **Playwright + TypeScript** end-to-end test suite for
[testspilot.vercel.app](https://testspilot.vercel.app/), built on a clean
**Page Object Model (POM)** architecture and wired into a full CI/CD pipeline
with cross-browser support, on-demand runs, and per-test screenshot evidence.

---

## Highlights

- **Page Object Model** with custom fixtures — specs stay declarative and readable.
- **Cross-browser**: Chromium, Firefox, and WebKit (Safari engine).
- **CI/CD on GitHub Actions** — runs on every push and pull request to `main`.
- **Branch protection** — PRs cannot merge until the suite passes.
- **On-demand manual runs** — pick the branch, browser, module, and a test-title
  filter straight from the Actions UI or the `gh` CLI.
- **Visual evidence** — a full-page screenshot is captured for every test and
  uploaded as a downloadable artifact.
- **Resilient by design** — role-based selectors, content-based readiness waits,
  and CI retries to absorb flakiness against a live site.

---

## Tech stack

- [Playwright Test](https://playwright.dev/) (`@playwright/test`)
- TypeScript (ESM)
- Page Object Model + custom fixtures
- GitHub Actions (CI/CD)

---

## Project structure

```
testspilot-e2e/
├── pages/                    # Page Objects (locators + actions, no assertions)
│   ├── base.page.ts          # shared header/footer chrome + navigation helpers
│   ├── home.page.ts          # landing page
│   ├── skills.page.ts        # /skills browse (search, filters, sort)
│   └── skill-detail.page.ts  # /skills/:slug detail (install, copy, download)
├── fixtures/
│   └── index.ts              # exposes page objects as fixtures + screenshot hook
├── utils/
│   └── test-data.ts          # base URL, categories, featured skill, counts
├── tests/e2e/                # specs grouped by feature (assertions live here)
│   ├── home.spec.ts
│   ├── navigation.spec.ts
│   ├── browse-skills.spec.ts
│   └── skill-detail.spec.ts
├── .github/workflows/
│   └── playwright.yml        # CI pipeline + manual dispatch controls
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

**Convention:** page objects hold locators and actions only; assertions live in specs.

---

## Getting started

```bash
npm install
npx playwright install chromium          # add firefox / webkit for cross-browser
```

---

## Running tests locally

```bash
npm test              # full suite (headless, Chromium)
npm run test:headed   # visible browser
npm run test:ui       # Playwright UI mode (time-travel debugger)
npm run test:debug    # step-through debugging
npm run report        # open the last HTML report
npm run codegen       # record selectors against the live site
npm run typecheck     # TypeScript type check (no emit)
```

Target a single browser or module:

```bash
npx playwright test --project=firefox
npx playwright test tests/e2e/browse-skills.spec.ts
npx playwright test --grep "no-results"
```

---

## Test coverage

| Area | Spec | What it verifies |
| --- | --- | --- |
| Home | `home.spec.ts` | Hero, CTAs, header nav, top-skills list, category grid, global search |
| Navigation | `navigation.spec.ts` | Home ↔ Browse, logo home, Categories anchor, category cards |
| Browse | `browse-skills.spec.ts` | Card count, per-category counts, inline search, clear filters, sort, empty state |
| Detail | `skill-detail.spec.ts` | Title, install command, copy-to-clipboard, download, view raw, breadcrumb |

---

## CI/CD pipeline

The [`playwright.yml`](.github/workflows/playwright.yml) workflow runs on:

- **Every push to `main`** (including PR merges)
- **Every pull request into `main`**
- **Manual dispatch** (see below)

Each run type checks, installs the selected browser, runs the suite, and uploads
two artifacts: the **HTML report** and a **screenshots** folder.

### Branch protection

`main` is protected by a ruleset that requires:

1. All changes to go through a pull request.
2. The **`Run Playwright tests`** check to pass before merging.

So the typical flow is:

```bash
git checkout -b my-feature
# ...make changes...
git commit -am "my change"
git push -u origin my-feature
gh pr create --base main --fill
gh pr checks --watch          # CI runs automatically
gh pr merge --squash          # allowed only once the check is green
```

### Manual runs (any branch / browser / module)

From **Actions → Playwright E2E → Run workflow**, or via the CLI:

```bash
# Full suite on a specific branch
gh workflow run playwright.yml -f branch=my-feature

# One browser + one module
gh workflow run playwright.yml -f browser=firefox -f module=home

# Filter by test title
gh workflow run playwright.yml -f browser=webkit -f grep="no-results"
```

| Input | Default | Options |
| --- | --- | --- |
| `branch` | `main` | any branch name |
| `browser` | `chromium` | `chromium`, `firefox`, `webkit` |
| `module` | `all` | `all`, `browse-skills`, `home`, `navigation`, `skill-detail` |
| `grep` | *(none)* | any text matched against test titles |

Each run's **title** in the Actions list shows the config at a glance
(e.g. `Playwright · firefox · all @ main`), and the run page includes a summary
table of the exact browser, module, branch, and trigger.

### Screenshots & reports

Open any run in the **Actions** tab and download from **Artifacts**:

- **`screenshots`** — one full-page PNG per test, named by test and grouped by
  browser (`screenshots/<browser>/<test>.png`) for quick visual validation.
- **`playwright-report`** — the full interactive HTML report (steps, traces,
  and the same screenshots attached per test).

---

## Design decisions

- **No `networkidle`.** The app keeps a long-lived connection open, so navigation
  uses `domcontentloaded` and each page waits on its own visible content.
- **Role-based selectors.** Prefers `getByRole` / `getByText` over brittle CSS.
- **Clipboard is Chromium-only.** The `clipboard-read` permission is scoped to the
  Chromium project; the clipboard test is skipped on Firefox/WebKit, which don't
  support it.
- **CI resilience.** CI runs with 2 retries and a single worker to smooth over
  transient slowness from the live target site.
- **Centralized test data.** Catalog counts and the featured skill live in
  `utils/test-data.ts` — update them there if the site's catalog changes.

---

## License

[MIT](LICENSE)
