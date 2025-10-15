import { test, expect } from '@playwright/test';

test('test edit icon on hover', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1200 });
  await page.goto('http://localhost:4200/clouds', { waitUntil: 'networkidle' });

  // Wait for data to load
  await page.waitForSelector('text=MS079631', { timeout: 10000 });
  await page.waitForTimeout(1000);

  // Hover over a row
  const firstRow = page.locator('tr[mat-row]').first();
  await firstRow.hover();
  await page.waitForTimeout(500);

  // Take screenshot with hover state
  await page.screenshot({ path: 'clouds-page-hover.png' });

  // Check if edit icon is visible
  const editIcon = page.locator('.edit-icon').first();
  const isVisible = await editIcon.isVisible();
  console.log('Edit icon visible on hover:', isVisible);
});
