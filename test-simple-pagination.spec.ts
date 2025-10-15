import { test } from '@playwright/test';

test('Take screenshot of pagination styling', async ({ page }) => {
  // Navigate to a page with pagination
  await page.goto('http://localhost:4200/contacts-unified', { waitUntil: 'networkidle', timeout: 10000 });

  // Wait a bit for everything to load
  await page.waitForTimeout(2000);

  // Take full page screenshot
  await page.screenshot({
    path: 'contacts-pagination-full.png',
    fullPage: true
  });
  console.log('✓ Full page screenshot saved: contacts-pagination-full.png');

  // Take screenshot focused on pagination area
  const paginatorExists = await page.locator('mat-paginator').count();
  if (paginatorExists > 0) {
    await page.locator('mat-paginator').screenshot({
      path: 'contacts-pagination-closeup.png'
    });
    console.log('✓ Pagination closeup screenshot saved: contacts-pagination-closeup.png');
  } else {
    console.log('No paginator found on page');
  }
});
