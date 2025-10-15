import { test } from '@playwright/test';

test('capture header with new Comcast Blue color', async ({ page }) => {
  await page.goto('http://localhost:4200/sd-wan-orchestrator');
  await page.waitForSelector('.no-access-container');

  // Wait for styles to load
  await page.waitForTimeout(1000);

  // Full page screenshot
  await page.screenshot({
    path: 'header-comcast-blue.png',
    fullPage: true
  });

  console.log('Screenshot saved: header-comcast-blue.png');
});
