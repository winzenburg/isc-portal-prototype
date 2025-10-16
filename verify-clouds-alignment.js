const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:4200', { waitUntil: 'networkidle' });
  await page.click('text=Network Services');
  await page.waitForTimeout(300);
  await page.click('text=Clouds');
  await page.waitForTimeout(2000); // Wait for styles to apply
  
  const positions = await page.evaluate(() => {
    const downloadBtn = Array.from(document.querySelectorAll('button')).find(btn => {
      const icon = btn.querySelector('mat-icon');
      return icon && icon.textContent?.trim() === 'download';
    });
    
    const helpBtn = document.querySelector('.floating-help-button');
    
    const downloadRect = downloadBtn?.getBoundingClientRect();
    const helpRect = helpBtn?.getBoundingClientRect();
    
    return {
      download: downloadRect ? {
        y: downloadRect.y,
        centerY: downloadRect.y + downloadRect.height / 2
      } : null,
      help: helpRect ? {
        y: helpRect.y,
        centerY: helpRect.y + helpRect.height / 2
      } : null
    };
  });
  
  console.log('Button Positions:');
  console.log('Download button center Y:', positions.download?.centerY);
  console.log('Help button center Y:', positions.help?.centerY);
  
  if (positions.download && positions.help) {
    const diff = Math.abs(positions.download.centerY - positions.help.centerY);
    console.log('Difference:', diff.toFixed(2), 'px');
    
    if (diff <= 2) {
      console.log('✅ SUCCESS: Buttons are aligned on the same row!');
    } else {
      console.log('❌ Still not aligned. Difference is', diff.toFixed(2), 'px');
    }
  }
  
  await page.screenshot({ path: 'clouds-aligned.png', fullPage: true });
  console.log('\nScreenshot saved to clouds-aligned.png');
  
  await browser.close();
})();
