import { test, expect } from '@playwright/test';

test('capture updated sites page', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1200 });
  await page.goto('http://localhost:4200/sites', { waitUntil: 'networkidle' });

  // Wait for data to load
  await page.waitForSelector('text=MB359026', { timeout: 10000 });
  await page.waitForTimeout(1000);

  // Take screenshot
  await page.screenshot({ path: 'sites-page-updated.png', fullPage: true });

  // Check if custom cells are rendered
  const contactsButton = await page.locator('.contacts-button').first();
  const hasContactsButton = await contactsButton.count() > 0;
  console.log('Has contacts buttons:', hasContactsButton);

  const circuitIndicators = await page.locator('.circuit-indicator').count();
  console.log('Number of circuit indicators:', circuitIndicators);

  // Check data
  const rowCount = await page.locator('tr[mat-row]').count();
  console.log('Number of rows:', rowCount);
});
