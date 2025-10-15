import { test, expect } from '@playwright/test';

test('Debug input field text and icon alignment in detail', async ({ page }) => {
  await page.goto('http://localhost:4200');
  await page.waitForLoadState('networkidle');

  // Take full header screenshot
  const header = page.locator('.app-header');
  await header.screenshot({ path: 'header-full-view.png' });

  console.log('\n========================================');
  console.log('ANALYZING SEARCH INPUT FIELD');
  console.log('========================================\n');

  // Get the search input container (.global-search IS the mat-form-field)
  const formField = page.locator('.global-search');
  await formField.screenshot({ path: 'search-input-closeup.png' });

  const formFieldBox = await formField.boundingBox();

  console.log('Mat Form Field:');
  console.log('  Height:', formFieldBox?.height);
  console.log('  Width:', formFieldBox?.width);

  // Get the infix (where input and icon live)
  const infix = formField.locator('.mat-form-field-infix');
  const infixBox = await infix.boundingBox();
  const infixStyles = await infix.evaluate((el) => {
    const computed = window.getComputedStyle(el);
    return {
      height: computed.height,
      minHeight: computed.minHeight,
      display: computed.display,
      alignItems: computed.alignItems,
      paddingTop: computed.paddingTop,
      paddingBottom: computed.paddingBottom,
      borderTop: computed.borderTop,
    };
  });

  console.log('\nMat Form Field Infix:');
  console.log('  Actual Height:', infixBox?.height);
  console.log('  CSS Height:', infixStyles.height);
  console.log('  Min Height:', infixStyles.minHeight);
  console.log('  Display:', infixStyles.display);
  console.log('  Align Items:', infixStyles.alignItems);
  console.log('  Padding Top:', infixStyles.paddingTop);
  console.log('  Padding Bottom:', infixStyles.paddingBottom);
  console.log('  Border Top:', infixStyles.borderTop);

  // Get the actual input element
  const input = formField.locator('input');
  const inputBox = await input.boundingBox();
  const inputStyles = await input.evaluate((el) => {
    const computed = window.getComputedStyle(el);
    return {
      height: computed.height,
      lineHeight: computed.lineHeight,
      paddingTop: computed.paddingTop,
      paddingBottom: computed.paddingBottom,
      marginTop: computed.marginTop,
      marginBottom: computed.marginBottom,
      display: computed.display,
      alignItems: computed.alignItems,
      verticalAlign: computed.verticalAlign,
      fontSize: computed.fontSize,
      border: computed.border,
    };
  });

  console.log('\nInput Element:');
  console.log('  Actual Height:', inputBox?.height);
  console.log('  Actual Y Position:', inputBox?.y);
  console.log('  CSS Height:', inputStyles.height);
  console.log('  Line Height:', inputStyles.lineHeight);
  console.log('  Padding Top:', inputStyles.paddingTop);
  console.log('  Padding Bottom:', inputStyles.paddingBottom);
  console.log('  Margin Top:', inputStyles.marginTop);
  console.log('  Margin Bottom:', inputStyles.marginBottom);
  console.log('  Display:', inputStyles.display);
  console.log('  Align Items:', inputStyles.alignItems);
  console.log('  Vertical Align:', inputStyles.verticalAlign);
  console.log('  Font Size:', inputStyles.fontSize);
  console.log('  Border:', inputStyles.border);

  // Get the prefix (search icon)
  const prefix = formField.locator('.mat-form-field-prefix');
  const prefixBox = await prefix.boundingBox();
  const prefixStyles = await prefix.evaluate((el) => {
    const computed = window.getComputedStyle(el);
    return {
      height: computed.height,
      display: computed.display,
      alignItems: computed.alignItems,
      paddingTop: computed.paddingTop,
      paddingBottom: computed.paddingBottom,
    };
  });

  console.log('\nPrefix Container (icon wrapper):');
  console.log('  Actual Height:', prefixBox?.height);
  console.log('  Actual Y Position:', prefixBox?.y);
  console.log('  CSS Height:', prefixStyles.height);
  console.log('  Display:', prefixStyles.display);
  console.log('  Align Items:', prefixStyles.alignItems);
  console.log('  Padding Top:', prefixStyles.paddingTop);
  console.log('  Padding Bottom:', prefixStyles.paddingBottom);

  // Get the actual icon
  const icon = prefix.locator('mat-icon');
  const iconBox = await icon.boundingBox();
  const iconStyles = await icon.evaluate((el) => {
    const computed = window.getComputedStyle(el);
    return {
      height: computed.height,
      width: computed.width,
      fontSize: computed.fontSize,
      lineHeight: computed.lineHeight,
      display: computed.display,
      alignItems: computed.alignItems,
      verticalAlign: computed.verticalAlign,
    };
  });

  console.log('\nMat Icon:');
  console.log('  Actual Height:', iconBox?.height);
  console.log('  Actual Y Position:', iconBox?.y);
  console.log('  CSS Height:', iconStyles.height);
  console.log('  CSS Width:', iconStyles.width);
  console.log('  Font Size:', iconStyles.fontSize);
  console.log('  Line Height:', iconStyles.lineHeight);
  console.log('  Display:', iconStyles.display);
  console.log('  Align Items:', iconStyles.alignItems);
  console.log('  Vertical Align:', iconStyles.verticalAlign);

  // Calculate alignment
  console.log('\n========================================');
  console.log('ALIGNMENT ANALYSIS');
  console.log('========================================\n');

  const infixY = infixBox?.y || 0;
  const infixHeight = infixBox?.height || 0;
  const infixCenter = infixY + (infixHeight / 2);

  const inputY = inputBox?.y || 0;
  const inputHeight = inputBox?.height || 0;
  const inputCenter = inputY + (inputHeight / 2);

  const iconY = iconBox?.y || 0;
  const iconHeight = iconBox?.height || 0;
  const iconCenter = iconY + (iconHeight / 2);

  console.log('Container Center Y:', infixCenter.toFixed(2));
  console.log('Input Center Y:', inputCenter.toFixed(2));
  console.log('Icon Center Y:', iconCenter.toFixed(2));
  console.log('\nOffset from container center:');
  console.log('  Input:', (inputCenter - infixCenter).toFixed(2), 'px');
  console.log('  Icon:', (iconCenter - infixCenter).toFixed(2), 'px');

  const isAligned = Math.abs(inputCenter - iconCenter) < 2;
  console.log('\nInput and Icon Aligned:', isAligned ? '✓ YES' : '✗ NO');
  console.log('Pixel Difference:', Math.abs(inputCenter - iconCenter).toFixed(2), 'px');

  if (!isAligned) {
    console.log('\n⚠️ MISALIGNMENT DETECTED');
    if (inputCenter < iconCenter) {
      console.log('Input is', (iconCenter - inputCenter).toFixed(2), 'px ABOVE icon');
    } else {
      console.log('Input is', (inputCenter - iconCenter).toFixed(2), 'px BELOW icon');
    }
  } else {
    console.log('\n✓ ALIGNMENT IS CORRECT');
  }
});
