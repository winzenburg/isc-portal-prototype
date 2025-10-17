import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface PageHelpSection {
  id: string;
  title: string;
  icon?: string;
  content: string;
  subsections?: PageHelpSubsection[];
}

export interface PageHelpSubsection {
  title: string;
  content: string;
  icon?: string;
}

export interface PageHelpContent {
  pageTitle: string;
  pageDescription: string;
  sections: PageHelpSection[];
}

@Component({
  selector: 'app-page-help-panel',
  templateUrl: './page-help-panel.component.html',
  styleUrls: ['./page-help-panel.component.scss']
})
export class PageHelpPanelComponent {
  @Input() content!: PageHelpContent;
  @Input() isOpen: boolean = false;
  @Output() closePanel = new EventEmitter<void>();

  expandedSections: Set<string> = new Set();

  toggleSection(sectionId: string): void {
    if (this.expandedSections.has(sectionId)) {
      this.expandedSections.delete(sectionId);
    } else {
      this.expandedSections.add(sectionId);
    }
  }

  isSectionExpanded(sectionId: string): boolean {
    return this.expandedSections.has(sectionId);
  }

  expandAll(): void {
    this.content.sections.forEach(section => {
      this.expandedSections.add(section.id);
    });
  }

  collapseAll(): void {
    this.expandedSections.clear();
  }

  printHelp(): void {
    window.print();
  }

  close(): void {
    this.closePanel.emit();
  }
}
