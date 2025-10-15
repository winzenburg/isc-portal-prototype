/**
 * Example: Circuits Table Configuration
 *
 * This demonstrates how the Circuits table from the ISC Portal
 * would be configured using the unified table system.
 *
 * Before: 7 different filter patterns, icon-only actions, inconsistent status
 * After: Unified pattern with accessibility, virtual scrolling, role-based permissions
 */

import { TableConfig } from './base-table.config';

export interface Circuit {
  bundleId: string;
  bundleStatus: 'Installed' | 'Pending' | 'Disconnected' | 'Cancelled';
  bundleAlias: string;
  streetAddress: string;
  bundleProductType: string;
  circuitType: string;
  location?: string;
  created?: Date;
}

export const circuitsTableConfig: TableConfig<Circuit> = {
  // Basic Settings
  title: 'Circuits',
  tableType: 'standard',
  tableId: 'circuits-table',  // Used for localStorage keys

  // Current user role (would come from auth service)
  currentUserRole: 'admin',

  // ============================================================================
  // COLUMNS CONFIGURATION
  // ============================================================================
  columns: [
    {
      field: 'bundleId',
      header: 'Bundle ID',
      type: 'text',
      sortable: true,
      width: '140px',
      tooltip: 'Unique circuit identifier'
    },
    {
      field: 'bundleStatus',
      header: 'Bundle Status',
      type: 'status',  // Triggers status indicator rendering
      sortable: true,
      width: '160px'
    },
    {
      field: 'bundleAlias',
      header: 'Bundle Alias',
      type: 'text',
      sortable: true,
      width: '150px'
    },
    {
      field: 'streetAddress',
      header: 'Street Address',
      type: 'text',
      sortable: true,
      wrap: true,  // Allow text wrapping for long addresses
      minWidth: '200px'
    },
    {
      field: 'bundleProductType',
      header: 'Bundle Product Type',
      type: 'text',
      sortable: false,
      width: '180px'
    },
    {
      field: 'circuitType',
      header: 'Circuit Type',
      type: 'text',
      sortable: true,
      width: '150px'
    }
  ],

  // ============================================================================
  // STATUS INDICATORS (Icon + Color + Text - WCAG Compliant)
  // ============================================================================
  statusColumn: {
    field: 'bundleStatus',
    mapping: {
      'Installed': {
        icon: 'circle',
        color: '#24A148',  // Green
        label: 'Installed',
        tooltip: 'Circuit is active and operational'
      },
      'Pending': {
        icon: 'circle',
        color: '#F1C21B',  // Yellow
        label: 'Pending',
        tooltip: 'Circuit installation in progress'
      },
      'Disconnected': {
        icon: 'triangle',
        color: '#DA1E28',  // Red
        label: 'Disconnected',
        tooltip: 'Circuit is not operational'
      },
      'Cancelled': {
        icon: 'square',
        color: '#8D8D8D',  // Gray
        label: 'Cancelled',
        tooltip: 'Circuit has been cancelled'
      }
    },
    defaultStatus: {
      icon: 'none',
      color: '#666666',
      label: 'Unknown'
    }
  },

  // ============================================================================
  // ACTIONS (Always with text labels - no icon-only buttons)
  // ============================================================================
  actions: {
    // Row Actions (shown for each circuit)
    row: [
      {
        label: 'Edit',
        icon: 'edit',
        color: 'primary',
        callback: (circuit: Circuit) => {
          console.log('Edit circuit:', circuit.bundleId);
          // Navigate to edit page or open modal
        },
        visibleForRoles: ['admin', 'network-admin'],  // Only admins can edit
        tooltip: 'Edit circuit details'
      },
      {
        label: 'View Details',
        icon: 'open_in_new',
        color: 'primary',
        callback: (circuit: Circuit) => {
          console.log('View circuit:', circuit.bundleId);
          // Open circuit details page
        },
        tooltip: 'View full circuit details'
      },
      {
        label: 'Delete',
        icon: 'delete',
        color: 'warn',
        callback: (circuit: Circuit) => {
          console.log('Delete circuit:', circuit.bundleId);
          // Delete circuit
        },
        visibleForRoles: ['admin'],  // Only admins can delete
        disabled: (circuit: Circuit) => circuit.bundleStatus === 'Installed',  // Can't delete active circuits
        confirmMessage: 'Are you sure you want to delete this circuit? This action cannot be undone.',
        tooltip: 'Delete circuit'
      }
    ],

    // Header Actions (top-right of table)
    header: [
      {
        label: 'Add Circuit',
        icon: 'add',
        color: 'primary',
        callback: () => {
          console.log('Add new circuit');
          // Navigate to create circuit page
        },
        visibleForRoles: ['admin', 'network-admin']
      },
      {
        label: 'Refresh',
        icon: 'refresh',
        color: 'default',
        callback: () => {
          console.log('Refresh circuits data');
          // Reload data from API
        }
      },
      {
        label: 'Export',
        icon: 'download',
        color: 'default',
        callback: () => {
          console.log('Export circuits to CSV');
          // Export table data
        }
      }
    ],

    // Bulk Actions (shown when rows are selected)
    bulk: [
      {
        label: 'Edit Selected',
        icon: 'edit',
        color: 'primary',
        callback: (circuits: Circuit[]) => {
          console.log('Bulk edit:', circuits.length, 'circuits');
          // Open bulk edit modal
        },
        visibleForRoles: ['admin', 'network-admin']
      },
      {
        label: 'Delete Selected',
        icon: 'delete',
        color: 'warn',
        callback: (circuits: Circuit[]) => {
          console.log('Bulk delete:', circuits.length, 'circuits');
          // Bulk delete
        },
        visibleForRoles: ['admin'],
        confirmMessage: 'Are you sure you want to delete {count} circuits? This action cannot be undone.'
      },
      {
        label: 'Send Notification',
        icon: 'notifications',
        color: 'primary',
        callback: (circuits: Circuit[]) => {
          console.log('Send notification for:', circuits.length, 'circuits');
          // Open notification dialog
        }
      }
    ],

    // Show max 2 actions as buttons, rest in overflow menu
    maxVisibleActions: 2
  },

  // ============================================================================
  // FILTERING (Unified pattern with localStorage persistence)
  // ============================================================================
  filtering: {
    // Global search (searches all visible columns)
    searchEnabled: true,
    searchPlaceholder: 'Search circuits...',

    // Quick Filter Pills (for simple category filtering)
    quickFilters: {
      enabled: true,
      label: 'Filter by Status:',
      field: 'bundleStatus',
      options: [
        { label: 'All Circuits', value: null, count: 109 },
        { label: 'Installed', value: 'Installed', count: 98 },
        { label: 'Pending', value: 'Pending', count: 5 },
        { label: 'Disconnected', value: 'Disconnected', count: 6 }
      ],
      multiple: false  // Mutually exclusive (only one can be active)
    },

    // Advanced Filter Drawer (for complex hierarchical filtering)
    advancedFilters: {
      enabled: true,
      searchPlaceholder: 'Search filters...',
      groups: [
        {
          label: 'Location',
          field: 'location',
          type: 'hierarchical',
          searchable: true,
          options: [
            {
              label: 'United States',
              value: 'us',
              children: [
                {
                  label: 'Texas',
                  value: 'tx',
                  children: [
                    { label: 'Dallas', value: 'dallas', count: 45 },
                    { label: 'Austin', value: 'austin', count: 12 },
                    { label: 'Grapevine', value: 'grapevine', count: 8 }
                  ]
                },
                {
                  label: 'Nevada',
                  value: 'nv',
                  children: [
                    { label: 'Reno', value: 'reno', count: 5 }
                  ]
                },
                {
                  label: 'Indiana',
                  value: 'in',
                  children: [
                    { label: 'Mishawaka', value: 'mishawaka', count: 3 }
                  ]
                }
              ]
            },
            {
              label: 'Canada',
              value: 'ca',
              children: [
                { label: 'British Columbia', value: 'bc', count: 2 }
              ]
            }
          ]
        },
        {
          label: 'Circuit Type',
          field: 'circuitType',
          type: 'checkbox',
          options: [
            { label: 'Ethernet', value: 'ethernet', count: 45 },
            { label: 'Customer Provided Internet', value: 'customer_internet', count: 23 },
            { label: 'T1', value: 't1', count: 8 },
            { label: 'T3', value: 't3', count: 5 },
            { label: 'VLAN', value: 'vlan', count: 12 },
            { label: 'Other', value: 'other', count: 16 }
          ]
        },
        {
          label: 'Bundle Product Type',
          field: 'bundleProductType',
          type: 'checkbox',
          options: [
            { label: '100m Ethernet', value: '100m_ethernet', count: 32 },
            { label: '20m Ethernet', value: '20m_ethernet', count: 18 },
            { label: '10m Ethernet', value: '10m_ethernet', count: 15 },
            { label: 'Cust Prvd Internet', value: 'cust_internet', count: 23 }
          ]
        }
      ]
    },

    // Persist filters in localStorage (30-day expiry)
    persistFilters: true,
    filterStorageKey: 'isc-portal-circuits-filters'
  },

  // ============================================================================
  // PAGINATION
  // ============================================================================
  pagination: {
    enabled: true,
    pageSize: 10,
    pageSizeOptions: [10, 25, 50, 100],
    showFirstLastButtons: true,
    pageSizeLabel: 'Items per page:'
  },

  // ============================================================================
  // SELECTION (for bulk actions)
  // ============================================================================
  selection: {
    enabled: true,
    mode: 'multiple',
    showCheckboxes: true,
    selectAllEnabled: true,
    persistSelection: false  // Don't persist selected rows (only filters)
  },

  // ============================================================================
  // SORTING
  // ============================================================================
  sorting: {
    enabled: true,
    defaultSort: {
      field: 'bundleId',
      direction: 'asc'
    },
    multiSort: false  // Single column sorting only
  },

  // ============================================================================
  // VIRTUAL SCROLLING (CRITICAL for 150k rows)
  // ============================================================================
  virtualScroll: {
    enabled: true,  // ALWAYS enabled for circuits table (can have 150k rows)
    itemHeight: 56,  // Fixed row height in pixels (Material Design standard)
    bufferSize: 10,  // Render 10 extra items above/below viewport
    infiniteScroll: false  // Load all data upfront (with server-side pagination)
  },

  // ============================================================================
  // STYLING
  // ============================================================================
  zebraStriping: true,  // Alternating row colors for better scannability
  hoverHighlight: true,  // Highlight row on hover
  compact: false,  // Standard padding (not compact)

  // ============================================================================
  // EMPTY & LOADING STATES
  // ============================================================================
  emptyMessage: 'No circuits found. Try adjusting your filters or add a new circuit.',
  emptyIcon: 'cable',
  loadingMessage: 'Loading circuits...',
  loading: false
};

/**
 * Example Usage in Component:
 *
 * @Component({
 *   template: `
 *     <app-base-table
 *       [config]="circuitsTableConfig"
 *       [data]="circuits$ | async"
 *       (rowAction)="handleRowAction($event)"
 *       (bulkAction)="handleBulkAction($event)"
 *       (filterChange)="handleFilterChange($event)"
 *       (sortChange)="handleSortChange($event)"
 *       (pageChange)="handlePageChange($event)">
 *     </app-base-table>
 *   `
 * })
 * export class CircuitsComponent {
 *   circuitsTableConfig = circuitsTableConfig;
 *   circuits$ = this.circuitsService.getCircuits();
 *
 *   handleRowAction(event: TableRowActionEvent<Circuit>) {
 *     console.log('Row action:', event.action.label, event.row);
 *   }
 *
 *   handleBulkAction(event: TableBulkActionEvent<Circuit>) {
 *     console.log('Bulk action:', event.action.label, event.selectedRows);
 *   }
 *
 *   handleFilterChange(event: TableFilterChangeEvent) {
 *     console.log('Filters changed:', event.activeFilters);
 *     // Reload data with new filters
 *   }
 * }
 */
