import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SitesListComponent } from './components/sites-list/sites-list.component';
import { SitesComponent } from './components/sites/sites.component';
import { ErrorStateComponent } from './components/error-state/error-state.component';
import { CircuitsImprovedComponent } from './components/circuits-improved/circuits-improved.component';
import { CircuitsUnifiedComponent } from './components/pages/circuits-unified/circuits-unified.component';
import { SitesUnifiedComponent } from './components/pages/sites-unified/sites-unified.component';
import { CloudsUnifiedComponent } from './components/pages/clouds-unified/clouds-unified.component';
import { CircuitReportsUnifiedComponent } from './components/pages/circuit-reports-unified/circuit-reports-unified.component';
import { NetworkInvoicesUnifiedComponent } from './components/pages/network-invoices-unified/network-invoices-unified.component';
import { ContactsUnifiedComponent } from './components/pages/contacts-unified/contacts-unified.component';
import { TicketsUnifiedComponent } from './components/pages/tickets-unified/tickets-unified.component';
import { ApplicationPerformanceUnifiedComponent } from './components/pages/application-performance-unified/application-performance-unified.component';
import { NoAccessStateComponent } from './components/no-access-state/no-access-state.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'dashboard', component: DashboardComponent },

  // Old implementations (for comparison)
  { path: 'circuits-improved', component: CircuitsImprovedComponent },
  { path: 'sites', component: SitesComponent },
  { path: 'sites-old', component: SitesListComponent },
  { path: 'error-demo', component: ErrorStateComponent },

  // New unified table implementations
  { path: 'circuits', component: CircuitsUnifiedComponent },
  { path: 'sites-unified', component: SitesUnifiedComponent },
  { path: 'clouds', component: CloudsUnifiedComponent },
  { path: 'circuit-reports', component: CircuitReportsUnifiedComponent },
  { path: 'invoices', component: NetworkInvoicesUnifiedComponent },
  { path: 'contacts', component: ContactsUnifiedComponent },
  { path: 'tickets', component: TicketsUnifiedComponent },
  { path: 'application-performance', component: ApplicationPerformanceUnifiedComponent },

  // No Access State Demo
  { path: 'sd-wan-orchestrator', component: NoAccessStateComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
