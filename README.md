# TestPilot E2E Suite

Playwright + TypeScript end-to-end tests for [testspilot.vercel.app](https://testspilot.vercel.app/),
built with a standard **Page Object Model (POM)** architecture.

## Stack

- [Playwright Test](https://playwright.dev/) (`@playwright/test`)
- TypeScript (ESM)
- Page Object Model with custom fixtures

## Project structure

```
testspilot-e2e/
├── pages/                    # Page Objects (locators + actions, no assertions)
│   ├── base.page.ts          # shared header/footer chrome + navigation helpers
│   ├── home.page.ts          # landing page
│   ├── skills.page.ts        # /skills browse (search, filters, sort)
│   └── skill-detail.page.ts  # /skills/:slug detail (install, copy, download)
├── fixtures/
│   └── index.ts              # exposes page objects as test fixtures
├── utils/
│   └── test-data.ts          # base URL, categories, featured skill, counts
├── tests/e2e/                # specs grouped by feature (assertions live here)
│   ├── home.spec.ts
│   ├── navigation.spec.ts
│   ├── browse-skills.spec.ts
│   └── skill-detail.spec.ts
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

**Convention:** page objects hold locators and actions only; assertions live in specs.

## Getting started

```bash
npm install
npx playwright install chromium
```

## Running tests

```bash
npm test              # run the full suite (headless, Chromium)
npm run test:headed   # run with a visible browser
npm run test:ui       # Playwright UI mode
npm run test:debug    # step-through debugging
npm run report        # open the last HTML report
npm run codegen       # record selectors against the live site
```

## Coverage

| Area | Spec | What it verifies |
| --- | --- | --- |
| Home | `home.spec.ts` | Hero, CTAs, header nav, top-skills list, category grid, global search |
| Navigation | `navigation.spec.ts` | Home ↔ Browse, logo home, Categories anchor, category cards |
| Browse | `browse-skills.spec.ts` | 76 cards, per-category counts, inline search, clear, sort, empty state |
| Detail | `skill-detail.spec.ts` | Title, install command, copy-to-clipboard, download, view raw, breadcrumb |

## Notes & design decisions

- **No `networkidle`.** The app keeps a long-lived connection open, so navigation
  uses `domcontentloaded` and each page waits on its own visible content.
- **Resilient selectors.** Prefers `getByRole` / `getByText` over brittle CSS.
- **Clipboard tests** grant `clipboard-read` / `clipboard-write` via the config.
- **Chromium only by default.** Firefox/WebKit projects are pre-wired (commented)
  in `playwright.config.ts` — uncomment to enable cross-browser runs.
- Some counts (total skills, per-category counts) live in `utils/test-data.ts`;
  update them there if the site's catalog changes.
