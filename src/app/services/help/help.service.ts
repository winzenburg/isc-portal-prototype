import { Injectable } from '@angular/core';
import { HELP_CONTENT_DATABASE, HelpContent, getHelpContent } from './help-content.database';

@Injectable({
  providedIn: 'root'
})
export class HelpService {
  /**
   * Get help content by ID
   */
  getHelpContent(id: string): HelpContent | undefined {
    return getHelpContent(id);
  }

  /**
   * Get short description for tooltip
   */
  getTooltip(id: string): string {
    const content = getHelpContent(id);
    return content ? content.shortDescription : '';
  }

  /**
   * Get detailed description for popover
   */
  getDetailedHelp(id: string): string {
    const content = getHelpContent(id);
    return content ? content.detailedDescription : '';
  }

  /**
   * Search all help content
   */
  search(query: string): HelpContent[] {
    const lowerQuery = query.toLowerCase();
    return HELP_CONTENT_DATABASE.filter(item =>
      item.term.toLowerCase().includes(lowerQuery) ||
      item.shortDescription.toLowerCase().includes(lowerQuery) ||
      item.detailedDescription.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get all help content (for glossary)
   */
  getAllContent(): HelpContent[] {
    return HELP_CONTENT_DATABASE;
  }
}
