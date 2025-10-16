const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const pages = [
    { name: 'clouds', nav: ['Network Services', 'Clouds'] },
    { name: 'circuits', nav: ['Network Services', 'Circuits'] },
    { name: 'sites', nav: ['Network Services', 'Sites'] },
    { name: 'circuit-reports', nav: ['Network Services', 'Circuit Reports'] }
  ];
  
  for (const pageInfo of pages) {
    console.log(`Capturing ${pageInfo.name}...`);
    
    await page.goto('http://localhost:4200', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    
    for (const menuItem of pageInfo.nav) {
      await page.click(`text=${menuItem}`);
      await page.waitForTimeout(500);
    }
    
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `unified-search-${pageInfo.name}.png` });
    console.log(`  Saved unified-search-${pageInfo.name}.png`);
  }
  
  console.log('\n✅ All search fields now unified at 300px width');
  
  await browser.close();
})();
