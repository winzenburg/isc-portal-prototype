import { test, expect } from '@playwright/test';

test.describe('Current State Visual Inspection', () => {

  test('Take screenshots of actual button states', async ({ page }) => {
    await page.goto('http://localhost:4200');
    await page.waitForLoadState('networkidle');

    // Scroll to buttons
    await page.locator('.issue-card').first().scrollIntoViewIfNeeded();

    // Take screenshot of normal state
    await page.screenshot({ path: 'current-buttons-normal.png' });

    // Hover over raised button and capture
    const raisedButton = page.locator('button.mat-raised-button.demo-button').first();
    await raisedButton.hover();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'current-raised-hover.png' });

    // Move away and hover stroked button
    await page.mouse.move(0, 0);
    await page.waitForTimeout(300);

    const strokedButton = page.locator('button.mat-stroked-button.demo-button').first();
    await strokedButton.hover();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'current-stroked-hover.png' });

    // Get actual colors
    const strokedColors = await strokedButton.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        bg: computed.backgroundColor,
        color: computed.color,
        border: computed.borderColor,
      };
    });

    console.log('\n=== STROKED BUTTON HOVER COLORS ===');
    console.log('Background:', strokedColors.bg);
    console.log('Text Color:', strokedColors.color);
    console.log('Border Color:', strokedColors.border);
  });

  test('Take screenshots of input fields', async ({ page }) => {
    await page.goto('http://localhost:4200');
    await page.waitForLoadState('networkidle');

    // Take close-up of header
    const header = page.locator('.app-header');
    await header.screenshot({ path: 'current-header-inputs.png' });

    // Get input dimensions
    const searchInput = page.locator('.global-search input');
    const inputBox = await searchInput.boundingBox();

    const formField = searchInput.locator('..').locator('..');
    const formFieldBox = await formField.boundingBox();

    console.log('\n=== INPUT FIELD MEASUREMENTS ===');
    if (inputBox && formFieldBox) {
      console.log('Input height:', inputBox.height);
      console.log('FormField height:', formFieldBox.height);
      console.log('Input Y position:', inputBox.y);
      console.log('FormField Y position:', formFieldBox.y);

      const inputCenter = inputBox.y + inputBox.height / 2;
      const formFieldCenter = formFieldBox.y + formFieldBox.height / 2;
      console.log('Vertical offset:', Math.abs(inputCenter - formFieldCenter).toFixed(1), 'px');
    }

    // Check icon position
    const searchIcon = page.locator('.global-search mat-icon').first();
    const iconBox = await searchIcon.boundingBox();

    if (iconBox && formFieldBox) {
      const iconCenter = iconBox.y + iconBox.height / 2;
      const formFieldCenter = formFieldBox.y + formFieldBox.height / 2;
      console.log('\nSearch Icon:');
      console.log('Icon height:', iconBox.height);
      console.log('Icon Y position:', iconBox.y);
      console.log('Vertical offset from form field center:', Math.abs(iconCenter - formFieldCenter).toFixed(1), 'px');
    }
  });

  test('Inspect dashboard buttons', async ({ page }) => {
    await page.goto('http://localhost:4200/dashboard');
    await page.waitForLoadState('networkidle');

    await page.screenshot({ path: 'current-dashboard.png' });

    // Hover over a Quick Actions button
    const quickActionButton = page.locator('.quick-actions-grid button').first();
    await quickActionButton.hover();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'current-dashboard-button-hover.png' });

    const colors = await quickActionButton.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        bg: computed.backgroundColor,
        color: computed.color,
      };
    });

    console.log('\n=== DASHBOARD BUTTON HOVER ===');
    console.log('Background:', colors.bg);
    console.log('Text Color:', colors.color);
  });
});
