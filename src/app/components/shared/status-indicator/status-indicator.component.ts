import { Component, Input } from '@angular/core';
import { StatusIndicatorConfig } from '../base-table/base-table.config';

/**
 * Unified Status Indicator Component
 *
 * WCAG 2.1 AA Compliant - Always shows Icon + Color + Text
 * Never relies on color alone for meaning
 *
 * Usage:
 * <app-status-indicator [config]="statusConfig"></app-status-indicator>
 */
@Component({
  selector: 'app-status-indicator',
  templateUrl: './status-indicator.component.html',
  styleUrls: ['./status-indicator.component.scss']
})
export class StatusIndicatorComponent {
  @Input() config!: StatusIndicatorConfig;

  /**
   * Get the appropriate icon class based on icon type
   */
  getIconClass(): string {
    if (this.config.materialIcon) {
      return ''; // Material icon will be used
    }

    switch (this.config.icon) {
      case 'circle':
        return 'status-circle';
      case 'triangle':
        return 'status-triangle';
      case 'square':
        return 'status-square';
      default:
        return '';
    }
  }

  /**
   * Get SVG path for custom shape icons
   */
  getShapePath(): string {
    switch (this.config.icon) {
      case 'circle':
        return 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z';
      case 'triangle':
        return 'M12 2L2 20h20L12 2z';
      case 'square':
        return 'M3 3h18v18H3z';
      default:
        return '';
    }
  }
}
