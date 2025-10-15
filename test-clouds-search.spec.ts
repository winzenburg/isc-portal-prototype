import { test, expect } from '@playwright/test';

test('Clouds page should have search filter input', async ({ page }) => {
  await page.goto('http://localhost:4200/clouds-unified');

  // Wait for page to load
  await page.waitForSelector('app-base-table');
  await page.waitForSelector('table tbody tr');
  await page.waitForTimeout(1000);

  console.log('=== Testing Clouds Search Filter ===\n');

  // Verify search input exists
  const searchInput = page.locator('.search-and-filters input[matInput]');
  await expect(searchInput).toBeVisible();

  // Verify placeholder text
  const placeholder = await searchInput.getAttribute('placeholder');
  console.log(`Search placeholder: "${placeholder}"`);
  expect(placeholder).toContain('Search');

  // Count initial rows
  const initialRows = await page.locator('table tbody tr').count();
  console.log(`Initial row count: ${initialRows}`);

  // Test search functionality - search for "SD-WAN"
  console.log('\nSearching for "SD-WAN"...');
  await searchInput.fill('SD-WAN');
  await page.waitForTimeout(500);

  // Count filtered rows
  const filteredRows = await page.locator('table tbody tr').count();
  console.log(`Filtered row count: ${filteredRows}`);

  // Should have fewer rows
  expect(filteredRows).toBeLessThan(initialRows);
  expect(filteredRows).toBeGreaterThan(0);

  // Verify the visible row contains "SD-WAN"
  const firstRowText = await page.locator('table tbody tr').first().textContent();
  console.log(`First row text: "${firstRowText}"`);
  expect(firstRowText?.toLowerCase()).toContain('sd-wan');

  // Clear search
  console.log('\nClearing search...');
  await searchInput.clear();
  await page.waitForTimeout(500);

  // Verify rows are back to original count
  const clearedRows = await page.locator('table tbody tr').count();
  console.log(`Row count after clear: ${clearedRows}`);
  expect(clearedRows).toBe(initialRows);

  // Test another search - search for "Production"
  console.log('\nSearching for "Production"...');
  await searchInput.fill('Production');
  await page.waitForTimeout(500);

  const productionRows = await page.locator('table tbody tr').count();
  console.log(`Rows matching "Production": ${productionRows}`);
  expect(productionRows).toBeGreaterThan(0);

  // Take screenshot
  await page.screenshot({ path: 'clouds-search-filter.png', fullPage: true });
  console.log('\nScreenshot saved: clouds-search-filter.png');

  console.log('\nAll Clouds search tests passed!');
});
