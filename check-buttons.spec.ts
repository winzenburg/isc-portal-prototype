import { test, expect } from '@playwright/test';

test.describe('Systemic Button Issues Investigation', () => {

  test('Investigate Landing Page View Solution Buttons', async ({ page }) => {
    await page.goto('http://localhost:4200');
    await page.waitForLoadState('networkidle');

    // Find all View Solution buttons
    const viewSolutionButtons = page.locator('button.demo-button');
    const count = await viewSolutionButtons.count();

    console.log(`\n=== LANDING PAGE VIEW SOLUTION BUTTONS (${count} found) ===`);

    for (let i = 0; i < count; i++) {
      const button = viewSolutionButtons.nth(i);
      const buttonBox = await button.boundingBox();

      // Get the icon inside the button
      const icon = button.locator('mat-icon');
      const iconBox = await icon.boundingBox();

      // Get the text span (specifically the one with md3-label-large class)
      const textSpan = button.locator('span.md3-label-large');
      const textBox = await textSpan.boundingBox();

      // Get the mat-button-wrapper
      const wrapper = button.locator('.mat-button-wrapper');
      const wrapperBox = await wrapper.boundingBox();

      console.log(`\nButton ${i + 1}:`);
      if (buttonBox) {
        console.log(`  Button: ${buttonBox.width}×${buttonBox.height}px at (${buttonBox.x}, ${buttonBox.y})`);
      }
      if (wrapperBox) {
        console.log(`  Wrapper: ${wrapperBox.width}×${wrapperBox.height}px at (${wrapperBox.x}, ${wrapperBox.y})`);
      }
      if (textBox) {
        console.log(`  Text: ${textBox.width}×${textBox.height}px at (${textBox.x}, ${textBox.y})`);
      }
      if (iconBox) {
        console.log(`  Icon: ${iconBox.width}×${iconBox.height}px at (${iconBox.x}, ${iconBox.y})`);

        // Check if icon overflows button
        if (buttonBox && iconBox.x + iconBox.width > buttonBox.x + buttonBox.width) {
          console.log(`  ⚠️ ISSUE: Icon overflows button by ${(iconBox.x + iconBox.width) - (buttonBox.x + buttonBox.width)}px`);
        }

        // Check vertical alignment of icon vs button
        if (buttonBox) {
          const iconCenterY = iconBox.y + iconBox.height / 2;
          const buttonCenterY = buttonBox.y + buttonBox.height / 2;
          const yDiff = Math.abs(iconCenterY - buttonCenterY);
          console.log(`  Icon vertical alignment: ${yDiff.toFixed(1)}px off center`);
          if (yDiff > 2) {
            console.log(`  ⚠️ ISSUE: Icon is not vertically centered (${yDiff.toFixed(1)}px off)`);
          }
        }
      }

      // Check text vertical alignment
      if (buttonBox && textBox) {
        const textCenterY = textBox.y + textBox.height / 2;
        const buttonCenterY = buttonBox.y + buttonBox.height / 2;
        const yDiff = Math.abs(textCenterY - buttonCenterY);
        console.log(`  Text vertical alignment: ${yDiff.toFixed(1)}px off center`);
        if (yDiff > 2) {
          console.log(`  ⚠️ ISSUE: Text is not vertically centered (${yDiff.toFixed(1)}px off)`);
        }
      }

      // Check computed styles
      const buttonStyles = await button.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          display: computed.display,
          alignItems: computed.alignItems,
          justifyContent: computed.justifyContent,
          padding: computed.padding,
          height: computed.height,
          lineHeight: computed.lineHeight,
        };
      });

      const wrapperStyles = await wrapper.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          display: computed.display,
          alignItems: computed.alignItems,
          justifyContent: computed.justifyContent,
          gap: computed.gap,
        };
      });

      console.log(`  Button styles:`, buttonStyles);
      console.log(`  Wrapper styles:`, wrapperStyles);
    }

    // Take screenshots
    await page.screenshot({ path: 'button-investigation-landing.png', fullPage: true });

    // Screenshot of first button with hover
    if (count > 0) {
      await viewSolutionButtons.first().hover();
      await page.screenshot({ path: 'button-hover-state.png' });
    }
  });

  test('Investigate Dashboard Quick Actions Buttons', async ({ page }) => {
    await page.goto('http://localhost:4200/dashboard');
    await page.waitForLoadState('networkidle');

    const quickActionButtons = page.locator('.quick-actions-grid button');
    const count = await quickActionButtons.count();

    console.log(`\n=== DASHBOARD QUICK ACTIONS BUTTONS (${count} found) ===`);

    for (let i = 0; i < count; i++) {
      const button = quickActionButtons.nth(i);
      const buttonBox = await button.boundingBox();

      const icon = button.locator('mat-icon');
      const iconBox = await icon.boundingBox();

      const wrapper = button.locator('.mat-button-wrapper');
      const wrapperBox = await wrapper.boundingBox();

      console.log(`\nButton ${i + 1}:`);
      if (buttonBox) {
        console.log(`  Button: ${buttonBox.width}×${buttonBox.height}px`);
      }
      if (iconBox && buttonBox) {
        const iconCenterY = iconBox.y + iconBox.height / 2;
        const buttonCenterY = buttonBox.y + buttonBox.height / 2;
        const yDiff = Math.abs(iconCenterY - buttonCenterY);
        console.log(`  Icon vertical alignment: ${yDiff.toFixed(1)}px off center`);
        if (yDiff > 2) {
          console.log(`  ⚠️ ISSUE: Icon not vertically centered`);
        }
      }

      // Check wrapper styles
      const wrapperStyles = await wrapper.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          display: computed.display,
          alignItems: computed.alignItems,
          justifyContent: computed.justifyContent,
        };
      });
      console.log(`  Wrapper styles:`, wrapperStyles);
    }

    await page.screenshot({ path: 'button-investigation-dashboard.png', fullPage: true });
  });

  test('Compare all Material Button types', async ({ page }) => {
    await page.goto('http://localhost:4200');
    await page.waitForLoadState('networkidle');

    console.log(`\n=== MATERIAL BUTTON TYPE COMPARISON ===`);

    // Check different button types
    const raisedButtons = page.locator('button.mat-raised-button');
    const strokedButtons = page.locator('button.mat-stroked-button');
    const flatButtons = page.locator('button.mat-flat-button');
    const textButtons = page.locator('button.mat-button:not(.mat-raised-button):not(.mat-stroked-button):not(.mat-flat-button)');

    const raisedCount = await raisedButtons.count();
    const strokedCount = await strokedButtons.count();
    const flatCount = await flatButtons.count();
    const textCount = await textButtons.count();

    console.log(`\nButton counts:`);
    console.log(`  mat-raised-button: ${raisedCount}`);
    console.log(`  mat-stroked-button: ${strokedCount}`);
    console.log(`  mat-flat-button: ${flatCount}`);
    console.log(`  mat-button (text): ${textCount}`);

    // Check height consistency
    if (raisedCount > 0) {
      const heights = [];
      for (let i = 0; i < Math.min(raisedCount, 5); i++) {
        const box = await raisedButtons.nth(i).boundingBox();
        if (box) heights.push(box.height);
      }
      console.log(`\nRaised button heights: ${heights.join(', ')}px`);
      const uniqueHeights = [...new Set(heights)];
      if (uniqueHeights.length > 1) {
        console.log(`  ⚠️ ISSUE: Inconsistent heights across raised buttons`);
      }
    }

    if (strokedCount > 0) {
      const heights = [];
      for (let i = 0; i < Math.min(strokedCount, 5); i++) {
        const box = await strokedButtons.nth(i).boundingBox();
        if (box) heights.push(box.height);
      }
      console.log(`\nStroked button heights: ${heights.join(', ')}px`);
      const uniqueHeights = [...new Set(heights)];
      if (uniqueHeights.length > 1) {
        console.log(`  ⚠️ ISSUE: Inconsistent heights across stroked buttons`);
      }
    }
  });

  test('Check .mat-button-wrapper consistency', async ({ page }) => {
    await page.goto('http://localhost:4200');
    await page.waitForLoadState('networkidle');

    console.log(`\n=== .mat-button-wrapper CONSISTENCY CHECK ===`);

    const allButtons = page.locator('button[mat-raised-button], button[mat-stroked-button], button[mat-flat-button], button[mat-button]');
    const count = await allButtons.count();

    let withWrapper = 0;
    let withoutWrapper = 0;
    let wrapperNotFlex = 0;

    for (let i = 0; i < Math.min(count, 10); i++) {
      const button = allButtons.nth(i);
      const wrapper = button.locator('.mat-button-wrapper');
      const wrapperExists = await wrapper.count() > 0;

      if (wrapperExists) {
        withWrapper++;
        const display = await wrapper.evaluate((el) => window.getComputedStyle(el).display);
        if (display !== 'flex') {
          wrapperNotFlex++;
          console.log(`  ⚠️ Button ${i + 1}: wrapper exists but display is "${display}", not "flex"`);
        }
      } else {
        withoutWrapper++;
        console.log(`  ⚠️ Button ${i + 1}: .mat-button-wrapper not found`);
      }
    }

    console.log(`\nSummary (first 10 buttons):`);
    console.log(`  With .mat-button-wrapper: ${withWrapper}`);
    console.log(`  Without .mat-button-wrapper: ${withoutWrapper}`);
    console.log(`  Wrapper not using flexbox: ${wrapperNotFlex}`);
  });
});
