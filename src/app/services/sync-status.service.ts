import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error' | 'stale';

export interface DataSyncInfo {
  lastUpdated: Date | null;
  status: SyncStatus;
  errorMessage?: string;
  nextSync?: Date;
  recordCount?: number;
}

/**
 * Service for tracking data sync status and freshness across the application
 */
@Injectable({
  providedIn: 'root'
})
export class SyncStatusService {
  private syncInfo = new Map<string, BehaviorSubject<DataSyncInfo>>();

  // Configurable threshold for when data is considered stale (default: 5 minutes)
  private staleThresholdMs = 5 * 60 * 1000;

  constructor() {
    // Check for stale data every minute
    setInterval(() => this.checkStaleData(), 60000);
  }

  /**
   * Initialize sync tracking for a data source
   */
  initializeDataSource(key: string, initialRecordCount: number = 0): void {
    if (!this.syncInfo.has(key)) {
      this.syncInfo.set(key, new BehaviorSubject<DataSyncInfo>({
        lastUpdated: null,
        status: 'idle',
        recordCount: initialRecordCount
      }));
    }
  }

  /**
   * Get sync info observable for a data source
   */
  getSyncInfo(key: string): Observable<DataSyncInfo> {
    if (!this.syncInfo.has(key)) {
      this.initializeDataSource(key);
    }
    return this.syncInfo.get(key)!.asObservable();
  }

  /**
   * Get current sync info value (non-observable)
   */
  getCurrentSyncInfo(key: string): DataSyncInfo {
    if (!this.syncInfo.has(key)) {
      this.initializeDataSource(key);
    }
    return this.syncInfo.get(key)!.value;
  }

  /**
   * Mark sync as started
   */
  startSync(key: string): void {
    const current = this.getCurrentSyncInfo(key);
    this.updateSyncInfo(key, {
      ...current,
      status: 'syncing',
      errorMessage: undefined
    });
  }

  /**
   * Mark sync as successful
   */
  completeSync(key: string, recordCount?: number): void {
    this.updateSyncInfo(key, {
      lastUpdated: new Date(),
      status: 'success',
      recordCount: recordCount,
      errorMessage: undefined
    });
  }

  /**
   * Mark sync as failed
   */
  failSync(key: string, errorMessage: string): void {
    const current = this.getCurrentSyncInfo(key);
    this.updateSyncInfo(key, {
      ...current,
      status: 'error',
      errorMessage: errorMessage
    });
  }

  /**
   * Update sync info
   */
  private updateSyncInfo(key: string, info: DataSyncInfo): void {
    if (!this.syncInfo.has(key)) {
      this.initializeDataSource(key);
    }
    this.syncInfo.get(key)!.next(info);
  }

  /**
   * Check all data sources for staleness
   */
  private checkStaleData(): void {
    const now = new Date();

    this.syncInfo.forEach((subject, key) => {
      const info = subject.value;

      // Only check if status is success and we have a last updated time
      if (info.status === 'success' && info.lastUpdated) {
        const timeSinceUpdate = now.getTime() - info.lastUpdated.getTime();

        if (timeSinceUpdate > this.staleThresholdMs) {
          this.updateSyncInfo(key, {
            ...info,
            status: 'stale'
          });
        }
      }
    });
  }

  /**
   * Get time since last update in human-readable format
   */
  getTimeSinceUpdate(lastUpdated: Date | null): string {
    if (!lastUpdated) {
      return 'Never updated';
    }

    const now = new Date();
    const diffMs = now.getTime() - lastUpdated.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) {
      return 'Just now';
    } else if (diffMinutes < 60) {
      return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    }
  }

  /**
   * Format last updated timestamp
   */
  formatLastUpdated(lastUpdated: Date | null): string {
    if (!lastUpdated) {
      return 'Never';
    }

    return lastUpdated.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  /**
   * Get status icon for current sync status
   */
  getStatusIcon(status: SyncStatus): string {
    switch (status) {
      case 'idle':
        return 'schedule';
      case 'syncing':
        return 'sync';
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'stale':
        return 'warning';
      default:
        return 'help';
    }
  }

  /**
   * Get status color for current sync status
   */
  getStatusColor(status: SyncStatus): string {
    switch (status) {
      case 'idle':
        return '#9e9e9e';
      case 'syncing':
        return '#2196f3';
      case 'success':
        return '#4caf50';
      case 'error':
        return '#f44336';
      case 'stale':
        return '#ff9800';
      default:
        return '#9e9e9e';
    }
  }

  /**
   * Get status label
   */
  getStatusLabel(status: SyncStatus): string {
    switch (status) {
      case 'idle':
        return 'Not synced';
      case 'syncing':
        return 'Syncing...';
      case 'success':
        return 'Up to date';
      case 'error':
        return 'Sync failed';
      case 'stale':
        return 'Data may be outdated';
      default:
        return 'Unknown';
    }
  }

  /**
   * Set stale threshold in milliseconds
   */
  setStaleThreshold(milliseconds: number): void {
    this.staleThresholdMs = milliseconds;
  }

  /**
   * Clear sync info for a data source
   */
  clearDataSource(key: string): void {
    this.syncInfo.delete(key);
  }

  /**
   * Clear all sync info
   */
  clearAll(): void {
    this.syncInfo.clear();
  }
}
