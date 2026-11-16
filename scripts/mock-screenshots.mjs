/**
 * Screenshots of the running app at phone width, for checking UI changes
 * against mock data (see "Running locally with mock data" in the README).
 *
 *   node scripts/mock-screenshots.mjs [outDir] [baseUrl]
 *
 * Needs Playwright with Chromium installed (not a project dependency).
 * Captures the current month, the same month with its first category
 * expanded, the charts page and the settings page, one phone screen each.
 */
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const outDir = process.argv[2] ?? "screenshots";
const baseUrl = process.argv[3] ?? "http://localhost:3000";
const now = new Date();
const monthPath = `/app/${now.getFullYear()}/${now.getMonth() + 1}`;

mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 412, height: 915 },
  deviceScaleFactor: 2,
});

async function shoot(name, path) {
  if (path) await page.goto(baseUrl + path, { waitUntil: "networkidle" });
  // The router devtools toggle would cover part of the bottom nav.
  await page.addStyleTag({
    content: "button[aria-label*='TanStack' i], .tsrd-open-btn-container { display: none !important; }",
  });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  const file = join(outDir, `${name}.png`);
  await page.screenshot({ path: file });
  console.log(file);
}

await shoot("month", monthPath);
await page.locator("main button, button").filter({ hasText: /€/ }).first().click();
await page.waitForTimeout(800);
await shoot("month-expanded");
await shoot("charts", "/app/charts");
await shoot("settings", "/app/settings");
await browser.close();
