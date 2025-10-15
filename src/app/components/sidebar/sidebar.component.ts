import { Component } from '@angular/core';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  children?: NavItem[];
  expanded?: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  navItems: NavItem[] = [
    // Heuristic Issues (prototype-specific)
    { label: 'Heuristic Issues', icon: 'home', route: '/' },

    // Main Navigation (matching ISC Portal)
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Contacts', icon: 'person', route: '/contacts' },
    { label: 'Network Invoices', icon: 'receipt', route: '/invoices' },

    // Network Services (expandable section from portal)
    {
      label: 'Network Services',
      icon: 'settings_ethernet',
      route: '/network-services',
      expanded: false,
      children: [
        { label: 'Sites', icon: 'location_on', route: '/sites-unified' },
        { label: 'Clouds', icon: 'cloud', route: '/clouds' },
        { label: 'Circuits', icon: 'cable', route: '/circuits' },
        { label: 'Circuit Reports', icon: 'summarize', route: '/circuit-reports' }
      ]
    },

    // Network Analytics (expandable section from portal)
    {
      label: 'Network Analytics',
      icon: 'insert_chart',
      route: '/network-analytics',
      expanded: false,
      children: [
        { label: 'Network Analyst', icon: 'analytics', route: '/network-analyst' }
      ]
    },

    // SD-WAN (expandable section from portal)
    {
      label: 'SD-WAN',
      icon: 'cloud_circle',
      route: '/sd-wan',
      expanded: false,
      children: [
        { label: 'Application Performance', icon: 'speed', route: '/application-performance' }
      ]
    },

    // SD-WAN Orchestrator (separate top-level item as shown in screenshot)
    { label: 'SD-WAN Orchestrator', icon: 'settings_ethernet', route: '/sd-wan-orchestrator' },

    // Tickets & Events (expandable section from portal)
    {
      label: 'Tickets & Events',
      icon: 'confirmation_number',
      route: '/tickets-events',
      expanded: false,
      children: [
        { label: 'Tickets', icon: 'support', route: '/tickets' }
      ]
    },

    // Contact Us
    { label: 'Contact Us', icon: 'phone', route: '/contact-us' }
  ];

  toggleSection(item: NavItem): void {
    if (item.children) {
      item.expanded = !item.expanded;
    }
  }
}
