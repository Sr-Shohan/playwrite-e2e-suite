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

export { expect };
