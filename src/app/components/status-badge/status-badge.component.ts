import { Component, Input } from '@angular/core';

export type BadgeType = 'success' | 'warning' | 'error' | 'info' | 'neutral';

/**
 * M3-compliant status badge component
 * Uses M3 container colors for accessible, consistent status indication
 * WCAG 2.1: Icon + text (not color alone) for status identification
 */
@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.scss']
})
export class StatusBadgeComponent {
  @Input() type: BadgeType = 'neutral';
  @Input() label: string = '';
  @Input() icon?: string;

  get badgeClass(): string {
    return `badge badge-${this.type} badge-m3`;
  }

  get iconName(): string {
    if (this.icon) return this.icon;

    // Default icons for each type (WCAG: Icon + text for clarity)
    switch (this.type) {
      case 'success': return 'check_circle';
      case 'warning': return 'warning';
      case 'error': return 'error';
      case 'info': return 'info';
      default: return '';
    }
  }
}
