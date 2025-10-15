import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HelpService } from '../../../services/help/help.service';
import { HelpContent, HelpCategory } from '../../../services/help/help-content.database';

@Component({
  selector: 'app-glossary-modal',
  templateUrl: './glossary-modal.component.html',
  styleUrls: ['./glossary-modal.component.scss']
})
export class GlossaryModalComponent implements OnInit {
  allContent: HelpContent[] = [];
  filteredContent: HelpContent[] = [];
  searchQuery: string = '';
  selectedCategory: HelpCategory | 'all' = 'all';
  selectedTier: number | 'all' = 'all';
  expandedTerms: Set<string> = new Set();

  // Category options
  categories = [
    { value: 'all', label: 'All Categories', icon: 'category' },
    { value: HelpCategory.NETWORKING, label: 'Networking', icon: 'cloud_circle' },
    { value: HelpCategory.STATUS, label: 'Status Indicators', icon: 'info' },
    { value: HelpCategory.METRICS, label: 'Metrics', icon: 'analytics' },
    { value: HelpCategory.PROTOCOLS, label: 'Protocols', icon: 'swap_horiz' },
    { value: HelpCategory.FEATURES, label: 'Features', icon: 'stars' },
    { value: HelpCategory.WORKFLOWS, label: 'Workflows', icon: 'account_tree' }
  ];

  // Tier options
  tiers = [
    { value: 'all', label: 'All Priorities' },
    { value: 1, label: 'Critical Terms', badge: 'priority-high' },
    { value: 2, label: 'Important Terms', badge: 'priority-medium' },
    { value: 3, label: 'Helpful Terms', badge: 'priority-low' }
  ];

  constructor(
    private dialogRef: MatDialogRef<GlossaryModalComponent>,
    private helpService: HelpService
  ) {}

  ngOnInit() {
    this.allContent = this.helpService.getAllContent();
    this.filterContent();
  }

  filterContent() {
    let filtered = [...this.allContent];

    // Apply search filter
    if (this.searchQuery.trim()) {
      filtered = this.helpService.search(this.searchQuery);
    }

    // Apply category filter
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === this.selectedCategory);
    }

    // Apply tier filter
    if (this.selectedTier !== 'all') {
      filtered = filtered.filter(item => item.tier === this.selectedTier);
    }

    // Sort alphabetically by term
    filtered.sort((a, b) => a.term.localeCompare(b.term));

    this.filteredContent = filtered;
  }

  onSearchChange() {
    this.filterContent();
  }

  onCategoryChange(category: any) {
    this.selectedCategory = category as HelpCategory | 'all';
    this.filterContent();
  }

  onTierChange(tier: any) {
    this.selectedTier = tier as number | 'all';
    this.filterContent();
  }

  toggleTerm(termId: string) {
    if (this.expandedTerms.has(termId)) {
      this.expandedTerms.delete(termId);
    } else {
      this.expandedTerms.add(termId);
    }
  }

  isExpanded(termId: string): boolean {
    return this.expandedTerms.has(termId);
  }

  clearSearch() {
    this.searchQuery = '';
    this.filterContent();
  }

  resetFilters() {
    this.searchQuery = '';
    this.selectedCategory = 'all';
    this.selectedTier = 'all';
    this.filterContent();
  }

  close() {
    this.dialogRef.close();
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
