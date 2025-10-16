const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:4200/clouds-unified');
  await page.waitForSelector('.export-button', { timeout: 5000 });
  
  // Get export button position
  const exportInfo = await page.evaluate(() => {
    const exportBtn = document.querySelector('.export-button');
    if (!exportBtn) return null;
    const rect = exportBtn.getBoundingClientRect();
    return {
      y: rect.y,
      top: rect.top,
      height: rect.height,
      centerY: rect.y + rect.height / 2
    };
  });
  
  // Get current help button position
  const helpInfo = await page.evaluate(() => {
    const helpBtn = document.querySelector('.floating-help-button');
    if (!helpBtn) return null;
    const rect = helpBtn.getBoundingClientRect();
    return {
      y: rect.y,
      top: rect.top,
      height: rect.height,
      centerY: rect.y + rect.height / 2
    };
  });
  
  // Get table header position
  const headerInfo = await page.evaluate(() => {
    const header = document.querySelector('.table-header');
    if (!header) return null;
    const rect = header.getBoundingClientRect();
    return {
      y: rect.y,
      height: rect.height,
      bottom: rect.bottom
    };
  });
  
  // Get quick filters position
  const filtersInfo = await page.evaluate(() => {
    const filters = document.querySelector('.quick-filters');
    if (!filters) return null;
    const rect = filters.getBoundingClientRect();
    return {
      y: rect.y,
      height: rect.height,
      bottom: rect.bottom
    };
  });
  
  // Get search and filters row position
  const searchRowInfo = await page.evaluate(() => {
    const searchRow = document.querySelector('.search-and-filters');
    if (!searchRow) return null;
    const rect = searchRow.getBoundingClientRect();
    return {
      y: rect.y,
      height: rect.height,
      bottom: rect.bottom
    };
  });
  
  console.log('Table Header:', headerInfo);
  console.log('Quick Filters:', filtersInfo);
  console.log('Search Row:', searchRowInfo);
  console.log('Export Button:', exportInfo);
  console.log('Help Button (current):', helpInfo);
  
  if (exportInfo && helpInfo) {
    console.log('\nAlignment Check:');
    console.log('Export button center Y:', exportInfo.centerY);
    console.log('Help button center Y:', helpInfo.centerY);
    console.log('Difference:', Math.abs(exportInfo.centerY - helpInfo.centerY), 'px');
    
    if (Math.abs(exportInfo.centerY - helpInfo.centerY) > 2) {
      console.log('❌ NOT ALIGNED: Buttons are not on the same row');
      
      // Calculate what the top position should be
      const tableTop = headerInfo ? headerInfo.y : 0;
      const exportTop = exportInfo.y;
      const offsetFromTable = exportTop - tableTop;
      console.log('\n📏 Recommended top position:', offsetFromTable, 'px (from table container top)');
    } else {
      console.log('✅ ALIGNED: Buttons are on the same row');
    }
  }
  
  await browser.close();
})();
