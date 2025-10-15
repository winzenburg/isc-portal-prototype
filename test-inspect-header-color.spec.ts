import { test, expect } from '@playwright/test';

test('inspect header background color', async ({ page }) => {
  await page.goto('http://localhost:4200/sd-wan-orchestrator');
  await page.waitForSelector('.app-header');

  // Get the computed background color of the header
  const headerBgColor = await page.evaluate(() => {
    const header = document.querySelector('.app-header');
    if (!header) return 'Header not found';
    const styles = window.getComputedStyle(header);
    return styles.backgroundColor;
  });

  console.log('Header background color:', headerBgColor);

  // Get the computed color of the primary button
  const buttonBgColor = await page.evaluate(() => {
    const button = document.querySelector('button[color="primary"]');
    if (!button) return 'Primary button not found';
    const styles = window.getComputedStyle(button);
    return styles.backgroundColor;
  });

  console.log('Primary button background color:', buttonBgColor);

  // Take a screenshot
  await page.screenshot({
    path: 'inspect-colors.png',
    fullPage: true
  });

  // Log expected vs actual
  console.log('\n=== Color Inspection ===');
  console.log('Expected header color: rgb(16, 47, 101) or #102F65');
  console.log('Actual header color:', headerBgColor);
  console.log('\nExpected button color: rgb(13, 98, 255) or #0D62FF');
  console.log('Actual button color:', buttonBgColor);

  // Check if colors match expected values
  const expectedHeaderRgb = 'rgb(16, 47, 101)';
  const expectedButtonRgb = 'rgb(13, 98, 255)';

  if (headerBgColor === expectedHeaderRgb) {
    console.log('\n✓ Header color is correct!');
  } else {
    console.log('\n✗ Header color does not match expected value');
  }

  if (buttonBgColor === expectedButtonRgb) {
    console.log('✓ Button color is correct!');
  } else {
    console.log('✗ Button color does not match expected value');
  }
});
