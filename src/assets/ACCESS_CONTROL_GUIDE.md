# ISC Portal - Access Control & Empty States Guide

## Overview

This guide explains the comprehensive access control system for the ISC Portal prototype. The system provides:

- **Standardized error codes** for different access denial reasons
- **Reusable access-denied component** with consistent UX
- **Feature-level access control** based on user roles and licenses
- **Empty states** that differentiate between "no data", "no access", and "no results"
- **Upgrade prompts** for users who need to upgrade their plan

## Architecture

### Core Components

1. **AccessControlService** (`/src/app/services/access-control.service.ts`)
   - Manages user profiles and permissions
   - Defines feature requirements (roles, licenses, active services)
   - Provides access checking with detailed error codes

2. **AccessDeniedComponent** (`/src/app/components/shared/access-denied/access-denied.component.ts`)
   - Reusable component for displaying access denied states
   - Supports different visual styles based on error type
   - Includes actionable buttons (Upgrade, Request Access, Contact Support)

3. **BaseTableComponent** (Enhanced with access control)
   - Supports `accessDenied` input property
   - Automatically displays access-denied state when access is denied
   - Prevents rendering of table data when user lacks access

## Error Codes

### Permission Errors
- **ACC_001**: `NO_PERMISSION` - User not logged in or lacks basic permission
- **ACC_002**: `INSUFFICIENT_ROLE` - User role doesn't have required permissions
- **ACC_003**: `FEATURE_NOT_LICENSED` - Feature not included in license
- **ACC_004**: `ACCOUNT_SUSPENDED` - Account has been suspended

### Feature-Specific Errors
- **FEAT_001**: `CIRCUITS_ACCESS_DENIED` - No access to Network Circuits
- **FEAT_002**: `SITES_ACCESS_DENIED` - No access to Sites Management
- **FEAT_003**: `CLOUDS_ACCESS_DENIED` - No access to Cloud Services
- **FEAT_004**: `INVOICES_ACCESS_DENIED` - No access to Network Invoices
- **FEAT_005**: `REPORTS_ACCESS_DENIED` - No access to Circuit Reports
- **FEAT_006**: `CONTACTS_ACCESS_DENIED` - No access to Contact Management
- **FEAT_007**: `TICKETS_ACCESS_DENIED` - No access to Support Tickets
- **FEAT_008**: `APP_PERFORMANCE_ACCESS_DENIED` - No access to Application Performance

### License Errors
- **LIC_001**: `TRIAL_EXPIRED` - Trial period has ended
- **LIC_002**: `FEATURE_NOT_IN_PLAN` - Feature not in current subscription plan
- **LIC_003**: `UPGRADE_REQUIRED` - Upgrade needed for feature access

### Network/Account Errors
- **NET_001**: `NETWORK_NOT_PROVISIONED` - Network services not provisioned
- **NET_002**: `SERVICE_NOT_ACTIVE` - Service not activated
- **NET_003**: `REGION_RESTRICTED` - Feature not available in user's region

## User Roles

- **admin**: Full access to all features
- **isc-admin**: Administrative access to ISC portal features
- **network-admin**: Network management features only
- **user**: Standard user with basic access
- **billing-contact**: Billing and invoices access
- **technical-contact**: Tickets and technical support access
- **guest**: Minimal/read-only access

## How to Implement Access Control

### Step 1: Inject AccessControlService

In your component TypeScript file:

```typescript
import { AccessControlService, AccessErrorCode } from '../../../services/access-control.service';

export class YourComponent implements OnInit {
  // Access control properties
  accessDenied = false;
  accessErrorCode?: AccessErrorCode;
  accessErrorMessage?: string;
  accessErrorDetails?: string;
  showUpgradeButton = false;

  constructor(private accessControl: AccessControlService) {}

  ngOnInit() {
    this.checkAccess();

    if (!this.accessDenied) {
      // Load your data here
      this.initializeComponent();
    }
  }

  private checkAccess(): void {
    // Check access for your feature
    const accessResult = this.accessControl.checkAccess('your-feature-id');

    if (!accessResult.hasAccess) {
      this.accessDenied = true;
      this.accessErrorCode = accessResult.errorCode;
      this.accessErrorMessage = accessResult.errorMessage;
      this.accessErrorDetails = accessResult.contactSalesMessage;
      this.showUpgradeButton = accessResult.upgradeRequired || false;
    }
  }
}
```

### Step 2: Update Component Template

For components using base-table:

```html
<app-base-table
  [config]="tableConfig"
  [data]="yourData"
  [loading]="loading"
  [accessDenied]="accessDenied"
  [accessErrorCode]="accessErrorCode"
  [accessErrorMessage]="accessErrorMessage"
  [accessErrorDetails]="accessErrorDetails"
  [showUpgradeButton]="showUpgradeButton"
  [featureName]="'Your Feature Name'"
></app-base-table>
```

For standalone pages:

```html
<div class="page-container" *ngIf="!accessDenied">
  <!-- Your normal page content -->
</div>

<app-access-denied
  *ngIf="accessDenied"
  [errorCode]="accessErrorCode"
  [errorMessage]="accessErrorMessage"
  [errorDetails]="accessErrorDetails"
  [showUpgrade]="showUpgradeButton"
  [featureName]="'Your Feature Name'"
></app-access-denied>
```

## Testing Different User Scenarios

The AccessControlService includes a `simulateUser()` method for testing:

### Available Scenarios

```typescript
// In browser console or component:
this.accessControl.simulateUser('full-access');      // Admin with all features
this.accessControl.simulateUser('limited-user');     // Basic user, limited features
this.accessControl.simulateUser('billing-only');     // Billing contact only
this.accessControl.simulateUser('no-license');       // User without required licenses
this.accessControl.simulateUser('suspended');        // Suspended account
this.accessControl.simulateUser('guest');            // Guest user
```

### Testing in Browser Console

Open browser console (`F12`) and run:

```javascript
// Get access control service (available via Angular dev tools)
const accessControl = ng.probe(document.body).injector.get('AccessControlService');

// Simulate different scenarios
accessControl.simulateUser('no-license');

// Then reload the page to see the access denied state
```

## Feature Configuration

Features are defined in `AccessControlService`. Each feature has:

```typescript
{
  id: 'feature-id',                    // Unique identifier
  name: 'Feature Display Name',        // User-facing name
  description: 'Feature description',  // Description
  requiredRoles: ['admin', 'user'],   // Roles that can access
  requiredLicense: ['premium'],        // Optional: Required license types
  requiresActiveService: true          // Optional: Service must be active
}
```

### Current Features

| Feature ID | Name | Required Roles | License Required | Service Required |
|------------|------|----------------|------------------|------------------|
| `circuits` | Network Circuits | admin, network-admin, isc-admin, user | No | Yes |
| `sites` | Sites Management | admin, network-admin, isc-admin, user | No | No |
| `clouds` | Cloud Services | admin, network-admin, isc-admin | cloud-connect, enterprise-plus | Yes |
| `invoices` | Network Invoices | admin, billing-contact, isc-admin | No | No |
| `circuit-reports` | Circuit Reports | admin, network-admin, isc-admin, user | reporting, enterprise | Yes |
| `contacts` | Contact Management | admin, isc-admin | No | No |
| `tickets` | Support Tickets | admin, network-admin, isc-admin, user, technical-contact | No | No |
| `application-performance` | Application Performance | admin, network-admin, isc-admin | apm, enterprise-plus | Yes |

## Customizing Access Denied Appearance

The AccessDeniedComponent automatically styles based on error code:

### Icons & Colors

- **Insufficient Permissions** (gray lock icon)
- **License/Upgrade Required** (orange premium icon)
- **Account Suspended** (red block icon)
- **Service Not Active** (blue cloud-off icon)

### Custom Appearance

```html
<app-access-denied
  [errorCode]="accessErrorCode"
  [errorMessage]="'Custom message'"
  [errorDetails]="'Additional details'"
  [icon]="'custom_icon'"           <!-- Override icon -->
  [showUpgrade]="true"
  [showContactSupport]="true"
  [showRequestAccess]="false"
  [featureName]="'Custom Feature'"
></app-access-denied>
```

## Empty States vs Access Denied

The base-table component now supports three distinct states:

### 1. Loading State
- Shows spinner and "Loading data..." message
- Displayed when `loading = true`

### 2. Empty State (No Data)
- Shows when there's no data AND user has access AND no filters are active
- Icon: inbox
- Message: "No data found"

### 3. No Results State (Filtered Out)
- Shows when filters are active but return no results
- Icon: search_off
- Message: "No results found - Try adjusting your filters"

### 4. Access Denied State (NEW)
- Shows when `accessDenied = true`
- Takes priority over all other states
- Displays appropriate access-denied component with error details

### 5. Error State
- Shows when `error` is set (technical errors, API failures)
- Displays error-state component with retry option

## Best Practices

### 1. Check Access Early
Always check access in `ngOnInit()` before initializing expensive operations:

```typescript
ngOnInit() {
  this.checkAccess();  // Check first

  if (!this.accessDenied) {
    this.loadExpensiveData();  // Only if access granted
  }
}
```

### 2. Provide Clear Error Messages
Use the error message to explain:
- What the user doesn't have access to
- Why they don't have access
- What they need to do to gain access

### 3. Show Actionable Buttons
Enable appropriate buttons based on the error:
- `showUpgrade` for license issues
- `showRequestAccess` for role-based issues
- `showContactSupport` for all other cases

### 4. Log Access Checks
Use console logging to help debug access issues:

```typescript
console.log('🚫 Access denied:', accessResult);
console.log('✅ Access granted');
```

### 5. Test All Scenarios
Test your feature with all user scenarios to ensure proper behavior:
- Full access admin
- Limited user
- No license
- Suspended account
- Guest user

## Adding a New Feature

To add a new feature to access control:

### 1. Add Feature Definition

In `AccessControlService`, add to the `features` Map:

```typescript
['your-feature-id', {
  id: 'your-feature-id',
  name: 'Your Feature Name',
  description: 'Description of your feature',
  requiredRoles: ['admin', 'user'],
  requiredLicense: ['premium'],  // Optional
  requiresActiveService: true     // Optional
}]
```

### 2. Add Error Code (Optional)

Add a feature-specific error code in the `AccessErrorCode` enum:

```typescript
export enum AccessErrorCode {
  // ...existing codes
  YOUR_FEATURE_ACCESS_DENIED = 'FEAT_009',
}
```

### 3. Update Error Code Mapping

In the `getFeatureErrorCode()` method:

```typescript
private getFeatureErrorCode(featureId: string): AccessErrorCode {
  const errorCodeMap: { [key: string]: AccessErrorCode } = {
    // ...existing mappings
    'your-feature-id': AccessErrorCode.YOUR_FEATURE_ACCESS_DENIED,
  };
  // ...
}
```

### 4. Implement in Component

Follow the implementation steps above to add access control to your component.

## Troubleshooting

### Access Check Not Working

1. Verify feature ID matches exactly: `this.accessControl.checkAccess('clouds')`
2. Check user role: `console.log(this.accessControl.getCurrentUser())`
3. Verify licenses: User must have ALL required licenses for features that need them

### Access Denied Not Showing

1. Ensure `accessDenied` property is properly set in component
2. Check that properties are passed to base-table in template
3. Verify AccessDeniedComponent is registered in app.module.ts

### Wrong Error Message Displaying

1. Check error code mapping in `getErrorMessage()` method
2. Verify custom error message is being passed correctly
3. Ensure `accessErrorMessage` is populated from `accessResult.errorMessage`

## Future Enhancements

Potential improvements to the access control system:

1. **Role Hierarchy**: Implement role inheritance (admin > network-admin > user)
2. **Temporary Access**: Time-based access grants
3. **API Integration**: Connect to real backend auth service
4. **Audit Logging**: Track access attempts and denials
5. **Granular Permissions**: Per-action permissions (read, write, delete)
6. **Custom Access Rules**: Allow complex access logic
7. **Access Request Workflow**: Formal process for requesting elevated permissions
8. **Session Management**: Handle session expiration and re-authentication

## Related Files

- `/src/app/services/access-control.service.ts` - Core access control logic
- `/src/app/components/shared/access-denied/access-denied.component.ts` - Access denied UI
- `/src/app/components/shared/access-denied/access-denied.component.html` - Access denied template
- `/src/app/components/shared/access-denied/access-denied.component.scss` - Access denied styles
- `/src/app/components/shared/base-table/base-table.component.ts` - Enhanced with access control
- `/src/app/components/pages/clouds-unified/clouds-unified.component.ts` - Example implementation

## Questions?

For questions or issues with the access control system, refer to:
- This documentation
- Code comments in access-control.service.ts
- Example implementation in clouds-unified.component.ts
