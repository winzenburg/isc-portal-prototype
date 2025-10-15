import { Directive, Input, OnInit, ElementRef, Renderer2, HostListener } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { HelpService } from '../services/help/help.service';
import { HelpPopoverComponent } from '../components/help/help-popover/help-popover.component';

/**
 * Help Tooltip Directive
 *
 * Easy-to-use directive that adds contextual help tooltips by referencing help content IDs.
 * Shows tooltip on hover, opens detailed popover on click.
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
    private dialog: MatDialog,
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

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    // Prevent event from bubbling
    event.stopPropagation();

    // Hide tooltip
    this.tooltip.hide();

    // Open detailed help popover
    const dialogRef = this.dialog.open(HelpPopoverComponent, {
      width: '600px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      panelClass: 'help-popover-dialog',
      data: { termId: this.appHelpTooltip }
    });

    // Handle related term navigation
    dialogRef.afterClosed().subscribe(result => {
      if (result?.openTerm) {
        // User clicked a related term - open its popover
        this.dialog.open(HelpPopoverComponent, {
          width: '600px',
          maxWidth: '95vw',
          maxHeight: '90vh',
          panelClass: 'help-popover-dialog',
          data: { termId: result.openTerm }
        });
      }
    });
  }

  private addHelpIndicator() {
    // Add a subtle help indicator class
    this.renderer.addClass(this.el.nativeElement, 'help-enabled');

    // Add help icon if element doesn't already contain one
    const hasIcon = this.el.nativeElement.querySelector('.help-icon');
    if (!hasIcon) {
      // Add dotted underline to indicate help is available
      this.renderer.setStyle(this.el.nativeElement, 'border-bottom', '1px dotted #0D62FF');
      this.renderer.setStyle(this.el.nativeElement, 'cursor', 'pointer');
    }
  }
}
