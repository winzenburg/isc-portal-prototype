import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { FilterGroup } from '../base-table/base-table.config';

/**
 * Filter Drawer Component (Component 2)
 *
 * Advanced filtering panel that slides in from the right side.
 * Supports hierarchical checkbox filters with search capability.
 *
 * Features:
 * - Right-side drawer (doesn't obscure table)
 * - Search within filters
 * - Hierarchical checkboxes
 * - Count badges
 * - Clear All functionality
 * - Apply/Cancel buttons
 */
@Component({
  selector: 'app-filter-drawer',
  templateUrl: './filter-drawer.component.html',
  styleUrls: ['./filter-drawer.component.scss']
})
export class FilterDrawerComponent implements OnInit, OnChanges {
  @Input() open: boolean = false;
  @Input() filterGroups: FilterGroup[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() apply = new EventEmitter<any>();

  // Filter state
  selectedFilters: { [key: string]: any } = {};
  searchTerm: string = '';
  expandedGroups: { [key: string]: boolean } = {};

  ngOnInit(): void {
    // Expand all groups by default
    this.filterGroups.forEach(group => {
      this.expandedGroups[group.field] = !group.collapsed;
    });
  }

  ngOnChanges(): void {
    // Reset search when drawer opens
    if (this.open) {
      this.searchTerm = '';
    }
  }

  toggleGroup(field: string): void {
    this.expandedGroups[field] = !this.expandedGroups[field];
  }

  isGroupExpanded(field: string): boolean {
    return this.expandedGroups[field] !== false;
  }

  onFilterChange(groupField: string, value: any, checked: boolean): void {
    if (!this.selectedFilters[groupField]) {
      this.selectedFilters[groupField] = [];
    }

    if (checked) {
      // Add value to selected filters
      if (!this.selectedFilters[groupField].includes(value)) {
        this.selectedFilters[groupField].push(value);
      }
    } else {
      // Remove value from selected filters
      const index = this.selectedFilters[groupField].indexOf(value);
      if (index > -1) {
        this.selectedFilters[groupField].splice(index, 1);
      }
    }
  }

  isFilterSelected(groupField: string, value: any): boolean {
    return this.selectedFilters[groupField]?.includes(value) || false;
  }

  clearAll(): void {
    this.selectedFilters = {};
  }

  onApply(): void {
    this.apply.emit(this.selectedFilters);
  }

  onCancel(): void {
    this.close.emit();
  }

  getSelectedCount(): number {
    return Object.values(this.selectedFilters)
      .reduce((count, values: any) => count + (values?.length || 0), 0);
  }
}
