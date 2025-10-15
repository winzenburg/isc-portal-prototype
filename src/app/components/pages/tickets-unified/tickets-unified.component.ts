import { Component, OnInit } from '@angular/core';
import { TableConfig } from '../../shared/base-table/base-table.config';

interface Ticket {
  ticketId: string;
  title: string;
  status: string;
  priority: string;
  assignee: string;
  created: string;
  type: string;
}

@Component({
  selector: 'app-tickets-unified',
  templateUrl: './tickets-unified.component.html',
  styleUrls: ['./tickets-unified.component.scss']
})
export class TicketsUnifiedComponent implements OnInit {
  tableConfig!: TableConfig<Ticket>;
  tickets: Ticket[] = [];
  loading = false;

  ngOnInit() {
    this.initializeTableConfig();
    this.loadTickets();
  }

  private initializeTableConfig() {
    this.tableConfig = {
      title: 'Support Tickets',
      tableType: 'quick-filter',
      tableId: 'tickets-table',

      columns: [
        { field: 'ticketId', header: 'Ticket ID', sortable: true, width: '120px' },
        { field: 'type', header: 'Type', sortable: true, type: 'status', width: '120px' },
        { field: 'title', header: 'Title', sortable: true },
        { field: 'status', header: 'Status', sortable: true, width: '130px' },
        { field: 'priority', header: 'Priority', sortable: true, width: '100px' },
        { field: 'assignee', header: 'Assignee', sortable: true, width: '150px' },
        { field: 'created', header: 'Created', sortable: true, width: '120px' }
      ],

      statusColumn: {
        field: 'type',
        mapping: {
          'Incident': { icon: 'circle', color: '#DA1E28', label: 'Incident' },
          'Maintenance': { icon: 'circle', color: '#0D62FF', label: 'Maintenance' },
          'Request': { icon: 'circle', color: '#24A148', label: 'Request' }
        }
      },

      actions: {
        row: [
          { label: 'View', icon: 'visibility', callback: ((t: Ticket) => this.viewTicket(t)) as any },
          { label: 'Edit', icon: 'edit', callback: ((t: Ticket) => this.editTicket(t)) as any }
        ],
        header: [
          { label: 'Create Ticket', icon: 'add', color: 'primary', callback: () => this.createTicket() }
        ]
      },

      filtering: {
        searchEnabled: true,
        persistFilters: true,
        quickFilters: {
          enabled: true,
          label: 'Filter by Status:',
          field: 'status',
          options: [
            { label: 'All', value: null, count: 125 },
            { label: 'To Do', value: 'To Do', count: 23 },
            { label: 'In Progress', value: 'In Progress', count: 45 },
            { label: 'Done', value: 'Done', count: 52 },
            { label: 'Pending Customer', value: 'Pending Customer', count: 5 }
          ]
        }
      },

      export: {
        enabled: true,
        filename: 'tickets',
        buttonLabel: 'Export CSV',
        showIcon: true,
        icon: 'download'
      },

      pagination: { enabled: true, pageSize: 25, pageSizeOptions: [25, 50, 100], showFirstLastButtons: true },
      selection: { enabled: true, mode: 'multiple', showCheckboxes: true },
      sorting: { enabled: true, defaultSort: { field: 'created', direction: 'desc' } },
      hoverHighlight: true
    };
  }

  private loadTickets() {
    this.loading = true;
    setTimeout(() => {
      this.tickets = [
        { ticketId: 'TKT-1234', title: 'Circuit outage in Dallas', status: 'In Progress', priority: 'High', assignee: 'John Doe', created: '2025-10-13', type: 'Incident' },
        { ticketId: 'TKT-1235', title: 'Scheduled maintenance window', status: 'To Do', priority: 'Medium', assignee: 'Jane Smith', created: '2025-10-14', type: 'Maintenance' },
        { ticketId: 'TKT-1236', title: 'Bandwidth increase request', status: 'Pending Customer', priority: 'Low', assignee: 'Bob Johnson', created: '2025-10-12', type: 'Request' },
        { ticketId: 'TKT-1237', title: 'VPN configuration issue', status: 'In Progress', priority: 'High', assignee: 'John Doe', created: '2025-10-13', type: 'Incident' },
        { ticketId: 'TKT-1238', title: 'Add new site to network', status: 'Done', priority: 'Medium', assignee: 'Jane Smith', created: '2025-10-10', type: 'Request' }
      ];
      this.loading = false;
    }, 500);
  }

  viewTicket(t: Ticket) { alert(`View: ${t.ticketId}`); }
  editTicket(t: Ticket) { alert(`Edit: ${t.ticketId}`); }
  createTicket() { alert('Create Ticket'); }
}
