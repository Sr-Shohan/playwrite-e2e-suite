import { test, expect } from "../../fixtures";

test.describe("Site navigation", () => {
  test("header 'Browse' link goes from home to the skills page", async ({
    homePage,
    skillsPage,
    page,
  }) => {
    await homePage.goto();
    await homePage.browseNavLink.click();
    await expect(page).toHaveURL(/\/skills$/);
    await expect(skillsPage.heading).toBeVisible();
  });

  test("hero 'Browse Skills' CTA opens the skills page", async ({
    homePage,
    skillsPage,
    page,
  }) => {
    await homePage.goto();
    await homePage.browseSkillsCta.click();
    await expect(page).toHaveURL(/\/skills$/);
    await expect(skillsPage.heading).toBeVisible();
  });

  test("logo returns to the home page from the skills page", async ({
    skillsPage,
    homePage,
    page,
  }) => {
    await skillsPage.goto();
    await skillsPage.homeLink.click();
    await expect(page).toHaveURL(new RegExp(`${page.url().split("/skills")[0]}/?$`));
    await expect(homePage.heroHeading).toBeVisible();
  });

  test("'Categories' link jumps to the categories section", async ({ homePage, page }) => {
    await homePage.goto();
    await homePage.categoriesNavLink.click();
    await expect(page).toHaveURL(/#categories$/);
    await expect(homePage.categoriesHeading).toBeVisible();
  });

  test("clicking a category card navigates to that category", async ({ homePage, page }) => {
    await homePage.goto();
    await homePage.categoryCard("e2e").click();
    await expect(page).toHaveURL(/\/categories\/e2e$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});
