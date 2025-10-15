import { test, expect } from '@playwright/test';

test('Empty states should show correctly based on filter state', async ({ page }) => {
  await page.goto('http://localhost:4200/clouds-unified');
  await page.waitForSelector('app-base-table');
  await page.waitForSelector('table tbody tr');
  await page.waitForTimeout(1000);

  console.log('=== Testing Empty State Behavior ===\n');

  // Test 1: With filters active and no results, should show "No results found" only
  console.log('Test 1: Applying filter that returns no results...');

  const searchInput = page.locator('.search-and-filters input[matInput]');
  await searchInput.fill('NONEXISTENT_CLOUD_XYZ123');
  await page.waitForTimeout(1000);

  // Check for "No results found" message
  const noResultsState = page.locator('.no-results-state');
  const noResultsVisible = await noResultsState.isVisible();
  console.log(`"No results found" state visible: ${noResultsVisible}`);
  expect(noResultsVisible).toBe(true);

  // Verify the text
  const noResultsText = await noResultsState.locator('h3').textContent();
  console.log(`No results text: "${noResultsText}"`);
  expect(noResultsText?.toLowerCase()).toContain('no results found');

  // Check that "No data found" state is NOT visible
  const emptyState = page.locator('app-empty-state');
  const emptyStateVisible = await emptyState.isVisible().catch(() => false);
  console.log(`"No data found" state visible: ${emptyStateVisible}`);
  expect(emptyStateVisible).toBe(false);

  // Verify table is hidden
  const tableRows = await page.locator('table tbody tr').count();
  console.log(`Table rows visible: ${tableRows}`);
  expect(tableRows).toBe(0);

  // Test 2: Clear filters button should work
  console.log('\nTest 2: Testing "Clear Filters" button...');

  const clearFiltersButton = page.locator('.no-results-state button:has-text("Clear Filters")');
  await expect(clearFiltersButton).toBeVisible();
  await clearFiltersButton.click();
  await page.waitForTimeout(500);

  // Verify data is shown again
  const restoredRows = await page.locator('table tbody tr').count();
  console.log(`Table rows after clear: ${restoredRows}`);
  expect(restoredRows).toBeGreaterThan(0);

  // Verify no results state is hidden
  const noResultsHidden = await noResultsState.isVisible().catch(() => false);
  console.log(`"No results found" state visible after clear: ${noResultsHidden}`);
  expect(noResultsHidden).toBe(false);

  // Take screenshot showing the cleared state
  await page.screenshot({ path: 'empty-state-cleared.png', fullPage: true });
  console.log('Screenshot saved: empty-state-cleared.png');

  // Test 3: Apply quick filter that returns no results
  console.log('\nTest 3: Testing quick filter with no results...');

  // First, search for something that will narrow results
  await searchInput.fill('ZZZZZ');
  await page.waitForTimeout(1000);

  // Verify "No results found" appears
  const noResultsAfterFilter = await noResultsState.isVisible();
  console.log(`"No results found" after quick filter: ${noResultsAfterFilter}`);
  expect(noResultsAfterFilter).toBe(true);

  // Take screenshot
  await page.screenshot({ path: 'no-results-found-state.png', fullPage: true });
  console.log('Screenshot saved: no-results-found-state.png');

  console.log('\nAll empty state tests passed!');
});

test('Verify no duplicate empty states appear', async ({ page }) => {
  await page.goto('http://localhost:4200/clouds-unified');
  await page.waitForSelector('app-base-table');
  await page.waitForSelector('table tbody tr');
  await page.waitForTimeout(1000);

  console.log('=== Testing No Duplicate Empty States ===\n');

  // Apply filter with no results
  const searchInput = page.locator('.search-and-filters input[matInput]');
  await searchInput.fill('IMPOSSIBLE_SEARCH_TERM_9999');
  await page.waitForTimeout(1000);

  // Count all possible empty state elements
  const noResultsState = page.locator('.no-results-state');
  const emptyStateComponent = page.locator('app-empty-state');

  const noResultsCount = await noResultsState.count();
  const emptyStateCount = await emptyStateComponent.count();

  console.log(`No results state count: ${noResultsCount}`);
  console.log(`Empty state component count: ${emptyStateCount}`);

  // Should only have one visible empty state
  const noResultsVisible = await noResultsState.isVisible().catch(() => false);
  const emptyStateVisible = await emptyStateComponent.isVisible().catch(() => false);

  console.log(`No results state visible: ${noResultsVisible}`);
  console.log(`Empty state component visible: ${emptyStateVisible}`);

  // Only one should be visible
  const totalVisible = (noResultsVisible ? 1 : 0) + (emptyStateVisible ? 1 : 0);
  console.log(`Total visible empty states: ${totalVisible}`);

  expect(totalVisible).toBe(1);
  expect(noResultsVisible).toBe(true);
  expect(emptyStateVisible).toBe(false);

  console.log('\nNo duplicate empty states found!');
});
