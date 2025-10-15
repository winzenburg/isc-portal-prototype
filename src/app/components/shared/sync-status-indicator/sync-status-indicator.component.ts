import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DataSyncInfo, SyncStatusService } from '../../../services/sync-status.service';

@Component({
  selector: 'app-sync-status-indicator',
  templateUrl: './sync-status-indicator.component.html',
  styleUrls: ['./sync-status-indicator.component.scss']
})
export class SyncStatusIndicatorComponent {
  @Input() syncInfo!: DataSyncInfo;
  @Input() dataSourceName: string = 'Data';
  @Input() showRefreshButton: boolean = true;
  @Input() showRecordCount: boolean = true;
  @Input() compact: boolean = false;

  @Output() refresh = new EventEmitter<void>();

  constructor(public syncService: SyncStatusService) {}

  onRefresh(): void {
    this.refresh.emit();
  }

  get statusIcon(): string {
    return this.syncService.getStatusIcon(this.syncInfo.status);
  }

  get statusColor(): string {
    return this.syncService.getStatusColor(this.syncInfo.status);
  }

  get statusLabel(): string {
    return this.syncService.getStatusLabel(this.syncInfo.status);
  }

  get timeSinceUpdate(): string {
    return this.syncService.getTimeSinceUpdate(this.syncInfo.lastUpdated);
  }

  get formattedLastUpdated(): string {
    return this.syncService.formatLastUpdated(this.syncInfo.lastUpdated);
  }

  get isSyncing(): boolean {
    return this.syncInfo.status === 'syncing';
  }
}
