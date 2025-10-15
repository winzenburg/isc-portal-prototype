import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

// Angular Material Modules - Matching ISC Portal usage
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';

import { NgChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SitesListComponent } from './components/sites-list/sites-list.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { StatusBadgeComponent } from './components/status-badge/status-badge.component';
import { ErrorStateComponent } from './components/error-state/error-state.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { LandingComponent } from './components/landing/landing.component';
import { SitesComponent } from './components/sites/sites.component';
import { CircuitsImprovedComponent } from './components/circuits-improved/circuits-improved.component';
import { StatusIndicatorComponent } from './components/shared/status-indicator/status-indicator.component';
import { BaseTableComponent } from './components/shared/base-table/base-table.component';
import { FilterDrawerComponent } from './components/shared/filter-drawer/filter-drawer.component';
import { TableActionsComponent } from './components/shared/table-actions/table-actions.component';
import { StandardTableDemoComponent } from './components/tables/standard-table-demo/standard-table-demo.component';
import { FilterDrawerDemoComponent } from './components/tables/filter-drawer-demo/filter-drawer-demo.component';
import { QuickFilterDemoComponent } from './components/tables/quick-filter-demo/quick-filter-demo.component';
import { ActionTableDemoComponent } from './components/tables/action-table-demo/action-table-demo.component';
import { EditableTableDemoComponent } from './components/tables/editable-table-demo/editable-table-demo.component';
import { CircuitsUnifiedComponent } from './components/pages/circuits-unified/circuits-unified.component';
import { SitesUnifiedComponent } from './components/pages/sites-unified/sites-unified.component';
import { CloudsUnifiedComponent } from './components/pages/clouds-unified/clouds-unified.component';
import { CircuitReportsUnifiedComponent } from './components/pages/circuit-reports-unified/circuit-reports-unified.component';
import { NetworkInvoicesUnifiedComponent } from './components/pages/network-invoices-unified/network-invoices-unified.component';
import { ContactsUnifiedComponent } from './components/pages/contacts-unified/contacts-unified.component';
import { TicketsUnifiedComponent } from './components/pages/tickets-unified/tickets-unified.component';
import { ApplicationPerformanceUnifiedComponent } from './components/pages/application-performance-unified/application-performance-unified.component';
import { ConfirmationDialogComponent } from './components/shared/confirmation-dialog/confirmation-dialog.component';
import { AccessDeniedComponent } from './components/shared/access-denied/access-denied.component';
import { SyncStatusIndicatorComponent } from './components/shared/sync-status-indicator/sync-status-indicator.component';
import { CommandPaletteComponent } from './components/shared/command-palette/command-palette.component';
import { NoAccessStateComponent } from './components/no-access-state/no-access-state.component';
import { NetworkAnalystUnifiedComponent } from './components/pages/network-analyst-unified/network-analyst-unified.component';
import { SparklineComponent } from './components/shared/sparkline/sparkline.component';
import { HelpTooltipDirective } from './directives/help-tooltip.directive';
import { GlossaryModalComponent } from './components/help/glossary-modal/glossary-modal.component';
import { Nl2brPipe } from './pipes/nl2br.pipe';
import { HelpPopoverComponent } from './components/help/help-popover/help-popover.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SitesListComponent,
    HeaderComponent,
    SidebarComponent,
    StatusBadgeComponent,
    ErrorStateComponent,
    EmptyStateComponent,
    LandingComponent,
    SitesComponent,
    CircuitsImprovedComponent,
    StatusIndicatorComponent,
    BaseTableComponent,
    FilterDrawerComponent,
    TableActionsComponent,
    StandardTableDemoComponent,
    FilterDrawerDemoComponent,
    QuickFilterDemoComponent,
    ActionTableDemoComponent,
    EditableTableDemoComponent,
    CircuitsUnifiedComponent,
    SitesUnifiedComponent,
    CloudsUnifiedComponent,
    CircuitReportsUnifiedComponent,
    NetworkInvoicesUnifiedComponent,
    ContactsUnifiedComponent,
    TicketsUnifiedComponent,
    ApplicationPerformanceUnifiedComponent,
    ConfirmationDialogComponent,
    AccessDeniedComponent,
    SyncStatusIndicatorComponent,
    CommandPaletteComponent,
    NoAccessStateComponent,
    NetworkAnalystUnifiedComponent,
    SparklineComponent,
    HelpTooltipDirective,
    GlossaryModalComponent,
    Nl2brPipe,
    HelpPopoverComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,

    // Charts Module
    NgChartsModule,

    // Material Modules
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule,
    MatChipsModule,
    MatDividerModule,
    MatExpansionModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatBadgeModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
