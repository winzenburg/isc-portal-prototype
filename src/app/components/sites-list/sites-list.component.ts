import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';

interface Site {
  id: string;
  name: string;
  address: string;
  status: 'active' | 'pending' | 'inactive';
  circuits: number;
  lastUpdated: Date;
}

@Component({
  selector: 'app-sites-list',
  templateUrl: './sites-list.component.html',
  styleUrls: ['./sites-list.component.scss']
})
export class SitesListComponent {
  displayedColumns: string[] = ['select', 'name', 'address', 'status', 'circuits', 'lastUpdated', 'actions'];
  dataSource: MatTableDataSource<Site>;
  selection = new SelectionModel<Site>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  showDeleteConfirm = false;

  sites: Site[] = [
    {
      id: 'SITE-001',
      name: 'HQ Building A',
      address: '123 Main St, New York, NY',
      status: 'active',
      circuits: 12,
      lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 2)
    },
    {
      id: 'SITE-002',
      name: 'Branch Office - Boston',
      address: '456 Market St, Boston, MA',
      status: 'active',
      circuits: 8,
      lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24)
    },
    {
      id: 'SITE-003',
      name: 'Data Center - Chicago',
      address: '789 Tech Blvd, Chicago, IL',
      status: 'pending',
      circuits: 24,
      lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 48)
    },
    {
      id: 'SITE-004',
      name: 'West Coast Hub',
      address: '321 Innovation Dr, San Francisco, CA',
      status: 'active',
      circuits: 16,
      lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 72)
    },
    {
      id: 'SITE-005',
      name: 'Legacy Office - Atlanta',
      address: '654 Commerce St, Atlanta, GA',
      status: 'inactive',
      circuits: 0,
      lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)
    }
  ];

  constructor() {
    this.dataSource = new MatTableDataSource(this.sites);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  onBulkDelete() {
    this.showDeleteConfirm = true;
  }

  confirmDelete() {
    console.log('Deleting sites:', this.selection.selected);
    this.selection.clear();
    this.showDeleteConfirm = false;
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
  }

  onExport() {
    console.log('Exporting sites:', this.selection.selected.length > 0 ? this.selection.selected : this.sites);
  }

  viewSite(site: Site) {
    console.log('Viewing site:', site);
  }

  editSite(site: Site) {
    console.log('Editing site:', site);
  }

  deleteSite(site: Site) {
    console.log('Deleting site:', site);
    this.showDeleteConfirm = true;
  }
}
