import { Component, OnInit } from '@angular/core';
import { TableConfig } from '../../shared/base-table/base-table.config';

interface Invoice {
  invoiceNumber: string;
  date: string;
  amount: string;
  status: string;
  dueDate: string;
}

@Component({
  selector: 'app-network-invoices-unified',
  templateUrl: './network-invoices-unified.component.html',
  styleUrls: ['./network-invoices-unified.component.scss']
})
export class NetworkInvoicesUnifiedComponent implements OnInit {
  tableConfig!: TableConfig<Invoice>;
  invoices: Invoice[] = [];
  loading = false;

  ngOnInit() {
    this.initializeTableConfig();
    this.loadInvoices();
  }

  private initializeTableConfig() {
    this.tableConfig = {
      title: 'Network Invoices',
      tableType: 'action',
      tableId: 'invoices-table',

      columns: [
        { field: 'invoiceNumber', header: 'Invoice #', sortable: true, width: '140px' },
        { field: 'date', header: 'Invoice Date', sortable: true, width: '130px' },
        { field: 'amount', header: 'Amount', sortable: true, width: '120px', align: 'right' },
        { field: 'status', header: 'Status', sortable: true, type: 'status', width: '120px' },
        { field: 'dueDate', header: 'Due Date', sortable: true, width: '130px' }
      ],

      statusColumn: {
        field: 'status',
        mapping: {
          'Paid': { icon: 'circle', color: '#24A148', label: 'Paid' },
          'Pending': { icon: 'circle', color: '#F1C21B', label: 'Pending' },
          'Overdue': { icon: 'triangle', color: '#DA1E28', label: 'Overdue' }
        }
      },

      actions: {
        row: [
          { label: 'PDF', icon: 'picture_as_pdf', callback: ((inv: Invoice) => this.downloadPDF(inv)) as any, tooltip: 'Download PDF' },
          { label: 'CSV', icon: 'table_chart', callback: ((inv: Invoice) => this.downloadCSV(inv)) as any, tooltip: 'Download CSV' },
          { label: 'Email', icon: 'email', callback: ((inv: Invoice) => this.emailInvoice(inv)) as any, tooltip: 'Email invoice' }
        ],
        header: [
          { label: 'Export All', icon: 'download', color: 'primary', callback: () => this.exportAll() }
        ]
      },

      filtering: {
        searchEnabled: true,
        searchPlaceholder: 'Search invoices...',
        persistFilters: true
      },

      export: {
        enabled: true,
        filename: 'network-invoices',
        buttonLabel: 'Export CSV',
        showIcon: true,
        icon: 'download'
      },

      pagination: { enabled: true, pageSize: 10, pageSizeOptions: [10, 25, 50], showFirstLastButtons: true },
      sorting: { enabled: true, defaultSort: { field: 'date', direction: 'desc' } },
      hoverHighlight: true
    };
  }

  private loadInvoices() {
    this.loading = true;
    setTimeout(() => {
      this.invoices = [
        { invoiceNumber: '121600', date: '2025-03-23', amount: '$1,245.00', status: 'Paid', dueDate: '2025-04-23' },
        { invoiceNumber: '120569', date: '2025-03-01', amount: '$1,180.00', status: 'Paid', dueDate: '2025-04-01' },
        { invoiceNumber: '120570', date: '2025-02-01', amount: '$950.00', status: 'Pending', dueDate: '2025-03-01' },
        { invoiceNumber: '119823', date: '2025-01-15', amount: '$2,340.00', status: 'Paid', dueDate: '2025-02-15' },
        { invoiceNumber: '119156', date: '2024-12-20', amount: '$875.50', status: 'Overdue', dueDate: '2025-01-20' }
      ];
      this.loading = false;
    }, 500);
  }

  downloadPDF(inv: Invoice) { alert(`Download PDF: ${inv.invoiceNumber}`); }
  downloadCSV(inv: Invoice) { alert(`Download CSV: ${inv.invoiceNumber}`); }
  emailInvoice(inv: Invoice) { alert(`Email: ${inv.invoiceNumber}`); }
  exportAll() { alert('Export all invoices'); }
}
