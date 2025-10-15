import { test } from '@playwright/test';

test('Take full page screenshot of dashboard', async ({ page }) => {
  await page.goto('http://localhost:4200');
  await page.waitForLoadState('networkidle');

  // Navigate to dashboard
  await page.click('text=Dashboard');
  await page.waitForLoadState('networkidle');

  // Wait for map to load
  await page.waitForTimeout(3000);

  // Take full page screenshot
  await page.screenshot({
    path: 'dashboard-fullpage.png',
    fullPage: true
  });

  console.log('✓ Dashboard full page screenshot saved');
});
