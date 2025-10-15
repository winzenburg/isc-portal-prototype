import { test, expect } from '@playwright/test';

test('Checking a checkbox should auto-expand to show children', async ({ page }) => {
  await page.goto('http://localhost:4200/sites-unified');
  await page.waitForSelector('.site-tree-panel');
  await page.waitForTimeout(1000);

  console.log('=== Testing Auto-Expand on Check ===\n');

  // Initially, US should be expanded but we'll collapse it first
  const usNode = page.locator('.country-level:has(.country-label:has-text("US")) > .tree-node');
  const usCheckbox = page.locator('.country-level:has(.country-label:has-text("US")) > .tree-node .tree-checkbox');
  const usExpandIcon = usNode.locator('.expand-icon');

  // Collapse US first (it starts expanded)
  let iconText = await usExpandIcon.textContent();
  if (iconText?.trim() === 'expand_more') {
    console.log('Collapsing US to start test...');
    await usNode.click();
    await page.waitForTimeout(300);
  }

  // Verify US is collapsed
  iconText = await usExpandIcon.textContent();
  console.log(`US expand icon (collapsed): "${iconText}"`);
  expect(iconText?.trim()).toBe('chevron_right');

  // Verify US sites are not visible
  let usSites = page.locator('.country-level:has(.country-label:has-text("US")) .site-level');
  let siteCount = await usSites.count();
  console.log(`US sites visible (before check): ${siteCount}`);
  expect(siteCount).toBe(0);

  console.log('\nChecking US checkbox...');

  // Check US checkbox
  await usCheckbox.click();
  await page.waitForTimeout(500);

  // Verify US is now expanded automatically
  iconText = await usExpandIcon.textContent();
  console.log(`US expand icon (after check): "${iconText}"`);
  expect(iconText?.trim()).toBe('expand_more');

  // Verify US sites are now visible
  usSites = page.locator('.country-level:has(.country-label:has-text("US")) .site-level');
  siteCount = await usSites.count();
  console.log(`US sites visible (after check): ${siteCount}`);
  expect(siteCount).toBeGreaterThan(0);

  // Verify sites are also expanded (should show locations)
  const nycSite = page.locator('.site-level:has(.site-label:has-text("NYC Office21"))').first();
  const nycExpandIcon = nycSite.locator('.expand-icon').first();
  const nycIconText = await nycExpandIcon.textContent();
  console.log(`NYC site expand icon: "${nycIconText}"`);
  expect(nycIconText?.trim()).toBe('expand_more');

  // Take screenshot showing auto-expanded tree
  await page.screenshot({ path: 'auto-expand-on-check.png', fullPage: true });
  console.log('\nScreenshot saved: auto-expand-on-check.png');

  console.log('\nTest 2: Checking a site should auto-expand it');

  // Clear all selections first
  const clearButton = page.locator('.tree-header-actions button[matTooltip="Clear Selection"]');
  await clearButton.click();
  await page.waitForTimeout(500);

  // Expand Canada but keep sites collapsed
  const canadaNode = page.locator('.country-level:has(.country-label:has-text("Canada")) > .tree-node');
  await canadaNode.click();
  await page.waitForTimeout(300);

  // Find ESRI VANC site (should be visible but might be expanded)
  const esriSiteNode = page.locator('.site-level:has(.site-label:has-text("ESRI VANC")) > .tree-node').first();
  const esriExpandIcon = esriSiteNode.locator('.expand-icon');

  // If it's expanded, collapse it first
  let esriIconText = await esriExpandIcon.textContent();
  if (esriIconText?.trim() === 'expand_more') {
    console.log('Collapsing ESRI VANC site...');
    await esriSiteNode.click();
    await page.waitForTimeout(300);
  }

  // Verify ESRI VANC is collapsed
  esriIconText = await esriExpandIcon.textContent();
  console.log(`ESRI VANC expand icon (before check): "${esriIconText}"`);

  // Check ESRI VANC site checkbox
  const esriCheckbox = page.locator('.site-level:has(.site-label:has-text("ESRI VANC")) > .tree-node .tree-checkbox').first();
  console.log('Checking ESRI VANC site checkbox...');
  await esriCheckbox.click();
  await page.waitForTimeout(500);

  // Verify ESRI VANC is now expanded
  esriIconText = await esriExpandIcon.textContent();
  console.log(`ESRI VANC expand icon (after check): "${esriIconText}"`);
  expect(esriIconText?.trim()).toBe('expand_more');

  // Verify locations are visible
  const esriLocations = page.locator('.site-level:has(.site-label:has-text("ESRI VANC")) .location-level');
  const locationCount = await esriLocations.count();
  console.log(`ESRI VANC locations visible: ${locationCount}`);
  expect(locationCount).toBeGreaterThan(0);

  // Take final screenshot
  await page.screenshot({ path: 'auto-expand-site-on-check.png', fullPage: true });
  console.log('Screenshot saved: auto-expand-site-on-check.png');

  console.log('\nAll auto-expand tests passed!');
});
