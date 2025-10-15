import { test, expect } from '@playwright/test';

test.describe('Circuit Health Key', () => {
  test('should display circuit health key on sites page', async ({ page }) => {
    await page.goto('http://localhost:4200/sites-unified');

    // Wait for table to load
    await page.waitForSelector('.sites-page-container');
    await page.waitForSelector('table tbody tr');

    // Check for circuit health key
    const healthKey = page.locator('.circuit-health-key');
    await expect(healthKey).toBeVisible();

    // Verify all key items are present
    const keyItems = page.locator('.key-item');
    await expect(keyItems).toHaveCount(5);

    // Verify specific key labels
    await expect(page.locator('.key-text:has-text("Up")')).toBeVisible();
    await expect(page.locator('.key-text:has-text("Down")')).toBeVisible();
    await expect(page.locator('.key-text:has-text("Pending Disconnect")')).toBeVisible();
    await expect(page.locator('.key-text:has-text("Monitoring Disabled")')).toBeVisible();
    await expect(page.locator('.key-text:has-text("No Data")')).toBeVisible();

    // Verify circuit indicators in the key (not in the table)
    const keyIndicators = page.locator('.circuit-health-key .circuit-indicator');
    await expect(keyIndicators).toHaveCount(5);

    // Verify specific indicator classes are present in the key
    await expect(page.locator('.circuit-health-key .circuit-up')).toBeVisible();
    await expect(page.locator('.circuit-health-key .circuit-down')).toBeVisible();
    await expect(page.locator('.circuit-health-key .circuit-pending')).toBeVisible();
    await expect(page.locator('.circuit-health-key .circuit-disabled')).toBeVisible();
    await expect(page.locator('.circuit-health-key .circuit-no-data')).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'circuit-health-key.png', fullPage: true });
  });
});
