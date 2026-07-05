import { type Page, type Locator } from "@playwright/test";
import { BasePage } from "./base.page";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * The browse page ("/skills"): searchable, filterable grid of every skill.
 * Category and agent filters are rendered as buttons; sort is driven by the
 * `?sort=` query param (see the footer links on {@link BasePage}).
 */
export class SkillsPage extends BasePage {
  get path(): string {
    return "/skills";
  }

  readonly heading: Locator;
  readonly allCategoriesButton: Locator;
  readonly allAgentsButton: Locator;
  readonly emptyState: Locator;
  readonly clearFiltersButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole("heading", { name: "Browse QA Skills" });
    this.allCategoriesButton = page.getByRole("button", { name: "All", exact: true });
    this.allAgentsButton = page.getByRole("button", { name: "All agents", exact: true });
    this.emptyState = page.getByText("No skills found", { exact: true });
    this.clearFiltersButton = page.getByRole("button", { name: "Clear filters" }).last();
  }

  async waitUntilReady(): Promise<void> {
    await this.heading.waitFor();
    await this.cards().first().waitFor();
  }

  /** One <article> per skill card. */
  cards(): Locator {
    return this.page.getByRole("article");
  }

  cardLinks(): Locator {
    return this.page.locator('a[href^="/skills/"]');
  }

  async cardCount(): Promise<number> {
    return this.cards().count();
  }

  /** Category filter button. Its accessible name is the label + count (e.g. "E2E 14"). */
  categoryFilter(name: string): Locator {
    return this.page.getByRole("button", { name: new RegExp(`^${escapeRegExp(name)}\\s*\\d`) });
  }

  agentFilter(name: string): Locator {
    return this.page.getByRole("button", { name, exact: true });
  }

  async filterByCategory(name: string): Promise<void> {
    await this.categoryFilter(name).click();
  }

  async filterByAgent(name: string): Promise<void> {
    await this.agentFilter(name).click();
  }

  /** Live/inline filter: typing narrows the grid without navigating away. */
  async filterInline(term: string): Promise<void> {
    await this.searchBox.fill(term);
  }

  cardByName(name: string): Locator {
    return this.cards().filter({ hasText: name });
  }

  /** The detail-page link for a given skill (ignores in-card category badges). */
  cardLinkByName(name: string): Locator {
    return this.cardLinks().filter({ hasText: name });
  }

  firstCardHeading(): Locator {
    return this.cards().first().getByRole("heading").first();
  }
}
