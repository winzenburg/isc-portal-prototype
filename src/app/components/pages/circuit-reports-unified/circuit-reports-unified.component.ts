import { Component, OnInit } from '@angular/core';
import { TableConfig } from '../../shared/base-table/base-table.config';

interface CircuitReport {
  reportId: string;
  reportName: string;
  type: string;
  schedule: string;
  lastRun: string;
  status: string;
  recipients: string;
}

@Component({
  selector: 'app-circuit-reports-unified',
  templateUrl: './circuit-reports-unified.component.html',
  styleUrls: ['./circuit-reports-unified.component.scss']
})
export class CircuitReportsUnifiedComponent implements OnInit {
  tableConfig!: TableConfig<CircuitReport>;
  reports: CircuitReport[] = [];
  loading = false;

  ngOnInit() {
    this.initializeTableConfig();
    this.loadReports();
  }

  private initializeTableConfig() {
    this.tableConfig = {
      title: 'Circuit Reports',
      tableType: 'standard',
      tableId: 'circuit-reports-table',

      columns: [
        { field: 'reportId', header: 'Report ID', sortable: true, width: '120px' },
        { field: 'reportName', header: 'Report Name', sortable: true },
        { field: 'type', header: 'Type', sortable: true, width: '150px' },
        { field: 'schedule', header: 'Schedule', sortable: true, width: '120px' },
        { field: 'lastRun', header: 'Last Run', sortable: true, width: '150px' },
        { field: 'status', header: 'Status', sortable: true, type: 'status', width: '120px' },
        { field: 'recipients', header: 'Recipients', sortable: true, width: '200px' }
      ],

      statusColumn: {
        field: 'status',
        mapping: {
          'Active': { icon: 'circle', color: '#24A148', label: 'Active' },
          'Paused': { icon: 'circle', color: '#F1C21B', label: 'Paused' },
          'Failed': { icon: 'triangle', color: '#DA1E28', label: 'Failed' }
        }
      },

      actions: {
        row: [
          { label: 'Run Now', icon: 'play_arrow', callback: ((r: CircuitReport) => this.runReport(r)) as any },
          { label: 'Edit', icon: 'edit', callback: ((r: CircuitReport) => this.editReport(r)) as any },
          { label: 'Download', icon: 'download', callback: ((r: CircuitReport) => this.downloadReport(r)) as any }
        ],
        header: [
          { label: 'Create Report', icon: 'add', color: 'primary', callback: () => this.createReport() },
          { label: 'Refresh', icon: 'refresh', callback: () => this.loadReports() }
        ],
        bulk: [
          { label: 'Delete Selected', icon: 'delete', color: 'warn', callback: ((r: CircuitReport[]) => this.deleteReports(r)) as any }
        ]
      },

      filtering: {
        searchEnabled: true,
        searchPlaceholder: 'Search reports...',
        persistFilters: true
      },

      export: {
        enabled: true,
        filename: 'circuit-reports',
        buttonLabel: 'Export CSV',
        showIcon: true,
        icon: 'download'
      },

      pagination: { enabled: true, pageSize: 10, pageSizeOptions: [10, 25, 50], showFirstLastButtons: true },
      selection: { enabled: true, mode: 'multiple', showCheckboxes: true },
      sorting: { enabled: true, defaultSort: { field: 'lastRun', direction: 'desc' } },
      hoverHighlight: true
    };
  }

  private loadReports() {
    this.loading = true;
    setTimeout(() => {
      this.reports = [
        { reportId: 'RPT-001', reportName: 'Daily Circuit Status', type: 'Status Report', schedule: 'Daily', lastRun: '2025-10-14 08:00', status: 'Active', recipients: 'ops@acme.com' },
        { reportId: 'RPT-002', reportName: 'Weekly Bandwidth Usage', type: 'Usage Report', schedule: 'Weekly', lastRun: '2025-10-13 09:00', status: 'Active', recipients: 'billing@acme.com' },
        { reportId: 'RPT-003', reportName: 'Monthly Performance', type: 'Performance Report', schedule: 'Monthly', lastRun: '2025-10-01 10:00', status: 'Active', recipients: 'management@acme.com' },
        { reportId: 'RPT-004', reportName: 'Incident Summary', type: 'Incident Report', schedule: 'On Demand', lastRun: '2025-10-10 14:00', status: 'Paused', recipients: 'noc@acme.com' },
        { reportId: 'RPT-005', reportName: 'SLA Compliance', type: 'SLA Report', schedule: 'Monthly', lastRun: '2025-09-30 11:00', status: 'Failed', recipients: 'legal@acme.com' }
      ];
      this.loading = false;
    }, 500);
  }

  runReport(r: CircuitReport) { alert(`Running report: ${r.reportName}`); }
  editReport(r: CircuitReport) { alert(`Edit: ${r.reportName}`); }
  downloadReport(r: CircuitReport) { alert(`Download: ${r.reportName}`); }
  createReport() { alert('Create Report'); }
  deleteReports(r: CircuitReport[]) { if (confirm(`Delete ${r.length} reports?`)) alert('Deleted'); }
}
