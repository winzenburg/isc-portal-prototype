import { test, expect } from '@playwright/test';

test('capture updated clouds page', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1200 });
  await page.goto('http://localhost:4200/clouds', { waitUntil: 'networkidle' });

  // Wait for data to load
  await page.waitForSelector('text=MS079631', { timeout: 10000 });
  await page.waitForTimeout(1000);

  // Take screenshot
  await page.screenshot({ path: 'clouds-page-updated.png', fullPage: true });

  // Check if custom cells are rendered
  const linkCell = await page.locator('.table-link').first();
  const hasLinkCell = await linkCell.count() > 0;
  console.log('Has link cells:', hasLinkCell);

  const editableCell = await page.locator('.editable-value').first();
  const hasEditableCell = await editableCell.count() > 0;
  console.log('Has editable cells:', hasEditableCell);

  // Check data
  const rowCount = await page.locator('mat-row, tr[mat-row]').count();
  console.log('Number of rows:', rowCount);
});
