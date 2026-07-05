import { type Page, type Locator } from "@playwright/test";

/**
 * Abstract base for every page object.
 *
 * Encapsulates the shared header/footer chrome and common navigation helpers so
 * concrete pages only declare what makes them unique. Navigation uses
 * `domcontentloaded` (never `networkidle`) because the target app keeps a
 * long-lived network connection open, and readiness is asserted on visible
 * content via {@link waitUntilReady}.
 */
export abstract class BasePage {
  readonly page: Page;

  // --- Shared header ---
  readonly homeLink: Locator;
  readonly browseNavLink: Locator;
  readonly categoriesNavLink: Locator;
  readonly githubNavLink: Locator;
  readonly searchBox: Locator;

  // --- Shared footer ---
  readonly sortAllLink: Locator;
  readonly sortMostInstalledLink: Locator;
  readonly sortNewestLink: Locator;

  /** Path (relative to baseURL) this page lives at. */
  abstract get path(): string;

  constructor(page: Page) {
    this.page = page;

    this.homeLink = page.getByRole("link", { name: "TestPilot" });
    this.browseNavLink = page.getByRole("link", { name: "Browse", exact: true });
    this.categoriesNavLink = page.getByRole("link", { name: "Categories", exact: true });
    this.githubNavLink = page.getByRole("link", { name: "GitHub", exact: true });
    this.searchBox = page.getByRole("searchbox");

    this.sortAllLink = page.getByRole("link", { name: "All skills" });
    this.sortMostInstalledLink = page.getByRole("link", { name: "Most installed" });
    this.sortNewestLink = page.getByRole("link", { name: "Newest" });
  }

  /** Navigate to this page and wait until its key content is visible. */
  async goto(): Promise<void> {
    await this.page.goto(this.path, { waitUntil: "domcontentloaded" });
    await this.waitUntilReady();
  }

  /** Each concrete page waits on its own distinguishing content. */
  abstract waitUntilReady(): Promise<void>;

  /** Type a query into the global search box and submit it. */
  async search(term: string): Promise<void> {
    await this.searchBox.fill(term);
    await this.searchBox.press("Enter");
  }

  async title(): Promise<string> {
    return this.page.title();
  }
}
