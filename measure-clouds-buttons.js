const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:4200', { waitUntil: 'networkidle' });
  await page.click('text=Network Services');
  await page.waitForTimeout(300);
  await page.click('text=Clouds');
  await page.waitForTimeout(1500);
  
  const positions = await page.evaluate(() => {
    // Find the download/export button (it's a blue icon button)
    const downloadBtn = Array.from(document.querySelectorAll('button')).find(btn => {
      const icon = btn.querySelector('mat-icon');
      return icon && icon.textContent?.trim() === 'download';
    });
    
    // Find the help button
    const helpBtn = document.querySelector('.floating-help-button');
    
    // Find the table container
    const tableContainer = document.querySelector('.table-with-help');
    
    const downloadRect = downloadBtn?.getBoundingClientRect();
    const helpRect = helpBtn?.getBoundingClientRect();
    const containerRect = tableContainer?.getBoundingClientRect();
    
    return {
      container: containerRect ? { y: containerRect.y } : null,
      download: downloadRect ? {
        y: downloadRect.y,
        height: downloadRect.height,
        centerY: downloadRect.y + downloadRect.height / 2,
        offsetFromContainer: containerRect ? downloadRect.y - containerRect.y : null
      } : null,
      help: helpRect ? {
        y: helpRect.y,
        height: helpRect.height,
        centerY: helpRect.y + helpRect.height / 2,
        offsetFromContainer: containerRect ? helpRect.y - containerRect.y : null,
        currentTopCSS: 72 // From the SCSS file
      } : null
    };
  });
  
  console.log('Positions:', JSON.stringify(positions, null, 2));
  
  if (positions.download && positions.help) {
    console.log('\nAlignment Analysis:');
    console.log('Download button Y:', positions.download.y, '(center:', positions.download.centerY + ')');
    console.log('Help button Y:', positions.help.y, '(center:', positions.help.centerY + ')');
    console.log('Download offset from container:', positions.download.offsetFromContainer, 'px');
    console.log('Help offset from container (current):', positions.help.offsetFromContainer, 'px');
    console.log('\n❌ Buttons are NOT aligned');
    console.log('📏 Help button should be at top:', positions.download.offsetFromContainer, 'px (currently at', positions.help.currentTopCSS, 'px)');
  }
  
  await browser.close();
})();
