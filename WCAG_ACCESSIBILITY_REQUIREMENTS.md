# WCAG 2.1 Accessibility Requirements for ISC Portal
## US Enterprise Compliance Standards

**Company**: Comcast Business
**Product**: ISC Portal (formerly Masergy)
**Standard**: WCAG 2.1 Level AA (Minimum) + Level AAA (Target for Critical Paths)
**Legal Framework**: Section 508, ADA Title III
**Date**: 2025-10-14

---

## Executive Summary

As a US-based enterprise company providing telecommunications services, Comcast Business must comply with:

1. **Americans with Disabilities Act (ADA) Title III** - Web accessibility for public accommodations
2. **Section 508 of the Rehabilitation Act** - Federal accessibility standards
3. **WCAG 2.1 Level AA** - Industry best practice and legal safe harbor

The ISC Portal serves enterprise customers and internal Account Managers, requiring **WCAG 2.1 Level AA compliance** as a baseline with **Level AAA** for critical workflows (ticket creation, circuit management, customer search).

---

## Legal & Compliance Context

### Why WCAG 2.1 Level AA is Required

**ADA Title III Precedent**:
- Gil v. Winn-Dixie (2017): Websites must be accessible under ADA
- Domino's Pizza LLC v. Robles (2019): Supreme Court let stand ruling requiring web accessibility
- Target Corp. settlement (2008): $6M + ongoing compliance monitoring

**Section 508 Requirements**:
- Federal contractors must meet Section 508 (references WCAG 2.0 Level AA)
- WCAG 2.1 Level AA exceeds Section 508 baseline (future-proofed)

**Enterprise Best Practice**:
- 15% of US adults report some form of disability (CDC)
- Inclusive design improves usability for all users (curb-cut effect)
- Reduces legal risk and demonstrates corporate social responsibility

---

## WCAG 2.1 Level AA Requirements (Mandatory)

### Principle 1: Perceivable
Information and user interface components must be presentable to users in ways they can perceive.

---

#### 1.1 Text Alternatives (Level A)

**1.1.1 Non-text Content**
All non-text content must have text alternatives.

**ISC Portal Requirements**:
- ✅ All icons have `aria-label` or adjacent text
- ✅ Status icons have both icon + text (e.g., "Active" with green checkmark)
- ✅ Chart images have `alt` text describing data
- ✅ Decorative images use `alt=""` or `role="presentation"`
- ✅ Site map markers have descriptive labels

**Implementation Example**:
```html
<!-- Bad: Icon only -->
<mat-icon>check_circle</mat-icon>

<!-- Good: Icon + visible text -->
<mat-icon aria-hidden="true">check_circle</mat-icon>
<span>Active</span>

<!-- Good: Icon with aria-label if text not visible -->
<button mat-icon-button aria-label="Refresh dashboard">
  <mat-icon>refresh</mat-icon>
</button>
```

**Testing**:
- Screen reader announces all icons correctly
- No "unlabeled graphic" or "button" announcements
- All status badges announce both icon and text

---

#### 1.2 Time-based Media (Level A)

**1.2.1 Audio-only and Video-only (Prerecorded)**

**ISC Portal Applicability**: Not applicable (no audio/video content)

---

#### 1.3 Adaptable (Level A)

**1.3.1 Info and Relationships**
Information, structure, and relationships conveyed through presentation must be programmatically determinable.

**ISC Portal Requirements**:
- ✅ Semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`)
- ✅ Heading hierarchy (h1 → h2 → h3, no skips)
- ✅ Form labels properly associated (`<label for="id">` or `aria-labelledby`)
- ✅ Tables use proper markup (`<th>`, `scope` attribute)
- ✅ Lists use `<ul>`, `<ol>`, `<li>` (not div soup)
- ✅ ARIA landmarks (`role="navigation"`, `role="main"`, `role="search"`)

**Implementation Example**:
```html
<!-- Bad: Divs without semantic meaning -->
<div class="header">
  <div class="title">Dashboard</div>
</div>

<!-- Good: Semantic HTML -->
<header role="banner">
  <h1>Dashboard</h1>
</header>

<!-- Bad: Table without headers -->
<table>
  <tr><td>Site Name</td><td>Status</td></tr>
</table>

<!-- Good: Table with proper headers -->
<table>
  <thead>
    <tr>
      <th scope="col">Site Name</th>
      <th scope="col">Status</th>
    </tr>
  </thead>
  <tbody>...</tbody>
</table>
```

**Testing**:
- Screen reader announces heading levels correctly
- Form labels announce when field receives focus
- Table headers associate with data cells
- Landmarks allow quick navigation (NVDA Insert+F7)

---

**1.3.2 Meaningful Sequence**
Content reading order must be logical.

**ISC Portal Requirements**:
- ✅ DOM order matches visual order (no CSS that reorders content illogically)
- ✅ Tab order follows visual flow (left→right, top→bottom)
- ✅ Modal dialogs trap focus (no tabbing behind modal)
- ✅ Sidebar navigation before main content in DOM

**Testing**:
- Disable CSS, verify content still makes sense
- Tab through page, verify logical order
- Screen reader navigation follows visual layout

---

**1.3.3 Sensory Characteristics**
Instructions don't rely solely on sensory characteristics (shape, size, location, sound).

**ISC Portal Requirements**:
- ✅ Don't say "Click the green button" (use label: "Click Save")
- ✅ Don't say "See sidebar on the right" (use proper link: "View navigation menu")
- ✅ Status indicators use text + icon (not color alone)

**Implementation Example**:
```html
<!-- Bad: Relies on color only -->
<span style="color: red;">Error</span>

<!-- Good: Icon + text + semantic color -->
<span class="status-error">
  <mat-icon>error</mat-icon>
  <span>Error</span>
</span>
```

---

**1.3.4 Orientation** (Level AA)
Content doesn't restrict display to single orientation (portrait/landscape).

**ISC Portal Requirements**:
- ✅ No `orientation: portrait` CSS locks
- ✅ Responsive design works in both orientations
- ✅ Dashboard widgets reflow on rotation

**Testing**:
- Test on tablet in portrait and landscape
- Verify no content loss or horizontal scrolling

---

**1.3.5 Identify Input Purpose** (Level AA)
Autocomplete attributes on form inputs.

**ISC Portal Requirements**:
- ✅ Email fields: `autocomplete="email"`
- ✅ Name fields: `autocomplete="name"`
- ✅ Phone fields: `autocomplete="tel"`
- ✅ Address fields: `autocomplete="street-address"`, etc.

**Implementation Example**:
```html
<mat-form-field>
  <mat-label>Email</mat-label>
  <input matInput
         type="email"
         autocomplete="email"
         aria-describedby="email-help">
</mat-form-field>
```

**Benefit**: Browsers/password managers auto-fill correctly, easier for users with cognitive disabilities

---

#### 1.4 Distinguishable (Level A/AA)

**1.4.1 Use of Color** (Level A)
Color is not the only visual means of conveying information.

**ISC Portal Requirements**:
- ✅ Status badges use icon + text + color (not color alone)
- ✅ Required form fields have asterisk or text (not just red border)
- ✅ Error messages have icon + text (not just red text)
- ✅ Chart legends have patterns + colors

**Implementation Example**:
```html
<!-- Bad: Color only -->
<span style="color: green;">Active</span>
<span style="color: red;">Down</span>

<!-- Good: Icon + text + color -->
<app-status-badge type="success" label="Active"></app-status-badge>
<app-status-badge type="error" label="Down"></app-status-badge>
```

**Testing**:
- View in grayscale mode (Chrome DevTools: Rendering > Emulate vision deficiencies > Achromatopsia)
- Verify status still distinguishable

---

**1.4.3 Contrast (Minimum)** (Level AA)
Text and images of text have contrast ratio of at least 4.5:1 (3:1 for large text).

**ISC Portal Requirements**:

| Text Type | Minimum Ratio | ISC Portal Implementation |
|-----------|---------------|---------------------------|
| **Normal text** (<18px or <14px bold) | 4.5:1 | Body text on white: 14.5:1 ✅ |
| **Large text** (≥18px or ≥14px bold) | 3:1 | Headers on white: 11:1 ✅ |
| **UI components** (buttons, form borders) | 3:1 | Primary button: 8.2:1 ✅ |
| **Graphical objects** (icons, status indicators) | 3:1 | Status icons: 4.8:1 ✅ |

**M3 Guaranteed Contrast Ratios**:
```scss
// Primary on White
--md-sys-color-primary: #0D62FF (8.2:1) ✅

// On-Surface on Surface
--md-sys-color-on-surface: #191C1E on #FBFCFE (14.5:1) ✅

// On-Surface-Variant on Surface
--md-sys-color-on-surface-variant: #44474C on #FBFCFE (7.5:1) ✅

// Error on Error Container
--md-sys-color-error: #D32F2F on #FFEBEE (11.8:1) ✅
```

**Testing Tools**:
- Chrome DevTools Lighthouse (automated)
- WebAIM Contrast Checker (manual): https://webaim.org/resources/contrastchecker/
- WAVE browser extension

**Testing**:
- Run Lighthouse audit, verify no contrast failures
- Manually check custom colors not in M3 system

---

**1.4.4 Resize Text** (Level AA)
Text can be resized up to 200% without loss of content or functionality.

**ISC Portal Requirements**:
- ✅ Use relative units (rem, em) not fixed pixels
- ✅ Test at 200% zoom (Ctrl/Cmd + several times)
- ✅ No horizontal scrolling at 200% zoom (1280px viewport)
- ✅ Content doesn't overlap or become unreadable

**Implementation**:
```scss
// Bad: Fixed pixels
.body-text {
  font-size: 14px;
}

// Good: Relative units
.body-text {
  font-size: 0.875rem; // 14px at default 16px root
}
```

**Testing**:
- Zoom browser to 200% (Ctrl/Cmd +)
- Verify all text readable, no overlap
- Check modals and fixed-position elements

---

**1.4.5 Images of Text** (Level AA)
Don't use images of text (use real text).

**ISC Portal Requirements**:
- ✅ Use web fonts, not images for text
- ✅ Use CSS for styled text, not graphics
- ✅ Exception: Logos can be images

**Testing**:
- Verify no decorative text as images
- Logos are exempt (Comcast Business logo OK as image)

---

**1.4.10 Reflow** (Level AA)
Content reflows to single column at 320px width (no horizontal scrolling except for tables/charts).

**ISC Portal Requirements**:
- ✅ Responsive design down to 320px width
- ✅ Dashboard widgets stack vertically on mobile
- ✅ Tables can scroll horizontally (exception allowed)
- ✅ Charts can scroll horizontally (exception allowed)

**Testing**:
- Resize browser to 320px width
- Verify no horizontal scrolling (except tables/charts)
- Check mobile emulation in DevTools

---

**1.4.11 Non-text Contrast** (Level AA)
UI components and graphical objects have contrast ratio of at least 3:1.

**ISC Portal Requirements**:
- ✅ Button borders: 3:1 against background
- ✅ Form field borders: 3:1 against background
- ✅ Focus indicators: 3:1 against background
- ✅ Status icons: 3:1 against background

**M3 Implementation**:
```scss
// Focus indicator (3px blue outline)
*:focus-visible {
  outline: 3px solid var(--md-sys-color-primary); // #0D62FF (8.2:1 on white)
  outline-offset: 2px;
}

// Button outline
.md3-button-outlined {
  border: 1px solid var(--md-sys-color-outline); // #74777C (4.6:1 on white)
}
```

**Testing**:
- Verify all interactive elements have visible borders/outlines
- Check focus indicators on various backgrounds

---

**1.4.12 Text Spacing** (Level AA)
Content doesn't break when text spacing is increased.

**ISC Portal Requirements**:
- ✅ Line height: 1.5× font size
- ✅ Paragraph spacing: 2× font size
- ✅ Letter spacing: 0.12× font size
- ✅ Word spacing: 0.16× font size

**Testing**:
- Apply CSS override with increased spacing
- Verify no overlapping, clipping, or loss of content

```css
/* Test with this CSS override */
* {
  line-height: 1.5 !important;
  letter-spacing: 0.12em !important;
  word-spacing: 0.16em !important;
}
* + * {
  margin-top: 2em !important;
}
```

---

**1.4.13 Content on Hover or Focus** (Level AA)
Hoverable/focusable content (tooltips, dropdowns) must be:
- **Dismissible** (Escape key closes without moving pointer)
- **Hoverable** (Pointer can move over tooltip without it disappearing)
- **Persistent** (Remains visible until hover/focus removed or dismissed)

**ISC Portal Requirements**:
- ✅ Tooltips dismissible with Escape key
- ✅ Dropdowns dismissible with Escape key
- ✅ Tooltips don't disappear when hovering over tooltip itself
- ✅ Tooltips remain until user moves away or presses Escape

**Implementation**:
```typescript
// Tooltip configuration
<button mat-button
        matTooltip="View site details"
        matTooltipShowDelay="500"
        matTooltipHideDelay="300"
        [matTooltipDisabled]="false">
  View Details
</button>
```

**Testing**:
- Hover over tooltips, verify they stay visible
- Press Escape, verify tooltips/dropdowns close
- Move pointer from trigger to tooltip, verify tooltip stays

---

### Principle 2: Operable
User interface components and navigation must be operable.

---

#### 2.1 Keyboard Accessible (Level A)

**2.1.1 Keyboard**
All functionality available via keyboard.

**ISC Portal Requirements**:
- ✅ All buttons reachable via Tab
- ✅ All form fields reachable via Tab
- ✅ All links reachable via Tab
- ✅ Dropdowns operable with Arrow keys
- ✅ Tables sortable via keyboard
- ✅ Modals closable via Escape
- ✅ No keyboard traps (can Tab out of all elements)

**Keyboard Shortcuts**:
| Action | Shortcut | Requirement |
|--------|----------|-------------|
| Navigate forward | Tab | ✅ Required |
| Navigate backward | Shift+Tab | ✅ Required |
| Activate button/link | Enter or Space | ✅ Required |
| Close modal | Escape | ✅ Required |
| Navigate dropdown | Arrow keys | ✅ Required |
| Global search | Ctrl/Cmd+K | ⚠️ Nice to have (already implemented) |

**Testing**:
- Unplug mouse, complete all tasks keyboard-only
- Tab through entire page, verify all elements reachable
- Check modal focus trap (Tab doesn't leave modal)

---

**2.1.2 No Keyboard Trap**
Keyboard focus can always move away from any component.

**ISC Portal Requirements**:
- ✅ Modals allow Escape to close (no permanent trap)
- ✅ Infinite scrolling lists allow Tab to exit
- ✅ Custom components allow Shift+Tab to exit
- ✅ No Flash/Java plugins (inherent keyboard traps)

**Testing**:
- Tab into modal, press Escape, verify modal closes
- Tab through all page elements, verify no traps

---

**2.1.4 Character Key Shortcuts** (Level A)
If single-key shortcuts exist, at least one of:
- Can be turned off
- Can be remapped
- Only active when component focused

**ISC Portal Applicability**:
- No single-key shortcuts currently (Ctrl/Cmd+K is multi-key, exempt)
- If adding shortcuts: Require Ctrl/Cmd/Alt modifier

---

#### 2.2 Enough Time (Level A)

**2.2.1 Timing Adjustable**
If time limit exists, user can turn off, adjust, or extend.

**ISC Portal Requirements**:
- ✅ Session timeout: 30-minute warning before logout
- ✅ User can extend session (no hard timeout without warning)
- ✅ Auto-save in forms (data preserved across sessions)
- ✅ No content that auto-updates faster than user can read

**Implementation Example**:
```typescript
// Session timeout warning
showSessionWarning() {
  const dialog = this.dialog.open(SessionWarningDialog, {
    data: { timeRemaining: 300 } // 5 minutes
  });

  dialog.componentInstance.onExtendSession.subscribe(() => {
    this.authService.extendSession();
  });
}
```

**Testing**:
- Wait for session timeout warning
- Verify 5-minute warning appears
- Verify "Extend Session" button works

---

**2.2.2 Pause, Stop, Hide**
Auto-updating, blinking, or scrolling content can be paused/stopped/hidden.

**ISC Portal Requirements**:
- ✅ Dashboard auto-refresh has pause button
- ✅ No auto-scrolling carousels without pause
- ✅ Loading spinners have timeout (don't spin forever)
- ✅ No blinking/flashing content (seizure risk)

**Implementation Example**:
```html
<div class="dashboard-header">
  <h1>Dashboard</h1>
  <button mat-icon-button
          (click)="toggleAutoRefresh()"
          [attr.aria-label]="autoRefresh ? 'Pause auto-refresh' : 'Resume auto-refresh'">
    <mat-icon>{{ autoRefresh ? 'pause' : 'play_arrow' }}</mat-icon>
  </button>
</div>
```

---

#### 2.3 Seizures and Physical Reactions (Level A/AA)

**2.3.1 Three Flashes or Below Threshold** (Level A)
No content flashes more than 3 times per second.

**ISC Portal Requirements**:
- ✅ No flashing animations
- ✅ Loading spinners rotate smoothly (no flashing)
- ✅ No strobe effects
- ✅ Alerts appear instantly (no fade-in/fade-out flashing)

**Testing**:
- Visual inspection of all animations
- Verify no rapid color changes

---

#### 2.4 Navigable (Level A/AA)

**2.4.1 Bypass Blocks** (Level A)
Skip navigation link to bypass repeated content.

**ISC Portal Requirements**:
- ✅ "Skip to main content" link at top of page
- ✅ Keyboard users can Tab once to activate skip link
- ✅ ARIA landmarks allow screen reader navigation

**Implementation Example**:
```html
<a href="#main-content" class="skip-link">
  Skip to main content
</a>

<header>...</header>
<nav>...</nav>

<main id="main-content" tabindex="-1">
  <!-- Main content here -->
</main>
```

```scss
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  padding: 8px;
  background: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  z-index: 9999;

  &:focus {
    top: 0; // Visible when focused
  }
}
```

**Testing**:
- Press Tab on page load
- Verify skip link appears
- Press Enter, verify focus moves to main content

---

**2.4.2 Page Titled** (Level A)
Pages have descriptive titles.

**ISC Portal Requirements**:
- ✅ Dashboard: "Dashboard - ISC Portal"
- ✅ Sites: "Sites - ISC Portal"
- ✅ Circuits: "Circuits - ISC Portal"
- ✅ Error: "Error - ISC Portal" or specific error message

**Implementation**:
```typescript
// In route component
ngOnInit() {
  this.titleService.setTitle('Dashboard - ISC Portal');
}
```

**Testing**:
- Check browser tab title on each page
- Verify title describes page content

---

**2.4.3 Focus Order** (Level A)
Tab order is logical and intuitive.

**ISC Portal Requirements**:
- ✅ Tab order follows visual layout (left→right, top→bottom)
- ✅ Modal dialogs trap focus within modal
- ✅ No `tabindex` values > 0 (use 0 or -1 only)
- ✅ Focus returns to trigger element when modal closes

**Testing**:
- Tab through page, verify order makes sense
- Open modal, verify focus trapped
- Close modal, verify focus returns to button

---

**2.4.4 Link Purpose (In Context)** (Level A)
Link purpose is clear from link text or context.

**ISC Portal Requirements**:
- ✅ Don't use "Click here" (use descriptive text)
- ✅ Don't use "Read more" without context
- ✅ Link text describes destination: "View site details"

**Implementation Example**:
```html
<!-- Bad: Generic link text -->
<a href="/sites/123">Click here</a>

<!-- Good: Descriptive link text -->
<a href="/sites/123">View details for HQ Building A</a>

<!-- Good: Context provided -->
<h3>HQ Building A</h3>
<a href="/sites/123">View details</a>
```

---

**2.4.5 Multiple Ways** (Level AA)
More than one way to locate a page (navigation + search).

**ISC Portal Requirements**:
- ✅ Sidebar navigation menu
- ✅ Global search (Ctrl/Cmd+K)
- ✅ Breadcrumbs (for deep pages)
- ✅ Recent items list

**Testing**:
- Verify user can reach Sites page via navigation
- Verify user can reach Sites page via global search
- Verify user can reach Sites page via recent items

---

**2.4.6 Headings and Labels** (Level AA)
Headings and labels are descriptive.

**ISC Portal Requirements**:
- ✅ Page headings describe page content ("Sites", "Dashboard")
- ✅ Form labels describe input purpose ("Email Address", not just "Email")
- ✅ Button labels describe action ("Create Ticket", not "Submit")

**Implementation Example**:
```html
<!-- Bad: Generic labels -->
<label>Name</label>
<button>Submit</button>

<!-- Good: Descriptive labels -->
<label for="site-name">Site Name</label>
<button type="submit">Create New Site</button>
```

---

**2.4.7 Focus Visible** (Level AA)
Keyboard focus indicator is visible.

**ISC Portal Requirements**:
- ✅ 3px solid outline in primary color (#0D62FF)
- ✅ 2px white offset for visibility on dark backgrounds
- ✅ Focus indicator never hidden (no `outline: none` without replacement)
- ✅ Contrast ratio 3:1 against adjacent colors

**M3 Implementation**:
```scss
*:focus-visible {
  outline: 3px solid var(--md-sys-color-primary);
  outline-offset: 2px;
  border-radius: var(--md-sys-shape-corner-extra-small);
}
```

**Testing**:
- Tab through page, verify blue outline visible on all elements
- Test on light and dark backgrounds
- Verify focus indicator doesn't cut off

---

**2.5 Input Modalities** (Level A/AA)

**2.5.1 Pointer Gestures** (Level A)
All multi-point or path-based gestures have single-pointer alternative.

**ISC Portal Applicability**:
- No pinch-to-zoom required (standard browser zoom works)
- No drag-to-sort required (provide move up/down buttons)
- No swipe gestures required (provide navigation buttons)

---

**2.5.2 Pointer Cancellation** (Level A)
Single-pointer actions can be aborted or undone.

**ISC Portal Requirements**:
- ✅ Click uses `mouseup` event (can abort by moving pointer away before releasing)
- ✅ Destructive actions have confirmation dialogs
- ✅ Undo available after non-destructive actions (toast with undo)

---

**2.5.3 Label in Name** (Level A)
Visible label text is included in accessible name.

**ISC Portal Requirements**:
- ✅ Button text matches `aria-label` (if `aria-label` used)
- ✅ Form label matches `aria-labelledby` text

**Implementation Example**:
```html
<!-- Bad: aria-label doesn't match visible text -->
<button aria-label="Submit form">Create Ticket</button>

<!-- Good: aria-label matches or omitted (uses visible text) -->
<button>Create Ticket</button>

<!-- Good: aria-label extends visible text -->
<button aria-label="Create Ticket for HQ Building A">Create Ticket</button>
```

---

**2.5.4 Motion Actuation** (Level A)
Device motion (shake, tilt) is not required.

**ISC Portal Applicability**: Not applicable (no device motion features)

---

### Principle 3: Understandable
Information and operation of user interface must be understandable.

---

#### 3.1 Readable (Level A/AA)

**3.1.1 Language of Page** (Level A)
Page language is programmatically determined.

**ISC Portal Requirements**:
- ✅ `<html lang="en">` attribute set
- ✅ If content has multiple languages, use `lang` on elements

**Implementation**:
```html
<!doctype html>
<html lang="en">
<head>
  <title>ISC Portal</title>
</head>
```

---

**3.1.2 Language of Parts** (Level AA)
Language of passages/phrases is programmatically determined.

**ISC Portal Applicability**: All content in English (no multi-language content currently)

---

#### 3.2 Predictable (Level A/AA)

**3.2.1 On Focus** (Level A)
Focusing on element doesn't cause unexpected context changes.

**ISC Portal Requirements**:
- ✅ Tabbing to form field doesn't submit form
- ✅ Focusing on dropdown doesn't open dropdown (requires Enter or click)
- ✅ No pop-ups on focus

**Testing**:
- Tab through all form fields
- Verify no unexpected actions

---

**3.2.2 On Input** (Level A)
Changing input doesn't cause unexpected context changes.

**ISC Portal Requirements**:
- ✅ Typing in search field doesn't navigate away (wait for Enter or button click)
- ✅ Selecting dropdown option doesn't submit form (wait for Submit button)
- ✅ Checking checkbox doesn't navigate or cause page reload

**Implementation Example**:
```html
<!-- Bad: Form submits on dropdown change -->
<mat-select (selectionChange)="submitForm()">...</mat-select>

<!-- Good: Dropdown changes value, separate submit button -->
<mat-select [(ngModel)]="status">...</mat-select>
<button mat-raised-button (click)="submitForm()">Apply Filter</button>
```

---

**3.2.3 Consistent Navigation** (Level AA)
Navigation mechanism is consistent across pages.

**ISC Portal Requirements**:
- ✅ Sidebar navigation in same location on all pages
- ✅ Header with search and user menu in same location
- ✅ Navigation items in same order

**Testing**:
- Navigate between pages
- Verify navigation structure consistent

---

**3.2.4 Consistent Identification** (Level AA)
Components with same functionality are identified consistently.

**ISC Portal Requirements**:
- ✅ All edit buttons use same icon and label ("Edit")
- ✅ All delete buttons use same icon and label ("Delete")
- ✅ All save buttons use same styling and label ("Save")

**Testing**:
- Check button labels across pages
- Verify consistency

---

#### 3.3 Input Assistance (Level A/AA)

**3.3.1 Error Identification** (Level A)
Errors are identified and described to user.

**ISC Portal Requirements**:
- ✅ Form validation errors shown clearly
- ✅ Error messages identify which field has error
- ✅ Error messages explain what's wrong: "Email address is required"
- ✅ Error messages use error color + icon + text (not color alone)

**Implementation Example**:
```html
<mat-form-field>
  <mat-label>Email Address</mat-label>
  <input matInput
         type="email"
         [formControl]="emailControl"
         required>
  <mat-error *ngIf="emailControl.hasError('required')">
    Email address is required
  </mat-error>
  <mat-error *ngIf="emailControl.hasError('email')">
    Please enter a valid email address
  </mat-error>
</mat-form-field>
```

---

**3.3.2 Labels or Instructions** (Level A)
Form fields have labels or instructions.

**ISC Portal Requirements**:
- ✅ All form fields have visible labels
- ✅ Required fields marked with asterisk (*) or "Required" text
- ✅ Input format examples provided ("MM/DD/YYYY")
- ✅ Helper text explains purpose ("This will be your login email")

**Implementation Example**:
```html
<mat-form-field>
  <mat-label>Email Address *</mat-label>
  <input matInput
         type="email"
         required
         aria-describedby="email-help">
  <mat-hint id="email-help">
    This will be used for account notifications
  </mat-hint>
</mat-form-field>
```

---

**3.3.3 Error Suggestion** (Level AA)
When error detected, suggestions for correction provided.

**ISC Portal Requirements**:
- ✅ Invalid email: "Please enter a valid email address (example: user@company.com)"
- ✅ Weak password: "Password must contain at least 8 characters, including uppercase, lowercase, and numbers"
- ✅ Date out of range: "Please select a date between 01/01/2020 and today"

**Implementation Example**:
```html
<mat-error *ngIf="passwordControl.hasError('minlength')">
  Password must be at least 8 characters long
</mat-error>
<mat-error *ngIf="passwordControl.hasError('pattern')">
  Password must include uppercase, lowercase, and numbers (example: MyPass123)
</mat-error>
```

---

**3.3.4 Error Prevention (Legal, Financial, Data)** (Level AA)
Submissions can be reversed, checked, or confirmed.

**ISC Portal Requirements**:
- ✅ Destructive actions (delete site, delete circuit) require confirmation
- ✅ Confirmation dialog explains consequence: "Are you sure? This action cannot be undone."
- ✅ Forms allow review before submission (multi-step forms)
- ✅ Account changes (email, password) require confirmation
- ✅ Financial transactions require confirmation (if applicable)

**Implementation Example**:
```typescript
// Confirmation dialog before delete
deleteSite(site: Site) {
  const dialog = this.dialog.open(ConfirmDialog, {
    data: {
      title: 'Confirm Deletion',
      message: `Are you sure you want to delete "${site.name}"? This action cannot be undone.`,
      confirmLabel: 'Delete',
      confirmColor: 'warn'
    }
  });

  dialog.afterClosed().subscribe(confirmed => {
    if (confirmed) {
      this.siteService.delete(site.id);
    }
  });
}
```

---

### Principle 4: Robust
Content must be robust enough to be interpreted by a wide variety of user agents, including assistive technologies.

---

#### 4.1 Compatible (Level A/AA)

**4.1.1 Parsing** (Level A)
HTML is valid (no duplicate IDs, proper nesting).

**ISC Portal Requirements**:
- ✅ No duplicate `id` attributes
- ✅ Elements properly nested (no `<div>` inside `<p>`)
- ✅ All tags closed properly
- ✅ Attributes quoted properly

**Testing**:
- W3C HTML Validator: https://validator.w3.org/
- Check Chrome DevTools Console for HTML errors

---

**4.1.2 Name, Role, Value** (Level A)
UI components have programmatically determined name, role, and value.

**ISC Portal Requirements**:
- ✅ All form controls have accessible names (label or aria-label)
- ✅ All buttons have accessible names (text or aria-label)
- ✅ Custom components use proper ARIA roles
- ✅ State changes are programmatically indicated (aria-expanded, aria-selected)

**Implementation Example**:
```html
<!-- Button with accessible name -->
<button mat-icon-button aria-label="Refresh dashboard">
  <mat-icon>refresh</mat-icon>
</button>

<!-- Dropdown with state -->
<button [attr.aria-expanded]="isOpen"
        aria-haspopup="true"
        (click)="toggle()">
  Customer Selector
</button>

<!-- Custom toggle with role -->
<div role="switch"
     [attr.aria-checked]="autoRefresh"
     tabindex="0"
     (click)="toggleAutoRefresh()"
     (keydown.enter)="toggleAutoRefresh()"
     (keydown.space)="toggleAutoRefresh()">
  Auto-refresh: {{ autoRefresh ? 'On' : 'Off' }}
</div>
```

---

**4.1.3 Status Messages** (Level AA)
Status messages can be programmatically determined.

**ISC Portal Requirements**:
- ✅ Success toasts use `role="status"` or `aria-live="polite"`
- ✅ Error alerts use `role="alert"` or `aria-live="assertive"`
- ✅ Loading states announced with `aria-busy="true"` or `aria-live="polite"`

**Implementation Example**:
```html
<!-- Success toast -->
<div class="toast toast-success"
     role="status"
     aria-live="polite">
  Site created successfully
</div>

<!-- Error alert -->
<div class="alert alert-error"
     role="alert"
     aria-live="assertive">
  Unable to save changes. Please try again.
</div>

<!-- Loading state -->
<div class="loading-spinner"
     role="status"
     aria-live="polite"
     aria-label="Loading dashboard data">
  <mat-spinner></mat-spinner>
</div>
```

---

## WCAG 2.1 Level AAA Recommendations (Critical Paths Only)

For **critical workflows** (ticket creation, circuit management, customer search), target Level AAA:

### 1.4.6 Contrast (Enhanced) - Level AAA
Text and images of text have contrast ratio of at least 7:1 (4.5:1 for large text).

**ISC Portal Target**:
- Body text on white: 14.5:1 ✅ (already exceeds)
- Primary button text: 8.2:1 ✅ (already exceeds)
- Link text: 8.2:1 ✅ (already exceeds)

---

### 2.4.8 Location - Level AAA
Information about user's location within site is available.

**ISC Portal Implementation**:
- ✅ Breadcrumbs on deep pages: Home > Sites > HQ Building A
- ✅ Active navigation item highlighted

---

### 2.4.9 Link Purpose (Link Only) - Level AAA
Link purpose is clear from link text alone (without context).

**ISC Portal Implementation**:
- Use: "View details for HQ Building A" (not just "View details")
- Use: "Edit Circuit CIR-2847" (not just "Edit")

---

### 2.4.10 Section Headings - Level AAA
Section headings organize content.

**ISC Portal Implementation**:
- ✅ Dashboard sections have headings ("Recent Activity", "Quick Actions")
- ✅ Forms have section headings ("Site Information", "Contact Details")

---

### 3.1.3 Unusual Words - Level AAA
Definitions available for unusual words, idioms, jargon.

**ISC Portal Implementation**:
- ✅ Technical terms have tooltips: "SD-WAN (Software-Defined Wide Area Network)"
- ✅ Acronyms expanded on first use: "SLA (Service Level Agreement)"

---

### 3.2.5 Change on Request - Level AAA
Context changes occur only on user request.

**ISC Portal Implementation**:
- ✅ No automatic redirects
- ✅ No automatic form submission
- ✅ Auto-refresh can be paused

---

### 3.3.5 Help - Level AAA
Context-sensitive help is available.

**ISC Portal Implementation**:
- ✅ Help icons next to complex fields
- ✅ Link to knowledge base articles
- ✅ Contextual tooltips on hover

---

### 3.3.6 Error Prevention (All) - Level AAA
Confirmation required for all submissions.

**ISC Portal Implementation** (Critical workflows only):
- ✅ Ticket creation: Review before submit
- ✅ Circuit order: Multi-step with review
- ✅ Account changes: Confirmation required

---

## Testing & Validation Requirements

### Automated Testing (CI/CD Pipeline)

**Tool**: Lighthouse CI (Chrome DevTools)
**Frequency**: Every build
**Threshold**: Accessibility score ≥ 95

```bash
# Add to CI/CD pipeline
npm install -g @lhci/cli

lhci autorun \
  --collect.url=http://localhost:4200/dashboard \
  --collect.url=http://localhost:4200/sites \
  --assert.preset=lighthouse:recommended \
  --assert.assertions.categories:accessibility=95
```

**Tool**: axe-core (Automated WCAG testing)
**Frequency**: Every PR
**Threshold**: 0 critical/serious violations

```bash
# Add to e2e tests
npm install --save-dev @axe-core/playwright

// In test file
test('Dashboard accessibility', async ({ page }) => {
  await page.goto('/dashboard');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toHaveLength(0);
});
```

---

### Manual Testing (Pre-Release)

**Keyboard Navigation Testing**:
- [ ] All interactive elements reachable via Tab
- [ ] Focus order is logical
- [ ] Escape closes modals/dropdowns
- [ ] No keyboard traps
- [ ] Focus indicators visible

**Screen Reader Testing**:
- [ ] NVDA (Windows - free): Test all pages
- [ ] JAWS (Windows - paid): Test critical workflows
- [ ] VoiceOver (Mac - built-in): Test all pages
- [ ] All content announced correctly
- [ ] Headings announce level
- [ ] Form labels announce with fields
- [ ] Status updates announced

**Visual Testing**:
- [ ] 200% zoom: No horizontal scrolling, no overlap
- [ ] High contrast mode: All content visible
- [ ] Colorblind simulation (Protanopia, Deuteranopia, Tritanopia): Status distinguishable
- [ ] Dark mode (if applicable): Contrast maintained

---

### Third-Party Audit (Annually)

**Recommended Vendors**:
- Deque Systems (axe audits)
- Level Access
- TPGi (The Paciello Group)

**Audit Scope**:
- WCAG 2.1 Level AA comprehensive audit
- Representative sample of pages (Dashboard, Sites, Circuits, Reports, Forms)
- Critical user workflows (ticket creation, circuit ordering)
- Assistive technology testing (screen readers, voice control)

**Deliverable**: VPAT (Voluntary Product Accessibility Template)

---

## Accessibility Statement (Required)

**Location**: `/accessibility` page on ISC Portal

**Content**:
```markdown
# Accessibility Statement for ISC Portal

Comcast Business is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.

## Conformance Status

The ISC Portal is **partially conformant** with WCAG 2.1 Level AA. Partially conformant means that some parts of the content do not fully conform to the accessibility standard.

## Feedback

We welcome your feedback on the accessibility of ISC Portal. Please contact us:
- Email: accessibility@comcast.com
- Phone: 1-800-XXX-XXXX

We aim to respond to accessibility feedback within 5 business days.

## Compatibility

ISC Portal is designed to be compatible with:
- Chrome, Firefox, Safari, Edge (latest versions)
- JAWS, NVDA, VoiceOver (latest versions)
- Dragon NaturallySpeaking (voice control)

## Technical Specifications

Accessibility of ISC Portal relies on the following technologies:
- HTML5
- CSS3
- JavaScript (Angular 13)
- WAI-ARIA 1.2

## Limitations

Despite our best efforts, some issues may exist:
- [List any known issues with remediation timeline]

## Assessment Approach

Comcast Business assessed the accessibility of ISC Portal by:
- Self-evaluation
- Automated testing (Lighthouse, axe)
- Manual testing (keyboard, screen reader)
- External third-party audit (annually)

**Last Reviewed**: [Date]
**Last Updated**: [Date]
```

---

## Training Requirements

### Developer Training (Required)

**Topics**:
1. WCAG 2.1 Level AA overview
2. Semantic HTML5
3. ARIA roles, states, properties
4. Keyboard accessibility
5. Focus management
6. Color contrast requirements
7. Screen reader testing basics

**Format**: 4-hour workshop + annual refresher
**Vendor**: Deque University (recommended)

---

### Designer Training (Required)

**Topics**:
1. Accessible color palettes
2. Typography for readability
3. Touch target sizes (44×44px minimum)
4. Focus indicator design
5. Error message design
6. Designing for screen readers

**Format**: 3-hour workshop + annual refresher

---

### QA Testing Training (Required)

**Topics**:
1. Automated testing tools (Lighthouse, axe)
2. Manual keyboard testing
3. Screen reader testing (NVDA, JAWS, VoiceOver)
4. Accessibility test plan creation
5. WCAG 2.1 success criteria

**Format**: 8-hour workshop + quarterly practice sessions

---

## Legal Protection & Risk Mitigation

### VPAT (Voluntary Product Accessibility Template)

**Requirement**: Create and maintain VPAT for ISC Portal
**Frequency**: Annual update
**Purpose**: Demonstrates conformance level for enterprise customers

**VPAT Sections**:
1. Product description
2. Evaluation methods
3. Applicable standards (WCAG 2.1, Section 508)
4. Success criteria table (Supports / Partially Supports / Does Not Support)
5. Known limitations and remediation plan

---

### Accessibility Policy

**Requirement**: Written accessibility policy
**Content**:
- Commitment to WCAG 2.1 Level AA
- Testing procedures
- Issue remediation timeline (Critical: 3 days, High: 2 weeks, Medium: 1 month, Low: 3 months)
- Training requirements
- Third-party vendor requirements (must meet same standards)

---

## Success Metrics

### Compliance Metrics

| Metric | Current | Target | Timeline |
|--------|---------|--------|----------|
| **Lighthouse Accessibility Score** | Baseline | 95+ | 3 months |
| **axe Violations (Critical/Serious)** | Baseline | 0 | 3 months |
| **Keyboard Accessibility** | TBD | 100% | 3 months |
| **Screen Reader Compatibility** | TBD | 100% | 6 months |
| **WCAG 2.1 Level AA Conformance** | Partial | Full | 6 months |

---

### User Impact Metrics

| Metric | Current | Target | Timeline |
|--------|---------|--------|----------|
| **Accessibility-related Support Tickets** | Baseline | -50% | 6 months |
| **Assistive Technology User Satisfaction** | Baseline | 4.0/5.0 | 6 months |
| **Task Completion Rate (Keyboard-only)** | Baseline | 95% | 6 months |
| **Task Completion Rate (Screen Reader)** | Baseline | 90% | 6 months |

---

## Summary & Recommendations

### Immediate Actions (0-3 Months)

1. ✅ Implement M3 design system (WCAG contrast ratios guaranteed)
2. [ ] Add focus indicators (3px solid primary color, 2px offset)
3. [ ] Ensure all icons have text alternatives (aria-label or visible text)
4. [ ] Fix keyboard navigation issues (modal traps, tab order)
5. [ ] Add skip navigation link
6. [ ] Implement proper heading hierarchy (h1 → h2 → h3)
7. [ ] Add ARIA landmarks (navigation, main, search)
8. [ ] Run Lighthouse audit, fix critical issues

### Short-Term (3-6 Months)

9. [ ] Manual keyboard testing of all workflows
10. [ ] Screen reader testing (NVDA, JAWS, VoiceOver)
11. [ ] Implement error prevention (confirmation dialogs)
12. [ ] Add context-sensitive help
13. [ ] Ensure form validation with error suggestions
14. [ ] Third-party accessibility audit
15. [ ] Create VPAT document
16. [ ] Publish accessibility statement

### Ongoing

17. [ ] Automated accessibility testing in CI/CD (Lighthouse CI, axe)
18. [ ] Annual third-party audit
19. [ ] Quarterly manual testing
20. [ ] Developer/designer/QA training (annual)
21. [ ] Monitor accessibility-related support tickets
22. [ ] Update VPAT annually

---

**Prepared By**: ISC Portal UX Team
**Approved By**: [Accessibility Officer / Legal / Compliance]
**Next Review**: [Date]

---

**END OF WCAG 2.1 ACCESSIBILITY REQUIREMENTS**
