import { test, expect } from '@playwright/test';

test.describe('Alignment Issues Check', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200');
    await page.waitForLoadState('networkidle');
  });

  test('Check header search input vertical alignment', async ({ page }) => {
    const searchInput = page.locator('.global-search input');
    await expect(searchInput).toBeVisible();

    const inputBox = await searchInput.boundingBox();
    const parentBox = await searchInput.locator('..').boundingBox();

    if (inputBox && parentBox) {
      const inputCenterY = inputBox.y + inputBox.height / 2;
      const parentCenterY = parentBox.y + parentBox.height / 2;
      const yDiff = Math.abs(inputCenterY - parentCenterY);

      console.log('Search Input Alignment:');
      console.log(`  Input center Y: ${inputCenterY}`);
      console.log(`  Parent center Y: ${parentCenterY}`);
      console.log(`  Difference: ${yDiff}px`);

      // Allow 7px tolerance for vertical centering (Material Design has built-in padding)
      expect(yDiff).toBeLessThan(7);
    }
  });

  test('Check header account selector vertical alignment', async ({ page }) => {
    const accountSelector = page.locator('.customer-selector .mat-select-value');
    await expect(accountSelector).toBeVisible();

    const selectorBox = await accountSelector.boundingBox();
    const parentBox = await page.locator('.customer-selector').boundingBox();

    if (selectorBox && parentBox) {
      const selectorCenterY = selectorBox.y + selectorBox.height / 2;
      const parentCenterY = parentBox.y + parentBox.height / 2;
      const yDiff = Math.abs(selectorCenterY - parentCenterY);

      console.log('Account Selector Alignment:');
      console.log(`  Selector center Y: ${selectorCenterY}`);
      console.log(`  Parent center Y: ${parentCenterY}`);
      console.log(`  Difference: ${yDiff}px`);

      // Allow 5px tolerance for vertical centering
      expect(yDiff).toBeLessThan(5);
    }
  });

  test('Check landing page hero section horizontal centering', async ({ page }) => {
    const heroContent = page.locator('.hero-content');
    await expect(heroContent).toBeVisible();

    const heroBox = await heroContent.boundingBox();
    const mainContent = page.locator('.main-content');
    const mainContentBox = await mainContent.boundingBox();

    if (heroBox && mainContentBox) {
      // Calculate margins relative to the main content area (excluding sidebar)
      const heroLeftMargin = heroBox.x - mainContentBox.x;
      const heroRightMargin = (mainContentBox.x + mainContentBox.width) - (heroBox.x + heroBox.width);
      const marginDiff = Math.abs(heroLeftMargin - heroRightMargin);

      console.log('Hero Content Horizontal Centering (relative to content area):');
      console.log(`  Left margin: ${heroLeftMargin}px`);
      console.log(`  Right margin: ${heroRightMargin}px`);
      console.log(`  Difference: ${marginDiff}px`);

      // Allow 10px tolerance for horizontal centering
      expect(marginDiff).toBeLessThan(10);
    }
  });

  test('Check metrics grid horizontal centering', async ({ page }) => {
    const metricsGrid = page.locator('.metrics-grid');
    await expect(metricsGrid).toBeVisible();

    const gridBox = await metricsGrid.boundingBox();
    const mainContent = page.locator('.main-content');
    const mainContentBox = await mainContent.boundingBox();

    if (gridBox && mainContentBox) {
      // Calculate margins relative to the main content area (excluding sidebar)
      const gridLeftMargin = gridBox.x - mainContentBox.x;
      const gridRightMargin = (mainContentBox.x + mainContentBox.width) - (gridBox.x + gridBox.width);
      const marginDiff = Math.abs(gridLeftMargin - gridRightMargin);

      console.log('Metrics Grid Horizontal Centering (relative to content area):');
      console.log(`  Left margin: ${gridLeftMargin}px`);
      console.log(`  Right margin: ${gridRightMargin}px`);
      console.log(`  Difference: ${marginDiff}px`);

      // Allow 10px tolerance for horizontal centering
      expect(marginDiff).toBeLessThan(10);
    }
  });

  test('Check issues grid horizontal centering', async ({ page }) => {
    const issuesGrid = page.locator('.issues-grid').first();
    await expect(issuesGrid).toBeVisible();

    const gridBox = await issuesGrid.boundingBox();
    const parentBox = await page.locator('.quick-wins-section').boundingBox();

    if (gridBox && parentBox) {
      const gridLeftMargin = gridBox.x - parentBox.x;
      const gridRightMargin = (parentBox.x + parentBox.width) - (gridBox.x + gridBox.width);
      const marginDiff = Math.abs(gridLeftMargin - gridRightMargin);

      console.log('Issues Grid Horizontal Centering:');
      console.log(`  Left margin: ${gridLeftMargin}px`);
      console.log(`  Right margin: ${gridRightMargin}px`);
      console.log(`  Difference: ${marginDiff}px`);

      // Allow 20px tolerance for grid centering (grids can have uneven spacing)
      expect(marginDiff).toBeLessThan(20);
    }
  });

  test('Visual screenshot for manual review', async ({ page }) => {
    // Take screenshots of key areas
    await page.screenshot({ path: 'alignment-check-full-page.png', fullPage: true });

    const header = page.locator('.app-header');
    await header.screenshot({ path: 'alignment-check-header.png' });

    const heroSection = page.locator('.hero-section');
    await heroSection.screenshot({ path: 'alignment-check-hero.png' });

    console.log('Screenshots saved:');
    console.log('  - alignment-check-full-page.png');
    console.log('  - alignment-check-header.png');
    console.log('  - alignment-check-hero.png');
  });
});
