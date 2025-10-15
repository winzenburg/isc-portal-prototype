import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

export interface Site {
  alias: string;
  address: string;
  circuitHealth: 'up' | 'down' | 'pending' | 'disabled' | 'none';
}

export interface FilterChip {
  category: string;
  label: string;
  value: string;
  color?: string;
}

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.scss']
})
export class SitesComponent implements OnInit {
  displayedColumns: string[] = ['alias', 'address', 'contacts', 'circuitHealth', 'actions'];
  dataSource: MatTableDataSource<Site>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Filter chips
  activeFilters: FilterChip[] = [
    { category: 'Site Type', label: 'All', value: 'all', color: '#0D62FF' },
    { category: 'Site Type', label: 'SD-WAN Sites', value: 'sd-wan', color: '#0D62FF' },
    { category: 'Site Health', label: 'Filter by Site Health', value: 'health-filter', color: '#0D62FF' },
    { category: 'Service', label: 'Partially Inactive', value: 'partial', color: '#0D62FF' },
    { category: 'Service', label: 'Down', value: 'down', color: '#0D62FF' },
    { category: 'Info', label: 'No Info', value: 'no-info', color: '#0D62FF' }
  ];

  // Sample data matching ISC Portal
  sites: Site[] = [
    {
      alias: 'MB359026',
      address: '10085 Double R Blvd, Reno, Nevada, United States of America, 89521',
      circuitHealth: 'none'
    },
    {
      alias: 'MB359016',
      address: '250 East Day Road, Mishawaka, Indiana, United States of America, 46545',
      circuitHealth: 'none'
    },
    {
      alias: 'DALLAS - MB921740',
      address: '2740 N. Dallas Pkwy, Suite 260, Dallas, Texas, United States of America, 75093',
      circuitHealth: 'up'
    },
    {
      alias: 'MB359037',
      address: '7638 Picardy Ave, Baton Rouge, Louisiana, United States of America, 70808',
      circuitHealth: 'none'
    },
    {
      alias: 'MB359006',
      address: '800 Lomax St, Jacksonville, Florida, United States of America, 32204',
      circuitHealth: 'none'
    },
    {
      alias: '904 Quality Way',
      address: '904 Quality Way, Richardson, Texas, United States of America, 75081',
      circuitHealth: 'disabled'
    }
  ];

  searchText = '';

  constructor() {
    this.dataSource = new MatTableDataSource(this.sites);
  }

  ngOnInit(): void {
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

  removeFilter(filter: FilterChip) {
    const index = this.activeFilters.indexOf(filter);
    if (index >= 0) {
      this.activeFilters.splice(index, 1);
    }
  }

  getCircuitHealthIcon(health: string): string {
    switch (health) {
      case 'up':
        return 'circle';
      case 'down':
        return 'circle';
      case 'pending':
        return 'circle';
      case 'disabled':
        return 'circle';
      default:
        return '';
    }
  }

  getCircuitHealthClass(health: string): string {
    return `health-${health}`;
  }

  editSite(site: Site) {
    console.log('Edit site:', site);
  }

  viewContacts(site: Site) {
    console.log('View contacts for site:', site);
  }

  openExternal(site: Site) {
    console.log('Open external link for site:', site);
  }
}
