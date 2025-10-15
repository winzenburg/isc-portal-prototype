import { test, expect } from '@playwright/test';

test('Contacts page should have select all checkbox for bulk deletion', async ({ page }) => {
  await page.goto('http://localhost:4200/contacts-unified');

  // Wait for page to load
  await page.waitForSelector('app-base-table');
  await page.waitForSelector('table tbody tr');
  await page.waitForTimeout(1000);

  console.log('=== Testing Select All Checkbox and Bulk Delete ===\n');

  // Verify the select all checkbox exists in the header
  const selectAllCheckbox = page.locator('th.selection-column mat-checkbox');
  await expect(selectAllCheckbox).toBeVisible();
  console.log('✓ Select all checkbox found in table header');

  // Count total contacts
  const totalRows = await page.locator('table tbody tr').count();
  console.log(`Total contacts: ${totalRows}`);

  // Click the select all checkbox
  console.log('\nClicking "Select All" checkbox...');
  await selectAllCheckbox.click();
  await page.waitForTimeout(500);

  // Verify all row checkboxes are checked
  const checkedRows = await page.locator('table tbody tr td.selection-column mat-checkbox input[aria-checked="true"]').count();
  console.log(`Rows selected: ${checkedRows}`);
  expect(checkedRows).toBe(totalRows);

  // Verify bulk action button appears
  const bulkDeleteButton = page.locator('button:has-text("Delete Selected")');
  await expect(bulkDeleteButton).toBeVisible();
  console.log('✓ "Delete Selected" button is visible');

  // Click the bulk delete button
  console.log('\nClicking "Delete Selected" button...');
  await bulkDeleteButton.click();
  await page.waitForTimeout(500);

  // Verify confirmation dialog appears
  const dialog = page.locator('mat-dialog-container');
  await expect(dialog).toBeVisible();
  console.log('✓ Confirmation dialog appeared');

  // Verify dialog title
  const dialogTitle = await page.locator('h2[mat-dialog-title]').textContent();
  console.log(`Dialog title: "${dialogTitle}"`);
  expect(dialogTitle).toContain('Delete Contacts');

  // Verify dialog message mentions the count
  const dialogMessage = await page.locator('mat-dialog-content p').textContent();
  console.log(`Dialog message: "${dialogMessage}"`);
  expect(dialogMessage).toContain(`${totalRows} contact`);

  // Take screenshot of confirmation dialog
  await page.screenshot({ path: 'bulk-delete-confirmation.png', fullPage: true });
  console.log('Screenshot saved: bulk-delete-confirmation.png');

  // Click Cancel button
  console.log('\nClicking Cancel button...');
  const cancelButton = page.locator('mat-dialog-actions button:has-text("Cancel")');
  await cancelButton.click();
  await page.waitForTimeout(500);

  // Verify dialog is closed
  const dialogClosed = await dialog.isVisible().catch(() => false);
  console.log(`Dialog closed: ${!dialogClosed}`);
  expect(dialogClosed).toBe(false);

  // Verify contacts are still there
  const remainingRows = await page.locator('table tbody tr').count();
  console.log(`Contacts remaining: ${remainingRows}`);
  expect(remainingRows).toBe(totalRows);

  console.log('\nTest 2: Select individual contacts and delete');

  // Uncheck select all first
  await selectAllCheckbox.click();
  await page.waitForTimeout(300);

  // Select first 2 contacts
  const firstCheckbox = page.locator('table tbody tr').nth(0).locator('td.selection-column mat-checkbox');
  const secondCheckbox = page.locator('table tbody tr').nth(1).locator('td.selection-column mat-checkbox');

  await firstCheckbox.click();
  await page.waitForTimeout(200);
  await secondCheckbox.click();
  await page.waitForTimeout(500);

  // Verify select all is indeterminate (some but not all selected)
  const selectAllIndeterminate = await selectAllCheckbox.evaluate((el: any) => {
    const input = el.querySelector('input');
    return input?.indeterminate || false;
  });
  console.log(`Select all checkbox is indeterminate: ${selectAllIndeterminate}`);
  expect(selectAllIndeterminate).toBe(true);

  // Click bulk delete
  await bulkDeleteButton.click();
  await page.waitForTimeout(500);

  // Verify dialog shows 2 contacts
  const dialogMessage2 = await page.locator('mat-dialog-content p').textContent();
  console.log(`Dialog message for 2 contacts: "${dialogMessage2}"`);
  expect(dialogMessage2).toContain('2 contact');

  // Click Delete All button to confirm
  console.log('\nClicking "Delete All" button...');
  const deleteButton = page.locator('mat-dialog-actions button:has-text("Delete All")');
  await deleteButton.click();
  await page.waitForTimeout(1000);

  // Verify contacts were deleted
  const finalRows = await page.locator('table tbody tr').count();
  console.log(`Final contact count: ${finalRows}`);
  expect(finalRows).toBe(totalRows - 2);

  // Take final screenshot
  await page.screenshot({ path: 'after-bulk-delete.png', fullPage: true });
  console.log('Screenshot saved: after-bulk-delete.png');

  console.log('\n✓ All bulk delete tests passed!');
});

test('Select all checkbox should toggle all rows', async ({ page }) => {
  await page.goto('http://localhost:4200/contacts-unified');
  await page.waitForSelector('table tbody tr');
  await page.waitForTimeout(1000);

  console.log('=== Testing Select All Toggle Behavior ===\n');

  const selectAllCheckbox = page.locator('th.selection-column mat-checkbox');
  const totalRows = await page.locator('table tbody tr').count();

  // Initially, no rows should be selected
  let checkedRows = await page.locator('table tbody tr td.selection-column mat-checkbox input[aria-checked="true"]').count();
  console.log(`Initial selected rows: ${checkedRows}`);
  expect(checkedRows).toBe(0);

  // Click select all - should select all rows
  console.log('Clicking select all...');
  await selectAllCheckbox.click();
  await page.waitForTimeout(500);

  checkedRows = await page.locator('table tbody tr td.selection-column mat-checkbox input[aria-checked="true"]').count();
  console.log(`After select all: ${checkedRows}`);
  expect(checkedRows).toBe(totalRows);

  // Click select all again - should deselect all rows
  console.log('Clicking select all again (to deselect)...');
  await selectAllCheckbox.click();
  await page.waitForTimeout(500);

  checkedRows = await page.locator('table tbody tr td.selection-column mat-checkbox input[aria-checked="true"]').count();
  console.log(`After deselect all: ${checkedRows}`);
  expect(checkedRows).toBe(0);

  console.log('\n✓ Select all toggle tests passed!');
});
