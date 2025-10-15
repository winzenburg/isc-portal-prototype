import { test, expect } from '@playwright/test';

test('Visual verification of checkbox cascade behavior', async ({ page }) => {
  await page.goto('http://localhost:4200/sites-unified');
  await page.waitForSelector('.site-tree-panel');
  await page.waitForTimeout(1500);

  console.log('=== Visual Checkbox Cascade Test ===\n');

  // Expand both countries to see all checkboxes
  const canadaNode = page.locator('.country-level:has(.country-label:has-text("Canada")) > .tree-node');
  const usNode = page.locator('.country-level:has(.country-label:has-text("US")) > .tree-node');

  await canadaNode.click();
  await page.waitForTimeout(300);
  await usNode.click();
  await page.waitForTimeout(300);

  console.log('Initial state with ESRI VANC location pre-selected');

  // Check initial states
  const canadaCheckbox = page.locator('.country-level:has(.country-label:has-text("Canada")) > .tree-node .tree-checkbox');
  const esriCheckbox = page.locator('.site-level:has(.site-label:has-text("ESRI VANC")) > .tree-node .tree-checkbox').first();

  const canadaIndeterminate = await canadaCheckbox.evaluate((el: any) => {
    const input = el.querySelector('input');
    return input?.indeterminate || false;
  });

  const canadaChecked = await canadaCheckbox.locator('input').getAttribute('aria-checked');
  const esriChecked = await esriCheckbox.locator('input').getAttribute('aria-checked');

  console.log(`Canada checkbox - checked: ${canadaChecked}, indeterminate: ${canadaIndeterminate}`);
  console.log(`ESRI site checkbox - checked: ${esriChecked}`);

  // Expect Canada to be indeterminate (has selected location)
  expect(canadaIndeterminate).toBe(true);
  // Expect ESRI to be checked (all locations selected)
  expect(esriChecked).toBe('true');

  // Take screenshot showing initial state
  await page.screenshot({ path: 'checkbox-initial-state.png', fullPage: true });
  console.log('Screenshot saved: checkbox-initial-state.png');

  console.log('\nClicking Canada checkbox to select all Canada sites...');

  // Click Canada checkbox to select all
  await canadaCheckbox.click();
  await page.waitForTimeout(500);

  const canadaAfterClick = await canadaCheckbox.locator('input').getAttribute('aria-checked');
  const canadaIndeterminateAfter = await canadaCheckbox.evaluate((el: any) => {
    const input = el.querySelector('input');
    return input?.indeterminate || false;
  });

  console.log(`Canada checkbox - checked: ${canadaAfterClick}, indeterminate: ${canadaIndeterminateAfter}`);

  // Take screenshot showing Canada fully selected
  await page.screenshot({ path: 'checkbox-country-selected.png', fullPage: true });
  console.log('Screenshot saved: checkbox-country-selected.png');

  console.log('\nClicking US checkbox to select all US sites...');

  const usCheckbox = page.locator('.country-level:has(.country-label:has-text("US")) > .tree-node .tree-checkbox');
  await usCheckbox.click();
  await page.waitForTimeout(500);

  // Take screenshot showing both countries selected
  await page.screenshot({ path: 'checkbox-all-selected.png', fullPage: true });
  console.log('Screenshot saved: checkbox-all-selected.png');

  console.log('\nUnclicking one US site to create indeterminate state...');

  // Expand and uncheck NYC site
  const nycSiteNode = page.locator('.site-level:has(.site-label:has-text("NYC Office21")) > .tree-node');
  await nycSiteNode.click(); // expand
  await page.waitForTimeout(300);

  const nycCheckbox = page.locator('.site-level:has(.site-label:has-text("NYC Office21")) > .tree-node .tree-checkbox').first();
  await nycCheckbox.click();
  await page.waitForTimeout(500);

  const usIndeterminate = await usCheckbox.evaluate((el: any) => {
    const input = el.querySelector('input');
    return input?.indeterminate || false;
  });

  console.log(`US checkbox indeterminate: ${usIndeterminate}`);
  expect(usIndeterminate).toBe(true);

  // Take screenshot showing indeterminate state
  await page.screenshot({ path: 'checkbox-indeterminate-state.png', fullPage: true });
  console.log('Screenshot saved: checkbox-indeterminate-state.png');

  console.log('\nAll visual tests completed!');
});
