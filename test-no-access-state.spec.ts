import { test } from '@playwright/test';

test('capture no-access-state page', async ({ page }) => {
  await page.goto('http://localhost:4200/sd-wan-orchestrator');
  await page.waitForSelector('.no-access-container');

  // Full page screenshot
  await page.screenshot({
    path: 'no-access-state-full.png',
    fullPage: true
  });

  console.log('Screenshot saved: no-access-state-full.png');
});
