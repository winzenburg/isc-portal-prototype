import { test } from '@playwright/test';

test('Verify pagination underline fix', async ({ page }) => {
  await page.goto('http://localhost:4200/contacts', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(2000);

  console.log('\n=== Testing Pagination Underline Fix ===\n');

  // Check if the underline is hidden
  const underlineInfo = await page.locator('mat-paginator').evaluate(() => {
    const underline = document.querySelector('.mat-paginator-page-size-select .mat-form-field-underline');
    const wrapper = document.querySelector('.mat-paginator-page-size-select .mat-form-field-wrapper');
    const infix = document.querySelector('.mat-paginator-page-size-select .mat-form-field-infix');
    const subscript = document.querySelector('.mat-paginator-page-size-select .mat-form-field-subscript-wrapper');

    return {
      underlineExists: !!underline,
      underlineDisplay: underline ? window.getComputedStyle(underline).display : 'N/A',
      wrapperPaddingBottom: wrapper ? window.getComputedStyle(wrapper).paddingBottom : 'N/A',
      infixPaddingBottom: infix ? window.getComputedStyle(infix).paddingBottom : 'N/A',
      infixBorderTop: infix ? window.getComputedStyle(infix).borderTop : 'N/A',
      subscriptDisplay: subscript ? window.getComputedStyle(subscript).display : 'N/A'
    };
  });

  console.log('--- CSS Fix Verification ---');
  console.log(`Underline element exists: ${underlineInfo.underlineExists}`);
  console.log(`Underline display property: ${underlineInfo.underlineDisplay}`);
  console.log(`Wrapper padding-bottom: ${underlineInfo.wrapperPaddingBottom}`);
  console.log(`Infix padding-bottom: ${underlineInfo.infixPaddingBottom}`);
  console.log(`Infix border-top: ${underlineInfo.infixBorderTop}`);
  console.log(`Subscript display: ${underlineInfo.subscriptDisplay}`);

  console.log('\n--- Expected Values ---');
  console.log(`Underline display should be: "none"`);
  console.log(`Wrapper padding-bottom should be: "0px"`);
  console.log(`Infix padding-bottom should be: "0px"`);
  console.log(`Subscript display should be: "none"`);

  console.log('\n--- Status ---');
  const isFixed =
    underlineInfo.underlineDisplay === 'none' &&
    underlineInfo.wrapperPaddingBottom === '0px' &&
    underlineInfo.infixPaddingBottom === '0px' &&
    underlineInfo.subscriptDisplay === 'none';

  console.log(isFixed ? '✅ FIX APPLIED SUCCESSFULLY!' : '❌ Fix not fully applied');

  // Take before and after screenshots
  await page.locator('mat-paginator').screenshot({
    path: 'pagination-after-fix.png'
  });
  console.log('\n✓ Screenshot saved: pagination-after-fix.png');

  console.log('\n=== Test Complete ===');
});
