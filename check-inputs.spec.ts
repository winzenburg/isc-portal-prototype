import { test, expect } from '@playwright/test';

test.describe('Systemic Input Field Issues Investigation', () => {

  test('Investigate Header Input Fields', async ({ page }) => {
    await page.goto('http://localhost:4200');
    await page.waitForLoadState('networkidle');

    console.log(`\n=== HEADER INPUT FIELDS ===`);

    // Search input
    const searchInput = page.locator('.global-search input');
    const searchBox = await searchInput.boundingBox();
    const searchFormField = searchInput.locator('..').locator('..');
    const searchFormFieldBox = await searchFormField.boundingBox();

    console.log(`\nSearch Input:`);
    if (searchBox && searchFormFieldBox) {
      console.log(`  Input: ${searchBox.width}×${searchBox.height}px at (${searchBox.x}, ${searchBox.y})`);
      console.log(`  FormField: ${searchFormFieldBox.width}×${searchFormFieldBox.height}px`);

      const inputCenterY = searchBox.y + searchBox.height / 2;
      const formFieldCenterY = searchFormFieldBox.y + searchFormFieldBox.height / 2;
      const yDiff = Math.abs(inputCenterY - formFieldCenterY);
      console.log(`  Vertical alignment: ${yDiff.toFixed(1)}px off center`);

      // Check padding
      const formFieldStyles = await searchFormField.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          padding: computed.padding,
          paddingTop: computed.paddingTop,
          paddingBottom: computed.paddingBottom,
        };
      });
      console.log(`  FormField padding:`, formFieldStyles);
    }

    // Account selector
    const accountSelect = page.locator('.customer-selector .mat-select');
    const accountBox = await accountSelect.boundingBox();

    console.log(`\nAccount Selector:`);
    if (accountBox) {
      console.log(`  Select: ${accountBox.width}×${accountBox.height}px at (${accountBox.x}, ${accountBox.y})`);
    }

    await page.screenshot({ path: 'input-investigation-header.png' });
  });

  test('Check mat-form-field consistency', async ({ page }) => {
    await page.goto('http://localhost:4200');
    await page.waitForLoadState('networkidle');

    console.log(`\n=== MAT-FORM-FIELD CONSISTENCY CHECK ===`);

    const allFormFields = page.locator('mat-form-field');
    const count = await allFormFields.count();

    console.log(`\nFound ${count} mat-form-field elements`);

    for (let i = 0; i < Math.min(count, 5); i++) {
      const formField = allFormFields.nth(i);
      const box = await formField.boundingBox();

      if (box) {
        console.log(`\nForm Field ${i + 1}: ${box.width}×${box.height}px`);

        // Check wrapper
        const wrapper = formField.locator('.mat-form-field-wrapper');
        const wrapperStyles = await wrapper.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            paddingBottom: computed.paddingBottom,
          };
        });
        console.log(`  Wrapper padding-bottom: ${wrapperStyles.paddingBottom}`);

        // Check infix
        const infix = formField.locator('.mat-form-field-infix');
        const infixStyles = await infix.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            display: computed.display,
            alignItems: computed.alignItems,
            paddingTop: computed.paddingTop,
            paddingBottom: computed.paddingBottom,
            borderTop: computed.borderTop,
          };
        });
        console.log(`  Infix styles:`, infixStyles);
      }
    }
  });

  test('Compare input heights across pages', async ({ page }) => {
    console.log(`\n=== INPUT HEIGHTS ACROSS PAGES ===`);

    // Landing page
    await page.goto('http://localhost:4200');
    await page.waitForLoadState('networkidle');

    const landingInputs = await page.locator('input').all();
    console.log(`\nLanding Page (${landingInputs.length} inputs):`);
    const landingHeights = [];
    for (const input of landingInputs.slice(0, 3)) {
      const box = await input.boundingBox();
      if (box) landingHeights.push(box.height);
    }
    console.log(`  Heights: ${landingHeights.join(', ')}px`);

    // Dashboard
    await page.goto('http://localhost:4200/dashboard');
    await page.waitForLoadState('networkidle');

    const dashboardInputs = await page.locator('input').all();
    console.log(`\nDashboard (${dashboardInputs.length} inputs):`);
    const dashboardHeights = [];
    for (const input of dashboardInputs.slice(0, 3)) {
      const box = await input.boundingBox();
      if (box) dashboardHeights.push(box.height);
    }
    console.log(`  Heights: ${dashboardHeights.join(', ')}px`);

    await page.screenshot({ path: 'input-heights-comparison.png' });
  });
});
