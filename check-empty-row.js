const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:4200/sites-unified', { waitUntil: 'networkidle', timeout: 10000 });
    await page.waitForTimeout(2000);
    
    // Get the filters container
    const filters = await page.$('.complex-filters');
    const filtersBox = await filters?.boundingBox();
    console.log('Filters bottom:', filtersBox ? filtersBox.y + filtersBox.height : 'not found');
    
    // Get the table header
    const tableHeader = await page.$('thead');
    const headerBox = await tableHeader?.boundingBox();
    console.log('Table header top:', headerBox?.y);
    
    // Calculate gap
    if (filtersBox && headerBox) {
      const gap = headerBox.y - (filtersBox.y + filtersBox.height);
      console.log('Gap between filters and table header:', gap, 'px');
    }
    
    // Check for any elements between
    const baseTable = await page.$('app-base-table');
    if (baseTable) {
      const tableContainer = await page.$('.base-table-container');
      const containerBox = await tableContainer?.boundingBox();
      console.log('\nTable container top:', containerBox?.y);
      console.log('Table container padding/margin creating gap');
    }
    
    // Get computed styles
    const tableContainerStyles = await page.$eval('.base-table-container', (el) => {
      const styles = window.getComputedStyle(el);
      return {
        paddingTop: styles.paddingTop,
        marginTop: styles.marginTop,
        paddingBottom: styles.paddingBottom
      };
    });
    console.log('\nTable container styles:', tableContainerStyles);
    
    await page.screenshot({ path: 'sites-empty-row.png', fullPage: true });
    console.log('\nScreenshot saved');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  await browser.close();
})();
