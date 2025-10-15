import { test } from '@playwright/test';

test('Take screenshot of Sites table', async ({ page }) => {
  // Navigate directly to Sites page
  await page.goto('http://localhost:4200/sites');
  await page.waitForLoadState('networkidle');

  // Wait for table to render
  await page.waitForTimeout(2000);

  // Take full page screenshot
  await page.screenshot({ path: 'sites-table.png', fullPage: true });

  console.log('✓ Sites table screenshot saved: sites-table.png');
});
