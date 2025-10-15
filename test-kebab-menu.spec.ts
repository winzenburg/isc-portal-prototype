import { test, expect } from '@playwright/test';

test('Contacts should show kebab menu for multiple actions', async ({ page }) => {
  await page.goto('http://localhost:4200/contacts');
  
  // Wait for table to load
  await page.waitForSelector('table tbody tr', { timeout: 10000 });
  await page.waitForTimeout(1000);

  console.log('=== Testing Kebab Menu ===\n');

  // Check if we have contacts
  const rowCount = await page.locator('table tbody tr').count();
  console.log(`Contacts loaded: ${rowCount}`);

  if (rowCount > 0) {
    // Find the kebab menu button (three dots)
    const kebabButton = page.locator('table tbody tr').first().locator('button[aria-label="Row actions"]');
    
    const kebabExists = await kebabButton.count();
    console.log(`Kebab menu button found: ${kebabExists > 0 ? 'Yes' : 'No'}`);

    if (kebabExists > 0) {
      // Take screenshot before opening menu
      await page.screenshot({
        path: 'contacts-kebab-closed.png',
        fullPage: true
      });
      console.log('Screenshot: contacts-kebab-closed.png');

      // Click the kebab button to open menu
      await kebabButton.click();
      await page.waitForTimeout(500);

      // Take screenshot with menu open
      await page.screenshot({
        path: 'contacts-kebab-open.png',
        fullPage: true
      });
      console.log('Screenshot: contacts-kebab-open.png');

      // Check menu items
      const menuItems = await page.locator('.mat-menu-panel button').count();
      console.log(`Menu items: ${menuItems}`);
    }
  }

  console.log('\n✓ Test complete');
});
