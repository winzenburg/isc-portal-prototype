/**
 * Unified Table Configuration System
 *
 * This configuration system supports all 5 table patterns identified in the analysis:
 * 1. Standard Data Table (80% of use cases)
 * 2. Filter Drawer (complex filtering)
 * 3. Quick Filter Pills (3-5 categories)
 * 4. Action Table (download/export focus)
 * 5. Editable Table (inline editing)
 */

// ============================================================================
// CORE INTERFACES
// ============================================================================

export type TableType = 'standard' | 'quick-filter' | 'action' | 'editable' | 'filter-drawer';
export type ColumnType = 'text' | 'number' | 'date' | 'status' | 'actions' | 'custom';
export type FilterType = 'text' | 'checkbox' | 'hierarchical' | 'date-range' | 'number-range';
export type ActionType = 'row' | 'header' | 'bulk';

// User roles for permission system
export type UserRole = 'admin' | 'user' | 'guest' | 'network-admin' | 'isc-admin';

// ============================================================================
// COLUMN CONFIGURATION
// ============================================================================

export interface TableColumn {
  /** Unique field identifier (maps to data property) */
  field: string;

  /** Display header text */
  header: string;

  /** Column type determines rendering */
  type?: ColumnType;

  /** Enable sorting for this column */
  sortable?: boolean;

  /** Fixed width (e.g., '120px', '15%') */
  width?: string;

  /** Minimum width for responsive */
  minWidth?: string;

  /** CSS classes to apply to column cells */
  cellClass?: string;

  /** CSS classes to apply to header */
  headerClass?: string;

  /** Show this column only for certain roles */
  visibleForRoles?: UserRole[];

  /** Hide column by default (user can show via settings) */
  hidden?: boolean;

  /** Custom cell template reference */
  templateRef?: string;

  /** Tooltip text for header */
  tooltip?: string;

  /** Enable text wrapping (default: truncate with ellipsis) */
  wrap?: boolean;

  /** Alignment: left, center, right */
  align?: 'left' | 'center' | 'right';
}

// ============================================================================
// STATUS INDICATOR CONFIGURATION
// ============================================================================

export interface StatusIndicatorConfig {
  /** Icon type: circle, triangle, square */
  icon: 'circle' | 'triangle' | 'square' | 'none';

  /** Color (hex or CSS variable) */
  color: string;

  /** Text label (always shown for accessibility) */
  label: string;

  /** Optional tooltip with additional context */
  tooltip?: string;

  /** Material icon name (alternative to shape icons) */
  materialIcon?: string;
}

export interface StatusColumnConfig {
  /** Field name for status column */
  field: string;

  /** Mapping of data values to status indicators */
  mapping: { [key: string]: StatusIndicatorConfig };

  /** Default status for unmapped values */
  defaultStatus?: StatusIndicatorConfig;
}

// ============================================================================
// ACTION BUTTON CONFIGURATION
// ============================================================================

export interface TableAction<T = any> {
  /** Action label (always shown for accessibility) */
  label: string;

  /** Material icon name */
  icon?: string;

  /** Button color: primary, accent, warn, default */
  color?: 'primary' | 'accent' | 'warn' | 'default';

  /** Callback function when action is triggered */
  callback: (data: T | T[]) => void;

  /** Show action only for certain roles */
  visibleForRoles?: UserRole[];

  /** Disable action based on row data */
  disabled?: (data: T) => boolean;

  /** Show action based on row data (dynamic visibility) */
  visible?: (data: T) => boolean;

  /** Confirm dialog before executing */
  confirmMessage?: string;

  /** Action type: button or menu-item */
  type?: 'button' | 'menu-item';

  /** Tooltip text */
  tooltip?: string;
}

export interface ActionsConfig<T = any> {
  /** Actions for individual rows (Edit, View, Delete) */
  row?: TableAction<T>[];

  /** Actions in table header (Add, Refresh, Export) */
  header?: TableAction<void>[];

  /** Bulk actions for selected rows (Delete Selected, Export Selected) */
  bulk?: TableAction<T[]>[];

  /** Maximum actions to show before collapsing to menu */
  maxVisibleActions?: number;
}

// ============================================================================
// FILTERING CONFIGURATION
// ============================================================================

export interface QuickFilterOption {
  /** Display label */
  label: string;

  /** Filter value (null for "All") */
  value: any;

  /** Count of items matching this filter (optional) */
  count?: number;

  /** Icon for filter chip */
  icon?: string;
}

export interface QuickFiltersConfig {
  /** Enable quick filter pills */
  enabled: boolean;

  /** Label above filter pills ("Filter by Status:") */
  label?: string;

  /** Field to filter on */
  field?: string;

  /** Available filter options */
  options: QuickFilterOption[];

  /** Allow multiple selections (default: false - mutually exclusive) */
  multiple?: boolean;
}

export interface FilterOption {
  /** Display label */
  label: string;

  /** Filter value */
  value: any;

  /** Count of items matching (shown in parentheses) */
  count?: number;

  /** Child options for hierarchical filters */
  children?: FilterOption[];

  /** Icon for this option */
  icon?: string;
}

export interface FilterGroup {
  /** Group label ("Location", "Status", etc.) */
  label: string;

  /** Field to filter on */
  field: string;

  /** Filter type */
  type: FilterType;

  /** Available options */
  options: FilterOption[];

  /** Collapsed by default */
  collapsed?: boolean;

  /** Enable search within this filter group */
  searchable?: boolean;
}

export interface AdvancedFiltersConfig {
  /** Enable advanced filter drawer */
  enabled: boolean;

  /** Filter groups (Location, Circuit Type, Status, etc.) */
  groups: FilterGroup[];

  /** Placeholder for filter search */
  searchPlaceholder?: string;
}

export interface FilteringConfig {
  /** Enable global search */
  searchEnabled?: boolean;

  /** Search placeholder text */
  searchPlaceholder?: string;

  /** Fields to search (empty = all visible columns) */
  searchFields?: string[];

  /** Quick filter pills configuration */
  quickFilters?: QuickFiltersConfig;

  /** Advanced filter drawer configuration */
  advancedFilters?: AdvancedFiltersConfig;

  /** Persist filter state in localStorage */
  persistFilters?: boolean;

  /** localStorage key for filter persistence */
  filterStorageKey?: string;
}

// ============================================================================
// PAGINATION CONFIGURATION
// ============================================================================

export interface PaginationConfig {
  /** Enable pagination */
  enabled: boolean;

  /** Default page size */
  pageSize: number;

  /** Available page size options */
  pageSizeOptions: number[];

  /** Show first/last page buttons */
  showFirstLastButtons?: boolean;

  /** Custom page size label */
  pageSizeLabel?: string;
}

// ============================================================================
// SELECTION CONFIGURATION
// ============================================================================

export interface SelectionConfig {
  /** Enable row selection */
  enabled: boolean;

  /** Selection mode: single or multiple */
  mode: 'single' | 'multiple';

  /** Show checkbox column */
  showCheckboxes?: boolean;

  /** Enable "Select All" checkbox in header */
  selectAllEnabled?: boolean;

  /** Persist selected rows in localStorage */
  persistSelection?: boolean;
}

// ============================================================================
// SORTING CONFIGURATION
// ============================================================================

export interface SortConfig {
  /** Field to sort by */
  field: string;

  /** Sort direction */
  direction: 'asc' | 'desc';
}

export interface SortingConfig {
  /** Enable sorting */
  enabled: boolean;

  /** Default sort configuration */
  defaultSort?: SortConfig;

  /** Allow multi-column sorting */
  multiSort?: boolean;
}

// ============================================================================
// VIRTUAL SCROLLING CONFIGURATION (for 150k rows)
// ============================================================================

export interface VirtualScrollConfig {
  /** Enable virtual scrolling (required for >1000 rows) */
  enabled: boolean;

  /** Item height in pixels (must be fixed for virtual scroll) */
  itemHeight: number;

  /** Buffer size (number of items to render outside viewport) */
  bufferSize?: number;

  /** Enable infinite scroll (load more on scroll) */
  infiniteScroll?: boolean;

  /** Callback for loading more data */
  loadMoreCallback?: () => void;
}

// ============================================================================
// INLINE EDITING CONFIGURATION
// ============================================================================

export interface EditableColumnConfig {
  /** Field name */
  field: string;

  /** Input type: text, number, date, select, etc. */
  inputType: 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'custom';

  /** Options for select inputs */
  selectOptions?: { label: string; value: any }[];

  /** Validation function */
  validator?: (value: any) => boolean | string;

  /** Required field */
  required?: boolean;

  /** Disabled (read-only in edit mode) */
  disabled?: boolean;
}

export interface EditingConfig {
  /** Enable inline editing */
  enabled: boolean;

  /** Editable columns configuration */
  columns: EditableColumnConfig[];

  /** Callback when row is saved */
  onSave?: (row: any) => void | Promise<void>;

  /** Callback when edit is cancelled */
  onCancel?: (row: any) => void;

  /** Show edit/save/cancel actions in row */
  showActions?: boolean;
}

// ============================================================================
// EXPORT CONFIGURATION
// ============================================================================

export interface ExportConfig {
  /** Enable CSV export */
  enabled: boolean;

  /** Default filename for export (without .csv extension) */
  filename?: string;

  /** Button label (default: "Export CSV") */
  buttonLabel?: string;

  /** Show button icon */
  showIcon?: boolean;

  /** Icon name (default: "download") */
  icon?: string;

  /** Include only visible columns */
  visibleColumnsOnly?: boolean;

  /** Callback before export (can modify data) */
  beforeExport?: (data: any[]) => any[];

  /** Callback after export */
  afterExport?: () => void;
}

// ============================================================================
// MAIN TABLE CONFIGURATION
// ============================================================================

export interface TableConfig<T = any> {
  // Basic Settings
  /** Table title */
  title?: string;

  /** Table type (determines which features are enabled) */
  tableType: TableType;

  /** Unique identifier for localStorage keys */
  tableId?: string;

  // Columns
  /** Column definitions */
  columns: TableColumn[];

  /** Status column configuration (if applicable) */
  statusColumn?: StatusColumnConfig;

  // Actions
  /** Action button configuration */
  actions?: ActionsConfig<T>;

  // Filtering
  /** Filtering configuration */
  filtering?: FilteringConfig;

  // Pagination
  /** Pagination configuration */
  pagination?: PaginationConfig;

  // Selection
  /** Row selection configuration */
  selection?: SelectionConfig;

  // Sorting
  /** Sorting configuration */
  sorting?: SortingConfig;

  // Virtual Scrolling (CRITICAL for 150k rows)
  /** Virtual scrolling configuration */
  virtualScroll?: VirtualScrollConfig;

  // Inline Editing
  /** Inline editing configuration */
  editing?: EditingConfig;

  // Export
  /** CSV export configuration */
  export?: ExportConfig;

  // Permissions
  /** Current user role (determines visible actions/columns) */
  currentUserRole?: UserRole;

  // Styling
  /** Custom CSS class for table */
  tableClass?: string;

  /** Enable zebra striping (alternating row colors) */
  zebraStriping?: boolean;

  /** Enable hover highlighting */
  hoverHighlight?: boolean;

  /** Compact mode (reduced padding) */
  compact?: boolean;

  // Empty States
  /** Empty state configuration */
  emptyState?: EmptyStateConfig;

  // Loading State
  /** Show loading spinner */
  loading?: boolean;

  /** Loading message */
  loadingMessage?: string;

  // Error State
  /** Error state configuration */
  errorState?: ErrorStateConfig;
}

// ============================================================================
// EVENT INTERFACES
// ============================================================================

export interface TableRowActionEvent<T = any> {
  action: TableAction<T>;
  row: T;
  rowIndex: number;
}

export interface TableBulkActionEvent<T = any> {
  action: TableAction<T[]>;
  selectedRows: T[];
}

export interface TableFilterChangeEvent {
  filters: any;
  activeFilters: { field: string; value: any; label: string }[];
}

export interface TableSortChangeEvent {
  field: string;
  direction: 'asc' | 'desc';
}

export interface TablePageChangeEvent {
  pageIndex: number;
  pageSize: number;
  length: number;
}

export interface TableSelectionChangeEvent<T = any> {
  selected: T[];
}

// ============================================================================
// FILTER STATE (for localStorage persistence)
// ============================================================================

export interface FilterState {
  searchTerm?: string;
  quickFilters?: any;
  advancedFilters?: any;
  timestamp: number;
}

// ============================================================================
// EMPTY STATE CONFIGURATION
// ============================================================================

export type EmptyStateType =
  | 'no-data'              // No data exists at all
  | 'no-results'           // No results match current filters
  | 'no-permission'        // User doesn't have access
  | 'error'                // Error loading data
  | 'custom';              // Custom empty state

export interface EmptyStateAction {
  /** Action button label */
  label: string;

  /** Material icon name */
  icon?: string;

  /** Button color */
  color?: 'primary' | 'accent' | 'warn' | 'default';

  /** Callback when button is clicked */
  callback: () => void;

  /** Show only for certain roles */
  visibleForRoles?: UserRole[];
}

export interface EmptyStateConfig {
  /** Type of empty state (determines default messaging) */
  type: EmptyStateType;

  // No Data State (when table is completely empty)
  /** Title for no-data state */
  noDataTitle?: string;

  /** Message for no-data state */
  noDataMessage?: string;

  /** Icon for no-data state */
  noDataIcon?: string;

  /** Actions for no-data state (e.g., "Add First Circuit") */
  noDataActions?: EmptyStateAction[];

  // No Results State (when filters return nothing)
  /** Title for no-results state */
  noResultsTitle?: string;

  /** Message for no-results state */
  noResultsMessage?: string;

  /** Icon for no-results state */
  noResultsIcon?: string;

  /** Actions for no-results state (e.g., "Clear Filters") */
  noResultsActions?: EmptyStateAction[];

  // No Permission State (when user lacks access)
  /** Title for no-permission state */
  noPermissionTitle?: string;

  /** Message for no-permission state */
  noPermissionMessage?: string;

  /** Icon for no-permission state */
  noPermissionIcon?: string;

  /** Actions for no-permission state (e.g., "Request Access") */
  noPermissionActions?: EmptyStateAction[];

  /** Contact person/team for permission requests */
  permissionContact?: {
    name: string;
    email?: string;
    role?: string;
  };

  // Custom Empty State
  /** Custom title (overrides type-based defaults) */
  customTitle?: string;

  /** Custom message (overrides type-based defaults) */
  customMessage?: string;

  /** Custom icon (overrides type-based defaults) */
  customIcon?: string;

  /** Custom actions */
  customActions?: EmptyStateAction[];

  /** Custom template reference (for completely custom empty states) */
  customTemplateRef?: string;
}

// ============================================================================
// ERROR STATE CONFIGURATION
// ============================================================================

export interface ErrorStateConfig {
  /** Error title */
  title?: string;

  /** Error message */
  message?: string;

  /** Error icon */
  icon?: string;

  /** Show technical error details (for debugging) */
  showDetails?: boolean;

  /** Error details text */
  details?: string;

  /** Actions for error state */
  actions?: EmptyStateAction[];

  /** Contact person/team for support */
  supportContact?: {
    name: string;
    email?: string;
    role?: string;
  };
}

// ============================================================================
// HELPER TYPES
// ============================================================================

export interface TableDataSource<T = any> {
  data: T[];
  total: number;
  filtered?: number;
}
