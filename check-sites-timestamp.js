const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:4200/sites-unified', { waitUntil: 'networkidle', timeout: 10000 });
    
    // Wait for the page to load
    await page.waitForTimeout(2000);
    
    // Check for timestamp footer
    const timestampFooter = await page.$('.table-footer-info');
    console.log('\n=== TIMESTAMP FOOTER CHECK ===');
    console.log('Footer element exists:', !!timestampFooter);
    
    if (timestampFooter) {
      const footerText = await timestampFooter.textContent();
      const footerVisible = await timestampFooter.isVisible();
      console.log('Footer visible:', footerVisible);
      console.log('Footer text:', footerText?.trim());
    }
    
    // Check for sync-status-indicator (old implementation)
    const syncStatus = await page.$('app-sync-status-indicator');
    console.log('\nOld sync-status-indicator exists:', !!syncStatus);
    
    // Get full HTML of main-content area
    const mainContent = await page.$('.main-content');
    if (mainContent) {
      const html = await mainContent.innerHTML();
      console.log('\n=== MAIN CONTENT HTML (last 1000 chars) ===');
      console.log(html.slice(-1000));
    }
    
    // Take screenshot
    await page.screenshot({ path: 'sites-unified-screenshot.png', fullPage: true });
    console.log('\nScreenshot saved to sites-unified-screenshot.png');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  await browser.close();
})();
