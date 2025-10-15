import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Command {
  id: string;
  label: string;
  description?: string;
  icon: string;
  group: CommandGroup;
  keywords?: string[];
  shortcut?: string;
  action: () => void;
}

export type CommandGroup = 'navigation' | 'actions' | 'search' | 'help' | 'settings' | 'recent';

export interface CommandGroupInfo {
  id: CommandGroup;
  label: string;
  priority: number;
}

/**
 * Service for managing command palette commands and state
 */
@Injectable({
  providedIn: 'root'
})
export class CommandPaletteService {
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  public isOpen$ = this.isOpenSubject.asObservable();

  private commands: Command[] = [];
  private recentCommands: string[] = [];
  private readonly MAX_RECENT = 5;

  public readonly groups: CommandGroupInfo[] = [
    { id: 'recent', label: 'Recent', priority: 0 },
    { id: 'navigation', label: 'Navigation', priority: 1 },
    { id: 'actions', label: 'Actions', priority: 2 },
    { id: 'search', label: 'Search', priority: 3 },
    { id: 'settings', label: 'Settings', priority: 4 },
    { id: 'help', label: 'Help & Support', priority: 5 }
  ];

  constructor(private router: Router) {
    this.initializeCommands();
  }

  private initializeCommands(): void {
    // Navigation commands
    this.registerCommand({
      id: 'nav-dashboard',
      label: 'Dashboard',
      description: 'View main dashboard',
      icon: 'dashboard',
      group: 'navigation',
      keywords: ['home', 'overview', 'main'],
      action: () => this.navigate('/')
    });

    this.registerCommand({
      id: 'nav-circuits',
      label: 'Circuits',
      description: 'Manage network circuits',
      icon: 'settings_ethernet',
      group: 'navigation',
      keywords: ['network', 'connectivity', 'bundles'],
      action: () => this.navigate('/circuits')
    });

    this.registerCommand({
      id: 'nav-sites',
      label: 'Sites',
      description: 'Manage sites and locations',
      icon: 'location_on',
      group: 'navigation',
      keywords: ['locations', 'addresses', 'places'],
      action: () => this.navigate('/sites-unified')
    });

    this.registerCommand({
      id: 'nav-clouds',
      label: 'Cloud Services',
      description: 'Manage cloud connections',
      icon: 'cloud',
      group: 'navigation',
      keywords: ['aws', 'azure', 'gcp', 'cloud'],
      action: () => this.navigate('/clouds')
    });

    this.registerCommand({
      id: 'nav-contacts',
      label: 'Contacts',
      description: 'Manage contacts',
      icon: 'contacts',
      group: 'navigation',
      keywords: ['people', 'users', 'contacts'],
      action: () => this.navigate('/contacts')
    });

    this.registerCommand({
      id: 'nav-tickets',
      label: 'Support Tickets',
      description: 'View and manage tickets',
      icon: 'confirmation_number',
      group: 'navigation',
      keywords: ['support', 'issues', 'help'],
      action: () => this.navigate('/tickets')
    });

    this.registerCommand({
      id: 'nav-invoices',
      label: 'Network Invoices',
      description: 'View billing and invoices',
      icon: 'receipt',
      group: 'navigation',
      keywords: ['billing', 'payments', 'charges'],
      action: () => this.navigate('/invoices')
    });

    this.registerCommand({
      id: 'nav-reports',
      label: 'Circuit Reports',
      description: 'View circuit reports',
      icon: 'analytics',
      group: 'navigation',
      keywords: ['analytics', 'statistics', 'data'],
      action: () => this.navigate('/circuit-reports')
    });

    this.registerCommand({
      id: 'nav-performance',
      label: 'Application Performance',
      description: 'Monitor app performance',
      icon: 'speed',
      group: 'navigation',
      keywords: ['monitoring', 'metrics', 'ucaas'],
      action: () => this.navigate('/app-performance')
    });

    // Action commands
    this.registerCommand({
      id: 'action-refresh',
      label: 'Refresh Current Page',
      description: 'Reload data on current page',
      icon: 'refresh',
      group: 'actions',
      shortcut: 'Cmd+R',
      keywords: ['reload', 'sync'],
      action: () => window.location.reload()
    });

    this.registerCommand({
      id: 'action-export',
      label: 'Export Data',
      description: 'Export current view to CSV',
      icon: 'download',
      group: 'actions',
      shortcut: 'Cmd+E',
      keywords: ['download', 'csv', 'excel'],
      action: () => this.executeExport()
    });

    // Search commands
    this.registerCommand({
      id: 'search-circuits',
      label: 'Search Circuits',
      description: 'Find circuits by ID or location',
      icon: 'search',
      group: 'search',
      keywords: ['find', 'lookup'],
      action: () => {
        this.navigate('/circuits');
        this.close();
      }
    });

    this.registerCommand({
      id: 'search-sites',
      label: 'Search Sites',
      description: 'Find sites by name or address',
      icon: 'search',
      group: 'search',
      keywords: ['find', 'lookup', 'location'],
      action: () => {
        this.navigate('/sites-unified');
        this.close();
      }
    });

    // Help commands
    this.registerCommand({
      id: 'help-docs',
      label: 'View Documentation',
      description: 'Access help documentation',
      icon: 'help',
      group: 'help',
      keywords: ['guide', 'manual', 'instructions'],
      action: () => this.openDocs()
    });

    this.registerCommand({
      id: 'help-support',
      label: 'Contact Support',
      description: 'Get help from support team',
      icon: 'support',
      group: 'help',
      keywords: ['help', 'assistance', 'contact'],
      action: () => this.contactSupport()
    });

    this.registerCommand({
      id: 'help-shortcuts',
      label: 'Keyboard Shortcuts',
      description: 'View all keyboard shortcuts',
      icon: 'keyboard',
      group: 'help',
      shortcut: '?',
      keywords: ['keys', 'hotkeys'],
      action: () => this.showShortcuts()
    });

    // Settings commands
    this.registerCommand({
      id: 'settings-account',
      label: 'Account Settings',
      description: 'Manage your account',
      icon: 'account_circle',
      group: 'settings',
      keywords: ['profile', 'preferences'],
      action: () => this.openSettings('account')
    });

    this.registerCommand({
      id: 'settings-notifications',
      label: 'Notification Settings',
      description: 'Configure notifications',
      icon: 'notifications',
      group: 'settings',
      keywords: ['alerts', 'emails'],
      action: () => this.openSettings('notifications')
    });
  }

  registerCommand(command: Command): void {
    // Remove existing command with same ID if exists
    this.commands = this.commands.filter(c => c.id !== command.id);
    this.commands.push(command);
  }

  unregisterCommand(commandId: string): void {
    this.commands = this.commands.filter(c => c.id !== commandId);
  }

  getAllCommands(): Command[] {
    return [...this.commands];
  }

  getRecentCommands(): Command[] {
    return this.recentCommands
      .map(id => this.commands.find(c => c.id === id))
      .filter(cmd => cmd !== undefined) as Command[];
  }

  executeCommand(command: Command): void {
    // Add to recent commands
    this.recentCommands = [
      command.id,
      ...this.recentCommands.filter(id => id !== command.id)
    ].slice(0, this.MAX_RECENT);

    // Execute the command
    command.action();

    // Close the palette
    this.close();
  }

  /**
   * Fuzzy search commands
   */
  searchCommands(query: string): Command[] {
    if (!query.trim()) {
      return this.getAllCommands();
    }

    const lowerQuery = query.toLowerCase().trim();

    return this.commands
      .map(cmd => ({
        command: cmd,
        score: this.calculateMatchScore(cmd, lowerQuery)
      }))
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(result => result.command);
  }

  private calculateMatchScore(command: Command, query: string): number {
    let score = 0;

    // Exact label match (highest priority)
    if (command.label.toLowerCase() === query) {
      score += 100;
    }

    // Label starts with query
    if (command.label.toLowerCase().startsWith(query)) {
      score += 50;
    }

    // Label contains query
    if (command.label.toLowerCase().includes(query)) {
      score += 25;
    }

    // Description contains query
    if (command.description?.toLowerCase().includes(query)) {
      score += 10;
    }

    // Keywords match
    if (command.keywords) {
      command.keywords.forEach(keyword => {
        if (keyword.toLowerCase() === query) score += 30;
        if (keyword.toLowerCase().startsWith(query)) score += 15;
        if (keyword.toLowerCase().includes(query)) score += 5;
      });
    }

    // Fuzzy match (basic implementation)
    score += this.fuzzyMatch(command.label.toLowerCase(), query);

    return score;
  }

  private fuzzyMatch(text: string, query: string): number {
    let score = 0;
    let queryIndex = 0;

    for (let i = 0; i < text.length && queryIndex < query.length; i++) {
      if (text[i] === query[queryIndex]) {
        score += 1;
        queryIndex++;
      }
    }

    return queryIndex === query.length ? score : 0;
  }

  open(): void {
    this.isOpenSubject.next(true);
  }

  close(): void {
    this.isOpenSubject.next(false);
  }

  toggle(): void {
    this.isOpenSubject.next(!this.isOpenSubject.value);
  }

  private navigate(route: string): void {
    this.router.navigate([route]);
    this.close();
  }

  private executeExport(): void {
    // Placeholder for export functionality
    alert('Export functionality would trigger current table export');
    this.close();
  }

  private openDocs(): void {
    window.open('assets/ACCESS_CONTROL_GUIDE.md', '_blank');
    this.close();
  }

  private contactSupport(): void {
    alert('Contact Support: support@isc.com');
    this.close();
  }

  private showShortcuts(): void {
    alert('Keyboard Shortcuts:\nCmd+K: Open Command Palette\nCmd+R: Refresh\nCmd+E: Export');
    this.close();
  }

  private openSettings(section: string): void {
    alert(`Opening ${section} settings...`);
    this.close();
  }
}
