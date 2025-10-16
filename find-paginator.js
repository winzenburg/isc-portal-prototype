const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:4200/sites-unified', { waitUntil: 'networkidle', timeout: 10000 });
    await page.waitForTimeout(2000);
    
    // Try different selectors
    const selectors = [
      'mat-paginator',
      '.mat-paginator',
      '.mat-mdc-paginator',
      '[class*="paginator"]',
      'app-base-table mat-paginator'
    ];
    
    console.log('\n=== SEARCHING FOR PAGINATOR ===');
    for (const selector of selectors) {
      const element = await page.$(selector);
      if (element) {
        const box = await element.boundingBox();
        console.log(`Found with selector: ${selector}`);
        console.log('Position:', box);
        break;
      }
    }
    
    // Get all elements with "paginat" in class name
    const allPaginators = await page.$$('[class*="paginat"]');
    console.log(`\nFound ${allPaginators.length} elements with "paginat" in class name`);
    
    // Check HTML structure
    const baseTable = await page.$('app-base-table');
    if (baseTable) {
      const html = await baseTable.innerHTML();
      const hasPagination = html.includes('paginator') || html.includes('pagination');
      console.log('Base table has pagination HTML:', hasPagination);
      
      // Show last 800 chars to see pagination area
      console.log('\n=== LAST 800 CHARS OF BASE TABLE HTML ===');
      console.log(html.slice(-800));
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  await browser.close();
})();
