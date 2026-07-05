import { type Page, type Locator } from "@playwright/test";
import { BasePage } from "./base.page";

/**
 * The landing page ("/"): hero + global search, "Top skills" list, and the
 * "Browse by category" grid.
 */
export class HomePage extends BasePage {
  get path(): string {
    return "/";
  }

  readonly heroHeading: Locator;
  readonly browseSkillsCta: Locator;
  readonly getStartedCta: Locator;
  readonly topSkillsHeading: Locator;
  readonly viewAllLink: Locator;
  readonly categoriesHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.heroHeading = page.getByRole("heading", {
      name: "QA Skills for AI Coding Agents",
    });
    this.browseSkillsCta = page.getByRole("link", { name: "Browse Skills" }).first();
    this.getStartedCta = page.locator('a[href="#get-started"]').first();
    this.topSkillsHeading = page.getByRole("heading", { name: "Top skills" });
    this.viewAllLink = page.getByRole("link", { name: /View all/ });
    this.categoriesHeading = page.getByRole("heading", { name: "Browse by category" });
  }

  async waitUntilReady(): Promise<void> {
    await this.heroHeading.waitFor();
  }

  /** All skill links rendered anywhere on the page (top-skills list). */
  skillLinks(): Locator {
    return this.page.locator('a[href^="/skills/"]');
  }

  /**
   * The category card (in the "Browse by category" grid) linking to a slug.
   * Scoped by the "N skills" copy so it does not collide with the footer's
   * plain category links.
   */
  categoryCard(slug: string): Locator {
    return this.page.locator(`a[href="/categories/${slug}"]`).filter({ hasText: /skill/i });
  }
}
