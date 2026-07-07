import { test, expect } from "../../fixtures";
import { FEATURED_SKILL } from "../../utils/test-data";

test.describe("Skill detail page", () => {
  test.beforeEach(async ({ skillDetailPage }) => {
    await skillDetailPage.goto();
  });

  test("shows the skill title and install command", async ({ skillDetailPage }) => {
    await expect(skillDetailPage.heading).toHaveText(FEATURED_SKILL.name);
    await expect(skillDetailPage.installCommand).toContainText(FEATURED_SKILL.installCommand);
  });

  test("copy button places the install command on the clipboard", async ({
    skillDetailPage,
    browserName,
  }) => {
    test.skip(
      browserName !== "chromium",
      "Reading the clipboard requires the clipboard-read permission, which only Chromium supports."
    );
    const clipboard = await skillDetailPage.copyInstallCommand();
    expect(clipboard).toContain(FEATURED_SKILL.installCommand);
  });

  test("downloads the SKILL.md file", async ({ skillDetailPage, page }) => {
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      skillDetailPage.downloadButton.click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/SKILL\.md$/);
  });

  test("'View raw' points at the served markdown file", async ({ skillDetailPage, page }) => {
    await expect(skillDetailPage.viewRawLink).toHaveAttribute("href", FEATURED_SKILL.rawPath);

    const response = await page.request.get(FEATURED_SKILL.rawPath);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("text/markdown");
  });

  test("renders breadcrumb and on-this-page navigation", async ({ skillDetailPage }) => {
    await expect(skillDetailPage.breadcrumbHome).toHaveAttribute("href", "/");
    await expect(skillDetailPage.breadcrumbSkills).toHaveAttribute("href", "/skills");
    await expect(skillDetailPage.tableOfContentsHeading).toBeVisible();
  });

  test("breadcrumb 'Skills' returns to the browse page", async ({
    skillDetailPage,
    skillsPage,
    page,
  }) => {
    await skillDetailPage.breadcrumbSkills.click();
    await expect(page).toHaveURL(/\/skills$/);
    await expect(skillsPage.heading).toBeVisible();
  });

  test("a browse card opens its matching detail page", async ({ skillsPage, page }) => {
    await skillsPage.goto();
    await skillsPage.filterInline(FEATURED_SKILL.name);
    await skillsPage.cardLinkByName(FEATURED_SKILL.name).first().click();
    await expect(page).toHaveURL(new RegExp(`/skills/${FEATURED_SKILL.slug}$`));
    await expect(page.getByRole("heading", { level: 1 }).first()).toHaveText(FEATURED_SKILL.name);
  });
});
