# Empty States Design Guide

## Overview

Empty states are critical UX moments that help users understand why they're seeing a blank table and what they can do next. This guide documents 5 distinct empty state patterns for the unified table system.

---

## The 5 Empty State Types

### 1. **No Data** (First-Time User Experience)
**When**: Table has never had any data, or all data was deleted
**Goal**: Guide users to add their first item

### 2. **No Results** (Filtered Out)
**When**: Data exists but current filters exclude everything
**Goal**: Help users refine their search criteria

### 3. **No Permission** (Access Denied)
**When**: User's role doesn't grant access to this feature/data
**Goal**: Explain restrictions and provide path to request access

### 4. **Error State** (Technical Failure)
**When**: API call failed, network error, server down
**Goal**: Communicate the problem and offer recovery options

### 5. **Custom State** (Positive Empty)
**When**: Special cases like "All caught up!" for tickets
**Goal**: Celebrate success or provide unique context

---

## Visual Hierarchy

All empty states follow this consistent structure:

```
┌──────────────────────────────────────────┐
│                                          │
│              [Large Icon]                │
│                                          │
│          Empty State Title               │
│                                          │
│     Helpful explanation message that     │
│     tells the user why they're seeing    │
│     this and what they can do about it.  │
│                                          │
│  [Primary Action]  [Secondary Action]    │
│                                          │
│  Contact: Person Name (email@example)    │  (if applicable)
│                                          │
└──────────────────────────────────────────┘
```

**Key Principles**:
- Icon: 48px minimum, centered, uses theme color
- Title: Typography level "headline-small" (Material Design 3)
- Message: Typography level "body-medium", max 2-3 lines
- Actions: Maximum 3 buttons (1 primary, 2 secondary)
- Contact: Optional, shown only for permission/error states

---

## Pattern 1: No Data State

### Circuits Table Example

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│                      🔌 (cable icon)                       │
│                                                            │
│                  No circuits configured                    │
│                                                            │
│      Get started by adding your first circuit to          │
│      monitor network connectivity and performance.        │
│                                                            │
│   [Add Your First Circuit]  [Import from CSV]  [Learn More]│
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Configuration**:
```typescript
emptyState: {
  type: 'no-data',
  noDataTitle: 'No circuits configured',
  noDataMessage: 'Get started by adding your first circuit to monitor network connectivity and performance.',
  noDataIcon: 'cable',
  noDataActions: [
    {
      label: 'Add Your First Circuit',
      icon: 'add_circle',
      color: 'primary',
      callback: () => navigateToAddCircuit(),
      visibleForRoles: ['admin', 'network-admin']
    },
    {
      label: 'Import from CSV',
      icon: 'upload_file',
      color: 'default',
      callback: () => openImportDialog(),
      visibleForRoles: ['admin']
    },
    {
      label: 'Learn More',
      icon: 'help_outline',
      color: 'default',
      callback: () => window.open('https://docs.example.com/circuits', '_blank')
    }
  ]
}
```

### Contacts Table Example

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│                      👥 (people icon)                      │
│                                                            │
│                      No contacts yet                       │
│                                                            │
│      Add contacts to manage who receives notifications     │
│      for network events and outages.                       │
│                                                            │
│         [Add Contact]  [Import Contacts]                   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**When to Use**:
- ✅ Brand new account (never added any data)
- ✅ All data was deleted
- ✅ User explicitly cleared all items

**When NOT to Use**:
- ❌ Filters are active (use "No Results" instead)
- ❌ User lacks permission (use "No Permission" instead)
- ❌ Loading error occurred (use "Error State" instead)

---

## Pattern 2: No Results State

### Example

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│                    🔍❌ (search_off icon)                   │
│                                                            │
│              No circuits match your filters                │
│                                                            │
│      Try adjusting your search criteria or clearing       │
│      some filters to see more results.                    │
│                                                            │
│      Active Filters: [Texas ×] [Status: Pending ×]        │
│                                                            │
│         [Clear All Filters]  [Reset Search]                │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Configuration**:
```typescript
emptyState: {
  type: 'no-results',
  noResultsTitle: 'No circuits match your filters',
  noResultsMessage: 'Try adjusting your search criteria or clearing some filters to see more results.',
  noResultsIcon: 'search_off',
  noResultsActions: [
    {
      label: 'Clear All Filters',
      icon: 'filter_list_off',
      color: 'primary',
      callback: () => clearAllFilters()
    },
    {
      label: 'Reset Search',
      icon: 'refresh',
      color: 'default',
      callback: () => resetSearch()
    }
  ]
}
```

**Auto-Detection Logic**:
The table automatically switches from "No Data" to "No Results" when:
- `data.length === 0` AND
- `filters.active === true` OR `searchTerm !== ''`

**Active Filters Display**:
Show active filter chips above the actions so users can:
- See what's filtering their results
- Remove individual filters by clicking X on chips

**When to Use**:
- ✅ User applied filters that exclude all results
- ✅ Search term doesn't match any records
- ✅ Date range excludes all data

---

## Pattern 3: No Permission State

### Example 1: Table-Level Access Denied

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│                      🔒 (lock icon)                        │
│                                                            │
│                    Access Restricted                       │
│                                                            │
│      You don't have permission to view circuits.           │
│      Contact your administrator to request access.         │
│                                                            │
│            [Request Access]                                │
│                                                            │
│     Contact: Network Operations Team                       │
│     Email: network-ops@example.com                         │
│     Role: ISC Admin                                        │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Configuration**:
```typescript
emptyState: {
  type: 'no-permission',
  noPermissionTitle: 'Access Restricted',
  noPermissionMessage: 'You don\'t have permission to view circuits. Contact your administrator to request access.',
  noPermissionIcon: 'lock',
  noPermissionActions: [
    {
      label: 'Request Access',
      icon: 'mail',
      color: 'primary',
      callback: () => openAccessRequestForm()
    }
  ],
  permissionContact: {
    name: 'Network Operations Team',
    email: 'network-ops@example.com',
    role: 'ISC Admin'
  }
}
```

### Example 2: Feature-Gated (Upgrade Required)

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│                  📈 (trending_up icon)                     │
│                                                            │
│      Application Performance Analytics Unavailable         │
│                                                            │
│      Your current plan doesn't include access to           │
│      Application Performance analytics. Upgrade your       │
│      account to unlock advanced network insights.          │
│                                                            │
│  [Upgrade Account]  [Compare Plans]  [Contact Sales]       │
│                                                            │
│     Contact: Sales Team                                    │
│     Email: sales@example.com                               │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Example 3: Regional Access Restriction

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│                   🗺️❌ (location_off icon)                 │
│                                                            │
│           No sites available in your region                │
│                                                            │
│      You have access to view sites in the US Central       │
│      region only. Contact your administrator to request    │
│      access to additional regions.                         │
│                                                            │
│  [Request Additional Access]  [View Accessible Regions]    │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**When to Use**:
- ✅ User's role doesn't grant access to entire feature
- ✅ Account plan doesn't include this feature (freemium/upgrade)
- ✅ Regional/hierarchical permissions restrict data
- ✅ Feature is temporarily disabled for this user

**Best Practices**:
1. **Be Specific**: Tell users exactly what they lack ("view circuits") not just "access denied"
2. **Provide Contact**: Always show who to contact for access
3. **Offer Action**: "Request Access" button that pre-fills email or opens form
4. **Avoid Jargon**: Don't say "403 Forbidden" - use plain language

---

## Pattern 4: Error State

### Example

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│                   ⚠️ (error_outline icon)                  │
│                                                            │
│                Unable to load circuits                     │
│                                                            │
│      We encountered an error while loading your circuits.  │
│      Please try again or contact support if the problem    │
│      persists.                                             │
│                                                            │
│         [Try Again]  [Contact Support]                     │
│                                                            │
│     Contact: Technical Support                             │
│     Email: support@example.com                             │
│                                                            │
│     ⚙️ Show Technical Details                              │  (clickable expander)
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Configuration**:
```typescript
errorState: {
  title: 'Unable to load circuits',
  message: 'We encountered an error while loading your circuits. Please try again or contact support if the problem persists.',
  icon: 'error_outline',
  showDetails: false,  // Set to true in development
  details: 'HTTP 500: Internal Server Error\nEndpoint: /api/circuits\nTimestamp: 2025-10-14T12:34:56Z',
  actions: [
    {
      label: 'Try Again',
      icon: 'refresh',
      color: 'primary',
      callback: () => retryLoadData()
    },
    {
      label: 'Contact Support',
      icon: 'support',
      color: 'default',
      callback: () => openSupportDialog()
    }
  ],
  supportContact: {
    name: 'Technical Support',
    email: 'support@example.com',
    role: 'ISC Support Team'
  }
}
```

**Technical Details Expander**:
When `showDetails: true`, show expandable section with:
- HTTP status code
- Endpoint URL
- Error message from server
- Timestamp
- Request ID (for support troubleshooting)

**When to Use**:
- ✅ API returned 500 Internal Server Error
- ✅ Network timeout or connection refused
- ✅ Authentication token expired
- ✅ CORS or proxy errors

**Best Practices**:
1. **User-Friendly Language**: "Unable to load circuits" not "XHR failed"
2. **Recovery Action**: Always offer "Try Again" button
3. **Support Path**: Show how to get help with ticket ID
4. **Hide Tech Details**: Only show to developers/admins

---

## Pattern 5: Custom Positive State

### Example: All Tickets Resolved

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│                    ✅ (check_circle icon)                  │
│                                                            │
│                     All caught up!                         │
│                                                            │
│      You have no open tickets. Great job! When issues      │
│      arise, they'll appear here.                           │
│                                                            │
│      [Create Test Ticket]  [View Closed Tickets]           │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Configuration**:
```typescript
emptyState: {
  type: 'custom',
  customTitle: 'All caught up!',
  customMessage: 'You have no open tickets. Great job! When issues arise, they\'ll appear here.',
  customIcon: 'check_circle',
  customActions: [
    {
      label: 'Create Test Ticket',
      icon: 'add',
      color: 'primary',
      callback: () => createTicket()
    },
    {
      label: 'View Closed Tickets',
      icon: 'history',
      color: 'default',
      callback: () => showClosedTickets()
    }
  ]
}
```

**When to Use**:
- ✅ Positive empty state (e.g., no open tickets = good!)
- ✅ Seasonal/contextual messaging
- ✅ Gamification (e.g., "You've reviewed all pending items!")
- ✅ Special business logic states

---

## Auto-Detection Logic

The `BaseTableComponent` automatically determines which empty state to show:

```typescript
function determineEmptyState(): EmptyStateType {
  // 1. Check permission first
  if (!hasPermission) {
    return 'no-permission';
  }

  // 2. Check for errors
  if (error) {
    return 'error';
  }

  // 3. Check if loading
  if (loading) {
    return 'loading';  // Show spinner, not empty state
  }

  // 4. Check if data is empty
  if (data.length === 0) {
    // 4a. Check if filters are active
    if (hasActiveFilters || searchTerm !== '') {
      return 'no-results';
    }

    // 4b. No filters, truly empty
    return 'no-data';
  }

  // 5. Data exists, no empty state needed
  return null;
}
```

---

## Responsive Behavior

### Desktop (>768px)
- Icon: 64px
- Title: 24px
- Message: 16px
- Actions: Horizontal layout (side-by-side)
- Max width: 600px (centered)

### Mobile (<768px)
- Icon: 48px
- Title: 20px
- Message: 14px
- Actions: Vertical layout (stacked)
- Max width: 100% (full width with padding)

---

## Accessibility

All empty states must be:

1. **Keyboard Navigable**
   - Tab to action buttons
   - Enter/Space to activate

2. **Screen Reader Friendly**
   ```html
   <div role="status" aria-live="polite" aria-label="Empty state: No circuits configured">
     <!-- Empty state content -->
   </div>
   ```

3. **Color Independent**
   - Don't rely on icon color alone
   - Use text labels on all actions
   - Sufficient contrast (WCAG AA: 4.5:1)

4. **Focus Management**
   - Auto-focus primary action button when empty state appears
   - Clear focus ring on buttons (3px outline)

---

## Animation

Empty states should fade in smoothly:

```scss
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.empty-state {
  animation: fadeInUp 0.3s ease-out;
}
```

**Timing**:
- Delay: 300ms (don't show empty state immediately)
- Duration: 300ms fade-in
- Easing: ease-out

**Why Delay?**
If data loads quickly (<300ms), users never see the empty state flash. This prevents UI jank.

---

## Examples by Table Type

| Table | Primary Empty State | Use Case |
|-------|---------------------|----------|
| **Circuits** | No Data | First-time setup, guide to add circuits |
| **Sites** | No Permission | Regional access restrictions |
| **Contacts** | No Data | New account, guide to add contacts |
| **Invoices** | No Results | Date filter excludes all invoices |
| **Tickets** | Custom | "All caught up!" positive messaging |
| **Reports** | No Permission | Upgrade required for analytics |
| **Application Profiles** | No Data | Default profiles not yet configured |

---

## Testing Checklist

For each table, verify all empty states:

- [ ] **No Data**
  - [ ] Shows when table is completely empty
  - [ ] Actions are appropriate for user role
  - [ ] Message explains what data goes here
  - [ ] Icon matches table theme

- [ ] **No Results**
  - [ ] Shows when filters exclude all data
  - [ ] Active filters are displayed
  - [ ] "Clear Filters" button works
  - [ ] Switches back to "No Data" when filters cleared

- [ ] **No Permission**
  - [ ] Shows when user lacks access
  - [ ] Contact information is accurate
  - [ ] "Request Access" button works
  - [ ] Message explains what permission is needed

- [ ] **Error State**
  - [ ] Shows when API call fails
  - [ ] "Try Again" button retries successfully
  - [ ] Support contact is accurate
  - [ ] Technical details are hidden from regular users

- [ ] **Accessibility**
  - [ ] Screen reader announces empty state
  - [ ] Keyboard navigation works
  - [ ] Focus is managed correctly
  - [ ] Color contrast meets WCAG AA

---

## File Locations

- **Configuration**: `src/app/components/shared/base-table/base-table.config.ts`
- **Examples**: `src/app/components/shared/base-table/empty-states.example.ts`
- **Component**: `src/app/components/shared/base-table/empty-state/empty-state.component.ts` (to be created)
- **Styles**: `src/app/components/shared/base-table/empty-state/empty-state.component.scss`

---

## Next Steps

1. ✅ Configuration interfaces created
2. ✅ Example configurations documented
3. ⏳ Create EmptyStateComponent
4. ⏳ Integrate into BaseTableComponent
5. ⏳ Add unit tests for all empty state scenarios
6. ⏳ Conduct usability testing

---

**Last Updated**: October 14, 2025
**Version**: 1.0
**Author**: Claude Code
