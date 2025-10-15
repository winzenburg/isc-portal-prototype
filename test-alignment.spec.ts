import { test, expect } from '@playwright/test';

test.describe('Horizontal Alignment Issues', () => {
  const pages = [
    { name: 'Landing', url: 'http://localhost:4200' },
    { name: 'Circuits', url: 'http://localhost:4200/circuits' },
    { name: 'Sites', url: 'http://localhost:4200/sites' },
    { name: 'Clouds', url: 'http://localhost:4200/clouds' },
    { name: 'Contacts', url: 'http://localhost:4200/contacts' },
    { name: 'Tickets', url: 'http://localhost:4200/tickets' },
    { name: 'Sources', url: 'http://localhost:4200/sources' },
    { name: 'UCaaS Reports', url: 'http://localhost:4200/ucaas' },
  ];

  for (const page of pages) {
    test(`Check alignment on ${page.name} page`, async ({ page: playwright }) => {
      await playwright.goto(page.url);
      await playwright.waitForLoadState('networkidle');

      // Wait for Angular to settle
      await playwright.waitForTimeout(1000);

      // Take full page screenshot
      await playwright.screenshot({
        path: `screenshots/alignment-${page.name.toLowerCase().replace(/\s+/g, '-')}.png`,
        fullPage: true
      });

      // Check for common alignment issues
      const results = {
        pageName: page.name,
        issues: [] as string[]
      };

      // Check if cards are centered properly
      const cards = await playwright.locator('mat-card, .issue-card, .metric-card, .quick-win-card').all();
      if (cards.length > 0) {
        for (let i = 0; i < cards.length; i++) {
          const card = cards[i];
          const box = await card.boundingBox();
          if (box) {
            const parentBox = await card.locator('..').boundingBox();
            if (parentBox) {
              const leftMargin = box.x - parentBox.x;
              const rightMargin = (parentBox.x + parentBox.width) - (box.x + box.width);
              const marginDiff = Math.abs(leftMargin - rightMargin);

              // If margins differ by more than 10px, it's likely misaligned
              if (marginDiff > 10) {
                results.issues.push(`Card ${i}: Left margin ${leftMargin.toFixed(1)}px, Right margin ${rightMargin.toFixed(1)}px (diff: ${marginDiff.toFixed(1)}px)`);
              }
            }
          }
        }
      }

      // Check container max-widths and centering
      const containers = await playwright.locator('.landing-container, .table-container, .demo-section, .context-section').all();
      for (let i = 0; i < containers.length; i++) {
        const container = containers[i];
        const box = await container.boundingBox();
        if (box) {
          const viewportWidth = playwright.viewportSize()?.width || 1280;
          const leftSpace = box.x;
          const rightSpace = viewportWidth - (box.x + box.width);
          const spaceDiff = Math.abs(leftSpace - rightSpace);

          if (spaceDiff > 10) {
            const className = await container.getAttribute('class');
            results.issues.push(`Container "${className}": Left space ${leftSpace.toFixed(1)}px, Right space ${rightSpace.toFixed(1)}px (diff: ${spaceDiff.toFixed(1)}px)`);
          }
        }
      }

      // Check grid layouts
      const grids = await playwright.locator('.issues-grid, .metrics-grid, .demo-grid').all();
      for (let i = 0; i < grids.length; i++) {
        const grid = grids[i];
        const box = await grid.boundingBox();
        if (box) {
          const parentBox = await grid.locator('..').boundingBox();
          if (parentBox) {
            const leftOffset = box.x - parentBox.x;
            const rightOffset = (parentBox.x + parentBox.width) - (box.x + box.width);
            const offsetDiff = Math.abs(leftOffset - rightOffset);

            if (offsetDiff > 10) {
              const className = await grid.getAttribute('class');
              results.issues.push(`Grid "${className}": Left offset ${leftOffset.toFixed(1)}px, Right offset ${rightOffset.toFixed(1)}px (diff: ${offsetDiff.toFixed(1)}px)`);
            }
          }
        }
      }

      // Check section titles and headings
      const headings = await playwright.locator('h1, h2, h3, .section-title').all();
      for (let i = 0; i < headings.length; i++) {
        const heading = headings[i];
        const textAlign = await heading.evaluate(el => window.getComputedStyle(el).textAlign);
        const box = await heading.boundingBox();

        if (textAlign === 'center' && box) {
          const parentBox = await heading.locator('..').boundingBox();
          if (parentBox) {
            const expectedCenter = parentBox.x + (parentBox.width / 2);
            const actualCenter = box.x + (box.width / 2);
            const centerDiff = Math.abs(expectedCenter - actualCenter);

            if (centerDiff > 10) {
              const text = await heading.textContent();
              results.issues.push(`Heading "${text?.substring(0, 30)}...": Expected center ${expectedCenter.toFixed(1)}px, Actual center ${actualCenter.toFixed(1)}px (diff: ${centerDiff.toFixed(1)}px)`);
            }
          }
        }
      }

      // Log results
      console.log(`\n=== ${page.name} Page Alignment Report ===`);
      if (results.issues.length === 0) {
        console.log('✓ No horizontal alignment issues detected');
      } else {
        console.log(`✗ Found ${results.issues.length} alignment issue(s):`);
        results.issues.forEach((issue, idx) => {
          console.log(`  ${idx + 1}. ${issue}`);
        });
      }

      // Save detailed report
      const fs = require('fs');
      const reportPath = `alignment-report-${page.name.toLowerCase().replace(/\s+/g, '-')}.json`;
      fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    });
  }

  test('Generate alignment summary report', async ({ page }) => {
    // This test runs last and consolidates all findings
    const fs = require('fs');
    const files = fs.readdirSync('.')
      .filter((f: string) => f.startsWith('alignment-report-') && f.endsWith('.json'));

    const allReports = files.map((f: string) => JSON.parse(fs.readFileSync(f, 'utf-8')));

    const summary = {
      totalPages: allReports.length,
      pagesWithIssues: allReports.filter((r: any) => r.issues.length > 0).length,
      totalIssues: allReports.reduce((sum: number, r: any) => sum + r.issues.length, 0),
      detailsByPage: allReports.map((r: any) => ({
        page: r.pageName,
        issueCount: r.issues.length,
        issues: r.issues
      }))
    };

    console.log('\n=== OVERALL ALIGNMENT SUMMARY ===');
    console.log(`Total Pages Checked: ${summary.totalPages}`);
    console.log(`Pages With Issues: ${summary.pagesWithIssues}`);
    console.log(`Total Issues Found: ${summary.totalIssues}`);
    console.log('\nBreakdown by Page:');
    summary.detailsByPage.forEach((page: any) => {
      console.log(`  ${page.page}: ${page.issueCount} issue(s)`);
    });

    fs.writeFileSync('alignment-summary.json', JSON.stringify(summary, null, 2));
    console.log('\n✓ Summary report saved to alignment-summary.json');
  });
});
