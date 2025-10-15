import { test, expect } from '@playwright/test';

test('Verify ALL buttons show white text on hover', async ({ page }) => {
  console.log('\n========================================');
  console.log('TESTING LANDING PAGE BUTTONS');
  console.log('========================================\n');

  await page.goto('http://localhost:4200');
  await page.waitForLoadState('networkidle');

  // Test landing page issue card buttons
  const issueCards = page.locator('.issue-card');
  const firstCard = issueCards.first();
  const landingButton = firstCard.locator('.demo-button');

  await landingButton.hover();
  await page.waitForTimeout(300);

  const landingButtonWrapper = landingButton.locator('.mat-button-wrapper');
  const landingSpan = landingButtonWrapper.locator('span.md3-label-large');

  const landingStyles = await landingSpan.evaluate((el) => {
    const computed = window.getComputedStyle(el);
    return {
      color: computed.color,
      textContent: el.textContent?.trim(),
    };
  });

  console.log('Landing Page Button Hover:');
  console.log('  Text:', landingStyles.textContent);
  console.log('  Color:', landingStyles.color);
  console.log('  ✓ Expected: rgb(255, 255, 255)');
  console.log('  ✓ Result:', landingStyles.color === 'rgb(255, 255, 255)' ? 'PASS' : 'FAIL');

  // Take screenshot of landing page button on hover
  await firstCard.screenshot({ path: 'landing-button-hover-final.png' });

  console.log('\n========================================');
  console.log('TESTING DASHBOARD BUTTONS');
  console.log('========================================\n');

  // Navigate to dashboard
  await page.click('text=Dashboard');
  await page.waitForLoadState('networkidle');

  // Test dashboard quick action buttons
  const quickActions = page.locator('.quick-actions-grid button').first();
  await quickActions.hover();
  await page.waitForTimeout(300);

  const dashboardSpan = quickActions.locator('span');
  const dashboardStyles = await dashboardSpan.first().evaluate((el) => {
    const computed = window.getComputedStyle(el);
    return {
      color: computed.color,
      textContent: el.textContent?.trim(),
    };
  });

  console.log('Dashboard Button Hover:');
  console.log('  Text:', dashboardStyles.textContent);
  console.log('  Color:', dashboardStyles.color);
  console.log('  ✓ Expected: rgb(255, 255, 255)');
  console.log('  ✓ Result:', dashboardStyles.color === 'rgb(255, 255, 255)' ? 'PASS' : 'FAIL');

  // Take screenshot of dashboard
  const dashboard = page.locator('.dashboard-container');
  await dashboard.screenshot({ path: 'dashboard-buttons-hover-final.png' });

  console.log('\n========================================');
  console.log('FINAL RESULTS');
  console.log('========================================\n');

  const allPassed =
    landingStyles.color === 'rgb(255, 255, 255)' &&
    dashboardStyles.color === 'rgb(255, 255, 255)';

  if (allPassed) {
    console.log('✓✓✓ ALL BUTTONS PASS - WHITE TEXT ON HOVER ✓✓✓\n');
  } else {
    console.log('✗✗✗ SOME BUTTONS FAIL - BLACK TEXT DETECTED ✗✗✗\n');
  }

  expect(allPassed).toBe(true);
});
