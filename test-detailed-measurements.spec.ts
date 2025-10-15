import { test } from '@playwright/test';

test('detailed width and centering measurements', async ({ page }) => {
  await page.goto('http://localhost:4200/sites');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  const measurements = await page.evaluate(() => {
    // Viewport
    const viewportWidth = window.innerWidth;

    // Sidebar
    const sidebar = document.querySelector('.app-sidenav');
    const sidebarRect = sidebar?.getBoundingClientRect();
    const sidebarWidth = sidebarRect?.width || 0;

    // Content area (mat-sidenav-content)
    const contentArea = document.querySelector('.main-content');
    const contentAreaRect = contentArea?.getBoundingClientRect();

    // Sites container
    const sitesContainer = document.querySelector('.sites-container');
    const sitesContainerRect = sitesContainer?.getBoundingClientRect();
    const sitesContainerStyles = sitesContainer ? window.getComputedStyle(sitesContainer) : null;

    // Table container
    const tableContainer = document.querySelector('.table-container');
    const tableContainerRect = tableContainer?.getBoundingClientRect();

    // Calculate ideal centering
    const contentAreaWidth = contentAreaRect ? contentAreaRect.width : 0;
    const contentAreaLeft = contentAreaRect ? contentAreaRect.left : 0;
    const contentAreaCenter = contentAreaLeft + (contentAreaWidth / 2);

    // Actual centering of sites container
    const sitesContainerCenter = sitesContainerRect
      ? sitesContainerRect.left + (sitesContainerRect.width / 2)
      : 0;

    const centeringOffset = Math.abs(sitesContainerCenter - contentAreaCenter);

    return {
      viewport: {
        width: viewportWidth
      },
      sidebar: {
        width: sidebarWidth,
        left: sidebarRect?.left || 0
      },
      contentArea: {
        width: contentAreaWidth,
        left: contentAreaLeft,
        center: contentAreaCenter
      },
      sitesContainer: {
        width: sitesContainerRect?.width || 0,
        left: sitesContainerRect?.left || 0,
        right: sitesContainerRect?.right || 0,
        center: sitesContainerCenter,
        paddingLeft: sitesContainerStyles?.paddingLeft || '0',
        paddingRight: sitesContainerStyles?.paddingRight || '0',
        marginLeft: sitesContainerStyles?.marginLeft || '0',
        marginRight: sitesContainerStyles?.marginRight || '0',
        maxWidth: sitesContainerStyles?.maxWidth || 'none',
        boxSizing: sitesContainerStyles?.boxSizing || 'content-box'
      },
      tableContainer: {
        width: tableContainerRect?.width || 0,
        left: tableContainerRect?.left || 0
      },
      centering: {
        offsetFromIdealCenter: centeringOffset,
        isWellCentered: centeringOffset < 10
      }
    };
  });

  console.log('\n=== DETAILED MEASUREMENTS (Sites Page) ===\n');
  console.log('VIEWPORT:');
  console.log(`  Width: ${measurements.viewport.width}px\n`);

  console.log('SIDEBAR:');
  console.log(`  Width: ${measurements.sidebar.width}px`);
  console.log(`  Left: ${measurements.sidebar.left}px\n`);

  console.log('CONTENT AREA (mat-sidenav-content):');
  console.log(`  Width: ${measurements.contentArea.width}px`);
  console.log(`  Left: ${measurements.contentArea.left}px`);
  console.log(`  Center: ${measurements.contentArea.center}px\n`);

  console.log('SITES CONTAINER:');
  console.log(`  Width: ${measurements.sitesContainer.width}px`);
  console.log(`  Left: ${measurements.sitesContainer.left}px`);
  console.log(`  Right: ${measurements.sitesContainer.right}px`);
  console.log(`  Center: ${measurements.sitesContainer.center}px`);
  console.log(`  Padding: left=${measurements.sitesContainer.paddingLeft}, right=${measurements.sitesContainer.paddingRight}`);
  console.log(`  Margin: left=${measurements.sitesContainer.marginLeft}, right=${measurements.sitesContainer.marginRight}`);
  console.log(`  Max-width: ${measurements.sitesContainer.maxWidth}`);
  console.log(`  Box-sizing: ${measurements.sitesContainer.boxSizing}\n`);

  console.log('TABLE CONTAINER:');
  console.log(`  Width: ${measurements.tableContainer.width}px`);
  console.log(`  Left: ${measurements.tableContainer.left}px\n`);

  console.log('CENTERING ANALYSIS:');
  console.log(`  Sites container center offset from ideal: ${measurements.centering.offsetFromIdealCenter.toFixed(2)}px`);
  console.log(`  Well centered: ${measurements.centering.isWellCentered ? 'YES ✓' : 'NO ✗'}\n`);

  if (!measurements.centering.isWellCentered) {
    console.log('DIAGNOSIS:');
    const leftSpace = measurements.sitesContainer.left - measurements.contentArea.left;
    const rightSpace = (measurements.contentArea.left + measurements.contentArea.width) - measurements.sitesContainer.right;
    console.log(`  Left space: ${leftSpace.toFixed(2)}px`);
    console.log(`  Right space: ${rightSpace.toFixed(2)}px`);
    console.log(`  Difference: ${Math.abs(leftSpace - rightSpace).toFixed(2)}px`);

    if (leftSpace > rightSpace) {
      console.log(`  Problem: Container is pushed ${(leftSpace - rightSpace).toFixed(2)}px to the RIGHT`);
    } else {
      console.log(`  Problem: Container is pushed ${(rightSpace - leftSpace).toFixed(2)}px to the LEFT`);
    }
  }
});
