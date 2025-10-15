import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HelpService } from '../../../services/help/help.service';
import { HelpContent } from '../../../services/help/help-content.database';

export interface HelpPopoverData {
  termId: string;
}

@Component({
  selector: 'app-help-popover',
  templateUrl: './help-popover.component.html',
  styleUrls: ['./help-popover.component.scss']
})
export class HelpPopoverComponent {
  helpContent: HelpContent | undefined;
  relatedContent: HelpContent[] = [];

  constructor(
    private dialogRef: MatDialogRef<HelpPopoverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HelpPopoverData,
    private helpService: HelpService
  ) {
    this.helpContent = this.helpService.getHelpContent(data.termId);

    // Load related terms
    if (this.helpContent?.relatedTerms) {
      this.relatedContent = this.helpContent.relatedTerms
        .map(id => this.helpService.getHelpContent(id))
        .filter(content => content !== undefined) as HelpContent[];
    }
  }

  close() {
    this.dialogRef.close();
  }

  openRelatedTerm(termId: string) {
    this.dialogRef.close({ openTerm: termId });
  }

  getTierBadgeClass(tier: number): string {
    switch (tier) {
      case 1: return 'tier-critical';
      case 2: return 'tier-important';
      case 3: return 'tier-helpful';
      default: return '';
    }
  }

  getTierLabel(tier: number): string {
    switch (tier) {
      case 1: return 'Critical';
      case 2: return 'Important';
      case 3: return 'Helpful';
      default: return '';
    }
  }
}
