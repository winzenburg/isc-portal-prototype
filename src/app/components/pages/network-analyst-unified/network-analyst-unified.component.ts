import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { TableConfig } from '../../shared/base-table/base-table.config';

interface ProtocolData {
  protocol: string;
  totalIn: string;
  totalOut: string;
  averageIn: string;
  averageOut: string;
  peakIn: string;
  peakOut: string;
  selected: boolean;
  totalInData?: number[];
  totalOutData?: number[];
  [key: string]: any;  // Allow dynamic properties
}

@Component({
  selector: 'app-network-analyst-unified',
  templateUrl: './network-analyst-unified.component.html',
  styleUrls: ['./network-analyst-unified.component.scss']
})
export class NetworkAnalystUnifiedComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  // Circuit Information
  circuitName = 'IIM External (MB095666)';
  circuitLocation = '3180 Irving Blvd Dallas, TX 75247 (Irving Texas 75247 USA - 10 Mbps -10 Mbps)';
  dateRange = 'October 13th 2025, 11:42 AM to October 14th 2025, 11:42 AM (a day), 60 second averages';

  // Chart Configuration
  public lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Inbound (Mbps)',
        borderColor: '#24A148',
        backgroundColor: 'rgba(36, 161, 72, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2
      },
      {
        data: [],
        label: 'Outbound (Mbps)',
        borderColor: '#0D62FF',
        backgroundColor: 'rgba(13, 98, 255, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2
      }
    ]
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          boxHeight: 8,
          padding: 15,
          font: {
            size: 12,
            family: 'Roboto, sans-serif'
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        bodyFont: {
          size: 12
        },
        titleFont: {
          size: 13,
          weight: 'bold'
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 8,
          font: {
            size: 11
          }
        }
      },
      y: {
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Inbound Throughput (Mbps)',
          color: '#24A148',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      y1: {
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Outbound Throughput (Mbps)',
          color: '#0D62FF',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          }
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false
    }
  };

  public lineChartType: ChartType = 'line';

  // Table Configuration
  tableConfig!: TableConfig<ProtocolData>;
  protocols: ProtocolData[] = [];

  ngOnInit() {
    this.generateChartData();
    this.initializeProtocolData();
    this.initializeTableConfig();
  }

  private generateChartData() {
    // Generate 24 hours of data points (every hour)
    const labels: string[] = [];
    const inboundData: number[] = [];
    const outboundData: number[] = [];

    const startDate = new Date('2025-10-13T11:42:00');

    for (let i = 0; i < 24; i++) {
      const currentTime = new Date(startDate.getTime() + i * 60 * 60 * 1000);
      const hours = currentTime.getHours();
      const minutes = currentTime.getMinutes();
      labels.push(`${hours}:${minutes.toString().padStart(2, '0')}`);

      // Generate realistic network traffic data
      // Inbound: 16-32 Mbps with peaks
      let inbound = 20 + Math.random() * 10;
      if (i >= 10 && i <= 12) inbound += 20; // Peak around midday
      if (i >= 18 && i <= 20) inbound += 15; // Peak in evening

      // Outbound: 40-80 Mbps more consistent
      let outbound = 60 + Math.random() * 15;
      if (i >= 10 && i <= 12) outbound += 10; // Slight peak

      inboundData.push(parseFloat(inbound.toFixed(2)));
      outboundData.push(parseFloat(outbound.toFixed(2)));
    }

    this.lineChartData.labels = labels;
    this.lineChartData.datasets[0].data = inboundData;
    this.lineChartData.datasets[1].data = outboundData;
  }

  private initializeProtocolData() {
    this.protocols = [
      {
        protocol: 'HTTP',
        totalIn: '131.2 MB',
        totalOut: '351.2 MB',
        averageIn: '12.1 Kbps',
        averageOut: '32.5 Kbps',
        peakIn: '20.9 Kbps',
        peakOut: '55.2 Kbps',
        selected: true,
        totalInData: this.generateSparklineData(12, 21, 15),
        totalOutData: this.generateSparklineData(28, 56, 15)
      },
      {
        protocol: '*Other*',
        totalIn: '85.3 MB',
        totalOut: '90.4 MB',
        averageIn: '7.9 Kbps',
        averageOut: '8.4 Kbps',
        peakIn: '48.9 Kbps',
        peakOut: '10.9 Kbps',
        selected: true,
        totalInData: this.generateSparklineData(6, 49, 15),
        totalOutData: this.generateSparklineData(7, 11, 15)
      },
      {
        protocol: 'Telnet',
        totalIn: '85.0 kB',
        totalOut: '0',
        averageIn: '7.8 bps',
        averageOut: '0',
        peakIn: '291.2 bps',
        peakOut: '0',
        selected: true,
        totalInData: this.generateSparklineData(5, 291, 15),
        totalOutData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      {
        protocol: 'SSH',
        totalIn: '45.8 kB',
        totalOut: '0',
        averageIn: '4.2 bps',
        averageOut: '0',
        peakIn: '299.5 bps',
        peakOut: '0',
        selected: false,
        totalInData: this.generateSparklineData(3, 300, 15),
        totalOutData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      {
        protocol: 'TerminalSvcs',
        totalIn: '40.9 kB',
        totalOut: '0',
        averageIn: '3.8 bps',
        averageOut: '0',
        peakIn: '291.2 bps',
        peakOut: '0',
        selected: false,
        totalInData: this.generateSparklineData(2, 291, 15),
        totalOutData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      {
        protocol: 'SMB CIFS NetBIOS',
        totalIn: '40.7 kB',
        totalOut: '0',
        averageIn: '3.8 bps',
        averageOut: '0',
        peakIn: '873.6 bps',
        peakOut: '0',
        selected: false,
        totalInData: this.generateSparklineData(2, 874, 15),
        totalOutData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }
    ];
  }

  private generateSparklineData(minVal: number, maxVal: number, points: number): number[] {
    const data: number[] = [];
    const range = maxVal - minVal;

    for (let i = 0; i < points; i++) {
      // Create more realistic patterns with some continuity
      const baseValue = minVal + (Math.random() * range * 0.6);
      const variation = (Math.random() - 0.5) * range * 0.4;
      data.push(parseFloat((baseValue + variation).toFixed(2)));
    }

    return data;
  }

  private initializeTableConfig() {
    this.tableConfig = {
      title: 'Protocol Breakdown',
      tableType: 'standard',
      tableId: 'network-analyst-protocols',

      columns: [
        { field: 'protocol', header: 'Protocol', sortable: true, width: '180px', tooltip: 'Network communication protocol used by this traffic' },
        { field: 'totalIn', header: 'Total In', sortable: true, width: '160px', type: 'custom', cellClass: 'sparkline-cell', tooltip: 'Total data received (inbound) with 24-hour traffic trend' },
        { field: 'totalOut', header: 'Total Out', sortable: true, width: '160px', type: 'custom', cellClass: 'sparkline-cell', tooltip: 'Total data sent (outbound) with 24-hour traffic trend' },
        { field: 'averageIn', header: 'Average In', sortable: true, width: '120px', tooltip: 'Average inbound data rate over time period' },
        { field: 'averageOut', header: 'Average Out', sortable: true, width: '120px', tooltip: 'Average outbound data rate over time period' },
        { field: 'peakIn', header: 'Peak In', sortable: true, width: '120px', tooltip: 'Highest inbound data rate observed' },
        { field: 'peakOut', header: 'Peak Out', sortable: true, width: '120px', tooltip: 'Highest outbound data rate observed' }
      ],

      filtering: {
        searchEnabled: true,
        searchPlaceholder: 'Search protocols...',
        persistFilters: true
      },

      sorting: {
        enabled: true,
        defaultSort: { field: 'totalIn', direction: 'desc' }
      },

      selection: {
        enabled: true,
        mode: 'multiple',
        showCheckboxes: true,
        selectAllEnabled: true
      },

      pagination: {
        enabled: false,
        pageSize: 10,
        pageSizeOptions: [10]
      },

      hoverHighlight: true
    };
  }

  onProtocolSelectionChange(event: any) {
    console.log('Selected protocols:', event);
    // In a real implementation, this would filter the chart data
  }
}
