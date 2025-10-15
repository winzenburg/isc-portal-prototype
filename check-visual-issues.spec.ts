import { test, expect } from '@playwright/test';

test.describe('Visual Inspection of Button Issues', () => {

  test('Capture button hover states and measure contrast', async ({ page }) => {
    await page.goto('http://localhost:4200');
    await page.waitForLoadState('networkidle');

    console.log(`\n=== BUTTON HOVER STATE CONTRAST ANALYSIS ===`);

    // Find first Quick Win card with raised button
    const raisedButton = page.locator('button.mat-raised-button.demo-button').first();
    await raisedButton.scrollIntoViewIfNeeded();

    // Take screenshot of normal state
    await page.screenshot({ path: 'button-raised-normal.png' });

    // Get button colors in normal state
    const normalColors = await raisedButton.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color,
      };
    });
    console.log(`\nRaised Button - Normal State:`);
    console.log(`  Background: ${normalColors.backgroundColor}`);
    console.log(`  Text Color: ${normalColors.color}`);

    // Hover and capture
    await raisedButton.hover();
    await page.waitForTimeout(300); // Wait for transition
    await page.screenshot({ path: 'button-raised-hover.png' });

    const hoverColors = await raisedButton.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color,
      };
    });
    console.log(`\nRaised Button - Hover State:`);
    console.log(`  Background: ${hoverColors.backgroundColor}`);
    console.log(`  Text Color: ${hoverColors.color}`);

    // Move away
    await page.mouse.move(0, 0);
    await page.waitForTimeout(300);

    // Find first stroked button
    const strokedButton = page.locator('button.mat-stroked-button.demo-button').first();
    await strokedButton.scrollIntoViewIfNeeded();

    // Take screenshot of normal state
    await page.screenshot({ path: 'button-stroked-normal.png' });

    const strokedNormalColors = await strokedButton.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color,
        borderColor: computed.borderColor,
      };
    });
    console.log(`\nStroked Button - Normal State:`);
    console.log(`  Background: ${strokedNormalColors.backgroundColor}`);
    console.log(`  Text Color: ${strokedNormalColors.color}`);
    console.log(`  Border Color: ${strokedNormalColors.borderColor}`);

    // Hover and capture
    await strokedButton.hover();
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'button-stroked-hover.png' });

    const strokedHoverColors = await strokedButton.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color,
        borderColor: computed.borderColor,
      };
    });
    console.log(`\nStroked Button - Hover State:`);
    console.log(`  Background: ${strokedHoverColors.backgroundColor}`);
    console.log(`  Text Color: ${strokedHoverColors.color}`);
    console.log(`  Border Color: ${strokedHoverColors.borderColor}`);
  });

  test('Check if buttons overflow their card containers', async ({ page }) => {
    await page.goto('http://localhost:4200');
    await page.waitForLoadState('networkidle');

    console.log(`\n=== BUTTON OVERFLOW FROM CARD ANALYSIS ===`);

    // Find all issue cards
    const cards = page.locator('.issue-card');
    const cardCount = await cards.count();

    console.log(`\nFound ${cardCount} issue cards`);

    for (let i = 0; i < Math.min(cardCount, 5); i++) {
      const card = cards.nth(i);
      const cardBox = await card.boundingBox();

      const button = card.locator('button.demo-button');
      const buttonBox = await button.boundingBox();

      if (cardBox && buttonBox) {
        console.log(`\nCard ${i + 1}:`);
        console.log(`  Card: ${cardBox.width}×${cardBox.height}px at (${cardBox.x}, ${cardBox.y})`);
        console.log(`  Button: ${buttonBox.width}×${buttonBox.height}px at (${buttonBox.x}, ${buttonBox.y})`);

        // Check if button extends past card's right edge
        const cardRight = cardBox.x + cardBox.width;
        const buttonRight = buttonBox.x + buttonBox.width;

        if (buttonRight > cardRight) {
          console.log(`  ⚠️ OVERFLOW: Button extends ${(buttonRight - cardRight).toFixed(1)}px past card right edge`);
        } else {
          console.log(`  ✓ No overflow: ${(cardRight - buttonRight).toFixed(1)}px clearance`);
        }

        // Check if button extends past card's bottom edge
        const cardBottom = cardBox.y + cardBox.height;
        const buttonBottom = buttonBox.y + buttonBox.height;

        if (buttonBottom > cardBottom) {
          console.log(`  ⚠️ OVERFLOW: Button extends ${(buttonBottom - cardBottom).toFixed(1)}px past card bottom edge`);
        }

        // Scroll to this card and take screenshot
        await card.scrollIntoViewIfNeeded();
        await page.screenshot({ path: `card-${i + 1}-button-overflow.png` });
      }
    }

    // Take full page screenshot
    await page.screenshot({ path: 'full-page-buttons.png', fullPage: true });
  });

  test('Measure actual contrast ratios', async ({ page }) => {
    await page.goto('http://localhost:4200');
    await page.waitForLoadState('networkidle');

    console.log(`\n=== WCAG CONTRAST RATIO CALCULATION ===`);

    // Helper function to parse RGB and calculate relative luminance
    const calculateContrastRatio = (rgb1: string, rgb2: string): number => {
      const getRGB = (str: string) => {
        const match = str.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (!match) return [0, 0, 0];
        return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
      };

      const getLuminance = (r: number, g: number, b: number) => {
        const [rs, gs, bs] = [r, g, b].map(c => {
          c = c / 255;
          return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
      };

      const [r1, g1, b1] = getRGB(rgb1);
      const [r2, g2, b2] = getRGB(rgb2);

      const l1 = getLuminance(r1, g1, b1);
      const l2 = getLuminance(r2, g2, b2);

      const lighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);

      return (lighter + 0.05) / (darker + 0.05);
    };

    // Test raised button hover
    const raisedButton = page.locator('button.mat-raised-button.demo-button').first();
    await raisedButton.hover();
    await page.waitForTimeout(300);

    const raisedHoverColors = await raisedButton.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color,
      };
    });

    const raisedContrastRatio = calculateContrastRatio(
      raisedHoverColors.backgroundColor,
      raisedHoverColors.color
    );

    console.log(`\nRaised Button Hover:`);
    console.log(`  Background: ${raisedHoverColors.backgroundColor}`);
    console.log(`  Text: ${raisedHoverColors.color}`);
    console.log(`  Contrast Ratio: ${raisedContrastRatio.toFixed(2)}:1`);
    console.log(`  WCAG AA (Normal): ${raisedContrastRatio >= 4.5 ? '✓ PASS' : '✗ FAIL (need 4.5:1)'}`);
    console.log(`  WCAG AA (Large): ${raisedContrastRatio >= 3.0 ? '✓ PASS' : '✗ FAIL (need 3:1)'}`);

    // Test stroked button hover
    await page.mouse.move(0, 0);
    await page.waitForTimeout(300);

    const strokedButton = page.locator('button.mat-stroked-button.demo-button').first();
    await strokedButton.hover();
    await page.waitForTimeout(300);

    const strokedHoverColors = await strokedButton.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        backgroundColor: computed.backgroundColor,
        color: computed.color,
      };
    });

    const strokedContrastRatio = calculateContrastRatio(
      strokedHoverColors.backgroundColor,
      strokedHoverColors.color
    );

    console.log(`\nStroked Button Hover:`);
    console.log(`  Background: ${strokedHoverColors.backgroundColor}`);
    console.log(`  Text: ${strokedHoverColors.color}`);
    console.log(`  Contrast Ratio: ${strokedContrastRatio.toFixed(2)}:1`);
    console.log(`  WCAG AA (Normal): ${strokedContrastRatio >= 4.5 ? '✓ PASS' : '✗ FAIL (need 4.5:1)'}`);
    console.log(`  WCAG AA (Large): ${strokedContrastRatio >= 3.0 ? '✓ PASS' : '✗ FAIL (need 3:1)'}`);
  });
});
