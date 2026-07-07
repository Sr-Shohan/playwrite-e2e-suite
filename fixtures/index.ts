import { promises as fs } from "node:fs";
import path from "node:path";
import { test as base, expect } from "@playwright/test";
import { HomePage } from "../pages/home.page";
import { SkillsPage } from "../pages/skills.page";
import { SkillDetailPage } from "../pages/skill-detail.page";

/**
 * Custom fixtures so specs read declaratively, e.g.:
 *   test("...", async ({ homePage }) => { await homePage.goto(); });
 *
 * `skillDetailPage` defaults to the featured Playwright skill; use
 * `makeSkillDetailPage(slug)` for any other slug.
 */
type Fixtures = {
  homePage: HomePage;
  skillsPage: SkillsPage;
  skillDetailPage: SkillDetailPage;
  makeSkillDetailPage: (slug: string) => SkillDetailPage;
};

export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  skillsPage: async ({ page }, use) => {
    await use(new SkillsPage(page));
  },
  skillDetailPage: async ({ page }, use) => {
    await use(new SkillDetailPage(page));
  },
  makeSkillDetailPage: async ({ page }, use) => {
    await use((slug: string) => new SkillDetailPage(page, slug));
  },
});

/**
 * Capture a full-page screenshot after every test so runs can be validated
 * visually. Each image is attached to the HTML report and also written to
 * `screenshots/<browser>/<test>.png` for browsing outside the report viewer.
 */
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status === "skipped" || page.isClosed()) return;

  const label = testInfo.titlePath.join(" › ");
  const safeName = label.replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "");

  try {
    const buffer = await page.screenshot({ fullPage: true });
    await testInfo.attach("final-screenshot", { body: buffer, contentType: "image/png" });

    const dir = path.join(process.cwd(), "screenshots", testInfo.project.name);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, `${safeName}.png`), buffer);
  } catch {
    // The page may already be closed (e.g. after navigation errors); skip.
  }
});

export { expect };
