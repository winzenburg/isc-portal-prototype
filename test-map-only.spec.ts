import { test } from '@playwright/test';

test('Check if Leaflet map renders', async ({ page }) => {
  await page.goto('http://localhost:4200/dashboard');
  await page.waitForLoadState('networkidle');

  // Wait for map container
  await page.waitForTimeout(3000);

  // Scroll to the map section
  await page.evaluate(() => {
    const mapCard = document.querySelector('.map-card');
    if (mapCard) {
      mapCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  await page.waitForTimeout(2000);

  // Take screenshot of just the visible area
  await page.screenshot({
    path: 'dashboard-map-view.png',
    fullPage: false
  });

  // Check if map container exists
  const mapExists = await page.locator('#network-map').count();
  console.log(`✓ Map container exists: ${mapExists > 0}`);

  // Check if Leaflet map was initialized
  const hasLeafletTiles = await page.locator('.leaflet-tile-pane').count();
  console.log(`✓ Leaflet tiles loaded: ${hasLeafletTiles > 0}`);
});
