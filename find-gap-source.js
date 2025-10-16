const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:4200/sites-unified', { waitUntil: 'networkidle', timeout: 10000 });
    await page.waitForTimeout(2000);
    
    // Find all elements between filters and table
    const allElements = await page.$$eval('.table-with-footer *', (elements) => {
      return elements.slice(0, 10).map(el => ({
        tagName: el.tagName,
        className: el.className,
        height: el.offsetHeight,
        y: el.getBoundingClientRect().y
      }));
    });
    
    console.log('First 10 elements in table-with-footer:');
    allElements.forEach((el, i) => {
      console.log(`${i + 1}. ${el.tagName} .${el.className} - Y: ${el.y}, Height: ${el.height}`);
    });
    
    // Check for search-and-filters
    const searchFilters = await page.$('.search-and-filters');
    if (searchFilters) {
      const box = await searchFilters.boundingBox();
      const visible = await searchFilters.isVisible();
      console.log('\n.search-and-filters found:', { visible, height: box?.height });
    } else {
      console.log('\n.search-and-filters: NOT FOUND');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  await browser.close();
})();
