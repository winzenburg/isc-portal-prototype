const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:4200/sites-unified', { waitUntil: 'networkidle', timeout: 10000 });
    await page.waitForTimeout(2000);
    
    // Check for table header
    const tableHeader = await page.$('.table-header');
    
    if (tableHeader) {
      const styles = await page.$eval('.table-header', (el) => {
        const computed = window.getComputedStyle(el);
        return {
          background: computed.backgroundColor,
          borderBottom: computed.borderBottom,
          borderBottomColor: computed.borderBottomColor,
          borderBottomWidth: computed.borderBottomWidth,
          borderBottomStyle: computed.borderBottomStyle
        };
      });
      
      console.log('Table header styles:', styles);
      
      const box = await tableHeader.boundingBox();
      console.log('Table header position:', box);
    } else {
      console.log('Table header NOT FOUND');
    }
    
    // Check if there's a filter overlaying it
    const filters = await page.$('.complex-filters-after-header');
    if (filters) {
      const filterBox = await filters.boundingBox();
      console.log('\nFilters position:', filterBox);
    }
    
    await page.screenshot({ path: 'sites-header-check.png', fullPage: true });
    console.log('\nScreenshot saved');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  await browser.close();
})();
