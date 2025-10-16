const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const page = await browser.newPage();
  
  // Go to home first
  await page.goto('http://localhost:4200', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  // Navigate to Clouds via the menu
  await page.click('text=Network Services');
  await page.waitForTimeout(500);
  await page.click('text=Clouds');
  await page.waitForTimeout(2000);
  
  // Take screenshot
  await page.screenshot({ path: 'clouds-navigated.png', fullPage: true });
  console.log('Screenshot saved');
  
  // Find elements
  const info = await page.evaluate(() => {
    const exportBtn = Array.from(document.querySelectorAll('button')).find(btn => 
      btn.textContent?.includes('Export CSV')
    );
    const helpBtn = document.querySelector('.floating-help-button');
    
    return {
      hasExport: !!exportBtn,
      hasHelp: !!helpBtn,
      exportPos: exportBtn ? exportBtn.getBoundingClientRect() : null,
      helpPos: helpBtn ? helpBtn.getBoundingClientRect() : null
    };
  });
  
  console.log('Info:', JSON.stringify(info, null, 2));
  
  await page.waitForTimeout(3000);
  await browser.close();
})();
