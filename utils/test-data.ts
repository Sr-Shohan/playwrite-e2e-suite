/**
 * Central test data for the TestPilot suite.
 * Keep site-specific constants here so specs stay readable and easy to update.
 */

export const SITE = {
  baseURL: "https://testspilot.vercel.app",
} as const;

/** Total number of skills currently published in the directory. */
export const TOTAL_SKILLS = 76;

/** Categories with the number of skills the site reports for each. */
export const CATEGORIES = [
  { name: "E2E", slug: "e2e", count: 14 },
  { name: "Unit", slug: "unit", count: 14 },
  { name: "API", slug: "api", count: 12 },
  { name: "Security", slug: "security", count: 10 },
  { name: "Browser", slug: "browser", count: 9 },
  { name: "Accessibility", slug: "accessibility", count: 8 },
  { name: "Performance", slug: "performance", count: 8 },
  { name: "CI/CD", slug: "ci-cd", count: 1 },
] as const;

/** Agents advertised as supported, used by the browse-page agent filter. */
export const AGENTS = [
  "Cursor",
  "Claude Code",
  "GitHub Copilot",
  "Windsurf",
] as const;

/** A stable, well-known skill used across detail-page tests. */
export const FEATURED_SKILL = {
  slug: "playwright-e2e",
  name: "Playwright E2E Testing",
  category: "E2E",
  installCommand: "npx testpilot add playwright-e2e",
  rawPath: "/skills/playwright-e2e/SKILL.md",
} as const;

export type Category = (typeof CATEGORIES)[number];
