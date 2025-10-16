const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const pages = [
    { name: 'Dashboard', url: 'http://localhost:4200/dashboard' },
    { name: 'Contacts', url: 'http://localhost:4200/contacts' },
    { name: 'Sites', url: 'http://localhost:4200/sites-unified' },
    { name: 'Clouds', url: 'http://localhost:4200/clouds-unified' },
    { name: 'Circuits', url: 'http://localhost:4200/circuits-unified' },
    { name: 'Circuit Reports', url: 'http://localhost:4200/circuit-reports' }
  ];
  
  const results = [];
  
  for (const pageInfo of pages) {
    console.log(`\nChecking ${pageInfo.name}...`);
    
    try {
      await page.goto(pageInfo.url, { waitUntil: 'networkidle', timeout: 10000 });
      await page.waitForTimeout(1500);
      
      // Take screenshot
      await page.screenshot({ path: `search-${pageInfo.name.toLowerCase().replace(/\s+/g, '-')}.png` });
      
      const searchInfo = await page.evaluate(() => {
        // Find search input field
        const searchInput = document.querySelector('input[placeholder*="Search"], input[placeholder*="Filter"], input[matinput]');
        const searchField = searchInput?.closest('mat-form-field') || searchInput?.closest('.mat-form-field');
        
        if (!searchInput) return { found: false };
        
        const inputRect = searchInput.getBoundingClientRect();
        const fieldRect = searchField?.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(searchInput);
        const fieldComputedStyle = searchField ? window.getComputedStyle(searchField) : null;
        
        return {
          found: true,
          placeholder: searchInput.placeholder,
          input: {
            width: inputRect.width,
            height: inputRect.height,
            fontSize: computedStyle.fontSize,
            padding: computedStyle.padding
          },
          field: fieldRect ? {
            width: fieldRect.width,
            height: fieldRect.height,
            appearance: searchInput.closest('mat-form-field')?.getAttribute('appearance') || 'default'
          } : null,
          containerClass: searchField?.className || 'none'
        };
      });
      
      if (searchInfo.found) {
        results.push({
          page: pageInfo.name,
          ...searchInfo
        });
      } else {
        console.log(`  ❌ No search input found`);
      }
    } catch (error) {
      console.log(`  ⚠️  Error: ${error.message}`);
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('SEARCH INPUT AUDIT RESULTS');
  console.log('='.repeat(80));
  
  results.forEach(result => {
    console.log(`\n${result.page}:`);
    console.log(`  Placeholder: "${result.placeholder}"`);
    console.log(`  Input Width: ${result.input.width.toFixed(0)}px`);
    console.log(`  Input Height: ${result.input.height.toFixed(0)}px`);
    console.log(`  Font Size: ${result.input.fontSize}`);
    console.log(`  Field Width: ${result.field?.width.toFixed(0)}px`);
    console.log(`  Field Height: ${result.field?.height.toFixed(0)}px`);
    console.log(`  Appearance: ${result.field?.appearance}`);
  });
  
  // Analyze inconsistencies
  console.log('\n' + '='.repeat(80));
  console.log('INCONSISTENCIES DETECTED');
  console.log('='.repeat(80));
  
  const widths = results.map(r => r.field?.width).filter(Boolean);
  const heights = results.map(r => r.field?.height).filter(Boolean);
  const fontSizes = results.map(r => r.input.fontSize);
  
  console.log(`\nField Widths: ${[...new Set(widths.map(w => Math.round(w)))].join(', ')}px`);
  console.log(`Field Heights: ${[...new Set(heights.map(h => Math.round(h)))].join(', ')}px`);
  console.log(`Font Sizes: ${[...new Set(fontSizes)].join(', ')}`);
  
  console.log('\n' + '='.repeat(80));
  console.log('RECOMMENDATION');
  console.log('='.repeat(80));
  
  // Calculate most common values
  const mostCommonWidth = Math.max(...widths);
  const mostCommonHeight = Math.max(...heights);
  
  console.log(`\nRecommended unified dimensions:`);
  console.log(`  Width: 300px (standard for search fields)`);
  console.log(`  Height: 56px (Material Design standard for outlined fields)`);
  console.log(`  Font Size: 14px (body text standard)`);
  console.log(`  Appearance: outline (consistent Material Design)`);
  
  await browser.close();
})();
