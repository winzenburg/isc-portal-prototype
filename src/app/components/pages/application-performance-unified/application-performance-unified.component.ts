import { Component, OnInit } from '@angular/core';
import { TableConfig } from '../../shared/base-table/base-table.config';

interface Application {
  appId: string;
  appName: string;
  category: string;
  priority: string;
  avgLatency: string;
  packetLoss: string;
  status: string;
  sites: number;
}

@Component({
  selector: 'app-application-performance-unified',
  templateUrl: './application-performance-unified.component.html',
  styleUrls: ['./application-performance-unified.component.scss']
})
export class ApplicationPerformanceUnifiedComponent implements OnInit {
  tableConfig!: TableConfig<Application>;
  applications: Application[] = [];
  loading = false;

  ngOnInit() {
    this.initializeTableConfig();
    this.loadApplications();
  }

  private initializeTableConfig() {
    this.tableConfig = {
      title: 'Application Performance',
      tableType: 'standard',
      tableId: 'app-performance-table',

      columns: [
        { field: 'appId', header: 'App ID', sortable: true, width: '100px' },
        { field: 'appName', header: 'Application Name', sortable: true },
        { field: 'category', header: 'Category', sortable: true, width: '150px' },
        { field: 'priority', header: 'Priority', sortable: true, width: '100px' },
        { field: 'avgLatency', header: 'Avg Latency', sortable: true, width: '120px', align: 'right' },
        { field: 'packetLoss', header: 'Packet Loss', sortable: true, width: '120px', align: 'right' },
        { field: 'status', header: 'Status', sortable: true, type: 'status', width: '120px' },
        { field: 'sites', header: 'Sites', sortable: true, width: '80px', align: 'right' }
      ],

      statusColumn: {
        field: 'status',
        mapping: {
          'Good': { icon: 'circle', color: '#24A148', label: 'Good' },
          'Warning': { icon: 'circle', color: '#F1C21B', label: 'Warning' },
          'Critical': { icon: 'triangle', color: '#DA1E28', label: 'Critical' }
        }
      },

      actions: {
        row: [
          { label: 'View Metrics', icon: 'analytics', callback: ((a: Application) => this.viewMetrics(a)) as any },
          { label: 'Configure', icon: 'settings', callback: ((a: Application) => this.configureApp(a)) as any }
        ],
        header: [
          { label: 'Add Application', icon: 'add', color: 'primary', callback: () => this.addApplication() },
          { label: 'Refresh', icon: 'refresh', callback: () => this.loadApplications() }
        ]
      },

      filtering: {
        searchEnabled: true,
        searchPlaceholder: 'Search applications...',
        persistFilters: true
      },

      export: {
        enabled: true,
        filename: 'application-performance',
        buttonLabel: 'Export CSV',
        showIcon: true,
        icon: 'download'
      },

      pagination: { enabled: true, pageSize: 10, pageSizeOptions: [10, 25, 50], showFirstLastButtons: true },
      selection: { enabled: true, mode: 'multiple', showCheckboxes: true },
      sorting: { enabled: true, defaultSort: { field: 'appName', direction: 'asc' } },
      hoverHighlight: true
    };
  }

  private loadApplications() {
    this.loading = true;
    setTimeout(() => {
      this.applications = [
        { appId: 'APP-001', appName: 'Microsoft Teams', category: 'Collaboration', priority: 'High', avgLatency: '45ms', packetLoss: '0.1%', status: 'Good', sites: 12 },
        { appId: 'APP-002', appName: 'Salesforce', category: 'CRM', priority: 'High', avgLatency: '120ms', packetLoss: '0.5%', status: 'Warning', sites: 8 },
        { appId: 'APP-003', appName: 'Zoom', category: 'Video Conference', priority: 'High', avgLatency: '35ms', packetLoss: '0.2%', status: 'Good', sites: 15 },
        { appId: 'APP-004', appName: 'SAP ERP', category: 'Business Apps', priority: 'Critical', avgLatency: '250ms', packetLoss: '2.1%', status: 'Critical', sites: 5 },
        { appId: 'APP-005', appName: 'Office 365', category: 'Productivity', priority: 'High', avgLatency: '55ms', packetLoss: '0.3%', status: 'Good', sites: 20 }
      ];
      this.loading = false;
    }, 500);
  }

  viewMetrics(a: Application) { alert(`View metrics: ${a.appName}`); }
  configureApp(a: Application) { alert(`Configure: ${a.appName}`); }
  addApplication() { alert('Add Application'); }
}
