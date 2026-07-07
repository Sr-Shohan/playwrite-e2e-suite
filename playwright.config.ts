import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for the TestPilot E2E suite.
 * Target: https://testspilot.vercel.app/
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { open: "never" }], ["list"]],
  timeout: 90_000,
  expect: { timeout: 15_000 },

  use: {
    baseURL: "https://testspilot.vercel.app",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    navigationTimeout: 60_000,
    actionTimeout: 20_000,
  },

  projects: [
    {
      name: "chromium",
      // `clipboard-read` is a Chromium-only permission; granting it globally
      // makes Firefox/WebKit throw "Unknown permission" at context creation.
      use: { ...devices["Desktop Chrome"], permissions: ["clipboard-read", "clipboard-write"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
});
