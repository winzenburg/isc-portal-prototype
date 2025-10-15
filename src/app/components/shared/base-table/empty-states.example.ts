/**
 * Empty State Configuration Examples
 *
 * Demonstrates comprehensive empty state handling for:
 * 1. No data exists (first-time user, empty database)
 * 2. No results match filters (user filtered too narrowly)
 * 3. No permission (user doesn't have access to this feature)
 * 4. Error loading data (API failure, network issue)
 */

import { TableConfig, EmptyStateConfig, ErrorStateConfig } from './base-table.config';

// ============================================================================
// EXAMPLE 1: CIRCUITS TABLE - COMPREHENSIVE EMPTY STATES
// ============================================================================

export const circuitsEmptyStateConfig: EmptyStateConfig = {
  type: 'no-data',  // Auto-switches to 'no-results' when filters are active

  // -------------------------------------------------------------------------
  // NO DATA STATE (First-time user, completely empty table)
  // -------------------------------------------------------------------------
  noDataTitle: 'No circuits configured',
  noDataMessage: 'Get started by adding your first circuit to monitor network connectivity and performance.',
  noDataIcon: 'cable',  // Material icon name
  noDataActions: [
    {
      label: 'Add Your First Circuit',
      icon: 'add_circle',
      color: 'primary',
      callback: () => {
        console.log('Navigate to add circuit page');
        // Navigate to create circuit wizard
      },
      visibleForRoles: ['admin', 'network-admin']  // Only admins can add circuits
    },
    {
      label: 'Import from CSV',
      icon: 'upload_file',
      color: 'default',
      callback: () => {
        console.log('Open CSV import dialog');
        // Open bulk import modal
      },
      visibleForRoles: ['admin']
    },
    {
      label: 'Learn More',
      icon: 'help_outline',
      color: 'default',
      callback: () => {
        console.log('Open help documentation');
        // Open help documentation
        window.open('https://docs.example.com/circuits', '_blank');
      }
    }
  ],

  // -------------------------------------------------------------------------
  // NO RESULTS STATE (User filtered too narrowly)
  // -------------------------------------------------------------------------
  noResultsTitle: 'No circuits match your filters',
  noResultsMessage: 'Try adjusting your search criteria or clearing some filters to see more results.',
  noResultsIcon: 'search_off',
  noResultsActions: [
    {
      label: 'Clear All Filters',
      icon: 'filter_list_off',
      color: 'primary',
      callback: () => {
        console.log('Clear all active filters');
        // Dispatch filter clear event
      }
    },
    {
      label: 'Reset Search',
      icon: 'refresh',
      color: 'default',
      callback: () => {
        console.log('Reset search term');
        // Clear search input
      }
    }
  ],

  // -------------------------------------------------------------------------
  // NO PERMISSION STATE (User doesn't have access)
  // -------------------------------------------------------------------------
  noPermissionTitle: 'Access Restricted',
  noPermissionMessage: 'You don\'t have permission to view circuits. Contact your administrator to request access.',
  noPermissionIcon: 'lock',
  noPermissionActions: [
    {
      label: 'Request Access',
      icon: 'mail',
      color: 'primary',
      callback: () => {
        console.log('Open access request form');
        // Open access request modal
      }
    }
  ],
  permissionContact: {
    name: 'Network Operations Team',
    email: 'network-ops@example.com',
    role: 'ISC Admin'
  }
};

// ============================================================================
// EXAMPLE 2: CONTACTS TABLE - NO DATA (NEW ACCOUNT)
// ============================================================================

export const contactsEmptyStateConfig: EmptyStateConfig = {
  type: 'no-data',

  noDataTitle: 'No contacts yet',
  noDataMessage: 'Add contacts to manage who receives notifications for network events and outages.',
  noDataIcon: 'people',
  noDataActions: [
    {
      label: 'Add Contact',
      icon: 'person_add',
      color: 'primary',
      callback: () => console.log('Open add contact modal'),
      visibleForRoles: ['admin', 'network-admin']
    },
    {
      label: 'Import Contacts',
      icon: 'upload_file',
      color: 'default',
      callback: () => console.log('Open CSV import'),
      visibleForRoles: ['admin']
    }
  ],

  noResultsTitle: 'No contacts match your search',
  noResultsMessage: 'Try searching for a different name, email, or role.',
  noResultsIcon: 'search_off',
  noResultsActions: [
    {
      label: 'Clear Search',
      icon: 'close',
      color: 'primary',
      callback: () => console.log('Clear search')
    }
  ],

  noPermissionTitle: 'Contact Management Unavailable',
  noPermissionMessage: 'Only administrators can view and manage contacts.',
  noPermissionIcon: 'admin_panel_settings',
  permissionContact: {
    name: 'Your Account Manager',
    email: 'support@example.com'
  }
};

// ============================================================================
// EXAMPLE 3: INVOICES TABLE - READ-ONLY (NO PERMISSION TO ADD)
// ============================================================================

export const invoicesEmptyStateConfig: EmptyStateConfig = {
  type: 'no-data',

  noDataTitle: 'No invoices available',
  noDataMessage: 'Invoices will appear here once they are generated by the billing system.',
  noDataIcon: 'receipt_long',
  noDataActions: [
    {
      label: 'Contact Billing',
      icon: 'mail',
      color: 'primary',
      callback: () => console.log('Open email to billing'),
    },
    {
      label: 'View Billing FAQ',
      icon: 'help',
      color: 'default',
      callback: () => window.open('https://docs.example.com/billing', '_blank')
    }
  ],

  noResultsTitle: 'No invoices match your date range',
  noResultsMessage: 'Try selecting a different date range or clearing filters.',
  noResultsIcon: 'date_range',
  noResultsActions: [
    {
      label: 'Clear Date Filter',
      icon: 'close',
      color: 'primary',
      callback: () => console.log('Clear date range')
    },
    {
      label: 'View All Invoices',
      icon: 'visibility',
      color: 'default',
      callback: () => console.log('Reset to show all')
    }
  ],

  noPermissionTitle: 'Invoices Unavailable',
  noPermissionMessage: 'You don\'t have permission to view billing information. Please contact your account administrator.',
  noPermissionIcon: 'lock',
  permissionContact: {
    name: 'Billing Administrator',
    email: 'billing@example.com',
    role: 'Account Admin'
  }
};

// ============================================================================
// EXAMPLE 4: TICKETS TABLE - CUSTOM EMPTY STATE
// ============================================================================

export const ticketsEmptyStateConfig: EmptyStateConfig = {
  type: 'custom',

  customTitle: 'All caught up!',
  customMessage: 'You have no open tickets. Great job! When issues arise, they\'ll appear here.',
  customIcon: 'check_circle',
  customActions: [
    {
      label: 'Create Test Ticket',
      icon: 'add',
      color: 'primary',
      callback: () => console.log('Create ticket')
    },
    {
      label: 'View Closed Tickets',
      icon: 'history',
      color: 'default',
      callback: () => console.log('Show closed tickets')
    }
  ],

  noResultsTitle: 'No tickets match your filters',
  noResultsMessage: 'Try changing the status filter or search term.',
  noResultsIcon: 'search_off',
  noResultsActions: [
    {
      label: 'Show All Tickets',
      icon: 'visibility',
      color: 'primary',
      callback: () => console.log('Clear filters')
    }
  ]
};

// ============================================================================
// EXAMPLE 5: ERROR STATE CONFIGURATION
// ============================================================================

export const circuitsErrorStateConfig: ErrorStateConfig = {
  title: 'Unable to load circuits',
  message: 'We encountered an error while loading your circuits. Please try again or contact support if the problem persists.',
  icon: 'error_outline',
  showDetails: false,  // Set to true in development to show technical details
  details: 'HTTP 500: Internal Server Error\nEndpoint: /api/circuits\nTimestamp: 2025-10-14T12:34:56Z',
  actions: [
    {
      label: 'Try Again',
      icon: 'refresh',
      color: 'primary',
      callback: () => {
        console.log('Retry loading data');
        // Retry API call
      }
    },
    {
      label: 'Contact Support',
      icon: 'support',
      color: 'default',
      callback: () => {
        console.log('Open support dialog');
        // Open support ticket form
      }
    }
  ],
  supportContact: {
    name: 'Technical Support',
    email: 'support@example.com',
    role: 'ISC Support Team'
  }
};

// ============================================================================
// COMPLETE TABLE CONFIGURATION WITH EMPTY STATES
// ============================================================================

export const circuitsTableConfigWithEmptyStates: TableConfig = {
  title: 'Circuits',
  tableType: 'standard',
  tableId: 'circuits-table',

  // ... (columns, actions, filtering, etc.)

  // Empty State Configuration
  emptyState: circuitsEmptyStateConfig,

  // Error State Configuration
  errorState: circuitsErrorStateConfig,

  // Loading State
  loading: false,
  loadingMessage: 'Loading circuits...'
};

// ============================================================================
// EXAMPLE 6: FEATURE-GATED TABLE (NO PERMISSION FOR ENTIRE FEATURE)
// ============================================================================

/**
 * Use Case: User doesn't have access to the entire feature (not just individual actions)
 *
 * Example: Guest users can't see the Application Performance table at all
 */
export const applicationPerformanceNoAccessConfig: EmptyStateConfig = {
  type: 'no-permission',

  noPermissionTitle: 'Application Performance Analytics Unavailable',
  noPermissionMessage: 'Your current plan doesn\'t include access to Application Performance analytics. Upgrade your account to unlock advanced network insights.',
  noPermissionIcon: 'trending_up',
  noPermissionActions: [
    {
      label: 'Upgrade Account',
      icon: 'upgrade',
      color: 'primary',
      callback: () => {
        console.log('Navigate to upgrade page');
        window.location.href = '/account/upgrade';
      }
    },
    {
      label: 'Compare Plans',
      icon: 'compare_arrows',
      color: 'default',
      callback: () => {
        window.open('https://example.com/pricing', '_blank');
      }
    },
    {
      label: 'Contact Sales',
      icon: 'call',
      color: 'default',
      callback: () => {
        console.log('Open contact sales form');
      }
    }
  ],
  permissionContact: {
    name: 'Sales Team',
    email: 'sales@example.com',
    role: 'Account Executive'
  }
};

// ============================================================================
// EXAMPLE 7: SITES TABLE WITH HIERARCHICAL PERMISSION MESSAGING
// ============================================================================

/**
 * Use Case: User can see some sites but not all (filtered by permission)
 */
export const sitesPartialAccessConfig: EmptyStateConfig = {
  type: 'custom',

  customTitle: 'No sites available in your region',
  customMessage: 'You have access to view sites in the US Central region only. Contact your administrator to request access to additional regions.',
  customIcon: 'location_off',
  customActions: [
    {
      label: 'Request Additional Access',
      icon: 'add_location',
      color: 'primary',
      callback: () => console.log('Open access request form')
    },
    {
      label: 'View Accessible Regions',
      icon: 'map',
      color: 'default',
      callback: () => console.log('Show regions list')
    }
  ],

  noResultsTitle: 'No sites match your filters',
  noResultsMessage: 'Try clearing filters or selecting a different region.',
  noResultsIcon: 'search_off',
  noResultsActions: [
    {
      label: 'Clear Filters',
      icon: 'filter_list_off',
      color: 'primary',
      callback: () => console.log('Clear filters')
    }
  ]
};

// ============================================================================
// USAGE IN COMPONENT
// ============================================================================

/**
 * Example Component Usage:
 *
 * @Component({
 *   template: `
 *     <app-base-table
 *       [config]="tableConfig"
 *       [data]="data$ | async"
 *       [loading]="loading$ | async"
 *       [error]="error$ | async"
 *       [hasPermission]="hasPermission$ | async">
 *     </app-base-table>
 *   `
 * })
 * export class CircuitsComponent {
 *   tableConfig = circuitsTableConfigWithEmptyStates;
 *   data$ = this.circuitsService.getCircuits();
 *   loading$ = this.circuitsService.loading$;
 *   error$ = this.circuitsService.error$;
 *   hasPermission$ = this.authService.hasPermission('circuits:view');
 * }
 *
 * The BaseTableComponent automatically shows the appropriate empty state:
 * - If hasPermission = false → Show noPermissionState
 * - If error exists → Show errorState
 * - If loading = true → Show loading spinner
 * - If data.length = 0 && filters active → Show noResultsState
 * - If data.length = 0 && no filters → Show noDataState
 */
