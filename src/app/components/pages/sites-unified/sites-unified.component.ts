import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { TableConfig } from '../../shared/base-table/base-table.config';
import { BaseTableComponent } from '../../shared/base-table/base-table.component';
import { SyncStatusService, DataSyncInfo } from '../../../services/sync-status.service';
import { Subject, takeUntil } from 'rxjs';

interface CircuitHealth {
  status: 'up' | 'down' | 'pending' | 'disabled' | 'no-data';
}

interface Site {
  siteAlias: string;
  address: string;
  contacts: number;
  circuits: CircuitHealth[];
  siteType: string;
  siteHealth: string;
}

interface SourceLocation {
  id: string;
  name: string;
  address: string;
  selected: boolean;
}

interface SourceSite {
  id: string;
  name: string;
  locations: SourceLocation[];
  expanded: boolean;
  selected: boolean;
  indeterminate?: boolean;
}

interface SourceCountry {
  id: string;
  name: string;
  sites: SourceSite[];
  expanded: boolean;
  selected: boolean;
  indeterminate?: boolean;
}

@Component({
  selector: 'app-sites-unified',
  templateUrl: './sites-unified.component.html',
  styleUrls: ['./sites-unified.component.scss']
})
export class SitesUnifiedComponent implements OnInit, OnDestroy {
  @ViewChild(BaseTableComponent) baseTable!: BaseTableComponent;

  tableConfig!: TableConfig<Site>;
  sites: Site[] = [];
  filteredSites: Site[] = [];
  loading = false;

  // Filter states
  siteTypeFilter: string | null = null;
  siteHealthFilter: string | null = null;
  globalFilter: string = '';
  activeExternalFilters: number = 0;

  // Sources hierarchy data
  sources: SourceCountry[] = [];

  // Sync status
  syncInfo!: DataSyncInfo;
  private destroy$ = new Subject<void>();
  private readonly SYNC_KEY = 'sites-data';

  constructor(private syncStatusService: SyncStatusService) {}

  ngOnInit() {
    // Initialize sync tracking
    this.syncStatusService.initializeDataSource(this.SYNC_KEY);
    this.syncStatusService.getSyncInfo(this.SYNC_KEY)
      .pipe(takeUntil(this.destroy$))
      .subscribe(info => this.syncInfo = info);

    this.initializeTableConfig();
    this.loadSites();
    this.loadSources();
    // Update parent checkbox states based on initial data
    this.updateParentStates();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeTableConfig() {
    this.tableConfig = {
      tableType: 'quick-filter',
      tableId: 'sites-table',

      columns: [
        { field: 'siteAlias', header: 'Site Alias', sortable: true, width: '250px', type: 'custom', cellClass: 'site-alias-cell' },
        { field: 'address', header: 'Address', sortable: true },
        { field: 'contacts', header: 'Contacts', sortable: false, width: '100px', align: 'center', type: 'custom', cellClass: 'contacts-cell' },
        { field: 'circuits', header: 'Circuits Health', sortable: false, width: '150px', align: 'center', type: 'custom', cellClass: 'circuits-health-cell' }
      ],

      filtering: {
        searchEnabled: false,
        persistFilters: false
      },

      // Note: Export button is handled in custom template (global-filter section)
      // to maintain optimal placement with the filter controls
      export: {
        enabled: false  // Disabled to avoid duplicate buttons
      },

      pagination: { enabled: true, pageSize: 10, pageSizeOptions: [10, 25, 50], showFirstLastButtons: true },
      sorting: { enabled: true, defaultSort: { field: 'siteAlias', direction: 'asc' } },
      hoverHighlight: true
    };
  }

  private loadSites() {
    this.loading = true;
    this.syncStatusService.startSync(this.SYNC_KEY);

    setTimeout(() => {
      this.sites = [
        {
          siteAlias: 'MB359026',
          address: '10085 Double R Blvd, Reno, Nevada, United States of America, 89521',
          contacts: 0,
          circuits: [{ status: 'no-data' }],
          siteType: 'SD-WAN',
          siteHealth: 'No Info'
        },
        {
          siteAlias: 'MB349016',
          address: '250 East Day Road, Mishawaka, Indiana, United States of America, 46545',
          contacts: 0,
          circuits: [{ status: 'no-data' }],
          siteType: 'SD-WAN',
          siteHealth: 'No Info'
        },
        {
          siteAlias: 'DALLAS - MB021740',
          address: '2740 N. Dallas Pkwy, Suite 200, Dallas, Texas, United States of America, 75093',
          contacts: 0,
          circuits: [{ status: 'disabled' }, { status: 'disabled' }, { status: 'disabled' }],
          siteType: 'SD-WAN',
          siteHealth: 'Monitoring Disabled'
        },
        {
          siteAlias: 'MB359037',
          address: '7638 Picardy Ave, Baton Rouge, Louisiana, United States of America, 70808',
          contacts: 0,
          circuits: [{ status: 'no-data' }],
          siteType: 'SD-WAN',
          siteHealth: 'No Info'
        },
        {
          siteAlias: 'MB359006',
          address: '800 Lomax St, Jacksonville, Florida, United States of America, 32204',
          contacts: 0,
          circuits: [{ status: 'no-data' }],
          siteType: 'SD-WAN',
          siteHealth: 'No Info'
        },
        {
          siteAlias: '904 Quality Way',
          address: '904 Quality Way, Richardson, Texas, United States of America, 75081',
          contacts: 0,
          circuits: [{ status: 'disabled' }],
          siteType: 'SD-WAN',
          siteHealth: 'Monitoring Disabled'
        }
      ];
      this.loading = false;
      this.applyFilters();
      this.syncStatusService.completeSync(this.SYNC_KEY, this.sites.length);
    }, 500);
  }

  refreshSites(): void {
    this.loadSites();
  }

  onSiteTypeFilterChange(value: string | null): void {
    this.siteTypeFilter = value;
    this.applyFilters();
  }

  onSiteHealthFilterChange(value: string | null): void {
    this.siteHealthFilter = value;
    this.applyFilters();
  }

  onGlobalFilterChange(value: string): void {
    this.globalFilter = value;
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.sites];

    // Count active filters
    let filterCount = 0;

    // Apply site type filter
    if (this.siteTypeFilter) {
      filtered = filtered.filter(site => site.siteType === this.siteTypeFilter);
      filterCount++;
    }

    // Apply site health filter
    if (this.siteHealthFilter) {
      filtered = filtered.filter(site => site.siteHealth === this.siteHealthFilter);
      filterCount++;
    }

    // Apply global filter (search across all fields)
    if (this.globalFilter) {
      const term = this.globalFilter.toLowerCase();
      filtered = filtered.filter(site =>
        site.siteAlias.toLowerCase().includes(term) ||
        site.address.toLowerCase().includes(term)
      );
      filterCount++;
    }

    this.filteredSites = filtered;
    this.activeExternalFilters = filterCount;
  }

  /**
   * Export filtered sites to CSV
   */
  exportToCsv(): void {
    if (this.baseTable) {
      this.baseTable.exportToCsv();
    }
  }

  /**
   * Load Sources hierarchy data
   */
  private loadSources(): void {
    this.sources = [
      {
        id: 'canada',
        name: 'Canada',
        expanded: false,
        selected: false,
        sites: [
          {
            id: 'esri-vanc',
            name: 'ESRI VANC - External',
            expanded: true,
            selected: false,
            locations: [
              {
                id: 'esri-vanc-1',
                name: 'ESRI VANC - External, 1050 W Pender St., Vancouver, British Columbia, V7X 1K6, CA',
                address: '1050 W Pender St., Vancouver, British Columbia, V7X 1K6, CA',
                selected: true
              }
            ]
          }
        ]
      },
      {
        id: 'us',
        name: 'US',
        expanded: true,
        selected: false,
        sites: [
          {
            id: 'nyc-office21',
            name: 'NYC Office21',
            expanded: false,
            selected: false,
            locations: [
              {
                id: 'nyc-1',
                name: 'NYC Office21, 111 8th Ave., New York, New York, 10011, USA',
                address: '111 8th Ave., New York, New York, 10011, USA',
                selected: false
              }
            ]
          },
          {
            id: 'dallas',
            name: 'DALLAS - MB021740',
            expanded: false,
            selected: false,
            locations: [
              {
                id: 'dallas-1',
                name: 'DALLAS - MB021740, 2740 N. Dallas Pkwy, Suite 260, Dallas, Texas, 75093, USA',
                address: '2740 N. Dallas Pkwy, Suite 260, Dallas, Texas, 75093, USA',
                selected: false
              }
            ]
          },
          {
            id: 'grapevine',
            name: 'Grapevine, TX',
            expanded: false,
            selected: false,
            locations: [
              {
                id: 'grapevine-1',
                name: 'Grapevine, TX, 801 S. Industrial Blvd., Grapevine, Texas, 76051, USA',
                address: '801 S. Industrial Blvd., Grapevine, Texas, 76051, USA',
                selected: false
              }
            ]
          },
          {
            id: 'mb115005',
            name: 'MB115005',
            expanded: false,
            selected: false,
            locations: [
              {
                id: 'mb115005-1',
                name: 'MB115005, 3190 Irving Blvd, Dallas, Texas, 75247, USA',
                address: '3190 Irving Blvd, Dallas, Texas, 75247, USA',
                selected: false
              }
            ]
          },
          {
            id: 'north-texas-lab',
            name: 'North Texas Lab',
            expanded: false,
            selected: false,
            locations: [
              {
                id: 'north-texas-1',
                name: 'North Texas Lab, 1900 N St James Rd, Pilot Point, Texas, 76258, USA',
                address: '1900 N St James Rd, Pilot Point, Texas, 76258, USA',
                selected: false
              }
            ]
          }
        ]
      }
    ];
  }

  /**
   * Toggle country expansion
   */
  toggleCountry(country: SourceCountry): void {
    country.expanded = !country.expanded;
  }

  /**
   * Toggle site expansion
   */
  toggleSite(site: SourceSite): void {
    site.expanded = !site.expanded;
  }

  /**
   * Toggle location selection and update parent states
   */
  toggleLocation(location: SourceLocation): void {
    location.selected = !location.selected;
    this.updateParentStates();
  }

  /**
   * Clear all selections
   */
  clearSelections(): void {
    this.sources.forEach(country => {
      country.selected = false;
      country.sites.forEach(site => {
        site.selected = false;
        site.locations.forEach(location => {
          location.selected = false;
        });
      });
    });
  }

  /**
   * Select all locations
   */
  selectAll(): void {
    this.sources.forEach(country => {
      country.sites.forEach(site => {
        site.locations.forEach(location => {
          location.selected = true;
        });
      });
    });
    this.updateParentStates();
  }

  /**
   * Toggle country selection and cascade to children
   */
  toggleCountrySelection(country: SourceCountry, event: any): void {
    country.selected = event.checked;
    country.indeterminate = false;

    // Expand country when checked to show selected sites
    if (event.checked) {
      country.expanded = true;
    }

    // Cascade down to all sites and locations
    country.sites.forEach(site => {
      site.selected = event.checked;
      site.indeterminate = false;
      // Expand site when checked to show selected locations
      if (event.checked) {
        site.expanded = true;
      }
      site.locations.forEach(location => {
        location.selected = event.checked;
      });
    });
  }

  /**
   * Toggle site selection and cascade to children
   */
  toggleSiteSelection(site: SourceSite, event: any): void {
    site.selected = event.checked;
    site.indeterminate = false;

    // Expand site when checked to show selected locations
    if (event.checked) {
      site.expanded = true;
    }

    // Cascade down to all locations
    site.locations.forEach(location => {
      location.selected = event.checked;
    });

    // Update parent country state
    this.updateParentStates();
  }

  /**
   * Update parent states based on children selections
   */
  private updateParentStates(): void {
    this.sources.forEach(country => {
      let allSitesSelected = true;
      let anySiteSelected = false;

      country.sites.forEach(site => {
        const selectedLocations = site.locations.filter(loc => loc.selected).length;
        const totalLocations = site.locations.length;

        if (selectedLocations === 0) {
          site.selected = false;
          site.indeterminate = false;
          allSitesSelected = false;
        } else if (selectedLocations === totalLocations) {
          site.selected = true;
          site.indeterminate = false;
          anySiteSelected = true;
        } else {
          site.selected = false;
          site.indeterminate = true;
          allSitesSelected = false;
          anySiteSelected = true;
        }
      });

      // Update country state based on sites
      const selectedSites = country.sites.filter(site => site.selected && !site.indeterminate).length;
      const totalSites = country.sites.length;

      if (selectedSites === 0 && !anySiteSelected) {
        country.selected = false;
        country.indeterminate = false;
      } else if (selectedSites === totalSites && allSitesSelected) {
        country.selected = true;
        country.indeterminate = false;
      } else {
        country.selected = false;
        country.indeterminate = true;
      }
    });
  }
}
