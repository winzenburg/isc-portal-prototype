import { test } from '@playwright/test';

test('Inspect pagination DOM structure and styles', async ({ page }) => {
  await page.goto('http://localhost:4200/contacts', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(2000);

  console.log('\n=== Pagination DOM & Style Analysis ===\n');

  // Get the full HTML structure of the paginator
  const paginatorHTML = await page.locator('mat-paginator').innerHTML();
  console.log('Paginator HTML structure (first 500 chars):');
  console.log(paginatorHTML.substring(0, 500));
  console.log('...\n');

  // Find all form fields in the paginator
  const formFields = await page.locator('mat-paginator mat-form-field').count();
  console.log(`Mat-form-field elements in paginator: ${formFields}`);

  // Get all class names in the paginator
  const classes = await page.locator('mat-paginator').evaluate((el) => {
    const allElements = el.querySelectorAll('*');
    const classSet = new Set();
    allElements.forEach(elem => {
      elem.classList.forEach(cls => classSet.add(cls));
    });
    return Array.from(classSet).sort();
  });

  console.log('\nAll CSS classes found in paginator:');
  console.log(classes.filter(c => c.includes('page-size') || c.includes('select')).join(', '));

  // Look for the page size select specifically
  const pageSizeInfo = await page.locator('mat-paginator').evaluate((paginator) => {
    // Try different selectors
    const selectors = [
      '.mat-mdc-paginator-page-size-select',
      '.mat-paginator-page-size-select',
      'mat-form-field',
      '.mat-form-field',
      '.mat-mdc-form-field'
    ];

    const results = {};
    selectors.forEach(sel => {
      const elem = paginator.querySelector(sel);
      results[sel] = {
        found: !!elem,
        classes: elem ? Array.from(elem.classList) : []
      };
    });

    // Also check for line ripple
    const lineRipple = paginator.querySelector('.mdc-line-ripple');
    results.lineRipple = {
      found: !!lineRipple,
      display: lineRipple ? window.getComputedStyle(lineRipple).display : 'N/A',
      height: lineRipple ? window.getComputedStyle(lineRipple).height : 'N/A'
    };

    return results;
  });

  console.log('\n--- Selector Search Results ---');
  Object.entries(pageSizeInfo).forEach(([selector, info]) => {
    if (selector !== 'lineRipple') {
      console.log(`${selector}: ${info.found ? 'FOUND' : 'NOT FOUND'}`);
      if (info.found && info.classes.length > 0) {
        console.log(`  Classes: ${info.classes.join(', ')}`);
      }
    }
  });

  console.log('\n--- Line Ripple Info ---');
  console.log(`Found: ${pageSizeInfo.lineRipple.found}`);
  console.log(`Display: ${pageSizeInfo.lineRipple.display}`);
  console.log(`Height: ${pageSizeInfo.lineRipple.height}`);

  // Take a screenshot
  await page.locator('mat-paginator').screenshot({
    path: 'pagination-current-state.png'
  });
  console.log('\n✓ Screenshot saved: pagination-current-state.png');

  console.log('\n=== Analysis Complete ===');
});
