import { existsSync } from "node:fs";
import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

// The sandbox ships a Chromium build that differs from the one this Playwright
// version downloads by default. Use the installed binary when it exists; on a
// normal machine, `npx playwright install` is used instead.
const SANDBOX_CHROME = "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome";
const executablePath = existsSync(SANDBOX_CHROME) ? SANDBOX_CHROME : undefined;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    launchOptions: executablePath ? { executablePath } : {},
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 5"] } },
  ],
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
    timeout: 240_000,
  },
});
