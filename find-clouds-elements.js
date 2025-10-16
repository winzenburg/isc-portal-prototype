const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:4200/clouds-unified');
  await page.waitForTimeout(2000); // Wait for page to load
  
  const elements = await page.evaluate(() => {
    const results = {
      tableHeader: !!document.querySelector('.table-header'),
      quickFilters: !!document.querySelector('.quick-filters'),
      searchAndFilters: !!document.querySelector('.search-and-filters'),
      exportButton: !!document.querySelector('[aria-label="Export CSV"]'),
      helpButton: !!document.querySelector('.floating-help-button'),
      allButtons: []
    };
    
    // Find all buttons and their positions
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
      const text = btn.textContent?.trim();
      const ariaLabel = btn.getAttribute('aria-label');
      const rect = btn.getBoundingClientRect();
      results.allButtons.push({
        text: text?.substring(0, 30),
        ariaLabel,
        y: rect.y,
        height: rect.height
      });
    });
    
    return results;
  });
  
  console.log('Elements found:', JSON.stringify(elements, null, 2));
  
  // Find the export button specifically
  const exportPos = await page.evaluate(() => {
    const btn = document.querySelector('[aria-label="Export CSV"]');
    if (!btn) return null;
    const rect = btn.getBoundingClientRect();
    const container = document.querySelector('.table-with-help');
    const containerRect = container ? container.getBoundingClientRect() : null;
    return {
      buttonY: rect.y,
      buttonHeight: rect.height,
      containerY: containerRect?.y || 0,
      offsetFromContainer: rect.y - (containerRect?.y || 0)
    };
  });
  
  console.log('\nExport Button Position:', exportPos);
  
  await browser.close();
})();
