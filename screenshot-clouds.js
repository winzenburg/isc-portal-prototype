const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:4200/clouds-unified', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
  // Take a screenshot
  await page.screenshot({ path: 'clouds-page.png', fullPage: true });
  console.log('Screenshot saved to clouds-page.png');
  
  // Try to find elements with more generic selectors
  const info = await page.evaluate(() => {
    const allDivs = Array.from(document.querySelectorAll('div')).map(div => div.className).filter(c => c);
    const allButtons = Array.from(document.querySelectorAll('button'));
    
    return {
      divClasses: allDivs.slice(0, 20),
      buttonCount: allButtons.length,
      buttons: allButtons.slice(0, 10).map(btn => ({
        text: btn.textContent?.trim().substring(0, 30),
        classes: btn.className,
        rect: btn.getBoundingClientRect()
      }))
    };
  });
  
  console.log('\nPage Info:', JSON.stringify(info, null, 2));
  
  await browser.close();
})();
