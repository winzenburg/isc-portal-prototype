import { test, expect } from '@playwright/test';

test('Check actual text alignment inside input', async ({ page }) => {
  await page.goto('http://localhost:4200');
  await page.waitForLoadState('networkidle');

  const header = page.locator('.app-header');
  await header.screenshot({ path: 'header-closeup.png' });

  const searchInput = page.locator('.global-search input');

  // Get all computed styles
  const styles = await searchInput.evaluate((el) => {
    const computed = window.getComputedStyle(el);
    return {
      height: computed.height,
      lineHeight: computed.lineHeight,
      paddingTop: computed.paddingTop,
      paddingBottom: computed.paddingBottom,
      fontSize: computed.fontSize,
      verticalAlign: computed.verticalAlign,
      display: computed.display,
      alignItems: computed.alignItems,
    };
  });

  console.log('\n=== INPUT TEXT STYLES ===');
  console.log('Height:', styles.height);
  console.log('Line Height:', styles.lineHeight);
  console.log('Padding Top:', styles.paddingTop);
  console.log('Padding Bottom:', styles.paddingBottom);
  console.log('Font Size:', styles.fontSize);
  console.log('Vertical Align:', styles.verticalAlign);
  console.log('Display:', styles.display);
  console.log('Align Items:', styles.alignItems);

  // Check icon
  const icon = page.locator('.global-search mat-icon').first();
  const iconStyles = await icon.evaluate((el) => {
    const computed = window.getComputedStyle(el);
    return {
      height: computed.height,
      lineHeight: computed.lineHeight,
      paddingTop: computed.paddingTop,
      paddingBottom: computed.paddingBottom,
      fontSize: computed.fontSize,
      verticalAlign: computed.verticalAlign,
    };
  });

  console.log('\n=== ICON STYLES ===');
  console.log('Height:', iconStyles.height);
  console.log('Line Height:', iconStyles.lineHeight);
  console.log('Padding:', iconStyles.paddingTop, iconStyles.paddingBottom);
  console.log('Font Size:', iconStyles.fontSize);
  console.log('Vertical Align:', iconStyles.verticalAlign);
});
