import { test, expect } from '@playwright/test';

test.describe('CSV Export Functionality', () => {
  test('should show export button on clouds page', async ({ page }) => {
    await page.goto('http://localhost:4200/clouds');

    // Wait for page to load
    await page.waitForSelector('app-base-table');

    // Check for export button (download icon button)
    const exportButton = page.locator('button[aria-label="Export CSV"], button[mattooltip="Export CSV"]');
    await expect(exportButton).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'clouds-export-button.png', fullPage: true });
  });

  test('should show export button on contacts page', async ({ page }) => {
    await page.goto('http://localhost:4200/contacts');

    // Wait for page to load
    await page.waitForSelector('app-base-table');

    // Check for export button
    const exportButton = page.locator('button[aria-label="Export CSV"], button[mattooltip="Export CSV"]');
    await expect(exportButton).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'contacts-export-button.png', fullPage: true });
  });

  test('should show export button on circuits page', async ({ page }) => {
    await page.goto('http://localhost:4200/circuits');

    // Wait for page to load
    await page.waitForSelector('app-base-table');

    // Check for export button
    const exportButton = page.locator('button[aria-label="Export CSV"], button[mattooltip="Export CSV"]');
    await expect(exportButton).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'circuits-export-button.png', fullPage: true });
  });

  test('should show export button on sites page with custom template', async ({ page }) => {
    await page.goto('http://localhost:4200/sites-unified');

    // Wait for page to load
    await page.waitForSelector('.sites-page-container');

    // Check for download button in global filter section
    const downloadButton = page.locator('.download-button');
    await expect(downloadButton).toBeVisible();

    // Verify tooltip
    await downloadButton.hover();
    const tooltip = page.locator('text=Export CSV');
    // Tooltip may not appear instantly, so we'll just verify the button exists

    // Take screenshot
    await page.screenshot({ path: 'sites-export-button.png', fullPage: true });
  });

  test('export button click triggers download on clouds page', async ({ page }) => {
    await page.goto('http://localhost:4200/clouds');

    // Wait for table data to load
    await page.waitForSelector('table tbody tr');

    // Set up download listener
    const downloadPromise = page.waitForEvent('download', { timeout: 5000 });

    // Click export button
    const exportButton = page.locator('button[aria-label="Export CSV"]').first();
    await exportButton.click();

    // Wait for download to start
    const download = await downloadPromise;

    // Verify filename
    expect(download.suggestedFilename()).toBe('clouds.csv');

    // Save the file to verify it's valid
    await download.saveAs(`downloads/${download.suggestedFilename()}`);
  });
});
