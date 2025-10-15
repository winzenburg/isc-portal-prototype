import { Injectable } from '@angular/core';
import { FilterState } from '../components/shared/base-table/base-table.config';

/**
 * Table State Service
 *
 * Handles localStorage persistence for table filters
 * 30-day expiry on stored filter states
 */
@Injectable({
  providedIn: 'root'
})
export class TableStateService {
  private readonly EXPIRY_DAYS = 30;
  private readonly EXPIRY_MS = this.EXPIRY_DAYS * 24 * 60 * 60 * 1000;

  /**
   * Save filter state to localStorage
   */
  saveFilterState(tableId: string, filters: any): void {
    const filterState: FilterState = {
      searchTerm: filters.searchTerm,
      quickFilters: filters.quickFilters,
      advancedFilters: filters.advancedFilters,
      timestamp: Date.now()
    };

    try {
      localStorage.setItem(`table-filters-${tableId}`, JSON.stringify(filterState));
    } catch (error) {
      console.warn('Failed to save filter state:', error);
    }
  }

  /**
   * Load filter state from localStorage
   * Returns null if expired or not found
   */
  loadFilterState(tableId: string): FilterState | null {
    try {
      const stored = localStorage.getItem(`table-filters-${tableId}`);
      if (!stored) {
        return null;
      }

      const filterState: FilterState = JSON.parse(stored);

      // Check if expired (30 days)
      const age = Date.now() - filterState.timestamp;
      if (age > this.EXPIRY_MS) {
        this.clearFilterState(tableId);
        return null;
      }

      return filterState;
    } catch (error) {
      console.warn('Failed to load filter state:', error);
      return null;
    }
  }

  /**
   * Clear filter state from localStorage
   */
  clearFilterState(tableId: string): void {
    try {
      localStorage.removeItem(`table-filters-${tableId}`);
    } catch (error) {
      console.warn('Failed to clear filter state:', error);
    }
  }

  /**
   * Clear all expired filter states (cleanup utility)
   */
  clearExpiredStates(): void {
    try {
      const keys = Object.keys(localStorage);
      const tableKeys = keys.filter(key => key.startsWith('table-filters-'));

      tableKeys.forEach(key => {
        const stored = localStorage.getItem(key);
        if (stored) {
          const filterState: FilterState = JSON.parse(stored);
          const age = Date.now() - filterState.timestamp;
          if (age > this.EXPIRY_MS) {
            localStorage.removeItem(key);
          }
        }
      });
    } catch (error) {
      console.warn('Failed to clear expired states:', error);
    }
  }
}
