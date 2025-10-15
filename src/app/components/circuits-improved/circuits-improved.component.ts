import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { StatusIndicatorConfig } from '../shared/base-table/base-table.config';
import { TableStateService } from '../../services/table-state.service';

export interface Circuit {
  bundleId: string;
  bundleStatus: 'Installed' | 'Pending' | 'Disconnected' | 'Cancelled';
  bundleAlias: string;
  streetAddress: string;
  bundleProductType: string;
  circuitType: string;
}

@Component({
  selector: 'app-circuits-improved',
  templateUrl: './circuits-improved.component.html',
  styleUrls: ['./circuits-improved.component.scss']
})
export class CircuitsImprovedComponent implements OnInit {
  // Table configuration
  displayedColumns: string[] = ['select', 'bundleId', 'bundleStatus', 'bundleAlias', 'streetAddress', 'bundleProductType', 'circuitType', 'actions'];
  dataSource: MatTableDataSource<Circuit>;
  selection = new SelectionModel<Circuit>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Filter state
  searchTerm = '';
  activeStatusFilter: string | null = null;
  showFilterDrawer = false;
  activeFilterChips: {label: string; value: any; field: string}[] = [];

  // Status filter options (Quick Filter Pills)
  statusFilters = [
    { label: 'All Circuits', value: null, count: 109 },
    { label: 'Installed', value: 'Installed', count: 98 },
    { label: 'Pending', value: 'Pending', count: 5 },
    { label: 'Disconnected', value: 'Disconnected', count: 6 }
  ];

  // Status indicator configurations (Icon + Color + Text)
  statusConfigs: { [key: string]: StatusIndicatorConfig } = {
    'Installed': {
      icon: 'circle',
      color: '#24A148',
      label: 'Installed',
      tooltip: 'Circuit is active and operational'
    },
    'Pending': {
      icon: 'circle',
      color: '#F1C21B',
      label: 'Pending',
      tooltip: 'Circuit installation in progress'
    },
    'Disconnected': {
      icon: 'triangle',
      color: '#DA1E28',
      label: 'Disconnected',
      tooltip: 'Circuit is not operational'
    },
    'Cancelled': {
      icon: 'square',
      color: '#8D8D8D',
      label: 'Cancelled',
      tooltip: 'Circuit has been cancelled'
    }
  };

  // Sample data
  circuits: Circuit[] = [
    { bundleId: 'MB303862', bundleStatus: 'Installed', bundleAlias: 'MB303862', streetAddress: '1500 Nolan Ryan Expressway...', bundleProductType: '100m Ethernet', circuitType: '100m Ethernet' },
    { bundleId: 'MB303869', bundleStatus: 'Installed', bundleAlias: 'MB303869', streetAddress: '506 North Center Street...', bundleProductType: '20m Ethernet', circuitType: '20m Ethernet' },
    { bundleId: 'MB372586', bundleStatus: 'Installed', bundleAlias: 'MB372586', streetAddress: '2740 N. Dallas Pkwy...', bundleProductType: 'Cust Prvd Internet', circuitType: 'Cust Prvd Internet' },
    { bundleId: 'MB303876', bundleStatus: 'Installed', bundleAlias: 'MB303876', streetAddress: '1311 Wet \'n Wild Way...', bundleProductType: '200m Ethernet', circuitType: '200m Ethernet' },
    { bundleId: 'MB372595', bundleStatus: 'Pending', bundleAlias: 'MB372595', streetAddress: '2740 N. Dallas Pkwy...', bundleProductType: 'Cust Prvd Internet', circuitType: 'Cust Prvd Internet' },
    { bundleId: 'MB303885', bundleStatus: 'Installed', bundleAlias: 'MB303885', streetAddress: '1500 Convention Center...', bundleProductType: '10m Ethernet', circuitType: '10m Ethernet' },
    { bundleId: 'MB359026', bundleStatus: 'Disconnected', bundleAlias: 'MB359026', streetAddress: '10085 Double R Blvd...', bundleProductType: '100m Ethernet', circuitType: '100m Ethernet' },
    { bundleId: 'MB359037', bundleStatus: 'Installed', bundleAlias: 'MB359037', streetAddress: '7638 Picardy Ave...', bundleProductType: '500m Ethernet', circuitType: '500m Ethernet' },
    { bundleId: 'MB318632', bundleStatus: 'Pending', bundleAlias: 'MB318632', streetAddress: '1900 N St James Rd...', bundleProductType: 'Cust Prvd Internet', circuitType: 'Cust Prvd Internet' },
    { bundleId: 'MB181175', bundleStatus: 'Installed', bundleAlias: 'MB181175', streetAddress: '3405 Palmtree Dr...', bundleProductType: 'Cust Prvd Internet', circuitType: 'Cust Prvd Internet' }
  ];

  constructor(private tableStateService: TableStateService) {
    this.dataSource = new MatTableDataSource(this.circuits);
  }

  ngOnInit() {
    // Load saved filter state from localStorage
    this.loadFilterState();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Custom filter predicate
    this.dataSource.filterPredicate = (data: Circuit, filter: string) => {
      const searchStr = filter.toLowerCase();
      return data.bundleId.toLowerCase().includes(searchStr) ||
             data.bundleAlias.toLowerCase().includes(searchStr) ||
             data.streetAddress.toLowerCase().includes(searchStr) ||
             data.bundleProductType.toLowerCase().includes(searchStr) ||
             data.circuitType.toLowerCase().includes(searchStr);
    };
  }

  // ============================================================================
  // SELECTION (Bulk Actions)
  // ============================================================================

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: Circuit): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.bundleId}`;
  }

  // ============================================================================
  // FILTERING
  // ============================================================================

  applySearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchTerm = filterValue;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.saveFilterState();
  }

  applyStatusFilter(status: string | null) {
    this.activeStatusFilter = status;

    // Update filter chips
    this.activeFilterChips = this.activeFilterChips.filter(chip => chip.field !== 'status');
    if (status) {
      this.activeFilterChips.push({
        label: `Status: ${status}`,
        value: status,
        field: 'status'
      });
    }

    // Apply filter
    if (status) {
      this.dataSource.data = this.circuits.filter(c => c.bundleStatus === status);
    } else {
      this.dataSource.data = this.circuits;
    }

    this.saveFilterState();
  }

  removeFilterChip(chip: {label: string; value: any; field: string}) {
    if (chip.field === 'status') {
      this.applyStatusFilter(null);
    }
  }

  clearAllFilters() {
    this.searchTerm = '';
    this.activeStatusFilter = null;
    this.activeFilterChips = [];
    this.dataSource.filter = '';
    this.dataSource.data = this.circuits;
    this.tableStateService.clearFilterState('circuits-improved');
  }

  toggleFilterDrawer() {
    this.showFilterDrawer = !this.showFilterDrawer;
  }

  getActiveFilterCount(): number {
    return this.activeFilterChips.length + (this.searchTerm ? 1 : 0);
  }

  // ============================================================================
  // ACTIONS
  // ============================================================================

  editCircuit(circuit: Circuit) {
    console.log('Edit circuit:', circuit.bundleId);
    alert(`Edit circuit: ${circuit.bundleId}\n\nThis would open an edit dialog or navigate to edit page.`);
  }

  viewCircuit(circuit: Circuit) {
    console.log('View circuit:', circuit.bundleId);
    alert(`View circuit details: ${circuit.bundleId}\n\nThis would navigate to circuit details page.`);
  }

  deleteCircuit(circuit: Circuit) {
    if (confirm(`Are you sure you want to delete circuit ${circuit.bundleId}?`)) {
      console.log('Delete circuit:', circuit.bundleId);
      this.circuits = this.circuits.filter(c => c.bundleId !== circuit.bundleId);
      this.dataSource.data = this.circuits;
    }
  }

  addCircuit() {
    console.log('Add new circuit');
    alert('Add New Circuit\n\nThis would navigate to create circuit page or open a dialog.');
  }

  refreshData() {
    console.log('Refresh circuits');
    alert('Refreshing circuits data...\n\nThis would reload data from the API.');
  }

  exportCircuits() {
    console.log('Export circuits');
    alert('Export Circuits\n\nThis would download a CSV file with circuit data.');
  }

  // Bulk Actions
  bulkEdit() {
    const count = this.selection.selected.length;
    console.log('Bulk edit:', count, 'circuits');
    alert(`Bulk Edit\n\n${count} circuits selected.\n\nThis would open a bulk edit dialog.`);
  }

  bulkDelete() {
    const count = this.selection.selected.length;
    if (confirm(`Are you sure you want to delete ${count} circuits?`)) {
      console.log('Bulk delete:', count, 'circuits');
      // Remove selected circuits
      this.circuits = this.circuits.filter(c => !this.selection.selected.includes(c));
      this.dataSource.data = this.circuits;
      this.selection.clear();
    }
  }

  bulkNotify() {
    const count = this.selection.selected.length;
    console.log('Send notification for:', count, 'circuits');
    alert(`Send Notification\n\n${count} circuits selected.\n\nThis would open a notification dialog.`);
  }

  // ============================================================================
  // LOCALSTORAGE PERSISTENCE
  // ============================================================================

  saveFilterState() {
    this.tableStateService.saveFilterState('circuits-improved', {
      searchTerm: this.searchTerm,
      quickFilters: this.activeStatusFilter,
      advancedFilters: null
    });
  }

  loadFilterState() {
    const savedState = this.tableStateService.loadFilterState('circuits-improved');
    if (savedState) {
      this.searchTerm = savedState.searchTerm || '';
      this.activeStatusFilter = savedState.quickFilters;

      // Apply saved filters
      if (this.searchTerm) {
        this.dataSource.filter = this.searchTerm.trim().toLowerCase();
      }
      if (this.activeStatusFilter) {
        this.applyStatusFilter(this.activeStatusFilter);
      }
    }
  }

  // ============================================================================
  // STATUS HELPERS
  // ============================================================================

  getStatusConfig(status: string): StatusIndicatorConfig {
    return this.statusConfigs[status] || {
      icon: 'none',
      color: '#666666',
      label: 'Unknown'
    };
  }
}
