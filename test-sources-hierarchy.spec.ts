import { test, expect } from '@playwright/test';

test('Sites page should have Sources hierarchy tree', async ({ page }) => {
  await page.goto('http://localhost:4200/sites-unified');

  // Wait for page to load completely
  await page.waitForSelector('.sites-page-container');
  await page.waitForSelector('.site-tree-panel');
  await page.waitForSelector('table tbody tr'); // Wait for data to load
  await page.waitForTimeout(1000); // Give Angular time to fully render

  // Verify the tree panel exists
  const treePanel = page.locator('.site-tree-panel');
  await expect(treePanel).toBeVisible();

  // Verify the header shows "Sources" (not "Site & Interfaces")
  const headerText = await page.locator('.tree-header span').first().textContent();
  console.log(`Tree header text: "${headerText}"`);
  expect(headerText?.trim()).toBe('Sources');

  // Verify header action buttons exist
  const selectAllButton = page.locator('.tree-header-actions button[matTooltip="Select All"]');
  const clearButton = page.locator('.tree-header-actions button[matTooltip="Clear Selection"]');
  await expect(selectAllButton).toBeVisible();
  await expect(clearButton).toBeVisible();

  // Count country nodes (should be 2: Canada and US)
  const countryNodes = page.locator('.country-level > .tree-node .country-label');
  const countryCount = await countryNodes.count();
  console.log(`Found ${countryCount} country node(s)`);
  expect(countryCount).toBe(2);

  // Verify country names
  const canadaNode = page.locator('.country-label:has-text("Canada")');
  const usNode = page.locator('.country-label:has-text("US")');
  await expect(canadaNode).toBeVisible();
  await expect(usNode).toBeVisible();

  // Test expand/collapse for US (starts expanded)
  const usTreeNode = page.locator('.country-level:has(.country-label:has-text("US")) > .tree-node');
  const usExpandIcon = usTreeNode.locator('.expand-icon');

  // Verify US starts expanded (should show expand_more icon)
  let iconText = await usExpandIcon.textContent();
  console.log(`US expand icon (initial): "${iconText}"`);
  expect(iconText?.trim()).toBe('expand_more');

  // Verify we can see US sites (should be 5 sites visible)
  let usSites = page.locator('.country-level:has(.country-label:has-text("US")) .tree-children .site-level');
  let siteCount = await usSites.count();
  console.log(`US sites visible (expanded): ${siteCount}`);
  expect(siteCount).toBeGreaterThan(0);

  // Click to collapse US
  await usTreeNode.click();
  await page.waitForTimeout(300);

  // Verify US is now collapsed (should show chevron_right icon)
  iconText = await usExpandIcon.textContent();
  console.log(`US expand icon (after collapse): "${iconText}"`);
  expect(iconText?.trim()).toBe('chevron_right');

  // Verify US sites are no longer visible
  usSites = page.locator('.country-level:has(.country-label:has-text("US")) .tree-children .site-level');
  siteCount = await usSites.count();
  console.log(`US sites visible (collapsed): ${siteCount}`);
  expect(siteCount).toBe(0);

  // Click to expand US again
  await usTreeNode.click();
  await page.waitForTimeout(300);

  // Test expand/collapse for a specific site (e.g., "ESRI VANC - External" under Canada)
  const canadaTreeNode = page.locator('.country-level:has(.country-label:has-text("Canada")) > .tree-node');
  await canadaTreeNode.click(); // Expand Canada
  await page.waitForTimeout(300);

  const esriSiteNode = page.locator('.site-label:has-text("ESRI VANC")').first();
  await expect(esriSiteNode).toBeVisible();

  // Check if ESRI VANC site starts expanded (should show locations)
  const esriLocations = page.locator('.site-level:has(.site-label:has-text("ESRI VANC")) .tree-children .location-level');
  let locationCount = await esriLocations.count();
  console.log(`ESRI VANC locations visible: ${locationCount}`);

  // Verify checkboxes exist at all levels
  const countryCheckboxes = page.locator('.country-level > .tree-node .tree-checkbox');
  const countryCheckboxCount = await countryCheckboxes.count();
  console.log(`Country checkboxes: ${countryCheckboxCount}`);
  expect(countryCheckboxCount).toBe(2);

  const siteCheckboxes = page.locator('.site-level > .tree-node .tree-checkbox');
  const siteCheckboxCount = await siteCheckboxes.count();
  console.log(`Site checkboxes: ${siteCheckboxCount}`);
  expect(siteCheckboxCount).toBeGreaterThan(0);

  const locationCheckboxes = page.locator('.location-level .tree-checkbox');
  const locationCheckboxCount = await locationCheckboxes.count();
  console.log(`Location checkboxes: ${locationCheckboxCount}`);
  expect(locationCheckboxCount).toBeGreaterThan(0);

  // Test "Select All" functionality
  console.log('\nTesting Select All...');
  await selectAllButton.click();
  await page.waitForTimeout(500);

  // Verify at least one location checkbox is checked
  const checkedLocations = page.locator('.location-level .tree-checkbox input[aria-checked="true"]');
  const checkedCount = await checkedLocations.count();
  console.log(`Checked locations after Select All: ${checkedCount}`);
  expect(checkedCount).toBeGreaterThan(0);

  // Test "Clear Selection" functionality
  console.log('\nTesting Clear Selection...');
  await clearButton.click();
  await page.waitForTimeout(500);

  // Verify all checkboxes are unchecked
  const stillChecked = await page.locator('.tree-checkbox input[aria-checked="true"]').count();
  console.log(`Checked items after Clear Selection: ${stillChecked}`);
  expect(stillChecked).toBe(0);

  // Take screenshot to verify layout
  await page.screenshot({ path: 'sites-sources-hierarchy.png', fullPage: true });
  console.log('\nScreenshot saved: sites-sources-hierarchy.png');
});

test('Sites page Sources hierarchy should have proper styling', async ({ page }) => {
  await page.goto('http://localhost:4200/sites-unified');
  await page.waitForSelector('.site-tree-panel');
  await page.waitForTimeout(1000);

  // Verify tree panel has proper width
  const treePanel = page.locator('.site-tree-panel');
  const box = await treePanel.boundingBox();
  console.log(`Tree panel width: ${box?.width}px`);
  expect(box?.width).toBeGreaterThan(200); // Should be 280px

  // Verify tree header has proper background
  const headerBgColor = await page.locator('.tree-header').evaluate((el) => {
    return window.getComputedStyle(el).backgroundColor;
  });
  console.log(`Tree header background: ${headerBgColor}`);

  // Verify tree nodes have proper indentation for hierarchy
  // Expand Canada to see sites
  const canadaNode = page.locator('.country-level:has(.country-label:has-text("Canada")) > .tree-node');
  await canadaNode.click();
  await page.waitForTimeout(300);

  // Check for tree-children indentation
  const treeChildren = page.locator('.tree-children').first();
  const marginLeft = await treeChildren.evaluate((el) => {
    return window.getComputedStyle(el).marginLeft;
  });
  console.log(`Tree children margin-left: ${marginLeft}`);
  expect(marginLeft).toBe('20px');

  // Scroll the tree panel into view for focused screenshot
  await treePanel.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  // Take focused screenshot of the tree panel
  await treePanel.screenshot({ path: 'sources-tree-panel-focused.png' });
  console.log('Focused tree panel screenshot saved: sources-tree-panel-focused.png');
});
