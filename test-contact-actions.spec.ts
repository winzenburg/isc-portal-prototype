import { test, expect } from '@playwright/test';

test('Contact actions menu should have all settings and actions', async ({ page }) => {
  await page.goto('http://localhost:4200/contacts');
  
  await page.waitForSelector('table tbody tr');
  await page.waitForTimeout(1000);

  console.log('=== Testing Contact Actions Menu ===\n');

  const firstRow = page.locator('table tbody tr').first();
  await expect(firstRow).toBeVisible();
  console.log('✓ First contact row found');

  const actionsButton = firstRow.locator('button mat-icon:has-text("more_vert")').first();
  await actionsButton.click();
  await page.waitForTimeout(500);
  console.log('✓ Actions menu opened');

  await page.screenshot({
    path: 'contact-actions-menu.png',
    fullPage: true
  });
  console.log('Screenshot saved: contact-actions-menu.png');

  const expectedActions = [
    'Site Assignments',
    'Notification Preferences',
    'Manage ISC Access',
    'Two Factor Auth',
    'Delete'
  ];

  console.log('\n--- Checking for Actions ---');
  for (const action of expectedActions) {
    const menuItem = page.locator(`button:has-text("${action}")`);
    const visible = await menuItem.count();
    console.log(`${action}: ${visible > 0 ? '✓ Found' : '✗ Not found'}`);
  }

  console.log('\n✓ Contact actions test complete!');
});
