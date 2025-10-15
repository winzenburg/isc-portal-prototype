import { test } from '@playwright/test';

test('Visual inspection of pagination styling', async ({ page }) => {
  console.log('Navigating to contacts page...');
  await page.goto('http://localhost:4200/contacts', { waitUntil: 'networkidle', timeout: 15000 });

  await page.waitForTimeout(3000);

  console.log('\n=== Pagination Visual Inspection ===\n');

  // Take full page screenshot
  await page.screenshot({
    path: 'contacts-page-full.png',
    fullPage: true
  });
  console.log('✓ Full page screenshot: contacts-page-full.png');

  // Check if paginator exists
  const paginatorCount = await page.locator('mat-paginator').count();
  console.log(`\nPaginator elements found: ${paginatorCount}`);

  if (paginatorCount > 0) {
    // Take screenshot of paginator
    await page.locator('mat-paginator').screenshot({
      path: 'pagination-component-full.png'
    });
    console.log('✓ Paginator component screenshot: pagination-component-full.png');

    // Inspect the page size select area
    const pageSizeSelect = page.locator('.mat-mdc-paginator-page-size-select');
    const pageSizeCount = await pageSizeSelect.count();
    console.log(`Page size select elements: ${pageSizeCount}`);

    if (pageSizeCount > 0) {
      // Get computed styles
      const styles = await pageSizeSelect.evaluate((el) => {
        const formField = el.querySelector('.mat-mdc-form-field');
        const lineRipple = el.querySelector('.mdc-line-ripple');
        const infix = el.querySelector('.mat-mdc-form-field-infix');

        return {
          lineRippleExists: !!lineRipple,
          lineRippleDisplay: lineRipple ? window.getComputedStyle(lineRipple).display : 'N/A',
          lineRippleHeight: lineRipple ? window.getComputedStyle(lineRipple).height : 'N/A',
          infixPaddingBottom: infix ? window.getComputedStyle(infix).paddingBottom : 'N/A',
          infixMinHeight: infix ? window.getComputedStyle(infix).minHeight : 'N/A'
        };
      });

      console.log('\n--- Styling Information ---');
      console.log(`Line ripple exists: ${styles.lineRippleExists}`);
      console.log(`Line ripple display: ${styles.lineRippleDisplay}`);
      console.log(`Line ripple height: ${styles.lineRippleHeight}`);
      console.log(`Infix padding-bottom: ${styles.infixPaddingBottom}`);
      console.log(`Infix min-height: ${styles.infixMinHeight}`);

      // Take closeup screenshot of the page size area
      const box = await pageSizeSelect.boundingBox();
      if (box) {
        await page.screenshot({
          path: 'pagination-pagesize-closeup.png',
          clip: {
            x: Math.max(0, box.x - 20),
            y: Math.max(0, box.y - 10),
            width: Math.min(box.width + 40, 300),
            height: Math.min(box.height + 20, 100)
          }
        });
        console.log('✓ Page size closeup: pagination-pagesize-closeup.png');
      }
    }

    // Check if there are any visible issues
    console.log('\n--- Visual Check ---');
    const tableExists = await page.locator('table').count();
    console.log(`Table found: ${tableExists > 0 ? 'Yes' : 'No'}`);

    const rowCount = await page.locator('table tbody tr').count();
    console.log(`Table rows: ${rowCount}`);
  }

  console.log('\n=== Inspection Complete ===');
});
