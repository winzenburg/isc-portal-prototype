import { test } from '@playwright/test';

test('capture pagination', async ({ page }) => {
  await page.goto('http://localhost:4200/clouds');
  await page.waitForTimeout(2000); // Wait for data to load
  await page.screenshot({ path: 'clouds-full-page.png', fullPage: true });
});
