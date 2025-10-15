import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import * as L from 'leaflet';

interface DashboardWidget {
  title: string;
  value: string | number;
  change?: string;
  icon: string;
  type: 'success' | 'warning' | 'error' | 'info';
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  private map: L.Map | undefined;
  widgets: DashboardWidget[] = [
    {
      title: 'Total Sites',
      value: 247,
      change: '+12 this month',
      icon: 'location_on',
      type: 'info'
    },
    {
      title: 'Active Circuits',
      value: 1842,
      change: '+5%',
      icon: 'router',
      type: 'success'
    },
    {
      title: 'Open Tickets',
      value: 23,
      change: '-8 from last week',
      icon: 'support',
      type: 'warning'
    },
    {
      title: 'Circuit Issues',
      value: 7,
      change: 'Requires attention',
      icon: 'error_outline',
      type: 'error'
    }
  ];

  // Clouds Doughnut Chart (matching ISC Portal)
  public cloudsChartData: ChartConfiguration['data'] = {
    datasets: [{
      data: [14, 25, 5],
      backgroundColor: ['#0D62FF', '#5A5D66', '#8E919A'],
      borderWidth: 0
    } as any],
    labels: ['Private Layer 2', 'Private Layer 3', 'Public Internet']
  };

  public cloudsChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '75%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 4
      }
    }
  } as any;

  public cloudsChartType: ChartType = 'doughnut';

  // Cloud breakdown data
  cloudsBreakdown = [
    { label: 'Private Layer 2', count: 14, percentage: 31.82, color: '#0D62FF' },
    { label: 'Private Layer 3', count: 25, percentage: 56.82, color: '#5A5D66' },
    { label: 'Public Internet', count: 5, percentage: 11.36, color: '#8E919A' }
  ];

  // Circuits Overview data
  circuitsOverview = [
    { label: 'Ethernet', percentage: 41, total: 45 },
    { label: 'Customer Provide...', percentage: 43, total: 47 },
    { label: 'Legacy - TDM', percentage: 8.3, total: 9 },
    { label: 'Other', percentage: 7.3, total: 8 }
  ];

  totalCircuits = 109;

  // Tickets Overview Bar Chart (Horizontal)
  public ticketsChartData: ChartConfiguration['data'] = {
    datasets: [{
      data: [2, 0, 0, 2, 0],
      backgroundColor: ['#0D62FF', '#525252', '#0D62FF', '#24A148', '#F1C21B'],
      borderRadius: 4,
      barThickness: 20
    }],
    labels: ['All Tickets', 'To Do', 'In Progress', 'Done', 'Pending Customer']
  };

  public ticketsChartOptions: ChartConfiguration['options'] = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 4
      }
    },
    scales: {
      x: {
        display: false,
        grid: {
          display: false
        }
      },
      y: {
        display: false,
        grid: {
          display: false
        }
      }
    }
  };

  public ticketsChartType: ChartType = 'bar';

  // Tickets data for display
  ticketsData = [
    { label: 'All Tickets', count: 2, color: '#0D62FF' },
    { label: 'To Do', count: 0, color: '#525252' },
    { label: 'In Progress', count: 0, color: '#0D62FF' },
    { label: 'Done', count: 2, color: '#24A148' },
    { label: 'Pending Customer', count: 0, color: '#F1C21B' }
  ];

  recentActivity = [
    {
      type: 'success',
      message: 'Circuit CIR-2847 activated successfully',
      timestamp: new Date(Date.now() - 1000 * 60 * 15)
    },
    {
      type: 'warning',
      message: 'Site "HQ Building A" requires configuration',
      timestamp: new Date(Date.now() - 1000 * 60 * 45)
    },
    {
      type: 'info',
      message: 'Report "Monthly Bandwidth Usage" generated',
      timestamp: new Date(Date.now() - 1000 * 60 * 120)
    },
    {
      type: 'error',
      message: 'Circuit CIR-1923 experiencing packet loss',
      timestamp: new Date(Date.now() - 1000 * 60 * 180)
    }
  ];

  // News items
  newsItems = [
    {
      title: 'Portal Maintenance in Progress',
      date: 'Aug 29, 2025',
      message: 'Due to ongoing maintenance, you may experience slower response times while using the ISC portal. We will post an update here when maintenance is complete.'
    },
    {
      title: 'Ticketing Will Be Unavailable 8/24 - 8/25',
      date: 'Aug 21, 2025',
      message: 'Our support ticketing system will be undergoing maintenance starting Sunday, 8/24 at 10:00 pm CST until Monday, 8/25, 4:00 am CST.'
    },
    {
      title: 'UCaaS upcoming changes (expected by Sep 10th)',
      date: 'Sep 08, 2024',
      message: 'Gain insights about your Auto Attendant calls with newly added fields to your reports including how calls are organized with our new Option Name.'
    }
  ];

  ngOnInit(): void {
    // Component initialization
  }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  private initializeMap(): void {
    // Initialize the map centered on the US
    this.map = L.map('network-map').setView([39.8283, -98.5795], 4);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(this.map);

    // Add sample site markers (matching the sites data)
    const sites = [
      { name: 'MB359026', lat: 39.5296, lng: -119.8138, location: 'Reno, NV' },
      { name: 'MB359016', lat: 41.6764, lng: -86.1584, location: 'Mishawaka, IN' },
      { name: 'DALLAS - MB921740', lat: 32.9783, lng: -96.7065, location: 'Dallas, TX' },
      { name: 'MB359037', lat: 30.4515, lng: -91.1871, location: 'Baton Rouge, LA' },
      { name: 'MB359006', lat: 30.3322, lng: -81.6557, location: 'Jacksonville, FL' },
      { name: '904 Quality Way', lat: 32.9483, lng: -96.7299, location: 'Richardson, TX' }
    ];

    // Create custom icon for site markers
    const siteIcon = L.icon({
      iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjMEQ2MkZGIj48cGF0aCBkPSJNMTIgMkM4LjEzIDIgNSA1LjEzIDUgOWMwIDUuMjUgNyAxMyA3IDEzczctNy43NSA3LTEzYzAtMy44Ny0zLjEzLTctNy03em0wIDkuNWMtMS4zOCAwLTIuNS0xLjEyLTIuNS0yLjVzMS4xMi0yLjUgMi41LTIuNSAyLjUgMS4xMiAyLjUgMi41LTEuMTIgMi41LTIuNSAyLjV6Ii8+PC9zdmc+',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    // Add markers for each site
    sites.forEach(site => {
      const marker = L.marker([site.lat, site.lng], { icon: siteIcon }).addTo(this.map!);
      marker.bindPopup(`
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <strong style="color: #0D62FF; font-size: 14px;">${site.name}</strong><br>
          <span style="color: #666; font-size: 12px;">${site.location}</span>
        </div>
      `);
    });

    // Fix Leaflet default icon issue in Angular
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/marker-icon-2x.png',
      iconUrl: 'assets/marker-icon.png',
      shadowUrl: 'assets/marker-shadow.png',
    });
  }

  refreshData(): void {
    // Simulate data refresh
    console.log('Refreshing dashboard data...');
  }
}
