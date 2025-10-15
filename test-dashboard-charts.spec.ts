import { test } from '@playwright/test';

test('Take screenshot of dashboard with charts', async ({ page }) => {
  await page.goto('http://localhost:4200');
  await page.waitForLoadState('networkidle');

  // Navigate to dashboard
  await page.click('text=Dashboard');
  await page.waitForLoadState('networkidle');

  // Wait for charts to render
  await page.waitForTimeout(2000);

  // Take full dashboard screenshot
  await page.screenshot({ path: 'dashboard-with-charts.png', fullPage: true });

  console.log('✓ Dashboard screenshot saved: dashboard-with-charts.png');
});
