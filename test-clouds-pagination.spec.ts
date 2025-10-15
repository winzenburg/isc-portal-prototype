import { test, expect } from '@playwright/test';

test('verify clouds pagination', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1200 });
  await page.goto('http://localhost:4200/clouds', { waitUntil: 'networkidle' });

  // Wait for data to load
  await page.waitForSelector('text=MS079631', { timeout: 10000 });
  await page.waitForTimeout(1000);

  // Count visible rows (should be 10)
  const visibleRows = await page.locator('tr[mat-row]').count();
  console.log('Visible rows on page:', visibleRows);

  // Check paginator text
  const paginatorText = await page.locator('mat-paginator .mat-mdc-paginator-range-label').textContent();
  console.log('Paginator text:', paginatorText);

  // Take full page screenshot
  await page.screenshot({ path: 'clouds-pagination-test.png', fullPage: true });
});
