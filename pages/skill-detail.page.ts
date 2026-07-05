import { type Page, type Locator } from "@playwright/test";
import { BasePage } from "./base.page";

/**
 * A single skill's detail page ("/skills/:slug"): install command with copy,
 * download + view-raw actions, breadcrumb, and the rendered SKILL.md body.
 */
export class SkillDetailPage extends BasePage {
  readonly slug: string;

  readonly heading: Locator;
  readonly installCommand: Locator;
  readonly copyInstallButton: Locator;
  readonly downloadButton: Locator;
  readonly viewRawLink: Locator;
  readonly breadcrumbHome: Locator;
  readonly breadcrumbSkills: Locator;
  readonly tableOfContentsHeading: Locator;

  constructor(page: Page, slug = "playwright-e2e") {
    super(page);
    this.slug = slug;

    this.heading = page.getByRole("heading", { level: 1 }).first();
    this.installCommand = page.getByText(/npx testpilot add/).first();
    this.copyInstallButton = page.getByRole("button", { name: "Copy install command" });
    this.downloadButton = page.getByRole("button", { name: "Download SKILL.md" });
    this.viewRawLink = page.getByRole("link", { name: "View raw" });
    this.breadcrumbHome = page.getByRole("link", { name: "Home", exact: true });
    this.breadcrumbSkills = page.getByRole("link", { name: "Skills", exact: true });
    this.tableOfContentsHeading = page.getByRole("heading", { name: "On this page" });
  }

  get path(): string {
    return `/skills/${this.slug}`;
  }

  async waitUntilReady(): Promise<void> {
    await this.heading.waitFor();
    await this.copyInstallButton.waitFor();
  }

  /** Click "Copy install command" and return the resulting clipboard contents. */
  async copyInstallCommand(): Promise<string> {
    await this.copyInstallButton.click();
    return this.page.evaluate(() => navigator.clipboard.readText());
  }
}
