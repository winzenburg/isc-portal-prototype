import { test, expect } from '@playwright/test';

test('Sites page should have only one download button', async ({ page }) => {
  await page.goto('http://localhost:4200/sites-unified');

  // Wait for page to load completely
  await page.waitForSelector('.sites-page-container');
  await page.waitForSelector('.complex-filters');
  await page.waitForSelector('table tbody tr'); // Wait for data to load
  await page.waitForTimeout(1000); // Give Angular time to fully render

  // Count download buttons/icons (look for buttons with download icon)
  const downloadButtons = page.locator('button:has(mat-icon:text("download"))');
  const count = await downloadButtons.count();

  console.log(`Found ${count} download button(s) on Sites page`);

  // Get info about each button
  for (let i = 0; i < count; i++) {
    const button = downloadButtons.nth(i);
    const classes = await button.getAttribute('class');
    console.log(`Button ${i + 1} classes:`, classes);
  }

  // Should only have 1 download button (the one in custom template)
  expect(count).toBe(1);

  // Verify the download button is in the global-filter section (far right)
  const globalFilterDownload = page.locator('.global-filter .download-button');
  await expect(globalFilterDownload).toBeVisible();

  // Take screenshot to verify layout
  await page.screenshot({ path: 'sites-single-download-button.png', fullPage: true });
});
