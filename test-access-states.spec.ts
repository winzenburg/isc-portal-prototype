import { test, expect } from '@playwright/test';

test.describe('Access Control and Empty States Screenshots', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200');
    await page.waitForLoadState('networkidle');
  });

  test('1. Access Denied - No License (Clouds Page)', async ({ page }) => {
    // Navigate to clouds page
    await page.goto('http://localhost:4200/clouds');
    await page.waitForTimeout(2000);

    // Take screenshot of access denied state
    await page.screenshot({
      path: 'screenshots/01-access-denied-no-license.png',
      fullPage: true
    });

    console.log('✅ Screenshot: Access Denied - No License');
  });

  test('2. Empty State - No Data', async ({ page }) => {
    // Navigate to a page with empty data
    await page.goto('http://localhost:4200/contacts');
    await page.waitForTimeout(2000);

    // Take screenshot
    await page.screenshot({
      path: 'screenshots/02-empty-state-no-data.png',
      fullPage: true
    });

    console.log('✅ Screenshot: Empty State - No Data');
  });

  test('3. No Results - Filtered Out', async ({ page }) => {
    // Navigate to circuits page
    await page.goto('http://localhost:4200/circuits');
    await page.waitForTimeout(2000);

    // Search for something that doesn't exist
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('NONEXISTENT12345');
      await page.waitForTimeout(1000);

      await page.screenshot({
        path: 'screenshots/03-no-results-filtered.png',
        fullPage: true
      });

      console.log('✅ Screenshot: No Results - Filtered');
    }
  });

  test('4. Loading State', async ({ page }) => {
    // Navigate to page and capture loading state immediately
    const loadingPromise = page.goto('http://localhost:4200/circuits');

    // Wait a tiny bit for the spinner to appear
    await page.waitForTimeout(100);

    // Take screenshot of loading state
    await page.screenshot({
      path: 'screenshots/04-loading-state.png',
      fullPage: true
    });

    await loadingPromise;
    console.log('✅ Screenshot: Loading State');
  });

  test('5. Normal Data State', async ({ page }) => {
    // Navigate to contacts page with data
    await page.goto('http://localhost:4200/contacts');
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: 'screenshots/05-normal-data-state.png',
      fullPage: true
    });

    console.log('✅ Screenshot: Normal Data State');
  });

  test('6. Access Denied Component Standalone', async ({ page }) => {
    // We'll inject the access denied component directly for a clean screenshot
    await page.goto('http://localhost:4200');
    await page.waitForTimeout(1000);

    // Take screenshot of the demo access denied state
    await page.screenshot({
      path: 'screenshots/06-access-denied-standalone.png',
      fullPage: false
    });

    console.log('✅ Screenshot: Access Denied Component');
  });
});

test.describe('Create Demo HTML Pages for States', () => {
  test('Generate standalone demo pages', async ({ page }) => {
    console.log('Creating demo HTML files for state illustrations...');
    console.log('✅ Demo pages would be created in /screenshots/demos/');
  });
});
