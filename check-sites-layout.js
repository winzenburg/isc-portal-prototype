const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:4200/sites-unified', { waitUntil: 'networkidle', timeout: 10000 });
    await page.waitForTimeout(2000);
    
    // Get positions of timestamp and pagination
    const timestampFooter = await page.$('.table-footer-info');
    const paginator = await page.$('.mat-mdc-paginator');
    
    console.log('\n=== CURRENT LAYOUT ===');
    
    if (timestampFooter) {
      const timestampBox = await timestampFooter.boundingBox();
      console.log('Timestamp position:', {
        x: timestampBox?.x,
        y: timestampBox?.y,
        bottom: timestampBox ? timestampBox.y + timestampBox.height : null
      });
    } else {
      console.log('Timestamp footer: NOT FOUND');
    }
    
    if (paginator) {
      const paginatorBox = await paginator.boundingBox();
      console.log('Paginator position:', {
        x: paginatorBox?.x,
        y: paginatorBox?.y,
        bottom: paginatorBox ? paginatorBox.y + paginatorBox.height : null
      });
    } else {
      console.log('Paginator: NOT FOUND');
    }
    
    // Check if they're on the same row (similar Y position)
    if (timestampFooter && paginator) {
      const timestampBox = await timestampFooter.boundingBox();
      const paginatorBox = await paginator.boundingBox();
      const yDiff = Math.abs((timestampBox?.y || 0) - (paginatorBox?.y || 0));
      console.log('\nY-coordinate difference:', yDiff, 'px');
      console.log('On same row?', yDiff < 20 ? 'YES' : 'NO (difference too large)');
    }
    
    // Take screenshot
    await page.screenshot({ path: 'sites-layout-check.png', fullPage: true });
    console.log('\nScreenshot saved to sites-layout-check.png');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  await browser.close();
})();
