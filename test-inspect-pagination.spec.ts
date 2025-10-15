import { test } from '@playwright/test';

test('Inspect pagination styling issue', async ({ page }) => {
  await page.goto('http://localhost:4200/contacts-unified', { waitUntil: 'networkidle', timeout: 15000 });

  await page.waitForTimeout(2000);

  console.log('=== Inspecting Pagination Component ===\n');

  // Take full page screenshot first
  await page.screenshot({
    path: 'pagination-full-page.png',
    fullPage: true
  });
  console.log('✓ Full page screenshot: pagination-full-page.png');

  // Check if paginator exists
  const paginatorExists = await page.locator('mat-paginator').count();
  console.log(`\nPaginator elements found: ${paginatorExists}`);

  if (paginatorExists > 0) {
    // Take screenshot of just the paginator
    await page.locator('mat-paginator').screenshot({
      path: 'pagination-component.png'
    });
    console.log('✓ Paginator screenshot: pagination-component.png');

    // Get the computed styles of the page size select
    const pageSizeSelect = page.locator('.mat-mdc-paginator-page-size-select');
    if (await pageSizeSelect.count() > 0) {
      console.log('\n✓ Page size selector found');

      // Check for the line ripple element
      const lineRipple = page.locator('.mat-mdc-paginator-page-size-select .mdc-line-ripple');
      const lineRippleCount = await lineRipple.count();
      console.log(`Line ripple elements: ${lineRippleCount}`);

      if (lineRippleCount > 0) {
        const display = await lineRipple.evaluate((el) => {
          return window.getComputedStyle(el).display;
        });
        console.log(`Line ripple display property: ${display}`);

        const height = await lineRipple.evaluate((el) => {
          return window.getComputedStyle(el).height;
        });
        console.log(`Line ripple height: ${height}`);

        const visibility = await lineRipple.evaluate((el) => {
          return window.getComputedStyle(el).visibility;
        });
        console.log(`Line ripple visibility: ${visibility}`);
      }

      // Check form field infix padding
      const formFieldInfix = page.locator('.mat-mdc-paginator-page-size-select .mat-mdc-form-field-infix');
      if (await formFieldInfix.count() > 0) {
        const paddingBottom = await formFieldInfix.evaluate((el) => {
          return window.getComputedStyle(el).paddingBottom;
        });
        console.log(`\nForm field infix padding-bottom: ${paddingBottom}`);
      }

      // Take a zoomed screenshot of the page size dropdown area
      const boundingBox = await pageSizeSelect.boundingBox();
      if (boundingBox) {
        await page.screenshot({
          path: 'pagination-page-size-closeup.png',
          clip: {
            x: Math.max(0, boundingBox.x - 50),
            y: Math.max(0, boundingBox.y - 20),
            width: boundingBox.width + 100,
            height: boundingBox.height + 40
          }
        });
        console.log('✓ Page size closeup screenshot: pagination-page-size-closeup.png');
      }
    } else {
      console.log('✗ Page size selector not found');
    }
  } else {
    console.log('✗ No paginator found on the page');
  }

  console.log('\n=== Inspection Complete ===');
});
