import { test } from '@playwright/test';

test('capture loading progress states', async ({ page }) => {
  await page.goto('http://localhost:4200/contacts');

  // Wait for loading overlay to appear
  await page.waitForSelector('.loading-overlay', { timeout: 2000 });

  // Capture different stages of loading
  await page.screenshot({
    path: 'contacts-loading-start.png',
    fullPage: true
  });

  console.log('Captured: Initial loading state');

  // Wait a bit to capture mid-loading
  await page.waitForTimeout(2000);
  await page.screenshot({
    path: 'contacts-loading-mid.png',
    fullPage: true
  });

  console.log('Captured: Mid-loading state');

  // Wait for loading to complete
  await page.waitForSelector('.loading-overlay', { state: 'detached', timeout: 10000 });

  // Capture final loaded state
  await page.screenshot({
    path: 'contacts-loaded.png',
    fullPage: true
  });

  console.log('Captured: Loaded state');
  console.log('All loading states captured successfully!');
});
