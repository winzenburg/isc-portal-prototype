import { test } from '@playwright/test';

test('visual centering check with guidelines', async ({ page }) => {
  const pages = [
    { path: '/', name: 'landing' },
    { path: '/sites', name: 'sites' },
  ];

  for (const pageInfo of pages) {
    await page.goto(`http://localhost:4200${pageInfo.path}`);
    await page.waitForLoadState('networkidle');

    // Wait for any loading states
    await page.waitForTimeout(1000);

    // Inject visual center guidelines
    await page.evaluate(() => {
      // Get the sidebar width
      const sidebar = document.querySelector('.app-sidenav');
      const sidebarWidth = sidebar ? sidebar.getBoundingClientRect().width : 0;

      // Calculate content area (viewport minus sidebar)
      const viewportWidth = window.innerWidth;
      const contentAreaWidth = viewportWidth - sidebarWidth;
      const contentAreaLeft = sidebarWidth;
      const contentAreaCenter = contentAreaLeft + (contentAreaWidth / 2);

      // Create center line for content area
      const centerLine = document.createElement('div');
      centerLine.style.position = 'fixed';
      centerLine.style.left = `${contentAreaCenter}px`;
      centerLine.style.top = '0';
      centerLine.style.bottom = '0';
      centerLine.style.width = '2px';
      centerLine.style.backgroundColor = 'red';
      centerLine.style.zIndex = '10000';
      centerLine.style.opacity = '0.7';
      document.body.appendChild(centerLine);

      // Create content area boundaries
      const leftBoundary = document.createElement('div');
      leftBoundary.style.position = 'fixed';
      leftBoundary.style.left = `${contentAreaLeft}px`;
      leftBoundary.style.top = '0';
      leftBoundary.style.bottom = '0';
      leftBoundary.style.width = '2px';
      leftBoundary.style.backgroundColor = 'blue';
      leftBoundary.style.zIndex = '10000';
      leftBoundary.style.opacity = '0.5';
      document.body.appendChild(leftBoundary);

      const rightBoundary = document.createElement('div');
      rightBoundary.style.position = 'fixed';
      rightBoundary.style.left = `${viewportWidth}px`;
      rightBoundary.style.top = '0';
      rightBoundary.style.bottom = '0';
      rightBoundary.style.width = '2px';
      rightBoundary.style.backgroundColor = 'blue';
      rightBoundary.style.zIndex = '10000';
      rightBoundary.style.opacity = '0.5';
      document.body.appendChild(rightBoundary);

      // Add info label
      const label = document.createElement('div');
      label.style.position = 'fixed';
      label.style.top = '80px';
      label.style.right = '20px';
      label.style.padding = '10px';
      label.style.backgroundColor = 'rgba(0,0,0,0.8)';
      label.style.color = 'white';
      label.style.zIndex = '10001';
      label.style.fontFamily = 'monospace';
      label.style.fontSize = '12px';
      label.innerHTML = `
        <div>Red line: Content area center</div>
        <div>Blue lines: Content area boundaries</div>
        <div>Content area: ${contentAreaWidth}px wide</div>
        <div>Sidebar: ${sidebarWidth}px wide</div>
      `;
      document.body.appendChild(label);
    });

    // Take screenshot with guidelines
    await page.screenshot({
      path: `visual-center-${pageInfo.name}.png`,
      fullPage: true
    });

    console.log(`✓ Screenshot with center guidelines saved: visual-center-${pageInfo.name}.png`);
  }
});
