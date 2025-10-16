const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const pages = [
    { name: 'Sites', url: 'http://localhost:4200/sites-unified' },
    { name: 'Clouds', url: 'http://localhost:4200/clouds-unified' },
    { name: 'Circuits', url: 'http://localhost:4200/circuits-unified' }
  ];
  
  const results = [];
  
  for (const pageInfo of pages) {
    console.log(`Checking ${pageInfo.name}...`);
    
    await page.goto(pageInfo.url, { waitUntil: 'networkidle', timeout: 10000 });
    await page.waitForTimeout(1500);
    
    const searchInfo = await page.evaluate(() => {
      // Find TABLE search input (not global header search)
      const tableSearchInputs = Array.from(document.querySelectorAll('input')).filter(input => {
        const placeholder = input.placeholder?.toLowerCase() || '';
        return (placeholder.includes('search') || placeholder.includes('filter')) && 
               !placeholder.includes('cmd+k') && // Exclude global search
               input.closest('.base-table-container, .table-with-footer, .table-with-help, .search-and-filters, .global-filter, .complex-filters-after-header');
      });
      
      if (tableSearchInputs.length === 0) return { found: false };
      
      const searchInput = tableSearchInputs[0];
      const searchField = searchInput.closest('mat-form-field');
      
      const inputRect = searchInput.getBoundingClientRect();
      const fieldRect = searchField?.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(searchInput);
      
      return {
        found: true,
        placeholder: searchInput.placeholder,
        input: {
          width: inputRect.width,
          height: inputRect.height,
          fontSize: computedStyle.fontSize
        },
        field: fieldRect ? {
          width: fieldRect.width,
          height: fieldRect.height,
          appearance: searchField?.getAttribute('appearance') || 'default'
        } : null,
        parentClass: searchField?.parentElement?.className || 'none'
      };
    });
    
    if (searchInfo.found) {
      results.push({ page: pageInfo.name, ...searchInfo });
    }
    
    // Take screenshot
    const filename = `table-search-${pageInfo.name.toLowerCase()}.png`;
    await page.screenshot({ path: filename });
    console.log(`  Screenshot: ${filename}`);
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('TABLE SEARCH INPUT AUDIT');
  console.log('='.repeat(80));
  
  results.forEach(result => {
    console.log(`\n${result.page}:`);
    console.log(`  Placeholder: "${result.placeholder}"`);
    console.log(`  Field Width: ${result.field?.width?.toFixed(0) || 'N/A'}px`);
    console.log(`  Field Height: ${result.field?.height?.toFixed(0) || 'N/A'}px`);
    console.log(`  Input Height: ${result.input.height.toFixed(0)}px`);
    console.log(`  Font Size: ${result.input.fontSize}`);
    console.log(`  Appearance: ${result.field?.appearance || 'N/A'}`);
  });
  
  await browser.close();
})();
