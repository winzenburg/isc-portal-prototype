import { test, expect } from '@playwright/test';

test('Check for hidden positioning properties', async ({ page }) => {
  await page.goto('http://localhost:4200');
  await page.waitForLoadState('networkidle');

  const formField = page.locator('.global-search');
  const infix = formField.locator('.mat-form-field-infix');
  const prefix = formField.locator('.mat-form-field-prefix');
  const input = formField.locator('input');
  const icon = prefix.locator('mat-icon');

  console.log('\n=== INFIX CONTAINER ===');
  const infixStyles = await infix.evaluate((el) => {
    const computed = window.getComputedStyle(el);
    return {
      position: computed.position,
      top: computed.top,
      bottom: computed.bottom,
      transform: computed.transform,
      display: computed.display,
      flexDirection: computed.flexDirection,
      alignItems: computed.alignItems,
      justifyContent: computed.justifyContent,
    };
  });
  console.log(infixStyles);

  console.log('\n=== PREFIX CONTAINER ===');
  const prefixStyles = await prefix.evaluate((el) => {
    const computed = window.getComputedStyle(el);
    return {
      position: computed.position,
      top: computed.top,
      bottom: computed.bottom,
      transform: computed.transform,
      alignSelf: computed.alignSelf,
      margin: computed.margin,
      marginTop: computed.marginTop,
      marginBottom: computed.marginBottom,
    };
  });
  console.log(prefixStyles);

  console.log('\n=== INPUT ELEMENT ===');
  const inputStyles = await input.evaluate((el) => {
    const computed = window.getComputedStyle(el);
    return {
      position: computed.position,
      top: computed.top,
      bottom: computed.bottom,
      transform: computed.transform,
      alignSelf: computed.alignSelf,
      margin: computed.margin,
      marginTop: computed.marginTop,
      marginBottom: computed.marginBottom,
    };
  });
  console.log(inputStyles);

  console.log('\n=== ICON ===');
  const iconStyles = await icon.evaluate((el) => {
    const computed = window.getComputedStyle(el);
    return {
      position: computed.position,
      top: computed.top,
      bottom: computed.bottom,
      transform: computed.transform,
      alignSelf: computed.alignSelf,
      margin: computed.margin,
      marginTop: computed.marginTop,
      marginBottom: computed.marginBottom,
    };
  });
  console.log(iconStyles);

  // Take a zoomed-in screenshot
  await formField.screenshot({ path: 'input-alignment-visual.png' });
});
