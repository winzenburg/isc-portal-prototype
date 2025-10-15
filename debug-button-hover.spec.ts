import { test, expect } from '@playwright/test';

test('Debug button hover state - check what user is actually seeing', async ({ page }) => {
  await page.goto('http://localhost:4200');
  await page.waitForLoadState('networkidle');

  // Take screenshot of buttons in normal state
  const issueCards = page.locator('.issue-card');
  const firstCard = issueCards.first();
  await firstCard.screenshot({ path: 'button-before-hover.png' });

  const button = firstCard.locator('.demo-button');

  // Get button styles BEFORE hover
  const beforeStyles = await button.evaluate((el) => {
    const computed = window.getComputedStyle(el);
    return {
      backgroundColor: computed.backgroundColor,
      color: computed.color,
    };
  });

  console.log('\n=== BUTTON BEFORE HOVER ===');
  console.log('Background:', beforeStyles.backgroundColor);
  console.log('Text Color:', beforeStyles.color);

  // Hover over button
  await button.hover();

  // Wait a moment for hover state to apply
  await page.waitForTimeout(500);

  // Take screenshot of button in hover state
  await firstCard.screenshot({ path: 'button-hover-state.png' });

  // Get button styles AFTER hover
  const afterStyles = await button.evaluate((el) => {
    const computed = window.getComputedStyle(el);
    return {
      backgroundColor: computed.backgroundColor,
      color: computed.color,
    };
  });

  console.log('\n=== BUTTON AFTER HOVER ===');
  console.log('Background:', afterStyles.backgroundColor);
  console.log('Text Color:', afterStyles.color);

  // Check .mat-button-wrapper specifically
  const wrapper = button.locator('.mat-button-wrapper');
  const wrapperStyles = await wrapper.evaluate((el) => {
    const computed = window.getComputedStyle(el);
    return {
      color: computed.color,
      display: computed.display,
    };
  });

  console.log('\n=== .mat-button-wrapper (where text lives) ===');
  console.log('Color:', wrapperStyles.color);
  console.log('Display:', wrapperStyles.display);

  // Check if there are any span elements inside wrapper that might be overriding
  const spans = wrapper.locator('span');
  const spanCount = await spans.count();
  console.log('\n=== Spans inside wrapper:', spanCount);

  for (let i = 0; i < spanCount; i++) {
    const spanColor = await spans.nth(i).evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        color: computed.color,
        className: el.className,
        textContent: el.textContent?.trim(),
      };
    });
    console.log(`Span ${i}:`, spanColor);
  }

  // Check the actual text node directly
  const textColor = await wrapper.evaluate((el) => {
    // Get the first text node child
    for (const child of el.childNodes) {
      if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
        const range = document.createRange();
        range.selectNode(child);
        const tempSpan = document.createElement('span');
        tempSpan.style.cssText = 'all: inherit;';
        range.surroundContents(tempSpan);
        const color = window.getComputedStyle(tempSpan).color;
        tempSpan.replaceWith(child);
        return color;
      }
    }
    return 'No text node found';
  });

  console.log('\n=== Direct text node color:', textColor);

  // Get all CSS rules that apply to the button on hover
  const hoverRules = await button.evaluate((el) => {
    const rules: string[] = [];
    const sheets = Array.from(document.styleSheets);

    for (const sheet of sheets) {
      try {
        const cssRules = Array.from(sheet.cssRules || []);
        for (const rule of cssRules) {
          if (rule instanceof CSSStyleRule) {
            const selector = rule.selectorText;
            if (selector && selector.includes(':hover') && selector.includes('mat-raised-button')) {
              rules.push(`${selector} { ${rule.style.cssText} }`);
            }
          }
        }
      } catch (e) {
        // Skip sheets we can't access
      }
    }
    return rules;
  });

  console.log('\n=== All hover rules for mat-raised-button ===');
  hoverRules.forEach(rule => console.log(rule));
});
