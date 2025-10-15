import { test, expect } from '@playwright/test';

test('debug pagination issue', async ({ page, context }) => {
  // Clear cache
  await context.clearCookies();
  
  await page.setViewportSize({ width: 1440, height: 1200 });
  await page.goto('http://localhost:4200/clouds', { waitUntil: 'networkidle' });
  
  // Hard reload
  await page.reload({ waitUntil: 'networkidle' });
  
  // Wait for data
  await page.waitForSelector('text=CLD-001', { timeout: 10000 });
  await page.waitForTimeout(1000);
  
  // Count table rows
  const rows = await page.locator('mat-row, tr[mat-row]').count();
  console.log('Number of table rows:', rows);
  
  // Check dataSource
  const tableText = await page.locator('.base-table-container').textContent();
  console.log('Has data in table:', tableText?.includes('CLD-001'));
  
  // Get paginator text
  const paginatorText = await page.locator('mat-paginator').textContent();
  console.log('Paginator says:', paginatorText);
  
  await page.screenshot({ path: 'debug-pagination.png' });
});
