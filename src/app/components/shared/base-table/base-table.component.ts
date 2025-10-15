import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges, AfterViewInit, ViewChild, TemplateRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import {
  TableConfig,
  TableColumn,
  TableRowActionEvent,
  TableBulkActionEvent,
  TableFilterChangeEvent,
  TableSortChangeEvent,
  TablePageChangeEvent,
  TableSelectionChangeEvent,
  FilterState
} from './base-table.config';
import { CsvExportService } from '../../../services/csv-export.service';
import { AccessErrorCode } from '../../../services/access-control.service';

/**
 * Base Table Component
 *
 * Unified table component supporting all 5 pattern variations:
 * 1. Standard Data Table
 * 2. Filter Drawer (complex filtering)
 * 3. Quick Filter Pills (simple categories)
 * 4. Action Table (download/export focus)
 * 5. Editable Table (inline editing)
 *
 * Features:
 * - Virtual scrolling for 150k+ rows
 * - Role-based permissions
 * - Filter persistence in localStorage
 * - Accessible (WCAG 2.1 AA compliant)
 * - Responsive design
 */
@Component({
  selector: 'app-base-table',
  templateUrl: './base-table.component.html',
  styleUrls: ['./base-table.component.scss']
})
export class BaseTableComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  // ========================================================================
  // INPUTS
  // ========================================================================

  /** Table configuration */
  @Input() config!: TableConfig;

  /** Data source array */
  @Input() data: any[] = [];

  /** Loading state */
  @Input() loading: boolean = false;

  /** Error state */
  @Input() error: string | null = null;

  /** Access denied state */
  @Input() accessDenied: boolean = false;

  /** Access error code */
  @Input() accessErrorCode?: AccessErrorCode;

  /** Access error message */
  @Input() accessErrorMessage?: string;

  /** Access error details */
  @Input() accessErrorDetails?: string;

  /** Show upgrade button in access denied state */
  @Input() showUpgradeButton: boolean = false;

  /** Feature name for access denied message */
  @Input() featureName?: string;

  /** Number of external filters applied (for parent components with custom filters) */
  @Input() externalFiltersActive: number = 0;

  // ========================================================================
  // OUTPUTS (Events)
  // ========================================================================

  /** Emitted when row action is triggered */
  @Output() rowAction = new EventEmitter<TableRowActionEvent>();

  /** Emitted when bulk action is triggered */
  @Output() bulkAction = new EventEmitter<TableBulkActionEvent>();

  /** Emitted when filters change */
  @Output() filterChange = new EventEmitter<TableFilterChangeEvent>();

  /** Emitted when sort changes */
  @Output() sortChange = new EventEmitter<TableSortChangeEvent>();

  /** Emitted when page changes */
  @Output() pageChange = new EventEmitter<TablePageChangeEvent>();

  /** Emitted when selection changes */
  @Output() selectionChange = new EventEmitter<TableSelectionChangeEvent>();

  // ========================================================================
  // VIEW CHILDREN
  // ========================================================================

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // ========================================================================
  // PUBLIC PROPERTIES
  // ========================================================================

  /** Material table data source */
  dataSource!: MatTableDataSource<any>;

  /** Selection model for checkboxes */
  selection!: SelectionModel<any>;

  /** Displayed columns (includes selection and actions) */
  displayedColumns: string[] = [];

  /** Active filters */
  activeFilters: { field: string; value: any; label: string }[] = [];

  /** Search term */
  searchTerm: string = '';

  /** Quick filter selection */
  quickFilterValue: any = null;

  /** Advanced filter drawer open state */
  filterDrawerOpen: boolean = false;

  /** Current editing row index */
  editingRowIndex: number | null = null;

  /** Editing row backup (for cancel) */
  editingRowBackup: any = null;

  // ========================================================================
  // PRIVATE PROPERTIES
  // ========================================================================

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  // ========================================================================
  // CONSTRUCTOR
  // ========================================================================

  constructor(private csvExportService: CsvExportService) {}

  // ========================================================================
  // LIFECYCLE HOOKS
  // ========================================================================

  ngOnInit(): void {
    this.initializeTable();
    this.initializeSelection();
    this.initializeSearch();
    this.loadPersistedFilters();
  }

  ngAfterViewInit(): void {
    // Connect paginator and sort to data source after view is initialized
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Update dataSource when data input changes
    if (changes['data'] && this.dataSource) {
      this.dataSource.data = this.data;

      // Re-connect paginator when data changes (in case it was connected before data loaded)
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ========================================================================
  // INITIALIZATION
  // ========================================================================

  private initializeTable(): void {
    // Initialize data source
    this.dataSource = new MatTableDataSource(this.data);

    // Build displayed columns
    this.displayedColumns = [];

    // Add selection column if enabled
    if (this.config.selection?.enabled && this.config.selection?.showCheckboxes) {
      this.displayedColumns.push('select');
    }

    // Add data columns
    this.displayedColumns.push(...this.config.columns.map(col => col.field));

    // Add actions column if enabled
    if (this.config.actions?.row && this.config.actions.row.length > 0) {
      this.displayedColumns.push('actions');
    }

    // Set up custom filter predicate
    this.dataSource.filterPredicate = this.createFilterPredicate();

    // Apply default sort if configured
    if (this.config.sorting?.defaultSort) {
      const { field, direction } = this.config.sorting.defaultSort;
      this.dataSource.data = this.sortData(this.dataSource.data, field, direction);
    }
  }

  private initializeSelection(): void {
    if (!this.config.selection?.enabled) return;

    const allowMultiSelect = this.config.selection.mode === 'multiple';
    this.selection = new SelectionModel<any>(allowMultiSelect, []);

    // Emit selection changes
    this.selection.changed
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.selectionChange.emit({ selected: this.selection.selected });
      });
  }

  private initializeSearch(): void {
    // Debounce search input
    this.searchSubject
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$)
      )
      .subscribe(searchTerm => {
        this.applyFilters();
      });
  }

  // ========================================================================
  // FILTER METHODS
  // ========================================================================

  onSearchChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.searchSubject.next(searchTerm);
  }

  onQuickFilterChange(value: any): void {
    this.quickFilterValue = value;
    this.applyFilters();
    this.persistFilters();
  }

  toggleFilterDrawer(): void {
    this.filterDrawerOpen = !this.filterDrawerOpen;
  }

  onAdvancedFiltersApply(filters: any): void {
    // Update active filters
    this.updateActiveFilters(filters);
    this.applyFilters();
    this.persistFilters();
    this.filterDrawerOpen = false;
  }

  removeFilter(filter: { field: string; value: any; label: string }): void {
    this.activeFilters = this.activeFilters.filter(f => f !== filter);
    this.applyFilters();
    this.persistFilters();
  }

  clearAllFilters(): void {
    this.searchTerm = '';
    this.quickFilterValue = null;
    this.activeFilters = [];
    this.applyFilters();
    this.persistFilters();
  }

  private applyFilters(): void {
    let filteredData = [...this.data];

    // Apply search filter
    if (this.searchTerm && this.config.filtering?.searchEnabled) {
      filteredData = this.filterBySearch(filteredData, this.searchTerm);
    }

    // Apply quick filter
    if (this.quickFilterValue !== null && this.config.filtering?.quickFilters) {
      const field = this.config.filtering.quickFilters.field;
      if (field) {
        filteredData = filteredData.filter(row => {
          const rowValue = row[field];
          // Support both exact match and substring match
          return rowValue === this.quickFilterValue ||
                 (typeof rowValue === 'string' && rowValue.includes(this.quickFilterValue));
        });
      }
    }

    // Apply advanced filters
    if (this.activeFilters.length > 0) {
      filteredData = this.filterByAdvanced(filteredData, this.activeFilters);
    }

    this.dataSource.data = filteredData;

    // Emit filter change event
    this.filterChange.emit({
      filters: {
        search: this.searchTerm,
        quickFilter: this.quickFilterValue,
        advancedFilters: this.activeFilters
      },
      activeFilters: this.activeFilters
    });
  }

  private filterBySearch(data: any[], searchTerm: string): any[] {
    const term = searchTerm.toLowerCase();
    const searchFields = this.config.filtering?.searchFields ||
                        this.config.columns.map(col => col.field);

    return data.filter(row => {
      return searchFields.some(field => {
        const value = row[field];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(term);
      });
    });
  }

  private filterByAdvanced(data: any[], filters: { field: string; value: any }[]): any[] {
    return data.filter(row => {
      return filters.every(filter => {
        const rowValue = row[filter.field];
        // Handle array values (multi-select filters)
        if (Array.isArray(filter.value)) {
          return filter.value.includes(rowValue);
        }
        return rowValue === filter.value;
      });
    });
  }

  private createFilterPredicate(): (data: any, filter: string) => boolean {
    return (data: any, filter: string): boolean => {
      // This is handled by applyFilters() method
      return true;
    };
  }

  private updateActiveFilters(filters: any): void {
    // Convert advanced filter selections to active filter chips
    this.activeFilters = [];

    if (this.config.filtering?.advancedFilters) {
      for (const group of this.config.filtering.advancedFilters.groups) {
        if (filters[group.field]) {
          const value = filters[group.field];
          if (Array.isArray(value)) {
            value.forEach(v => {
              const option = this.findFilterOption(group.options, v);
              if (option) {
                this.activeFilters.push({
                  field: group.field,
                  value: v,
                  label: `${group.label}: ${option.label}`
                });
              }
            });
          } else {
            const option = this.findFilterOption(group.options, value);
            if (option) {
              this.activeFilters.push({
                field: group.field,
                value: value,
                label: `${group.label}: ${option.label}`
              });
            }
          }
        }
      }
    }
  }

  private findFilterOption(options: any[], value: any): any {
    for (const option of options) {
      if (option.value === value) return option;
      if (option.children) {
        const found = this.findFilterOption(option.children, value);
        if (found) return found;
      }
    }
    return null;
  }

  // ========================================================================
  // SORTING METHODS
  // ========================================================================

  onSortChange(sort: Sort): void {
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = [...this.data];
      return;
    }

    this.dataSource.data = this.sortData(this.dataSource.data, sort.active, sort.direction);

    this.sortChange.emit({
      field: sort.active,
      direction: sort.direction as 'asc' | 'desc'
    });
  }

  private sortData(data: any[], field: string, direction: 'asc' | 'desc'): any[] {
    return data.sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];

      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      let comparison = 0;
      if (typeof aVal === 'string') {
        comparison = aVal.localeCompare(bVal);
      } else {
        comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      }

      return direction === 'asc' ? comparison : -comparison;
    });
  }

  // ========================================================================
  // PAGINATION METHODS
  // ========================================================================

  onPageChange(event: PageEvent): void {
    this.pageChange.emit({
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
      length: event.length
    });
  }

  // ========================================================================
  // SELECTION METHODS
  // ========================================================================

  isAllSelected(): boolean {
    if (!this.selection) return false;
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    if (!this.selection) return;

    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  toggleRow(row: any): void {
    if (!this.selection) return;
    this.selection.toggle(row);
  }

  // ========================================================================
  // ACTION METHODS
  // ========================================================================

  onRowAction(action: any, row: any, rowIndex: number): void {
    // Check if action is disabled
    if (action.disabled && action.disabled(row)) {
      return;
    }

    // Show confirmation dialog if configured
    if (action.confirmMessage) {
      const confirmed = confirm(action.confirmMessage);
      if (!confirmed) return;
    }

    // Execute callback
    action.callback(row);

    // Emit event
    this.rowAction.emit({ action, row, rowIndex });
  }

  onBulkAction(action: any): void {
    const selectedRows = this.selection.selected;

    if (selectedRows.length === 0) {
      alert('Please select at least one row');
      return;
    }

    // Show confirmation dialog if configured
    if (action.confirmMessage) {
      const confirmed = confirm(action.confirmMessage.replace('{count}', selectedRows.length));
      if (!confirmed) return;
    }

    // Execute callback
    action.callback(selectedRows);

    // Emit event
    this.bulkAction.emit({ action, selectedRows });
  }

  // ========================================================================
  // EDITING METHODS (for Editable Table type)
  // ========================================================================

  startEditRow(row: any, rowIndex: number): void {
    if (!this.config.editing?.enabled) return;

    this.editingRowIndex = rowIndex;
    this.editingRowBackup = { ...row };
  }

  saveEditRow(row: any, rowIndex: number): void {
    if (!this.config.editing?.enabled) return;

    // Validate row data
    if (this.config.editing.columns) {
      for (const col of this.config.editing.columns) {
        if (col.required && !row[col.field]) {
          alert(`${col.field} is required`);
          return;
        }
        if (col.validator) {
          const result = col.validator(row[col.field]);
          if (result !== true) {
            alert(typeof result === 'string' ? result : `Invalid value for ${col.field}`);
            return;
          }
        }
      }
    }

    // Call onSave callback
    if (this.config.editing.onSave) {
      this.config.editing.onSave(row);
    }

    this.editingRowIndex = null;
    this.editingRowBackup = null;
  }

  cancelEditRow(row: any, rowIndex: number): void {
    if (!this.config.editing?.enabled || !this.editingRowBackup) return;

    // Restore original values
    Object.assign(row, this.editingRowBackup);

    // Call onCancel callback
    if (this.config.editing.onCancel) {
      this.config.editing.onCancel(row);
    }

    this.editingRowIndex = null;
    this.editingRowBackup = null;
  }

  isRowEditing(rowIndex: number): boolean {
    return this.editingRowIndex === rowIndex;
  }

  // ========================================================================
  // PERSISTENCE METHODS (localStorage)
  // ========================================================================

  private persistFilters(): void {
    if (!this.config.filtering?.persistFilters || !this.config.tableId) return;

    const filterState: FilterState = {
      searchTerm: this.searchTerm,
      quickFilters: this.quickFilterValue,
      advancedFilters: this.activeFilters,
      timestamp: Date.now()
    };

    const key = this.config.filtering.filterStorageKey || `table-filters-${this.config.tableId}`;
    localStorage.setItem(key, JSON.stringify(filterState));
  }

  private loadPersistedFilters(): void {
    if (!this.config.filtering?.persistFilters || !this.config.tableId) return;

    const key = this.config.filtering.filterStorageKey || `table-filters-${this.config.tableId}`;
    const stored = localStorage.getItem(key);

    if (!stored) return;

    try {
      const filterState: FilterState = JSON.parse(stored);

      // Check if filters are expired (30 days)
      const expiryDays = 30;
      const expiryMs = expiryDays * 24 * 60 * 60 * 1000;
      if (Date.now() - filterState.timestamp > expiryMs) {
        localStorage.removeItem(key);
        return;
      }

      // Restore filters
      this.searchTerm = filterState.searchTerm || '';
      this.quickFilterValue = filterState.quickFilters;
      this.activeFilters = filterState.advancedFilters || [];

      this.applyFilters();
    } catch (error) {
      console.error('Failed to load persisted filters:', error);
    }
  }

  // ========================================================================
  // HELPER METHODS
  // ========================================================================

  getColumnValue(row: any, column: TableColumn): any {
    return row[column.field];
  }

  getStatusConfig(value: any): any {
    if (!this.config.statusColumn) return null;
    return this.config.statusColumn.mapping[value] || this.config.statusColumn.defaultStatus;
  }

  isActionVisible(action: any, row: any): boolean {
    if (action.visible && !action.visible(row)) return false;
    if (action.visibleForRoles && this.config.currentUserRole) {
      return action.visibleForRoles.includes(this.config.currentUserRole);
    }
    return true;
  }

  isColumnVisible(column: TableColumn): boolean {
    if (column.hidden) return false;
    if (column.visibleForRoles && this.config.currentUserRole) {
      return column.visibleForRoles.includes(this.config.currentUserRole);
    }
    return true;
  }

  getActiveFilterCount(): number {
    let count = 0;
    if (this.searchTerm) count++;
    if (this.quickFilterValue !== null) count++;
    count += this.activeFilters.length;
    count += this.externalFiltersActive; // Include external filters from parent component
    return count;
  }

  // ========================================================================
  // EMPTY STATE HELPERS
  // ========================================================================

  hasData(): boolean {
    return this.dataSource && this.dataSource.data.length > 0;
  }

  hasFilteredResults(): boolean {
    return this.hasData();
  }

  shouldShowEmptyState(): boolean {
    // Only show "No data" state when there's truly no data AND no filters active AND no access denied
    return !this.loading && !this.error && !this.accessDenied && !this.hasData() && this.getActiveFilterCount() === 0;
  }

  shouldShowNoResultsState(): boolean {
    // Show "No results found" when filters are active but return no results AND no access denied
    return !this.loading && !this.error && !this.accessDenied && !this.hasFilteredResults() && this.getActiveFilterCount() > 0;
  }

  shouldShowAccessDeniedState(): boolean {
    // Show access denied state when accessDenied flag is true
    return !this.loading && this.accessDenied;
  }

  shouldShowErrorState(): boolean {
    return !this.loading && !!this.error && !this.accessDenied;
  }

  // ========================================================================
  // EXPORT FUNCTIONALITY
  // ========================================================================

  /**
   * Export current table data to CSV
   */
  exportToCsv(): void {
    if (!this.config.export?.enabled) {
      console.warn('Export is not enabled for this table');
      return;
    }

    // Call beforeExport callback if provided
    let dataToExport = this.dataSource.data;
    if (this.config.export.beforeExport) {
      dataToExport = this.config.export.beforeExport(dataToExport);
    }

    // Determine filename
    const filename = this.config.export.filename || this.config.tableId || 'table-export';

    // Export using CSV service
    this.csvExportService.exportToCsv(
      dataToExport,
      this.config.columns,
      filename
    );

    // Call afterExport callback if provided
    if (this.config.export.afterExport) {
      this.config.export.afterExport();
    }
  }

  /**
   * Check if export is enabled
   */
  isExportEnabled(): boolean {
    return this.config.export?.enabled ?? false;
  }

  /**
   * Get export button label
   */
  getExportButtonLabel(): string {
    return this.config.export?.buttonLabel || 'Export CSV';
  }

  /**
   * Get export button icon
   */
  getExportIcon(): string {
    return this.config.export?.icon || 'download';
  }

  /**
   * Check if export icon should be shown
   */
  shouldShowExportIcon(): boolean {
    return this.config.export?.showIcon !== false;
  }

  /**
   * Check if table has a circuit health column
   */
  hasCircuitHealthColumn(): boolean {
    return this.config.columns.some(col =>
      col.cellClass === 'circuits-health-cell' ||
      col.field === 'circuits' ||
      col.header?.toLowerCase().includes('circuit')
    );
  }
}
