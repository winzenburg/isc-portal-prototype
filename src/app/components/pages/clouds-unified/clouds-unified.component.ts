import { Component, OnInit } from '@angular/core';
import { TableConfig } from '../../shared/base-table/base-table.config';
import { AccessControlService, AccessErrorCode } from '../../../services/access-control.service';

interface Cloud {
  cloudId: string;
  cloudAlias: string;
  cloudType: string;
  cloudTypeCategory: string; // Simplified category: layer3, layer2, or public
  status: string;
  createdDate: string;
  connections: number;
}

@Component({
  selector: 'app-clouds-unified',
  templateUrl: './clouds-unified.component.html',
  styleUrls: ['./clouds-unified.component.scss']
})
export class CloudsUnifiedComponent implements OnInit {
  tableConfig!: TableConfig<Cloud>;
  clouds: Cloud[] = [];
  loading = false;

  // Access control properties
  accessDenied = false;
  accessErrorCode?: AccessErrorCode;
  accessErrorMessage?: string;
  accessErrorDetails?: string;
  showUpgradeButton = false;

  constructor(private accessControl: AccessControlService) {}

  ngOnInit() {
    // Check access before initializing
    this.checkAccess();

    if (!this.accessDenied) {
      this.initializeTableConfig();
      this.loadClouds();
    }
  }

  /**
   * Check if user has access to Cloud Services
   */
  private checkAccess(): void {
    const accessResult = this.accessControl.checkAccess('clouds');

    if (!accessResult.hasAccess) {
      this.accessDenied = true;
      this.accessErrorCode = accessResult.errorCode;
      this.accessErrorMessage = accessResult.errorMessage;
      this.accessErrorDetails = accessResult.contactSalesMessage;
      this.showUpgradeButton = accessResult.upgradeRequired || false;

      console.log('🚫 Access denied to Clouds:', accessResult);
    } else {
      console.log('✅ Access granted to Clouds');
    }
  }

  private initializeTableConfig() {
    this.tableConfig = {
      tableType: 'quick-filter',
      tableId: 'clouds-table',

      columns: [
        { field: 'cloudId', header: 'Cloud ID', sortable: true, width: '150px', type: 'custom', cellClass: 'link-cell' },
        { field: 'cloudAlias', header: 'Cloud Alias', sortable: true, width: '200px', type: 'custom', cellClass: 'editable-cell' },
        { field: 'cloudType', header: 'Cloud Type', sortable: true },
        { field: 'status', header: 'Status', sortable: true, width: '120px' },
        { field: 'createdDate', header: 'Created Date', sortable: true, width: '140px' },
        { field: 'connections', header: 'Connections', sortable: true, width: '120px', align: 'right' }
      ],

      filtering: {
        searchEnabled: true,
        searchPlaceholder: 'Search clouds...',
        persistFilters: true,
        quickFilters: {
          enabled: true,
          label: '',
          field: 'cloudTypeCategory',
          options: [
            { label: 'All', value: null, count: 44 },
            { label: 'Layer 3 Clouds', value: 'layer3', count: 28 },
            { label: 'Layer 2 Clouds', value: 'layer2', count: 12 },
            { label: 'Public Internet', value: 'public', count: 4 }
          ]
        }
      },

      export: {
        enabled: true,
        filename: 'clouds',
        buttonLabel: 'Export CSV',
        showIcon: true,
        icon: 'download'
      },

      pagination: { enabled: true, pageSize: 10, pageSizeOptions: [10, 25, 50], showFirstLastButtons: true },
      sorting: { enabled: true, defaultSort: { field: 'cloudId', direction: 'asc' } },
      hoverHighlight: true
    };
  }

  /**
   * Helper to categorize cloud types for filtering
   */
  private categorizeCloudType(cloudType: string): string {
    if (cloudType.includes('VPRN') || cloudType.includes('Layer 3')) {
      return 'layer3';
    } else if (cloudType.includes('VPLS') || cloudType.includes('Layer 2')) {
      return 'layer2';
    } else if (cloudType.includes('Public IP')) {
      return 'public';
    }
    return 'layer3'; // default
  }

  private loadClouds() {
    this.loading = true;
    setTimeout(() => {
      const rawClouds = [
        { cloudId: 'MS079631', cloudAlias: 'SD-WAN primary', cloudType: 'ITP VPRN / Private / Layer 3 Cloud', status: 'Installed', createdDate: '2022-12-14', connections: 56 },
        { cloudId: 'MS304031', cloudAlias: 'WARP9 DEMO', cloudType: 'ITP VPLS Layer 2 Cloud', status: 'Installed', createdDate: '2016-09-25', connections: 23 },
        { cloudId: 'MS304029', cloudAlias: 'WARP9 DEMO', cloudType: 'ITP VPLS Transparent Layer 2 Cloud', status: 'Installed', createdDate: '2016-09-25', connections: 22 },
        { cloudId: 'MS304028', cloudAlias: 'WARP9 DEMO', cloudType: 'ITP VPRN / Private / Layer 3 Cloud', status: 'Installed', createdDate: '2016-09-25', connections: 22 },
        { cloudId: 'MS304030', cloudAlias: 'WARP9 DEMO', cloudType: 'ITP Public IP Cloud', status: 'Installed', createdDate: '2016-09-25', connections: 21 },
        { cloudId: 'MS100168', cloudAlias: 'alias 4', cloudType: 'ITP VPRN / Private / Layer 3 Cloud', status: 'Installed', createdDate: '2012-04-04', connections: 16 },
        { cloudId: 'MS1027518', cloudAlias: 'MMM VPN', cloudType: 'ITP VPRN / Private / Layer 3 Cloud', status: 'Installed', createdDate: '2021-07-14', connections: 8 },
        { cloudId: 'MS084704', cloudAlias: 'Private IP Cloud', cloudType: 'ITP VPRN / Private / Layer 3 Cloud', status: 'Installed', createdDate: '2011-12-19', connections: 8 },
        { cloudId: 'MS410252', cloudAlias: 'Voice VPRN', cloudType: 'ITP VPRN / Private / Layer 3 Cloud', status: 'Installed', createdDate: '2017-11-07', connections: 7 },
        { cloudId: 'MS255842', cloudAlias: 'NFVDemo', cloudType: 'ITP VPRN / Private / Layer 3 Cloud', status: 'Installed', createdDate: '2016-02-23', connections: 5 },
        { cloudId: 'MS123456', cloudAlias: 'Production VPN', cloudType: 'ITP VPRN / Private / Layer 3 Cloud', status: 'Installed', createdDate: '2020-05-12', connections: 45 },
        { cloudId: 'MS234567', cloudAlias: 'Dev Environment', cloudType: 'ITP VPLS Layer 2 Cloud', status: 'Installed', createdDate: '2019-08-22', connections: 18 },
        { cloudId: 'MS345678', cloudAlias: 'QA Network', cloudType: 'ITP VPRN / Private / Layer 3 Cloud', status: 'Installed', createdDate: '2021-03-15', connections: 12 },
        { cloudId: 'MS456789', cloudAlias: 'Stage Cloud', cloudType: 'ITP VPLS Layer 2 Cloud', status: 'Installed', createdDate: '2020-11-08', connections: 9 },
        { cloudId: 'MS567890', cloudAlias: 'Backup Gateway', cloudType: 'ITP Public IP Cloud', status: 'Installed', createdDate: '2018-06-30', connections: 6 },
        { cloudId: 'MS678901', cloudAlias: 'DR Site Primary', cloudType: 'ITP VPRN / Private / Layer 3 Cloud', status: 'Installed', createdDate: '2022-01-20', connections: 34 },
        { cloudId: 'MS789012', cloudAlias: 'DR Site Secondary', cloudType: 'ITP VPRN / Private / Layer 3 Cloud', status: 'Installed', createdDate: '2022-01-20', connections: 28 },
        { cloudId: 'MS890123', cloudAlias: 'Branch Office VPN', cloudType: 'ITP VPLS Transparent Layer 2 Cloud', status: 'Installed', createdDate: '2019-12-05', connections: 19 },
        { cloudId: 'MS901234', cloudAlias: 'HQ Network', cloudType: 'ITP VPRN / Private / Layer 3 Cloud', status: 'Installed', createdDate: '2018-03-14', connections: 52 },
        { cloudId: 'MS012345', cloudAlias: 'Regional Hub', cloudType: 'ITP VPRN / Private / Layer 3 Cloud', status: 'Installed', createdDate: '2020-09-18', connections: 41 },
        { cloudId: 'MS112233', cloudAlias: 'Internet Breakout', cloudType: 'ITP Public IP Cloud', status: 'Installed', createdDate: '2021-06-11', connections: 15 },
        { cloudId: 'MS223344', cloudAlias: 'MPLS Core', cloudType: 'ITP VPLS Layer 2 Cloud', status: 'Installed', createdDate: '2017-04-25', connections: 38 },
        { cloudId: 'MS334455', cloudAlias: 'WAN Aggregation', cloudType: 'ITP VPRN / Private / Layer 3 Cloud', status: 'Installed', createdDate: '2019-02-08', connections: 29 },
        { cloudId: 'MS445566', cloudAlias: 'Cloud Connect', cloudType: 'ITP VPLS Transparent Layer 2 Cloud', status: 'Installed', createdDate: '2021-11-30', connections: 14 },
        { cloudId: 'MS556677', cloudAlias: 'DMZ Network', cloudType: 'ITP VPRN / Private / Layer 3 Cloud', status: 'Installed', createdDate: '2018-07-19', connections: 26 },
        { cloudId: 'MS667788', cloudAlias: 'Guest WiFi', cloudType: 'ITP Public IP Cloud', status: 'Installed', createdDate: '2020-04-02', connections: 8 },
        { cloudId: 'MS778899', cloudAlias: 'IoT Network', cloudType: 'ITP VPLS Layer 2 Cloud', status: 'Installed', createdDate: '2022-08-16', connections: 31 },
        { cloudId: 'MS889900', cloudAlias: 'Secure Access', cloudType: 'ITP VPRN / Private / Layer 3 Cloud', status: 'Installed', createdDate: '2021-01-24', connections: 47 },
        { cloudId: 'MS990011', cloudAlias: 'Partner Network', cloudType: 'ITP VPLS Transparent Layer 2 Cloud', status: 'Installed', createdDate: '2019-05-13', connections: 11 },
        { cloudId: 'MS001122', cloudAlias: 'Legacy VPN', cloudType: 'ITP VPRN / Private / Layer 3 Cloud', status: 'Installed', createdDate: '2015-10-07', connections: 24 },
        { cloudId: 'MS102030', cloudAlias: 'Campus Core', cloudType: 'ITP VPLS Layer 2 Cloud', status: 'Installed', createdDate: '2020-02-28', connections: 36 },
        { cloudId: 'MS203040', cloudAlias: 'Data Center', cloudType: 'ITP VPRN / Private / Layer 3 Cloud', status: 'Installed', createdDate: '2018-11-12', connections: 63 },
        { cloudId: 'MS304050', cloudAlias: 'Remote Access', cloudType: 'ITP VPRN / Private / Layer 3 Cloud', status: 'Installed', createdDate: '2021-09-05', connections: 39 },
        { cloudId: 'MS405060', cloudAlias: 'Video Conferencing', cloudType: 'ITP VPLS Layer 2 Cloud', status: 'Installed', createdDate: '2019-07-22', connections: 17 },
        { cloudId: 'MS506070', cloudAlias: 'VoIP Gateway', cloudType: 'ITP VPRN / Private / Layer 3 Cloud', status: 'Installed', createdDate: '2020-12-01', connections: 27 },
        { cloudId: 'MS607080', cloudAlias: 'Cloud Storage', cloudType: 'ITP VPLS Transparent Layer 2 Cloud', status: 'Installed', createdDate: '2022-03-18', connections: 13 },
        { cloudId: 'MS708090', cloudAlias: 'SaaS Connect', cloudType: 'ITP Public IP Cloud', status: 'Installed', createdDate: '2021-05-29', connections: 10 },
        { cloudId: 'MS809001', cloudAlias: 'Multi-Cloud Hub', cloudType: 'ITP VPRN / Private / Layer 3 Cloud', status: 'Installed', createdDate: '2022-07-04', connections: 51 },
        { cloudId: 'MS910203', cloudAlias: 'Edge Computing', cloudType: 'ITP VPLS Layer 2 Cloud', status: 'Installed', createdDate: '2021-10-14', connections: 20 },
        { cloudId: 'MS021304', cloudAlias: 'AI Workloads', cloudType: 'ITP VPRN / Private / Layer 3 Cloud', status: 'Installed', createdDate: '2022-11-22', connections: 33 },
        { cloudId: 'MS132405', cloudAlias: 'Analytics Platform', cloudType: 'ITP VPLS Layer 2 Cloud', status: 'Installed', createdDate: '2020-08-07', connections: 25 },
        { cloudId: 'MS243506', cloudAlias: 'Test Lab', cloudType: 'ITP VPRN / Private / Layer 3 Cloud', status: 'Installed', createdDate: '2019-04-16', connections: 7 },
        { cloudId: 'MS354607', cloudAlias: 'Training Environment', cloudType: 'ITP VPLS Transparent Layer 2 Cloud', status: 'Installed', createdDate: '2021-02-09', connections: 4 },
        { cloudId: 'MS465708', cloudAlias: 'Demo Cloud', cloudType: 'ITP VPRN / Private / Layer 3 Cloud', status: 'Installed', createdDate: '2020-06-23', connections: 6 }
      ];

      // Add cloudTypeCategory to each cloud
      this.clouds = rawClouds.map(cloud => ({
        ...cloud,
        cloudTypeCategory: this.categorizeCloudType(cloud.cloudType)
      }));

      this.loading = false;
    }, 500);
  }
}
