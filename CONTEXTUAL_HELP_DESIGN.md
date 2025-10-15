# ISC Portal Contextual Help System Design

## Overview

A multi-tiered contextual help system to make complex networking terminology and features accessible to non-technical users.

## Design Principles

1. **Progressive Disclosure** - Show help only when needed, don't overwhelm
2. **Contextual** - Help appears where users encounter concepts
3. **Layered** - Multiple help levels from tooltips to detailed guides
4. **Searchable** - Users can search for explanations
5. **Visual** - Use icons, colors, and diagrams where helpful

## Help System Components

### 1. Inline Tooltips (Tier 1 - Quickest)

**Purpose**: Instant explanations on hover
**Implementation**: Material Design tooltips with enhanced content
**Target**: Critical terminology, status indicators, data fields

**Features**:
- Hover-triggered
- 1-2 sentence explanations
- Icon + text format
- Keyboard accessible
- Mobile: tap-to-show

**Example**:
```
SD-WAN 🔍
[Tooltip: Software-Defined Wide Area Network - Advanced networking that
connects multiple office locations using intelligent routing]
```

### 2. Help Icon Popovers (Tier 2 - Detailed)

**Purpose**: Expandable explanations with more context
**Implementation**: Clickable info icons (ⓘ) that open popovers
**Target**: Complex concepts, page features, workflows

**Features**:
- Click/tap to open
- 2-4 paragraphs with examples
- "Learn More" links to documentation
- Dismissible
- Can include diagrams or examples

**Example**:
```
Sparklines ⓘ
[Popover]
What are sparklines?
━━━━━━━━━━━━━━━━━━━
Sparklines are mini charts that show traffic trends over time
right in the table. Each line represents 24 hours of data.

📊 Green = Inbound traffic
📊 Blue = Outbound traffic

↗️ Spikes indicate high usage periods
↘️ Flat lines indicate steady traffic

[Learn More →]
```

### 3. Page-Level Help Panel (Tier 3 - Comprehensive)

**Purpose**: Overview of entire page functionality
**Implementation**: Collapsible side panel or modal
**Target**: Page-specific features, workflows, best practices

**Features**:
- Accessible via "?" button in header
- Table of contents
- Screenshots/GIFs
- Step-by-step guides
- Searchable content
- Print-friendly

**Example Sections**:
- "What is this page?"
- "Understanding the data"
- "Common tasks"
- "Troubleshooting"

### 4. Glossary Modal (Tier 4 - Reference)

**Purpose**: Comprehensive terminology reference
**Implementation**: Searchable modal dialog
**Target**: All technical terms across the portal

**Features**:
- Alphabetically organized
- Search functionality
- Category filters (Networking, Status, Metrics, etc.)
- Cross-references between terms
- Accessible from any page

### 5. Guided Tours (Tier 5 - Onboarding)

**Purpose**: Interactive walkthroughs for new users
**Implementation**: Step-by-step overlays (Shepherd.js style)
**Target**: First-time users, new features

**Features**:
- Multi-step guided experience
- Highlights specific UI elements
- "Skip" and "Next" buttons
- Progress indicator
- Can be replayed anytime

**Tours Available**:
- "Welcome to ISC Portal" (first login)
- "Understanding Your Network" (Dashboard)
- "Managing Sites" (Sites page)
- "Reading Network Analytics" (Network Analyst)

### 6. Contextual Help Suggestions (Tier 6 - AI-Powered)

**Purpose**: Proactive help based on user behavior
**Implementation**: Smart suggestions based on actions
**Target**: Common confusion points, errors

**Features**:
- Appears when user seems stuck
- "Having trouble? Try this..." format
- Can be dismissed permanently
- Non-intrusive positioning

**Triggers**:
- User hovers repeatedly over same area
- User applies/removes filters multiple times
- User encounters error state
- User spends long time on page without action

## Visual Design System

### Help Icon Hierarchy

```
🔍 Tooltip indicator (hover for quick info)
ⓘ  Info icon (click for detailed explanation)
❓ Help button (open help panel)
🎓 Tutorial icon (start guided tour)
📖 Documentation link (external help docs)
```

### Color Coding

- **Primary Help**: Blue (#0D62FF) - Main help elements
- **Success/Good**: Green (#24A148) - Positive indicators
- **Warning**: Yellow (#F1C21B) - Caution indicators
- **Critical**: Red (#DA1E28) - Error/critical indicators
- **Neutral**: Gray (#8D8D8D) - Disabled/no data

### Help Content Tone

- **Conversational** - "Your network" not "The network"
- **Non-technical** - "Connection speed" not "Bandwidth throughput"
- **Action-oriented** - "Click here to..." not "This button allows..."
- **Analogies** - Compare complex concepts to familiar things

## Implementation Architecture

### Component Structure

```
/src/app/components/help/
  ├── help-tooltip/
  │   ├── help-tooltip.component.ts
  │   ├── help-tooltip.component.html
  │   └── help-tooltip.component.scss
  ├── help-popover/
  │   ├── help-popover.component.ts
  │   ├── help-popover.component.html
  │   └── help-popover.component.scss
  ├── help-panel/
  │   ├── help-panel.component.ts
  │   ├── help-panel.component.html
  │   └── help-panel.component.scss
  ├── glossary-modal/
  │   ├── glossary-modal.component.ts
  │   ├── glossary-modal.component.html
  │   └── glossary-modal.component.scss
  ├── guided-tour/
  │   ├── guided-tour.service.ts
  │   ├── tour-step.component.ts
  │   └── tour-step.component.scss
  └── help.service.ts
```

### Data Model

```typescript
interface HelpContent {
  id: string;
  term: string;
  category: HelpCategory;
  shortDescription: string;      // For tooltips
  detailedDescription: string;   // For popovers
  examples?: string[];
  relatedTerms?: string[];
  documentationUrl?: string;
  visualAid?: string;            // Path to diagram/icon
  tier: 1 | 2 | 3;               // Priority level
}

enum HelpCategory {
  NETWORKING = 'Networking Concepts',
  STATUS = 'Status Indicators',
  METRICS = 'Metrics & Measurements',
  FEATURES = 'Portal Features',
  WORKFLOWS = 'Common Tasks'
}
```

### Content Database

```typescript
// /src/app/services/help-content.database.ts
export const HELP_CONTENT: HelpContent[] = [
  {
    id: 'sd-wan',
    term: 'SD-WAN',
    category: HelpCategory.NETWORKING,
    tier: 1,
    shortDescription: 'Software-Defined Wide Area Network - Smart networking that connects your office locations',
    detailedDescription: `SD-WAN is a modern approach to connecting multiple office locations.

Think of it as an intelligent traffic controller for your network. Instead of using dedicated expensive circuits between every location, SD-WAN automatically routes your data through the best available path (internet, MPLS, or LTE).

Benefits:
• Cost savings compared to traditional MPLS
• Automatic failover if one connection fails
• Better performance for cloud applications
• Centralized management`,
    examples: [
      'Your Dallas office connects to New York office via SD-WAN',
      'Video calls automatically route through the fastest connection'
    ],
    relatedTerms: ['mpls', 'circuit', 'bandwidth'],
    documentationUrl: '/docs/sd-wan-overview'
  },
  // ... more entries
];
```

## Usage Patterns

### Example 1: Tooltip on Table Header

```html
<!-- Sites table column header -->
<th>
  Site Health
  <mat-icon
    class="help-tooltip-trigger"
    matTooltip="Shows the operational status of all circuits at this site"
    matTooltipPosition="above">
    help_outline
  </mat-icon>
</th>
```

### Example 2: Popover on Complex Feature

```html
<!-- Network Analyst sparklines -->
<div class="sparkline-header">
  <span>Traffic Trends</span>
  <app-help-popover
    helpId="sparklines"
    [showLearnMore]="true">
  </app-help-popover>
</div>
```

### Example 3: Page-Level Help Button

```html
<!-- In page header -->
<div class="page-header-actions">
  <button mat-icon-button (click)="openHelpPanel()">
    <mat-icon>help_outline</mat-icon>
  </button>
</div>
```

## Content Priority Implementation

### Phase 1: Critical Terms (Week 1)
- SD-WAN, MPLS, DIA definitions
- Cloud Layer 2/3 explanations
- Network Analyst metrics
- Site health statuses

### Phase 2: Important Terms (Week 2)
- Bandwidth units (Gbps, Mbps, etc.)
- Protocol explanations
- Application performance metrics
- All status indicators

### Phase 3: Enhanced Features (Week 3)
- Page-level help panels
- Glossary modal
- Guided tours for key pages

### Phase 4: Advanced Help (Week 4)
- Contextual suggestions
- Interactive examples
- Video tutorials
- Expanded documentation

## Accessibility

- **Keyboard Navigation**: All help elements accessible via keyboard
- **Screen Readers**: Proper ARIA labels and descriptions
- **High Contrast**: Help icons visible in high contrast mode
- **Focus Indicators**: Clear focus states for all interactive help
- **No Hover-Only**: Critical info never hidden behind hover-only tooltips

## Analytics & Improvement

Track help system usage to identify:
- Most viewed help topics
- Pages with highest help engagement
- Terms users search for but don't find
- Tours completed vs. skipped

Use data to:
- Improve unclear explanations
- Add missing terminology
- Simplify confusing workflows
- Prioritize documentation efforts

## Mobile Considerations

- **Tap instead of hover** for tooltips
- **Full-screen modals** for help panels on mobile
- **Simplified guided tours** with fewer steps
- **Collapsible help sections** to save screen space
- **Bottom sheet** UI pattern for help popovers

## Success Metrics

- **Reduced support tickets** about terminology
- **Increased feature adoption** through guided tours
- **Higher user satisfaction** scores
- **Faster time to productivity** for new users
- **Decreased error rates** in common workflows

## Example Help Content by Page

### Sites Page Help Panel

```markdown
# Sites Page Help

## What is this page?
The Sites page shows all your office locations and their network health.
Think of it as a map of your company's network infrastructure.

## Understanding the hierarchy
📍 **Country** → Top level grouping
🏢 **Site** → Individual office location (e.g., "Dallas HQ")
📫 **Location** → Specific address within a site

## What does "Site Health" mean?
• ✅ **All circuits up** - Everything working normally
• ⚠️ **Partially Inactive** - Some connections down, but office still online
• ❌ **Down** - Office completely offline
• ⭕ **No Info** - We can't check the status (monitoring may be disabled)

## Common tasks
1. **Find a specific site**: Use the search box
2. **Filter by SD-WAN sites**: Click the "SD-WAN Sites" pill
3. **Check circuit status**: Look for colored dots in "Circuits Health" column
4. **Export data**: Click the download icon

## Pro tip
Use the tree panel on the left to select multiple sites at once, then
export or apply bulk actions!
```

## Implementation Notes

- Use Angular Material components where possible (tooltips, dialogs, etc.)
- Lazy-load help content to minimize bundle size
- Cache frequently accessed help content
- Support offline access to critical help content
- Implement keyboard shortcut (?) to open help on any page
- Add "Was this helpful?" feedback on all help content

## Future Enhancements

- **Video tutorials** embedded in help panels
- **Interactive demos** that simulate actions
- **Chatbot integration** for natural language help queries
- **Personalized help** based on user role and history
- **Community Q&A** section for peer support
- **Multi-language support** for help content

---

**Version**: 1.0
**Last Updated**: 2025-10-15
**Status**: Design Complete - Ready for Implementation
