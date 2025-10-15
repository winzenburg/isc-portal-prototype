import { test } from '@playwright/test';

test('capture updated sidebar with SD-WAN Orchestrator', async ({ page }) => {
  await page.goto('http://localhost:4200/sd-wan-orchestrator');
  await page.waitForSelector('.no-access-container');

  // Wait a moment for any animations
  await page.waitForTimeout(500);

  // Full page screenshot showing sidebar and content
  await page.screenshot({
    path: 'sidebar-with-orchestrator.png',
    fullPage: true
  });

  console.log('Screenshot saved: sidebar-with-orchestrator.png');
});
