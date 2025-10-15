import { test, expect } from '@playwright/test';

test('Sources hierarchy checkboxes should cascade properly', async ({ page }) => {
  await page.goto('http://localhost:4200/sites-unified');

  // Wait for page to load
  await page.waitForSelector('.site-tree-panel');
  await page.waitForTimeout(1000);

  console.log('=== Testing Checkbox Cascade Behavior ===\n');

  // Expand Canada to see its sites
  const canadaNode = page.locator('.country-level:has(.country-label:has-text("Canada")) > .tree-node');
  await canadaNode.click();
  await page.waitForTimeout(300);

  // Verify ESRI VANC site is visible and expanded (should show location)
  const esriSite = page.locator('.site-level:has(.site-label:has-text("ESRI VANC"))').first();
  await expect(esriSite).toBeVisible();

  // Get checkboxes
  const canadaCheckbox = page.locator('.country-level:has(.country-label:has-text("Canada")) > .tree-node .tree-checkbox');
  const esriCheckbox = page.locator('.site-level:has(.site-label:has-text("ESRI VANC")) > .tree-node .tree-checkbox').first();
  const esriLocationCheckbox = page.locator('.site-level:has(.site-label:has-text("ESRI VANC")) .location-level .tree-checkbox').first();

  console.log('Test 1: Check single location - parent checkboxes should reflect selection');

  // Click location checkbox
  await esriLocationCheckbox.click();
  await page.waitForTimeout(300);

  // Verify location is checked
  const locationChecked = await esriLocationCheckbox.locator('input').getAttribute('aria-checked');
  console.log(`Location checkbox: ${locationChecked}`);
  expect(locationChecked).toBe('true');

  // Verify ESRI site checkbox is checked (all locations selected)
  const siteChecked = await esriCheckbox.locator('input').getAttribute('aria-checked');
  console.log(`ESRI site checkbox: ${siteChecked}`);
  expect(siteChecked).toBe('true');

  // Verify Canada checkbox shows indeterminate (only 1 of multiple sites selected)
  const countryIndeterminate = await canadaCheckbox.evaluate((el: any) => {
    const input = el.querySelector('input');
    return input?.indeterminate || false;
  });
  console.log(`Canada checkbox indeterminate: ${countryIndeterminate}`);
  expect(countryIndeterminate).toBe(true);

  console.log('\nTest 2: Uncheck location - parent checkboxes should update');

  // Uncheck location
  await esriLocationCheckbox.click();
  await page.waitForTimeout(300);

  // Verify location is unchecked
  const locationUnchecked = await esriLocationCheckbox.locator('input').getAttribute('aria-checked');
  console.log(`Location checkbox: ${locationUnchecked}`);
  expect(locationUnchecked).toBe('false');

  // Verify ESRI site checkbox is unchecked
  const siteUnchecked = await esriCheckbox.locator('input').getAttribute('aria-checked');
  console.log(`ESRI site checkbox: ${siteUnchecked}`);
  expect(siteUnchecked).toBe('false');

  // Verify Canada checkbox is also unchecked (no sites selected)
  const countryUnchecked = await canadaCheckbox.locator('input').getAttribute('aria-checked');
  console.log(`Canada checkbox: ${countryUnchecked}`);
  expect(countryUnchecked).toBe('false');

  console.log('\nTest 3: Check site - all locations should be checked');

  // Click site checkbox to check it
  await esriCheckbox.click();
  await page.waitForTimeout(300);

  // Verify site is checked
  const siteRechecked = await esriCheckbox.locator('input').getAttribute('aria-checked');
  console.log(`ESRI site checkbox: ${siteRechecked}`);
  expect(siteRechecked).toBe('true');

  // Verify location is also checked (cascaded down)
  const locationCascaded = await esriLocationCheckbox.locator('input').getAttribute('aria-checked');
  console.log(`Location checkbox (cascaded): ${locationCascaded}`);
  expect(locationCascaded).toBe('true');

  console.log('\nTest 4: Check country - all sites and locations should be checked');

  // First expand US to see its sites
  const usNode = page.locator('.country-level:has(.country-label:has-text("US")) > .tree-node');
  const usCheckbox = page.locator('.country-level:has(.country-label:has-text("US")) > .tree-node .tree-checkbox');

  // Click US checkbox to check it
  await usCheckbox.click();
  await page.waitForTimeout(300);

  // Verify US is checked
  const usChecked = await usCheckbox.locator('input').getAttribute('aria-checked');
  console.log(`US checkbox: ${usChecked}`);
  expect(usChecked).toBe('true');

  // Expand US to verify sites are checked
  await usNode.click();
  await page.waitForTimeout(300);

  // Check a few site checkboxes
  const nycCheckbox = page.locator('.site-level:has(.site-label:has-text("NYC Office21")) > .tree-node .tree-checkbox').first();
  const nycChecked = await nycCheckbox.locator('input').getAttribute('aria-checked');
  console.log(`NYC Office21 site checkbox: ${nycChecked}`);
  expect(nycChecked).toBe('true');

  const dallasCheckbox = page.locator('.site-level:has(.site-label:has-text("DALLAS - MB021740")) > .tree-node .tree-checkbox').first();
  const dallasChecked = await dallasCheckbox.locator('input').getAttribute('aria-checked');
  console.log(`DALLAS site checkbox: ${dallasChecked}`);
  expect(dallasChecked).toBe('true');

  console.log('\nTest 5: Uncheck site under checked country - country should become indeterminate');

  // Uncheck NYC site
  await nycCheckbox.click();
  await page.waitForTimeout(300);

  // Verify NYC is unchecked
  const nycUnchecked = await nycCheckbox.locator('input').getAttribute('aria-checked');
  console.log(`NYC Office21 site checkbox: ${nycUnchecked}`);
  expect(nycUnchecked).toBe('false');

  // Verify US becomes indeterminate (some but not all sites checked)
  const usIndeterminate = await usCheckbox.evaluate((el: any) => {
    const input = el.querySelector('input');
    return input?.indeterminate || false;
  });
  console.log(`US checkbox indeterminate: ${usIndeterminate}`);
  expect(usIndeterminate).toBe(true);

  // Take screenshot
  await page.screenshot({ path: 'checkbox-cascade-behavior.png', fullPage: true });
  console.log('\nScreenshot saved: checkbox-cascade-behavior.png');
});

test('Select All and Clear Selection buttons should work with cascade', async ({ page }) => {
  await page.goto('http://localhost:4200/sites-unified');
  await page.waitForSelector('.site-tree-panel');
  await page.waitForTimeout(1000);

  console.log('=== Testing Select All / Clear Selection ===\n');

  const selectAllButton = page.locator('.tree-header-actions button[matTooltip="Select All"]');
  const clearButton = page.locator('.tree-header-actions button[matTooltip="Clear Selection"]');

  // Expand all to see checkboxes
  const canadaNode = page.locator('.country-level:has(.country-label:has-text("Canada")) > .tree-node');
  await canadaNode.click();
  await page.waitForTimeout(300);

  const usNode = page.locator('.country-level:has(.country-label:has-text("US")) > .tree-node');
  await usNode.click();
  await page.waitForTimeout(300);

  console.log('Test: Select All should check all checkboxes and update parent states');

  // Click Select All
  await selectAllButton.click();
  await page.waitForTimeout(500);

  // Verify country checkboxes are checked (not indeterminate)
  const canadaCheckbox = page.locator('.country-level:has(.country-label:has-text("Canada")) > .tree-node .tree-checkbox');
  const usCheckbox = page.locator('.country-level:has(.country-label:has-text("US")) > .tree-node .tree-checkbox');

  const canadaChecked = await canadaCheckbox.locator('input').getAttribute('aria-checked');
  const usChecked = await usCheckbox.locator('input').getAttribute('aria-checked');

  console.log(`Canada checked: ${canadaChecked}`);
  console.log(`US checked: ${usChecked}`);

  expect(canadaChecked).toBe('true');
  expect(usChecked).toBe('true');

  // Verify neither is indeterminate
  const canadaIndeterminate = await canadaCheckbox.evaluate((el: any) => {
    const input = el.querySelector('input');
    return input?.indeterminate || false;
  });
  const usIndeterminate = await usCheckbox.evaluate((el: any) => {
    const input = el.querySelector('input');
    return input?.indeterminate || false;
  });

  console.log(`Canada indeterminate: ${canadaIndeterminate}`);
  console.log(`US indeterminate: ${usIndeterminate}`);

  expect(canadaIndeterminate).toBe(false);
  expect(usIndeterminate).toBe(false);

  console.log('\nTest: Clear Selection should uncheck all checkboxes');

  // Click Clear Selection
  await clearButton.click();
  await page.waitForTimeout(500);

  // Verify all checkboxes are unchecked
  const canadaCleared = await canadaCheckbox.locator('input').getAttribute('aria-checked');
  const usCleared = await usCheckbox.locator('input').getAttribute('aria-checked');

  console.log(`Canada checked: ${canadaCleared}`);
  console.log(`US checked: ${usCleared}`);

  expect(canadaCleared).toBe('false');
  expect(usCleared).toBe('false');

  console.log('\nAll tests passed!');
});
