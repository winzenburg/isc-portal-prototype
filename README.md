# ISC Portal Usability Analysis Prototype

> **Interactive prototype demonstrating solutions to critical usability issues in the Comcast Business ISC Portal**

[![Angular](https://img.shields.io/badge/Angular-13.3.2-DD0031?logo=angular)](https://angular.io/)
[![Material Design](https://img.shields.io/badge/Material%20Design-3-757575?logo=material-design)](https://material.angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.5+-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Internal-blue)]()

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Quick Start](#quick-start)
- [Usability Improvements Demonstrated](#usability-improvements-demonstrated)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Testing](#testing)
- [Documentation](#documentation)
- [Contributing](#contributing)

---

## 🎯 Overview

This prototype addresses critical usability issues identified in the Comcast Business ISC Portal (formerly Masergy) through comprehensive heuristic analysis based on:

- **Nielsen's 10 Usability Heuristics**
- **Q2 2025 Employee Survey** (pNPS: -4, 81% reporting system issues)
- **ISC Portal Focus Group Findings**

The prototype is built with the **exact same tech stack** as the production ISC Portal, ensuring solutions are immediately implementable.

### Business Impact

| Metric | Current | Target |
|--------|---------|--------|
| System Issues | 81% | 50% |
| pNPS Score | -4 | +5 |
| Task Completion Time | Baseline | -30% |

---

## ✨ Key Features

### 🎨 Material Design 3 Implementation
- Complete M3 design system with color tokens
- Consistent component styling across all pages
- Dark header (RGB 16,47,101) with light primary actions (RGB 13,98,255)

### 🔐 Access Control & Error States
- No-access state pages with contextual help
- Structured error handling with recovery actions
- Empty states with actionable next steps

### 📊 Enhanced Data Tables
- Unified table component with filtering, sorting, and pagination
- Row actions with kebab menus
- Bulk operations with selection
- CSV export functionality
- Editable inline rows

### ⏳ Loading Progress Indicators
- Progressive loading screens (3-5 seconds)
- Status messages and percentage displays
- Prevents user confusion about frozen screens

### 🔍 Command Palette
- Quick access to all major features (Cmd/Ctrl+K)
- Fuzzy search across sites, circuits, contacts
- Keyboard shortcuts for power users

### 📱 Responsive Design
- Mobile-friendly layouts
- Adaptive navigation
- Touch-optimized interactions

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: 14.x or 16.x (required for Angular 13.3.2)
- **npm**: 6+ or yarn 1.22+

### Installation

```bash
# Clone the repository
git clone https://github.com/winzenburg/isc-portal-prototype.git
cd isc-portal-prototype

# Install dependencies
npm install

# Start development server
npm start

# Open browser to http://localhost:4200
```

### Build for Production

```bash
# Production build with optimizations
npm run build --configuration=production

# Output will be in dist/ directory
```

---

## 🎨 Usability Improvements Demonstrated

### 1. Access Control & Error States

**Heuristics Addressed**: #9 (Error Recovery), #10 (Help & Documentation)

**Features**:
- No-access state page (e.g., SD-WAN Orchestrator) with clear explanation
- Support contact information with click-to-call and email
- "Request Access" action buttons
- Contextual help explaining why access is denied

**Demo**: Navigate to `/sd-wan-orchestrator`

---

### 2. Loading Progress Indicators

**Heuristics Addressed**: #1 (Visibility of System Status)

**Features**:
- 5-stage progressive loading with realistic messages
- Visual progress bar with percentage
- Animated icons and smooth transitions
- Prevents "is it frozen?" confusion

**Demo**: Navigate to `/contacts` - watch the 4.5-second loading sequence

---

### 3. Enhanced Table Interactions

**Heuristics Addressed**: #7 (Flexibility & Efficiency), #4 (Consistency)

**Features**:
- Unified table component used across all data pages
- Advanced filtering with drawer
- Column sorting
- Row actions (edit, delete, custom actions)
- Bulk operations with selection
- CSV export
- Persistent filter state
- Editable inline rows

**Demo**: Navigate to `/circuits`, `/sites`, `/clouds`, `/contacts`, etc.

---

### 4. Command Palette

**Heuristics Addressed**: #7 (Flexibility & Efficiency), #6 (Recognition vs Recall)

**Features**:
- Global search accessible via Cmd/Ctrl+K
- Fuzzy search across all major entities
- Keyboard shortcuts for common actions
- Recent searches

**Demo**: Press `Cmd+K` (Mac) or `Ctrl+K` (Windows) from any page

---

### 5. Empty & Error States

**Heuristics Addressed**: #9 (Error Recovery), #2 (System/Real World Match)

**Features**:
- Contextual empty states with helpful explanations
- Actionable next steps
- Appropriate icons and messaging
- Error states with retry and support options

**Demo**: Filter tables to show no results, or check error state demos

---

### 6. Consistent Navigation

**Heuristics Addressed**: #4 (Consistency & Standards), #6 (Recognition vs Recall)

**Features**:
- Left sidebar navigation always visible
- Expandable sections (Network Services, SD-WAN, Tickets & Events)
- Active page highlighting
- Logical information architecture

**Demo**: Navigate through sidebar menu items

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Angular** | 13.3.2 | Core framework (matches ISC Portal) |
| **Angular Material** | 13.x | UI component library (315+ elements) |
| **Material Design 3** | Latest | Design system |
| **TypeScript** | 4.5+ | Type-safe development |
| **SCSS** | - | Styling with CSS custom properties |
| **Leaflet** | 1.7.1 | Map visualization |
| **Chart.js** | via ng2-charts | Dashboard charts |
| **Playwright** | Latest | E2E testing & visual verification |

---

## 📁 Project Structure

```
isc-portal-prototype/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── header/                    # Global header with search
│   │   │   ├── sidebar/                   # Navigation sidebar
│   │   │   ├── landing/                   # Landing page with issue demos
│   │   │   ├── dashboard/                 # Dashboard with charts
│   │   │   ├── no-access-state/           # No-access page component
│   │   │   ├── shared/
│   │   │   │   ├── base-table/            # Unified table component
│   │   │   │   ├── command-palette/       # Global search (Cmd+K)
│   │   │   │   ├── confirmation-dialog/   # Confirmation modals
│   │   │   │   ├── access-denied/         # Access denied component
│   │   │   │   └── sync-status-indicator/ # Loading status
│   │   │   └── pages/
│   │   │       ├── circuits-unified/      # Circuits page
│   │   │       ├── sites-unified/         # Sites page
│   │   │       ├── clouds-unified/        # Clouds page
│   │   │       ├── contacts-unified/      # Contacts page (with loading demo)
│   │   │       ├── tickets-unified/       # Tickets page
│   │   │       └── ... (more pages)
│   │   ├── services/
│   │   │   ├── csv-export.service.ts      # CSV export functionality
│   │   │   ├── table-state.service.ts     # Persist table filters
│   │   │   └── access-control.service.ts  # Access control logic
│   │   ├── app.module.ts                  # Main module
│   │   └── app-routing.module.ts          # Routing configuration
│   ├── styles.scss                        # Global styles + design tokens
│   ├── material-design-3-theme.scss       # M3 theme configuration
│   └── index.html
├── test-*.spec.ts                         # Playwright test files
├── ALIGNMENT_ANALYSIS.md                  # Alignment testing report
├── ACCESS_CONTROL_GUIDE.md                # Access control documentation
├── MATERIAL_DESIGN_3_GUIDE.md             # M3 implementation guide
├── package.json
└── README.md
```

---

## 📸 Screenshots

### Landing Page - Heuristic Issues Overview
Interactive landing page showcasing all identified usability issues with live demos.

### Enhanced Data Tables
Unified table component with filtering, sorting, pagination, and bulk actions.

### Loading Progress Indicator
Progressive 5-stage loading screen with status messages preventing user confusion.

### No-Access State Page
Clear messaging with contextual help and action buttons for requesting access.

### Command Palette (Cmd+K)
Quick access to all major features with fuzzy search.

---

## 🧪 Testing

### Run Development Server

```bash
npm start
# Open http://localhost:4200
```

### Manual Testing Checklist

**Access Control**:
- [ ] Navigate to `/sd-wan-orchestrator`
- [ ] Verify no-access state displays with support information
- [ ] Test "Request Access" and support contact buttons

**Loading Indicators**:
- [ ] Navigate to `/contacts`
- [ ] Observe 5-stage loading progression
- [ ] Verify progress bar and percentage display
- [ ] Confirm smooth transition to loaded state

**Table Interactions**:
- [ ] Navigate to any data page (circuits, sites, clouds)
- [ ] Test filtering, sorting, and pagination
- [ ] Select rows and test bulk actions
- [ ] Export table to CSV
- [ ] Test row actions (kebab menu)

**Command Palette**:
- [ ] Press Cmd+K (Mac) or Ctrl+K (Windows)
- [ ] Type search query
- [ ] Verify fuzzy matching works
- [ ] Test keyboard navigation (arrow keys, enter)

### Automated Testing with Playwright

```bash
# Install Playwright browsers
npx playwright install

# Run alignment tests
npx playwright test test-alignment.spec.ts

# Run visual verification tests
npx playwright test test-visual-center.spec.ts

# Run loading progress tests
npx playwright test test-loading-progress.spec.ts
```

---

## 📚 Documentation

### Design & Analysis Documents

- **ALIGNMENT_ANALYSIS.md** - Comprehensive alignment testing report
- **ACCESS_CONTROL_GUIDE.md** - Access control implementation guide
- **MATERIAL_DESIGN_3_GUIDE.md** - M3 design system implementation
- **EMPTY_STATES_GUIDE.md** - Empty state patterns
- **TABLE_IMPROVEMENTS_SUMMARY.md** - Table component documentation
- **WCAG_ACCESSIBILITY_REQUIREMENTS.md** - Accessibility compliance

### Key Implementation Guides

1. **Creating New Pages**: Use the unified table component as a base
2. **Adding Routes**: Update `app-routing.module.ts`
3. **Styling**: Use CSS custom properties from `styles.scss`
4. **Access Control**: Use `AccessControlService` for permissions

---

## 🎨 Design System

### Color Palette

```scss
/* Primary - Comcast Blue */
--md-sys-color-primary: rgb(13, 98, 255);        // Buttons, links, active states
--md-sys-color-primary-hover: rgb(10, 78, 204);  // Hover states

/* Header - Dark Blue */
--header-background: rgb(16, 47, 101);           // Header bar

/* Status Colors */
--md-sys-color-success: rgb(36, 161, 72);        // Active, healthy
--md-sys-color-warning: rgb(241, 194, 27);       // Pending, attention
--md-sys-color-error: rgb(218, 30, 40);          // Errors, critical
--md-sys-color-info: rgb(13, 98, 255);           // Informational
```

### Typography

- **Display**: 57px / 400 weight - Hero titles
- **Headline**: 32px / 400 weight - Section headers
- **Title**: 22px / 500 weight - Card titles
- **Body**: 16px / 400 weight - Standard text
- **Label**: 14px / 500 weight - Form labels

### Spacing Scale

```scss
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 48px;
```

---

## 🤝 Contributing

This is an internal prototype for demonstrating usability improvements. For questions or suggestions:

1. Review the analysis documents in the `/docs` folder (if available)
2. Reference specific heuristic violations or issues
3. Test proposed solutions in the prototype
4. Gather feedback from stakeholders

---

## 📊 Alignment Testing

Comprehensive alignment testing has been performed using Playwright:

- **8 pages tested**
- **6 pages** with perfect alignment
- **2 pages** flagged (false positives - containers are properly centered)
- See `ALIGNMENT_ANALYSIS.md` for detailed report

Visual verification screenshots available in project root showing proper centering with overlay guidelines.

---

## 📝 License

This prototype is for internal evaluation and testing purposes only.

---

## 🙏 Acknowledgments

- Built with Angular 13.3.2 to match ISC Portal production stack
- Material Design 3 implementation following Google's guidelines
- Analysis based on Nielsen's 10 Usability Heuristics
- Employee survey data (Q2 2025) and focus group findings

---

## 📞 Support

For questions about the prototype or implementation:

- Review documentation in project root
- Check specific component README files
- Reference `MASTER_SYNTHESIS_FINAL.md` for complete analysis

---

**Last Updated**: 2025-10-15
**Version**: 1.0.0
**Status**: ✅ Ready for stakeholder review and testing

---

**Built with ❤️ using Angular 13 + Material Design 3**
