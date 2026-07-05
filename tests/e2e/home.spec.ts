import { test, expect } from "../../fixtures";
import { CATEGORIES } from "../../utils/test-data";

test.describe("Home page", () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test("renders the hero and primary calls to action", async ({ homePage }) => {
    await expect(homePage.heroHeading).toBeVisible();
    await expect(homePage.browseSkillsCta).toBeVisible();
    await expect(homePage.getStartedCta).toBeVisible();
    await expect(homePage.searchBox).toBeVisible();
  });

  test("shows the global header navigation", async ({ homePage }) => {
    await expect(homePage.homeLink).toBeVisible();
    await expect(homePage.browseNavLink).toHaveAttribute("href", "/skills");
    await expect(homePage.categoriesNavLink).toBeVisible();
  });

  test("lists the top skills", async ({ homePage }) => {
    await expect(homePage.topSkillsHeading).toBeVisible();
    await expect(homePage.viewAllLink).toHaveAttribute("href", "/skills");
    await expect(homePage.skillLinks().first()).toBeVisible();
    expect(await homePage.skillLinks().count()).toBeGreaterThanOrEqual(10);
  });

  test("renders a card for every category", async ({ homePage }) => {
    await expect(homePage.categoriesHeading).toBeVisible();
    for (const category of CATEGORIES) {
      await expect(homePage.categoryCard(category.slug)).toBeVisible();
    }
  });

  test("global search navigates to filtered browse results", async ({ homePage, page }) => {
    await homePage.search("playwright");
    await expect(page).toHaveURL(/\/skills\?q=playwright/);
    await expect(page.getByRole("article").first()).toBeVisible();
  });
});
