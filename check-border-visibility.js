const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:4200/sites-unified');
  await page.waitForSelector('.table-header', { timeout: 5000 });
  
  // Get table header dimensions and position
  const headerInfo = await page.evaluate(() => {
    const header = document.querySelector('.table-header');
    if (!header) return null;
    const rect = header.getBoundingClientRect();
    const styles = window.getComputedStyle(header);
    return {
      y: rect.y,
      height: rect.height,
      bottom: rect.bottom,
      borderBottom: styles.borderBottom
    };
  });
  
  // Get filters position
  const filtersInfo = await page.evaluate(() => {
    const filters = document.querySelector('.complex-filters-after-header');
    if (!filters) return null;
    const rect = filters.getBoundingClientRect();
    return {
      y: rect.y,
      top: rect.top
    };
  });
  
  console.log('Table Header Info:', headerInfo);
  console.log('Filters Info:', filtersInfo);
  
  if (headerInfo && filtersInfo) {
    const gap = filtersInfo.y - headerInfo.bottom;
    console.log('\nGap between header bottom and filters top:', gap, 'px');
    
    if (gap >= 1) {
      console.log('✅ SUCCESS: Border should be visible with', gap, 'px gap');
    } else {
      console.log('❌ ISSUE: Gap is too small, border may still be covered');
    }
  }
  
  await browser.close();
})();
