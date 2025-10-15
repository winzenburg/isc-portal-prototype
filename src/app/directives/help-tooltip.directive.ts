import { Directive, Input, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { HelpService } from '../services/help/help.service';

/**
 * Help Tooltip Directive
 *
 * Easy-to-use directive that adds contextual help tooltips by referencing help content IDs.
 *
 * Usage:
 * <span appHelpTooltip="sd-wan">SD-WAN</span>
 * <th appHelpTooltip="sparklines">Traffic Trends</th>
 */
@Directive({
  selector: '[appHelpTooltip]',
  providers: [MatTooltip]
})
export class HelpTooltipDirective implements OnInit {
  @Input() appHelpTooltip!: string;  // Help content ID

  constructor(
    private helpService: HelpService,
    private tooltip: MatTooltip,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    if (!this.appHelpTooltip) {
      return;
    }

    // Get tooltip text from help service
    const tooltipText = this.helpService.getTooltip(this.appHelpTooltip);

    if (tooltipText) {
      // Configure the Material tooltip
      this.tooltip.message = tooltipText;
      this.tooltip.position = 'above';
      this.tooltip.showDelay = 300;
      this.tooltip.hideDelay = 100;

      // Add visual indicator (help icon or underline)
      this.addHelpIndicator();
    }
  }

  private addHelpIndicator() {
    // Add a subtle help indicator class
    this.renderer.addClass(this.el.nativeElement, 'help-enabled');

    // Add help icon if element doesn't already contain one
    const hasIcon = this.el.nativeElement.querySelector('.help-icon');
    if (!hasIcon) {
      // Add dotted underline to indicate help is available
      this.renderer.setStyle(this.el.nativeElement, 'border-bottom', '1px dotted #0D62FF');
      this.renderer.setStyle(this.el.nativeElement, 'cursor', 'help');
    }
  }
}
