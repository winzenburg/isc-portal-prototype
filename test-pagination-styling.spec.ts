import { test, expect } from '@playwright/test';

test('Pagination component should not have underline through the page size number', async ({ page }) => {
  // Test on the Contacts page which has pagination
  await page.goto('http://localhost:4200/contacts-unified');

  // Wait for page to load
  await page.waitForSelector('mat-paginator');
  await page.waitForTimeout(1000);

  console.log('=== Testing Pagination Styling Fix ===\n');

  // Verify pagination is visible
  const paginator = page.locator('mat-paginator');
  await expect(paginator).toBeVisible();
  console.log('✓ Pagination component found');

  // Take screenshot of the pagination area
  await page.screenshot({
    path: 'pagination-before-interaction.png',
    fullPage: true
  });
  console.log('Screenshot saved: pagination-before-interaction.png');

  // Check the page size selector
  const pageSizeSelect = page.locator('.mat-mdc-paginator-page-size-select');
  await expect(pageSizeSelect).toBeVisible();
  console.log('✓ Page size selector found');

  // Click the page size dropdown to open it
  console.log('\nOpening page size dropdown...');
  await pageSizeSelect.click();
  await page.waitForTimeout(500);

  // Take screenshot of the open dropdown
  await page.screenshot({
    path: 'pagination-dropdown-open.png',
    fullPage: true
  });
  console.log('Screenshot saved: pagination-dropdown-open.png');

  // Check if the line ripple is hidden (CSS fix verification)
  const lineRipple = page.locator('.mat-mdc-paginator-page-size-select .mdc-line-ripple');

  if (await lineRipple.count() > 0) {
    // If it exists, check if it's hidden via CSS
    const display = await lineRipple.evaluate((el) => {
      return window.getComputedStyle(el).display;
    });
    console.log(`Line ripple display property: ${display}`);
    expect(display).toBe('none');
    console.log('✓ Line ripple is properly hidden');
  } else {
    console.log('✓ No line ripple element found (already cleaned up)');
  }

  // Close the dropdown by clicking elsewhere
  await page.locator('body').click({ position: { x: 10, y: 10 } });
  await page.waitForTimeout(300);

  // Test on another page with pagination - Circuits
  console.log('\n=== Testing on Circuits Page ===\n');
  await page.goto('http://localhost:4200/circuits-unified');
  await page.waitForSelector('mat-paginator');
  await page.waitForTimeout(1000);

  const circuitsPaginator = page.locator('mat-paginator');
  await expect(circuitsPaginator).toBeVisible();
  console.log('✓ Circuits pagination found');

  // Take screenshot
  await page.screenshot({
    path: 'pagination-circuits-page.png',
    fullPage: true
  });
  console.log('Screenshot saved: pagination-circuits-page.png');

  console.log('\n✓ Pagination styling test completed!');
  console.log('\nPlease review the screenshots to verify:');
  console.log('1. No underline running through the "Items per page" number');
  console.log('2. Proper spacing and alignment of pagination components');
  console.log('3. Clean appearance when dropdown is open');
});
