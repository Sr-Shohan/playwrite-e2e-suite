import { test, expect } from "../../fixtures";
import { TOTAL_SKILLS, CATEGORIES, FEATURED_SKILL } from "../../utils/test-data";

const E2E = CATEGORIES.find((c) => c.name === "E2E")!;

test.describe("Browse skills page", () => {
  test.beforeEach(async ({ skillsPage }) => {
    await skillsPage.goto();
  });

  test("loads a card for every published skill", async ({ skillsPage }) => {
    await expect(skillsPage.heading).toBeVisible();
    expect(await skillsPage.cardCount()).toBe(TOTAL_SKILLS);
  });

  test("every card links to a skill detail page", async ({ skillsPage }) => {
    const links = skillsPage.cardLinks();
    expect(await links.count()).toBe(TOTAL_SKILLS);
    for (const href of await links.evaluateAll((els) =>
      els.map((el) => el.getAttribute("href"))
    )) {
      expect(href).toMatch(/^\/skills\/[a-z0-9-]+$/);
    }
  });

  test("category filter narrows the grid to that category's count", async ({ skillsPage }) => {
    await skillsPage.filterByCategory(E2E.name);
    await expect(skillsPage.cards()).toHaveCount(E2E.count);
  });

  test("inline search filters the grid without leaving the page", async ({
    skillsPage,
    page,
  }) => {
    await skillsPage.filterInline("cypress");
    await expect(skillsPage.cardByName("Cypress E2E Testing")).toBeVisible();
    expect(await skillsPage.cardCount()).toBeLessThan(TOTAL_SKILLS);
    await expect(page).toHaveURL(/\/skills(\?|$)/);
  });

  test("clearing the search restores the full grid", async ({ skillsPage }) => {
    await skillsPage.filterInline("cypress");
    await expect(skillsPage.cards()).not.toHaveCount(TOTAL_SKILLS);
    await skillsPage.filterInline("");
    await expect(skillsPage.cards()).toHaveCount(TOTAL_SKILLS);
  });

  test("sort by installs surfaces the most-installed skill first", async ({ page, skillsPage }) => {
    await page.goto("/skills?sort=installs", { waitUntil: "domcontentloaded" });
    await skillsPage.waitUntilReady();
    await expect(skillsPage.firstCardHeading()).toHaveText(FEATURED_SKILL.name);
  });

  test("a search with no matches shows an empty grid", async ({ skillsPage }) => {
    await skillsPage.filterInline("zzz-no-such-skill-zzz");
    await expect(skillsPage.cards()).toHaveCount(0);
  });

  test('searching "adadads" shows the no-results state and clearing filters restores the grid', async ({
    skillsPage,
  }) => {
    await skillsPage.filterInline("adadads");
    await expect(skillsPage.cards()).toHaveCount(0);
    await expect(skillsPage.emptyState).toBeVisible();
    await skillsPage.clearFiltersButton.click();
    await expect(skillsPage.emptyState).toHaveCount(0);
    await expect(skillsPage.cards()).toHaveCount(TOTAL_SKILLS);
  });
});
