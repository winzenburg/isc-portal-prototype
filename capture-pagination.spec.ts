import { test } from '@playwright/test';

test('capture pagination area', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1200 });
  await page.goto('http://localhost:4200/clouds');
  await page.waitForTimeout(2000);
  
  // Take full screenshot
  await page.screenshot({ path: 'clouds-viewport-full.png' });
  
  // Try to find and screenshot the paginator
  const paginator = page.locator('mat-paginator').first();
  if (await paginator.isVisible()) {
    await paginator.screenshot({ path: 'paginator-only.png' });
  }
});
