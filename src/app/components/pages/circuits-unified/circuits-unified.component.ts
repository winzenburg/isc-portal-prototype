import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { TableConfig } from '../../shared/base-table/base-table.config';
import { BaseTableComponent } from '../../shared/base-table/base-table.component';
import { SyncStatusService, DataSyncInfo } from '../../../services/sync-status.service';
import { PageHelpService } from '../../../services/help/page-help.service';
import { PageHelpContent } from '../../help/page-help-panel/page-help-panel.component';
import { Subject, takeUntil } from 'rxjs';

interface Circuit {
  bundleId: string;
  bundleStatus: string;
  bundleAlias: string;
  streetAddress: string;
  city: string;
  state: string;
  bundleProductType: string;
  circuitType: string;
  bandwidth: string;
}

@Component({
  selector: 'app-circuits-unified',
  templateUrl: './circuits-unified.component.html',
  styleUrls: ['./circuits-unified.component.scss']
})
export class CircuitsUnifiedComponent implements OnInit, OnDestroy {
  @ViewChild(BaseTableComponent) baseTable!: BaseTableComponent;

  tableConfig!: TableConfig<Circuit>;
  circuits: Circuit[] = [];
  loading: boolean = false;

  // Sync status
  syncInfo!: DataSyncInfo;
  private destroy$ = new Subject<void>();
  private readonly SYNC_KEY = 'circuits-data';

  // Help panel
  helpPanelOpen = false;
  helpContent!: PageHelpContent;

  constructor(
    private syncStatusService: SyncStatusService,
    private pageHelpService: PageHelpService
  ) {}

  ngOnInit(): void {
    // Initialize sync tracking
    this.syncStatusService.initializeDataSource(this.SYNC_KEY);
    this.syncStatusService.getSyncInfo(this.SYNC_KEY)
      .pipe(takeUntil(this.destroy$))
      .subscribe(info => this.syncInfo = info);

    // Load help content
    const content = this.pageHelpService.getPageHelp('circuits');
    if (content) {
      this.helpContent = content;
    }

    this.initializeTableConfig();
    this.loadCircuits();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeTableConfig(): void {
    this.tableConfig = {
      title: 'Circuits',
      tableType: 'standard',
      tableId: 'circuits-table',

      columns: [
        {
          field: 'bundleId',
          header: 'Bundle ID',
          sortable: true,
          width: '140px',
          tooltip: 'Unique identifier for the circuit bundle'
        },
        {
          field: 'bundleStatus',
          header: 'Status',
          sortable: true,
          width: '150px',
          type: 'status',
          tooltip: 'Current operational status of the circuit'
        },
        {
          field: 'bundleAlias',
          header: 'Bundle Alias',
          sortable: true,
          tooltip: 'Human-readable name for the circuit'
        },
        {
          field: 'streetAddress',
          header: 'Street Address',
          sortable: true,
          tooltip: 'Physical location of the circuit endpoint'
        },
        {
          field: 'city',
          header: 'City',
          sortable: true,
          width: '120px'
        },
        {
          field: 'state',
          header: 'State',
          sortable: true,
          width: '80px'
        },
        {
          field: 'bundleProductType',
          header: 'Product Type',
          sortable: true,
          width: '150px',
          tooltip: 'Type of network service (e.g., SD-WAN, DIA, MPLS)'
        },
        {
          field: 'circuitType',
          header: 'Circuit Type',
          sortable: true,
          width: '130px',
          tooltip: 'Physical connection type for the circuit'
        },
        {
          field: 'bandwidth',
          header: 'Bandwidth',
          sortable: true,
          width: '120px',
          tooltip: 'Maximum data transfer capacity of the circuit'
        },
      ],

      statusColumn: {
        field: 'bundleStatus',
        mapping: {
          'Installed': { icon: 'circle', color: '#24A148', label: 'Installed', tooltip: 'Circuit is operational' },
          'Pending': { icon: 'circle', color: '#F1C21B', label: 'Pending', tooltip: 'Installation in progress' },
          'Disconnected': { icon: 'triangle', color: '#DA1E28', label: 'Disconnected', tooltip: 'Circuit disconnected' },
          'Action Required': { icon: 'triangle', color: '#FF9800', label: 'Action Required', tooltip: 'Requires attention' }
        }
      },

      actions: {
        row: [
          { label: 'Edit', icon: 'edit', color: 'primary', callback: ((c: Circuit) => this.editCircuit(c)) as any },
          { label: 'View Details', icon: 'open_in_new', color: 'primary', callback: ((c: Circuit) => this.viewDetails(c)) as any }
        ],
        header: [
          { label: 'Add Circuit', icon: 'add', color: 'primary', callback: () => this.addCircuit() },
          { label: 'Refresh', icon: 'refresh', callback: () => this.loadCircuits() }
        ],
        bulk: [
          { label: 'Export Selected', icon: 'download', callback: ((c: Circuit[]) => this.export(c)) as any },
          { label: 'Delete Selected', icon: 'delete', color: 'warn', callback: ((c: Circuit[]) => this.delete(c)) as any }
        ]
      },

      filtering: {
        searchEnabled: true,
        searchPlaceholder: 'Search circuits...',
        persistFilters: true,
        quickFilters: {
          enabled: true,
          label: 'Filter by Status:',
          field: 'bundleStatus',
          options: [
            { label: 'All Circuits', value: null, count: 109 },
            { label: 'Installed', value: 'Installed', count: 98 },
            { label: 'Action Required', value: 'Action Required', count: 6 }
          ]
        }
      },

      export: {
        enabled: false  // Disabled to use custom button in header
      },

      pagination: { enabled: true, pageSize: 10, pageSizeOptions: [10, 25, 50, 100], showFirstLastButtons: true },
      selection: { enabled: true, mode: 'multiple', showCheckboxes: true, selectAllEnabled: true },
      sorting: { enabled: true, defaultSort: { field: 'bundleId', direction: 'asc' } },
      hoverHighlight: true
    };
  }

  private loadCircuits(): void {
    this.loading = true;
    this.syncStatusService.startSync(this.SYNC_KEY);

    setTimeout(() => {
      this.circuits = [
        { bundleId: 'ESRI.VANC.0001', bundleStatus: 'Installed', bundleAlias: 'Vancouver Main', streetAddress: '1050 W Pender St', city: 'Vancouver', state: 'BC', bundleProductType: 'Managed IP VPN', circuitType: 'Ethernet', bandwidth: '1 Gbps' },
        { bundleId: 'ESRI.DALL.0023', bundleStatus: 'Installed', bundleAlias: 'Dallas DC', streetAddress: '123 Commerce St', city: 'Dallas', state: 'TX', bundleProductType: 'DIA', circuitType: 'Ethernet', bandwidth: '10 Gbps' },
        { bundleId: 'ESRI.AUST.0045', bundleStatus: 'Pending', bundleAlias: 'Austin Branch', streetAddress: '456 Congress Ave', city: 'Austin', state: 'TX', bundleProductType: 'SD-WAN', circuitType: 'MPLS', bandwidth: '500 Mbps' },
        { bundleId: 'ESRI.SF.0067', bundleStatus: 'Action Required', bundleAlias: 'SF HQ', streetAddress: '789 Market St', city: 'San Francisco', state: 'CA', bundleProductType: 'Managed IP VPN', circuitType: 'Ethernet', bandwidth: '2 Gbps' },
        { bundleId: 'ESRI.LA.0089', bundleStatus: 'Installed', bundleAlias: 'LA Office', streetAddress: '321 Wilshire Blvd', city: 'Los Angeles', state: 'CA', bundleProductType: 'DIA', circuitType: 'Customer Provided', bandwidth: '1 Gbps' }
      ];
      this.loading = false;
      this.syncStatusService.completeSync(this.SYNC_KEY, this.circuits.length);
    }, 500);
  }

  refreshCircuits(): void {
    this.loadCircuits();
  }

  editCircuit(c: Circuit) { alert(`Edit: ${c.bundleId}`); }
  viewDetails(c: Circuit) { alert(`View: ${c.bundleId}`); }
  addCircuit() { alert('Add Circuit'); }
  export(c: Circuit[]) { alert(`Export ${c.length} circuits`); }
  delete(c: Circuit[]) { if (confirm(`Delete ${c.length} circuits?`)) alert('Deleted'); }

  /**
   * Export circuits to CSV
   */
  exportToCsv(): void {
    if (this.baseTable) {
      this.baseTable.exportToCsv();
    }
  }

  /**
   * Toggle help panel
   */
  toggleHelpPanel(): void {
    this.helpPanelOpen = !this.helpPanelOpen;
  }
}
