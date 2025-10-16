const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:4200/clouds-unified', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Click away from any open menus
  await page.click('body', { position: { x: 640, y: 400 } });
  await page.waitForTimeout(500);
  
  // Wait for the table to appear
  await page.waitForSelector('app-base-table', { timeout: 5000 });
  
  // Take a new screenshot
  await page.screenshot({ path: 'clouds-page-clean.png', fullPage: true });
  console.log('Screenshot saved to clouds-page-clean.png');
  
  // Find the export button and help button positions
  const positions = await page.evaluate(() => {
    // Find export button (it's inside the base-table component)
    const exportBtn = Array.from(document.querySelectorAll('button')).find(btn => 
      btn.textContent?.includes('Export CSV') || btn.getAttribute('mattooltip') === 'Export CSV'
    );
    
    const helpBtn = document.querySelector('.floating-help-button');
    const tableContainer = document.querySelector('.table-with-help');
    
    const exportRect = exportBtn?.getBoundingClientRect();
    const helpRect = helpBtn?.getBoundingClientRect();
    const containerRect = tableContainer?.getBoundingClientRect();
    
    return {
      container: containerRect ? { y: containerRect.y, height: containerRect.height } : null,
      export: exportRect ? { 
        y: exportRect.y, 
        height: exportRect.height,
        centerY: exportRect.y + exportRect.height / 2,
        offsetFromContainer: containerRect ? exportRect.y - containerRect.y : null
      } : null,
      help: helpRect ? { 
        y: helpRect.y, 
        height: helpRect.height,
        centerY: helpRect.y + helpRect.height / 2,
        offsetFromContainer: containerRect ? helpRect.y - containerRect.y : null
      } : null
    };
  });
  
  console.log('\nPositions:', JSON.stringify(positions, null, 2));
  
  if (positions.export && positions.help) {
    const diff = Math.abs(positions.export.centerY - positions.help.centerY);
    console.log('\nAlignment:');
    console.log('Export button center Y:', positions.export.centerY);
    console.log('Help button center Y:', positions.help.centerY);
    console.log('Difference:', diff, 'px');
    
    if (diff > 2) {
      console.log('❌ NOT ALIGNED');
      console.log('Recommended top position:', positions.export.offsetFromContainer, 'px');
    } else {
      console.log('✅ ALIGNED');
    }
  }
  
  await browser.close();
})();
