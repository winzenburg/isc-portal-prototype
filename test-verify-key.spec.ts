import { test, expect } from '@playwright/test';

test('verify circuit health key renders correctly', async ({ page }) => {
  await page.goto('http://localhost:4200/sites-unified');

  // Wait for table to load
  await page.waitForSelector('.sites-page-container');
  await page.waitForSelector('table tbody tr');

  // Check if circuit health key exists in DOM
  const healthKey = page.locator('.circuit-health-key');
  await expect(healthKey).toBeAttached();

  // Scroll the key into view
  await healthKey.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  // Now verify it's visible
  await expect(healthKey).toBeVisible();

  // Get a screenshot focused on the key area
  const keyElement = await healthKey.elementHandle();
  if (keyElement) {
    await keyElement.screenshot({ path: 'circuit-key-closeup.png' });
  }

  // Also get full page screenshot with key scrolled into view
  await page.screenshot({ path: 'sites-page-with-key-visible.png', fullPage: false });

  console.log('Circuit health key successfully rendered and visible!');
});
