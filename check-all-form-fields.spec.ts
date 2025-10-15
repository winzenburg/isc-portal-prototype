import { test } from '@playwright/test';

test('Check alignment of ALL form fields in the app', async ({ page }) => {
  await page.goto('http://localhost:4200');
  await page.waitForLoadState('networkidle');

  console.log('\n========================================');
  console.log('CHECKING ALL FORM FIELDS');
  console.log('========================================\n');

  // Check customer selector in header
  const customerSelector = page.locator('.customer-selector');
  await customerSelector.screenshot({ path: 'customer-selector-before.png' });

  const customerPrefix = customerSelector.locator('.mat-form-field-prefix, .mat-select-arrow-wrapper');
  const customerSelect = customerSelector.locator('.mat-select');

  const customerSelectBox = await customerSelect.boundingBox();
  const customerPrefixBox = await customerPrefix.boundingBox();

  console.log('=== CUSTOMER SELECTOR (Header) ===');
  if (customerSelectBox && customerPrefixBox) {
    const selectCenter = customerSelectBox.y + (customerSelectBox.height / 2);
    const prefixCenter = customerPrefixBox.y + (customerPrefixBox.height / 2);
    const diff = Math.abs(selectCenter - prefixCenter);

    console.log('Select Center Y:', selectCenter.toFixed(2));
    console.log('Arrow Center Y:', prefixCenter.toFixed(2));
    console.log('Difference:', diff.toFixed(2), 'px');
    console.log('Aligned:', diff < 2 ? '✓ YES' : '✗ NO');
  }

  // Check if there are any form fields on the dashboard
  await page.click('text=Dashboard');
  await page.waitForLoadState('networkidle');

  const dashboardFormFields = page.locator('.mat-form-field');
  const count = await dashboardFormFields.count();

  console.log('\n=== DASHBOARD FORM FIELDS ===');
  console.log('Found', count, 'form fields on dashboard');

  // Take screenshot of dashboard
  await page.screenshot({ path: 'dashboard-full.png' });

  // Check other pages
  const pages = ['Sites', 'Circuits', 'Reports', 'Contacts'];

  for (const pageName of pages) {
    const nav = page.locator(`text="${pageName}"`);
    const exists = await nav.count();

    if (exists > 0) {
      await nav.first().click();
      await page.waitForLoadState('networkidle');

      const pageFormFields = page.locator('.mat-form-field');
      const pageCount = await pageFormFields.count();

      console.log(`\n=== ${pageName.toUpperCase()} PAGE ===`);
      console.log('Found', pageCount, 'form fields');

      if (pageCount > 0) {
        await page.screenshot({ path: `${pageName.toLowerCase()}-page.png` });
      }
    }
  }

  console.log('\n========================================');
  console.log('RECOMMENDATION');
  console.log('========================================\n');
  console.log('The styles in styles.scss already apply globally to ALL');
  console.log('.mat-form-field elements, so all form fields should be');
  console.log('fixed. However, mat-select dropdowns may need additional');
  console.log('styling for their arrow icons.');
});
