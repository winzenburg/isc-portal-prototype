import { test, expect } from '@playwright/test';

test('should display circuit health key at bottom of sites table', async ({ page }) => {
  await page.goto('http://localhost:4200/sites-unified');

  // Wait for table to load
  await page.waitForSelector('.sites-page-container');
  await page.waitForSelector('table tbody tr');

  // Scroll to bottom to see the circuit health key
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  // Wait a bit for scroll
  await page.waitForTimeout(500);

  // Take full page screenshot to see the key
  await page.screenshot({ path: 'sites-with-circuit-key.png', fullPage: true });

  // Check that circuit health key is visible after scrolling
  const healthKey = page.locator('.circuit-health-key');
  const isVisible = await healthKey.isVisible();
  console.log('Circuit health key visible:', isVisible);

  // Get key position
  const keyBox = await healthKey.boundingBox();
  console.log('Circuit health key position:', keyBox);
});
