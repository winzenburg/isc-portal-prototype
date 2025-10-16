const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const pages = [
    { name: 'Clouds', url: 'http://localhost:4200/clouds-unified', nav: ['Network Services', 'Clouds'] },
    { name: 'Circuits', url: 'http://localhost:4200/circuits-unified', nav: ['Network Services', 'Circuits'] },
    { name: 'Sites', url: 'http://localhost:4200/sites-unified', nav: ['Network Services', 'Sites'] },
    { name: 'Contacts', url: 'http://localhost:4200/contacts', nav: ['Contacts'] },
    { name: 'Circuit Reports', url: 'http://localhost:4200/circuit-reports', nav: ['Network Services', 'Circuit Reports'] }
  ];
  
  const results = [];
  
  for (const pageInfo of pages) {
    console.log(`\nAuditing ${pageInfo.name}...`);
    
    await page.goto('http://localhost:4200', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    
    // Navigate through menu
    for (const menuItem of pageInfo.nav) {
      await page.click(`text=${menuItem}`);
      await page.waitForTimeout(500);
    }
    
    await page.waitForTimeout(1500);
    
    const measurements = await page.evaluate(() => {
      const searchInputs = [];
      
      // Find all mat-form-fields with search/filter inputs
      const formFields = document.querySelectorAll('mat-form-field');
      
      formFields.forEach((field, index) => {
        const input = field.querySelector('input');
        const label = field.querySelector('mat-label');
        const placeholder = input?.placeholder || '';
        
        if (input && (placeholder.toLowerCase().includes('search') || 
                      placeholder.toLowerCase().includes('filter') ||
                      label?.textContent?.toLowerCase().includes('search') ||
                      label?.textContent?.toLowerCase().includes('filter'))) {
          
          // Exclude global header search
          if (placeholder.includes('Cmd+K')) return;
          
          const fieldRect = field.getBoundingClientRect();
          const inputRect = input.getBoundingClientRect();
          const computedField = window.getComputedStyle(field);
          const computedInput = window.getComputedStyle(input);
          
          searchInputs.push({
            index,
            label: label?.textContent || '',
            placeholder,
            field: {
              width: fieldRect.width,
              height: fieldRect.height,
              y: fieldRect.y
            },
            input: {
              width: inputRect.width,
              height: inputRect.height,
              fontSize: computedInput.fontSize,
              padding: computedInput.padding
            },
            appearance: field.getAttribute('appearance') || 'legacy'
          });
        }
      });
      
      return searchInputs;
    });
    
    if (measurements.length > 0) {
      results.push({
        page: pageInfo.name,
        searches: measurements
      });
      
      measurements.forEach((m, i) => {
        console.log(`  Search ${i + 1}:`);
        console.log(`    Label: ${m.label}`);
        console.log(`    Placeholder: ${m.placeholder}`);
        console.log(`    Field: ${Math.round(m.field.width)}px × ${Math.round(m.field.height)}px`);
        console.log(`    Appearance: ${m.appearance}`);
      });
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('SEARCH INPUT AUDIT SUMMARY');
  console.log('='.repeat(80));
  
  const allWidths = [];
  const allHeights = [];
  const allAppearances = [];
  
  results.forEach(result => {
    result.searches.forEach(search => {
      allWidths.push(Math.round(search.field.width));
      allHeights.push(Math.round(search.field.height));
      allAppearances.push(search.appearance);
    });
  });
  
  const uniqueWidths = [...new Set(allWidths)].sort((a, b) => a - b);
  const uniqueHeights = [...new Set(allHeights)].sort((a, b) => a - b);
  const uniqueAppearances = [...new Set(allAppearances)];
  
  console.log(`\nUnique Widths: ${uniqueWidths.join(', ')}px`);
  console.log(`Unique Heights: ${uniqueHeights.join(', ')}px`);
  console.log(`Appearances: ${uniqueAppearances.join(', ')}`);
  
  console.log('\n' + '='.repeat(80));
  console.log('RECOMMENDATION');
  console.log('='.repeat(80));
  console.log('\nStandardize all table search/filter inputs to:');
  console.log('  Width: 300px (fixed width for consistent layout)');
  console.log('  Appearance: outline (Material Design 3 standard)');
  console.log('  Height: Auto (determined by outline appearance ~56px)');
  
  // Save detailed report
  fs.writeFileSync('search-audit-report.json', JSON.stringify(results, null, 2));
  console.log('\nDetailed report saved to search-audit-report.json');
  
  await browser.close();
})();
