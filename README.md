# ISC Portal Prototype

**Purpose**: Functional prototype matching the exact tech stack of the Comcast Business ISC Portal for UX testing and solution validation.

**Status**: ✅ Complete - Ready for development and testing

---

## Tech Stack

This prototype uses the **exact verified tech stack** from the ISC Portal:

| Component | Version | Purpose |
|-----------|---------|---------|
| **Angular** | 13.3.2 | Core framework |
| **Angular Material** | 13.x | UI component library (315+ elements) |
| **TypeScript** | 4.5+ | Type-safe development |
| **Leaflet** | 1.7.1 | Interactive mapping (future integration) |
| **Webpack** | 5 | Module bundler with Module Federation support |
| **SCSS** | - | Styling with design tokens |

---

## Quick Start

### Prerequisites

- Node.js 14.x or 16.x (required for Angular 13.3.2)
- npm 6+ or yarn 1.22+

### Installation

```bash
cd prototype

# Install dependencies
npm install

# Start development server
npm start

# Open browser to http://localhost:4200
```

### Build

```bash
# Development build
npm run build

# Production build
npm run build --configuration=production
```

---

## Project Structure

```
prototype/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── dashboard/           # Dashboard with widgets (Issue #1 solution demo)
│   │   │   ├── sites-list/          # Sites table with bulk actions (Issues #4, #5)
│   │   │   ├── header/              # Global search + customer switcher (Issues #3, #8)
│   │   │   ├── sidebar/             # Navigation menu
│   │   │   ├── status-badge/        # Reusable status badges (Design system)
│   │   │   ├── error-state/         # Structured error component (Issue #1)
│   │   │   └── empty-state/         # Contextual empty states (Issue #2)
│   │   ├── app.component.*          # Root component with layout
│   │   ├── app.module.ts            # Module configuration
│   │   └── app-routing.module.ts    # Route definitions
│   ├── styles.scss                  # Global styles + design tokens
│   ├── index.html                   # App entry point
│   └── main.ts                      # Bootstrap file
├── angular.json                     # Angular CLI configuration
├── package.json                     # Dependencies (Angular 13.3.2)
├── tsconfig.json                    # TypeScript configuration
└── README.md                        # This file
```

---

## Design System Implementation

### Color Tokens

The prototype implements the full ISC Portal design token system identified in the design system analysis:

```css
/* Interactive Colors - Single blue for consistency */
--color-interactive-default: #0D62FF;  /* Primary actions */
--color-interactive-hover: #0A4ECC;    /* Hover states */
--color-interactive-pressed: #102F65;  /* Pressed states */

/* Status Colors */
--color-success: #1E8500;  /* Active, healthy states */
--color-warning: #E65100;  /* Pending, attention needed */
--color-error: #D32F2F;    /* Errors, critical issues */
--color-info: #00838F;     /* Informational messages */

/* Focus Ring - WCAG 2.1 Compliance */
--color-focus-ring: #0D62FF;
--focus-ring-width: 3px;
--focus-ring-offset: 2px;
```

**Key Design System Features**:
- ✅ Single blue (#0D62FF) for ALL interactive elements (solves button hierarchy issue)
- ✅ Error Red (#D32F2F) defined and implemented
- ✅ Focus ring specification for accessibility
- ✅ CSS custom properties enforced throughout
- ✅ No hard-coded hex values in components

### Button Hierarchy

The prototype implements the recommended button hierarchy from the design system analysis:

| Button Type | Use Case | Class | Example |
|-------------|----------|-------|---------|
| **Primary** | Main action per page | `.btn-primary` | "Create Ticket", "Save" |
| **Secondary** | Supporting actions | `.btn-secondary` | "Cancel", "Filter" |
| **Tertiary** | Low-emphasis actions | `.btn-tertiary` | "Learn More", "Skip" |
| **Destructive** | Delete/remove actions | `.btn-destructive` | "Delete Site", "Remove" |

**Usage**:
```html
<button mat-raised-button class="btn-primary">Primary Action</button>
<button mat-stroked-button class="btn-secondary">Secondary Action</button>
<button mat-button class="btn-tertiary">Tertiary Action</button>
<button mat-raised-button class="btn-destructive">Delete</button>
```

---

## UX Issue Solutions Demonstrated

This prototype includes working examples of solutions for the critical issues identified in the heuristic analysis:

### ✅ Issue #1: Error Handling & Recovery

**Component**: `ErrorStateComponent`

**Location**: `src/app/components/error-state/`

**Features**:
- Structured error messages with error codes
- Timestamps for support reference
- Clear recovery actions (Retry, Contact Support)
- Copy error details to clipboard
- Contextual help text

**Demo**:
```html
<app-error-state
  errorCode="SD-WAN-503"
  errorMessage="Unable to load SD-WAN configuration"
  errorDetails="The SD-WAN service is temporarily unavailable. This is usually resolved within a few minutes."
  [timestamp]="now"
  [showRetry]="true"
  [showContact]="true"
  (retry)="onRetry()"
  (contactSupport)="onContactSupport()">
</app-error-state>
```

---

### ✅ Issue #2: Empty State Communication

**Component**: `EmptyStateComponent`

**Location**: `src/app/components/empty-state/`

**Features**:
- Contextual explanations (not just "No data found")
- Action buttons to resolve the empty state
- Appropriate icons for context
- Used in Sites table when no results

**Demo**:
```html
<app-empty-state
  icon="location_on"
  title="No sites found"
  message="Try adjusting your search or filters to find what you're looking for."
  actionLabel="Add Site"
  actionIcon="add"
  (action)="onAddSite()">
</app-empty-state>
```

---

### ✅ Issue #3: Global Search

**Component**: `HeaderComponent`

**Location**: `src/app/components/header/`

**Features**:
- Global search bar in header (always accessible)
- Keyboard shortcut (Cmd/Ctrl + K)
- Placeholder shows searchable entity types
- Search icon for visibility

**Implementation**: `header.component.html` lines 9-19

---

### ✅ Issue #4: Bulk Operations

**Component**: `SitesListComponent`

**Location**: `src/app/components/sites-list/`

**Features**:
- Checkboxes for row selection
- Bulk actions bar appears when items selected
- Shows count of selected items
- Export and Delete actions enabled
- Master checkbox for select all

**Implementation**: `sites-list.component.html` lines 33-46

---

### ✅ Issue #5: Confirmation Dialogs

**Component**: `SitesListComponent` (embedded confirmation)

**Location**: `src/app/components/sites-list/`

**Features**:
- Warning icon and color scheme
- Clear description of destructive action
- Confirmation required before delete
- Cancel and Delete buttons with distinct styling

**Implementation**: `sites-list.component.html` lines 48-62

---

### ✅ Issue #6: Button Hierarchy

**Solution**: Design token system + button classes

**Location**: `src/styles.scss` lines 165-232

**Features**:
- Clear visual hierarchy (Primary > Secondary > Tertiary > Destructive)
- Consistent styling across all components
- CSS custom properties enforce design tokens
- No hard-coded colors

**Examples**: Dashboard Quick Actions, Sites List Actions

---

### ✅ Issue #8: Customer Switching

**Component**: `HeaderComponent`

**Location**: `src/app/components/header/`

**Features**:
- Customer selector in header (always visible)
- Dropdown with customer list
- No need to logout/login to switch
- Immediately updates context

**Implementation**: `header.component.html` lines 25-35

---

## Angular Material Components Used

The prototype uses the same Angular Material components detected in the ISC Portal:

| Component | Usage | Location |
|-----------|-------|----------|
| `mat-toolbar` | Header | `HeaderComponent` |
| `mat-sidenav` | Sidebar navigation | `AppComponent` |
| `mat-nav-list` | Navigation menu | `SidebarComponent` |
| `mat-icon` | Icons throughout | All components |
| `mat-menu` | Dropdown menus | Header, Sites table actions |
| `mat-form-field` | Form inputs | Search, filters |
| `mat-select` | Dropdowns | Customer selector, filters |
| `mat-table` | Data tables | Sites list |
| `mat-paginator` | Table pagination | Sites list |
| `mat-card` | Content containers | Dashboard widgets |
| `mat-chip` | Status badges | Via `StatusBadgeComponent` |
| `mat-button` | Buttons | All components |
| `mat-checkbox` | Bulk selection | Sites table |

---

## Customization & Extension

### Adding New Components

1. Generate component:
```bash
ng generate component components/my-component
```

2. Import required Material modules in `app.module.ts`

3. Use design tokens from `styles.scss`:
```scss
.my-component {
  color: var(--color-interactive-default);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
}
```

### Extending Design Tokens

Edit `src/styles.scss`:

```scss
:root {
  /* Add new tokens */
  --color-my-new-color: #HEXCODE;
  --spacing-my-spacing: 20px;
}
```

### Adding Routes

Edit `src/app/app-routing.module.ts`:

```typescript
const routes: Routes = [
  { path: 'my-route', component: MyComponent }
];
```

---

## Material Theme Customization

The prototype uses a custom Angular Material theme matching ISC Portal colors.

**Location**: `src/styles.scss` lines 1-70

**Customization**:

```scss
// Primary palette (Interactive Blue)
$isc-primary: mat.define-palette((
  500: #0D62FF,  // Main interactive color
  600: #0A4ECC,  // Hover
  700: #102F65,  // Pressed
));

// Warn palette (Error Red)
$isc-warn: mat.define-palette((
  500: #D32F2F,  // Error color
));
```

---

## Testing UX Solutions

### Manual Testing Checklist

**Error Handling** (Issue #1):
- [ ] Navigate to a page with error state
- [ ] Verify error code is displayed
- [ ] Verify timestamp is shown
- [ ] Click "Try Again" - verify retry behavior
- [ ] Click "Copy Details" - verify clipboard

**Empty States** (Issue #2):
- [ ] Clear all sites from table (or search with no results)
- [ ] Verify contextual message appears
- [ ] Verify "Add Site" action button is present
- [ ] Click action - verify behavior

**Global Search** (Issue #3):
- [ ] Press Cmd+K (Mac) or Ctrl+K (Windows)
- [ ] Verify search field receives focus
- [ ] Type search query
- [ ] Verify placeholder text is helpful

**Bulk Operations** (Issue #4):
- [ ] Select 2+ sites using checkboxes
- [ ] Verify bulk actions bar appears
- [ ] Verify selected count is correct
- [ ] Click "Export" - verify behavior
- [ ] Click "Delete" - verify confirmation appears

**Confirmation Dialogs** (Issue #5):
- [ ] Select sites and click "Delete"
- [ ] Verify warning icon and message appear
- [ ] Click "Cancel" - verify dialog closes
- [ ] Click "Delete" - verify action executes

**Button Hierarchy** (Issue #6):
- [ ] Navigate to Dashboard
- [ ] Verify primary buttons are visually distinct (blue background)
- [ ] Verify secondary buttons are outlined
- [ ] Verify no two primary buttons compete for attention

**Customer Switching** (Issue #8):
- [ ] Click customer selector in header
- [ ] Select different customer from dropdown
- [ ] Verify customer name updates
- [ ] Verify no page reload required

---

## Accessibility (WCAG 2.1)

The prototype implements accessibility features from the design system analysis:

- ✅ **Focus Rings**: 3px solid blue with 2px white offset
- ✅ **Color Contrast**: All text meets AA minimum (4.5:1 for normal text)
- ✅ **Keyboard Navigation**: All interactive elements accessible via Tab
- ✅ **Icon + Text**: Status badges use both icon and text (not color alone)
- ✅ **ARIA Labels**: Angular Material components include built-in ARIA

**Testing**:
```bash
# Navigate entire app using only keyboard
Tab, Shift+Tab, Enter, Space, Arrow keys

# Use browser DevTools Lighthouse for accessibility audit
# Target: WCAG 2.1 Level AA compliance
```

---

## Leaflet Integration (Future)

The prototype includes Leaflet 1.7.1 for future map integration.

**Example Integration**:

```typescript
import * as L from 'leaflet';

export class SiteMapComponent implements OnInit {
  ngOnInit() {
    const map = L.map('map').setView([37.7749, -122.4194], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  }
}
```

---

## Module Federation (Future)

The prototype is configured for Webpack 5 Module Federation for micro-frontend architecture.

**Configuration**: `angular.json`

**Future Use Cases**:
- Split portal into independent micro-apps (Dashboard, Sites, Reports)
- Independent deployment per micro-app
- Shared component libraries
- Reduced bundle sizes

---

## Common Issues & Solutions

### Issue: `npm install` fails

**Solution**:
```bash
# Verify Node.js version (must be 14.x or 16.x for Angular 13)
node -v

# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

---

### Issue: Port 4200 already in use

**Solution**:
```bash
# Use different port
ng serve --port 4201

# Or kill process using port 4200
lsof -ti:4200 | xargs kill -9
```

---

### Issue: Material styles not loading

**Solution**:
Verify `angular.json` includes Material CSS:
```json
"styles": [
  "./node_modules/@angular/material/prebuilt-themes/indigo-pink.css",
  "src/styles.scss"
]
```

---

## Next Steps

### Immediate (Prototyping Phase)

1. **Run the prototype**:
   ```bash
   cd prototype
   npm install
   npm start
   ```

2. **Test UX solutions** using checklist above

3. **Gather feedback** from stakeholders:
   - Design team: Does this solve the button hierarchy issue?
   - Account Managers: Is customer switching intuitive?
   - Product team: Are empty states contextual enough?

4. **Iterate** based on feedback

### Short-Term (Implementation Phase)

1. **Validate solutions** with usability testing

2. **Create detailed specifications** for each solution

3. **Estimate development effort** with engineering team

4. **Integrate** validated solutions into ISC Portal codebase

5. **Measure improvement**:
   - System issues: 81% → 50% (target)
   - pNPS: -4 → +5 (target)
   - Task completion time: Baseline → -30%

---

## Support & Resources

### Documentation

- [Angular 13 Documentation](https://v13.angular.io/docs)
- [Angular Material 13 Components](https://v13.material.angular.io/components/categories)
- [Leaflet Documentation](https://leafletjs.com/reference-1.7.1.html)

### Analysis Documents

- **Master Synthesis**: `/MASTER_SYNTHESIS_FINAL.md` - Complete heuristic analysis
- **Design System**: `/DESIGN_SYSTEM_ANALYSIS.md` - Color palette & design tokens
- **Tech Stack**: `/ISC_PORTAL_TECH_STACK_ANALYSIS.md` - Verified tech stack details
- **Complete Index**: `/COMPLETE_ANALYSIS_INDEX.md` - Navigation guide

### Contact

For questions about the prototype or analysis:
- Review analysis documents in `/Users/rwinze026/Projects/ISC Analysis/`
- Reference issue numbers (e.g., "Issue #1: Error Handling")
- Check `MASTER_SYNTHESIS_FINAL.md` for complete recommendations

---

## License

This prototype is for internal evaluation and testing purposes only.

---

**Last Updated**: 2025-10-14
**Prototype Version**: 1.0.0
**Angular Version**: 13.3.2 ✅
**Material Version**: 13.x ✅
**Status**: ✅ Ready for Testing
