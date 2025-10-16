import { Injectable } from '@angular/core';
import { PageHelpContent } from '../../components/help/page-help-panel/page-help-panel.component';

@Injectable({
  providedIn: 'root'
})
export class PageHelpService {

  getPageHelp(pageId: string): PageHelpContent | undefined {
    return PAGE_HELP_DATABASE[pageId];
  }
}

// ============================================================================
// PAGE HELP CONTENT DATABASE
// ============================================================================

const PAGE_HELP_DATABASE: { [key: string]: PageHelpContent } = {
  'sites': {
    pageTitle: 'Sites',
    pageDescription: 'The Sites page shows all your office locations and their network health. Think of it as a **map of your company\'s network infrastructure**.',
    sections: [
      {
        id: 'overview',
        title: 'What is this page?',
        icon: 'info',
        content: 'The Sites page displays a complete inventory of all your physical office locations and their network status. Each site represents a building or office where your network equipment is installed.',
        subsections: [
          {
            title: 'Understanding the hierarchy',
            icon: 'account_tree',
            content: '**Country** → Top level grouping by geographic location\n**Site** → Individual office or building (e.g., "Dallas HQ")\n**Location** → Specific street address within a site'
          }
        ]
      },
      {
        id: 'site-health',
        title: 'What does "Site Health" mean?',
        icon: 'health_and_safety',
        content: 'Site Health shows the overall status of all network circuits at a location. It\'s determined by checking all the circuits connected to that site.',
        subsections: [
          {
            title: 'Health Status Indicators',
            icon: 'circle',
            content: '**✅ All circuits up** - Everything working normally, full connectivity\n**⚠️ Partially Inactive** - Some connections are down, but the office still has internet access\n**❌ Down** - Office is completely offline, no connectivity\n**⭕ No Info** - We can\'t check the status right now (monitoring may be disabled or pending setup)'
          },
          {
            title: 'Circuit Health Dots',
            icon: 'fiber_manual_record',
            content: 'Each colored dot represents one network circuit:\n• **Green** - Circuit is up and running\n• **Red** - Circuit is down\n• **Yellow** - Circuit is pending activation\n• **Gray** - No data available or monitoring disabled'
          }
        ]
      },
      {
        id: 'common-tasks',
        title: 'Common tasks',
        icon: 'task_alt',
        content: 'Here are the most common actions you can perform on this page:',
        subsections: [
          {
            title: 'Find a specific site',
            icon: 'search',
            content: 'Use the **search box** at the top to quickly locate a site by name or address. Type any part of the site name to filter results instantly.'
          },
          {
            title: 'Filter by SD-WAN sites',
            icon: 'filter_alt',
            content: 'Click the **"SD-WAN Sites"** filter button to show only sites using SD-WAN technology. This helps you focus on specific network types.'
          },
          {
            title: 'Check circuit status',
            icon: 'cable',
            content: 'Look for colored dots in the **"Circuits Health"** column. Green dots = good, red dots = problems. Click on a site row to see detailed circuit information.'
          },
          {
            title: 'Export data',
            icon: 'download',
            content: 'Click the **download icon** to export your sites list to CSV format. Great for reports or sharing with colleagues.'
          },
          {
            title: 'Select multiple sites',
            icon: 'checklist',
            content: 'Use the **tree panel on the left** to select multiple sites at once. Check the boxes next to countries, sites, or individual locations, then export or apply bulk actions.'
          }
        ]
      },
      {
        id: 'pro-tips',
        title: 'Pro Tips',
        icon: 'tips_and_updates',
        content: 'Expert shortcuts to work faster:',
        subsections: [
          {
            title: 'Bulk selection',
            icon: 'done_all',
            content: 'Click the **checkbox next to a country name** to select all sites in that country at once. Perfect for regional reports!'
          },
          {
            title: 'Quick health check',
            icon: 'visibility',
            content: 'Scan the **Circuits Health column** for any red or yellow dots. This gives you an at-a-glance view of network problems.'
          },
          {
            title: 'Expand to see details',
            icon: 'expand_more',
            content: 'Click the **arrow icons in the tree panel** to expand countries and sites, revealing all locations underneath.'
          }
        ]
      }
    ]
  },

  'circuits': {
    pageTitle: 'Circuits',
    pageDescription: 'The Circuits page manages all your network connections. A **circuit** is a dedicated network connection between two points, like a highway lane for your data.',
    sections: [
      {
        id: 'overview',
        title: 'What is this page?',
        icon: 'info',
        content: 'This page displays all your network circuits (connections) across all sites. Each circuit represents a physical or virtual network link that carries data between locations.',
        subsections: [
          {
            title: 'Key terminology',
            icon: 'abc',
            content: '**Bundle ID** - Unique identifier for the circuit (like a serial number)\n**Bundle Alias** - Human-readable name you assign (e.g., "Dallas Main Link")\n**Circuit Type** - The technology used (Ethernet, MPLS, etc.)\n**Bandwidth** - Maximum data capacity (how much data can flow through)'
          }
        ]
      },
      {
        id: 'circuit-status',
        title: 'Understanding Circuit Status',
        icon: 'signal_cellular_alt',
        content: 'Each circuit has a status that tells you if it\'s working properly:',
        subsections: [
          {
            title: 'Status types',
            icon: 'analytics',
            content: '**🟢 Installed** - Circuit is active and working normally\n**🟡 Pending** - Installation is in progress, not yet operational\n**🔴 Disconnected** - Circuit is down and not passing traffic\n**🟠 Action Required** - Something needs your attention (check details)'
          }
        ]
      },
      {
        id: 'product-types',
        title: 'Circuit Product Types',
        icon: 'category',
        content: 'Different types of network services are available:',
        subsections: [
          {
            title: 'Common product types',
            icon: 'dns',
            content: '**SD-WAN** - Smart network that automatically routes traffic\n**DIA (Direct Internet Access)** - Direct connection to the internet\n**Managed IP VPN** - Private network managed by your provider\n**MPLS** - Traditional dedicated private network'
          }
        ]
      },
      {
        id: 'common-tasks',
        title: 'Common tasks',
        icon: 'task_alt',
        content: 'Actions you can perform with circuits:',
        subsections: [
          {
            title: 'Search for a circuit',
            icon: 'search',
            content: 'Use the **search box** to find circuits by Bundle ID, alias, or address. The search updates as you type.'
          },
          {
            title: 'Filter by status',
            icon: 'filter_list',
            content: 'Click the **filter pills** (All Circuits, Installed, Action Required) to show only circuits in a specific state.'
          },
          {
            title: 'View circuit details',
            icon: 'open_in_new',
            content: 'Click the **"View Details"** action button (•••) on any row to see complete circuit information, including performance metrics.'
          },
          {
            title: 'Export circuits',
            icon: 'download',
            content: 'Select multiple circuits using checkboxes, then click **"Export Selected"** to download circuit data as CSV.'
          }
        ]
      },
      {
        id: 'pro-tips',
        title: 'Pro Tips',
        icon: 'tips_and_updates',
        content: 'Work smarter with these shortcuts:',
        subsections: [
          {
            title: 'Sort by bandwidth',
            icon: 'sort',
            content: 'Click the **Bandwidth column header** to sort circuits by capacity. This helps you quickly identify your fastest or slowest connections.'
          },
          {
            title: 'Multi-select for bulk actions',
            icon: 'checklist',
            content: 'Use **Shift+Click** to select a range of circuits at once, or check the **header checkbox** to select all visible circuits.'
          },
          {
            title: 'Watch for "Action Required"',
            icon: 'warning',
            content: 'Circuits with **🟠 Action Required status** need immediate attention. Filter by this status daily to catch issues early.'
          }
        ]
      }
    ]
  },

  'clouds': {
    pageTitle: 'Clouds',
    pageDescription: 'The Clouds page manages your virtual private networks. A **cloud** is a secure network that connects multiple sites together, like a private internet just for your company.',
    sections: [
      {
        id: 'overview',
        title: 'What is this page?',
        icon: 'info',
        content: 'This page shows all your cloud networks (VPNs). Think of each cloud as a secure tunnel that connects multiple office locations, allowing them to communicate privately.',
        subsections: [
          {
            title: 'Cloud vs Circuit',
            icon: 'compare_arrows',
            content: 'A **circuit** is a single connection between two points. A **cloud** connects many sites together in one virtual network, like a hub with multiple spokes.'
          }
        ]
      },
      {
        id: 'cloud-types',
        title: 'Understanding Cloud Types',
        icon: 'cloud',
        content: 'Different cloud types operate at different network layers:',
        subsections: [
          {
            title: 'Layer 3 Clouds (VPRN)',
            icon: 'layers',
            content: '**Most common type** - Works like a private internet\n• Routes traffic between sites intelligently\n• Each site has its own IP address range\n• Includes built-in security and firewall rules\n• Example: "ITP VPRN / Private / Layer 3 Cloud"'
          },
          {
            title: 'Layer 2 Clouds (VPLS)',
            icon: 'layers',
            content: '**Advanced networking** - Makes remote sites appear on the same local network\n• All sites share the same network segment\n• Useful for special applications requiring Layer 2\n• More complex to configure\n• Example: "ITP VPLS Layer 2 Cloud"'
          },
          {
            title: 'Public Internet',
            icon: 'public',
            content: 'Standard internet access without private networking. Used for sites that only need internet, not private connectivity to other locations.'
          }
        ]
      },
      {
        id: 'cloud-status',
        title: 'Cloud Status & Connections',
        icon: 'hub',
        content: 'Monitor your cloud networks:',
        subsections: [
          {
            title: 'Connections count',
            icon: 'share',
            content: 'The **Connections** column shows how many sites are actively connected to this cloud. More connections = more sites can communicate through this network.'
          },
          {
            title: 'Status indicator',
            icon: 'check_circle',
            content: '**Installed** - Cloud is operational and passing traffic\n**Pending** - Cloud is being provisioned\n**Inactive** - Cloud exists but is not currently active'
          }
        ]
      },
      {
        id: 'common-tasks',
        title: 'Common tasks',
        icon: 'task_alt',
        content: 'Actions you can perform with clouds:',
        subsections: [
          {
            title: 'Search clouds',
            icon: 'search',
            content: 'Use the **search box** to find clouds by Cloud ID or alias. Great for large networks with many clouds.'
          },
          {
            title: 'Filter by layer type',
            icon: 'filter_list',
            content: 'Click **"Layer 3 Clouds"** or **"Layer 2 Clouds"** to show only specific cloud types. This helps you focus on the networks you manage.'
          },
          {
            title: 'Edit cloud alias',
            icon: 'edit',
            content: 'Click on a **cloud alias** (the name) to edit it. Give your clouds memorable names like "East Coast Network" instead of technical IDs.'
          },
          {
            title: 'View connections',
            icon: 'visibility',
            content: 'Click on a cloud row to see which sites are connected to it. This shows you the full network topology.'
          }
        ]
      },
      {
        id: 'pro-tips',
        title: 'Pro Tips',
        icon: 'tips_and_updates',
        content: 'Expert cloud management tips:',
        subsections: [
          {
            title: 'Name your clouds',
            icon: 'label',
            content: 'Give each cloud a **descriptive alias** that explains its purpose, like "Production Network" or "Guest WiFi Cloud". This makes troubleshooting much easier.'
          },
          {
            title: 'Monitor connection counts',
            icon: 'trending_up',
            content: 'If a cloud\'s **connection count suddenly drops**, it may indicate sites going offline. Investigate quickly!'
          },
          {
            title: 'Layer 3 for most uses',
            icon: 'recommend',
            content: 'Unless you have specific requirements, **Layer 3 clouds (VPRN)** are simpler to manage and work for 95% of use cases.'
          }
        ]
      }
    ]
  },

  'network-analyst': {
    pageTitle: 'Network Analyst',
    pageDescription: 'The Network Analyst page visualizes your network traffic patterns. Use these charts and tables to **monitor bandwidth usage, identify trends, and troubleshoot performance issues**.',
    sections: [
      {
        id: 'overview',
        title: 'What is this page?',
        icon: 'info',
        content: 'This page shows real-time and historical network traffic data. It helps you understand how your network is being used and spot potential problems before they impact users.',
        subsections: [
          {
            title: 'Key metrics explained',
            icon: 'speed',
            content: '**Traffic** - Amount of data flowing through the network\n**Protocol** - Type of network communication (HTTP, HTTPS, SSH, etc.)\n**Bandwidth** - Network capacity (how much data can flow)\n**Throughput** - Actual data transfer rate (how much is flowing now)'
          }
        ]
      },
      {
        id: 'traffic-chart',
        title: 'Understanding the Traffic Chart',
        icon: 'show_chart',
        content: 'The main chart shows 24 hours of network traffic patterns:',
        subsections: [
          {
            title: 'Chart elements',
            icon: 'analytics',
            content: '**📊 Green line** - Inbound traffic (data coming into your network)\n**📊 Blue line** - Outbound traffic (data going out of your network)\n**📊 Peaks** - High usage periods (usually business hours)\n**📊 Valleys** - Low usage periods (nights and weekends)'
          },
          {
            title: 'What to look for',
            icon: 'troubleshoot',
            content: '**Spikes** - Sudden increases may indicate large file transfers or video conferences\n**Flatlines** - Consistent usage patterns indicate normal operations\n**Unusual patterns** - Traffic at odd hours might be backups or unauthorized activity'
          }
        ]
      },
      {
        id: 'protocol-table',
        title: 'Protocol Breakdown Table',
        icon: 'table_chart',
        content: 'The table shows which protocols (types of traffic) are using your bandwidth:',
        subsections: [
          {
            title: 'Common protocols',
            icon: 'dns',
            content: '**HTTP/HTTPS** - Web browsing and web applications\n**SSH** - Secure remote server access\n**ICMP** - Network diagnostics (ping)\n**TCP/UDP** - General data transmission protocols'
          },
          {
            title: 'Sparklines mini-charts',
            icon: 'auto_graph',
            content: 'The tiny charts in **Total In** and **Total Out** columns show traffic trends for each protocol over 24 hours. Green = inbound, Blue = outbound.'
          },
          {
            title: 'Metrics columns',
            icon: 'calculate',
            content: '**Total In/Out** - Cumulative data transferred\n**Average In/Out** - Typical transfer rate\n**Peak In/Out** - Highest transfer rate recorded'
          }
        ]
      },
      {
        id: 'common-tasks',
        title: 'Common tasks',
        icon: 'task_alt',
        content: 'How to use this page effectively:',
        subsections: [
          {
            title: 'Monitor current usage',
            icon: 'speed',
            content: 'Check the **main chart** to see if bandwidth usage is normal. Compare current levels to typical patterns.'
          },
          {
            title: 'Identify bandwidth hogs',
            icon: 'data_usage',
            content: 'Sort the **protocol table by Total In or Total Out** to find which applications are using the most bandwidth.'
          },
          {
            title: 'Spot trends',
            icon: 'trending_up',
            content: 'Look at **sparklines** to see if protocol usage is increasing over time. Growing trends may indicate you need more bandwidth.'
          },
          {
            title: 'Troubleshoot slowness',
            icon: 'bug_report',
            content: 'If users report slow performance, check if you\'re near peak bandwidth capacity during those times.'
          }
        ]
      },
      {
        id: 'pro-tips',
        title: 'Pro Tips',
        icon: 'tips_and_updates',
        content: 'Advanced analytics techniques:',
        subsections: [
          {
            title: 'Baseline your traffic',
            icon: 'insights',
            content: 'Check this page daily for a week to understand your **normal traffic patterns**. This makes it easier to spot anomalies.'
          },
          {
            title: 'Watch for symmetric vs asymmetric',
            icon: 'compare',
            content: 'If **Inbound and Outbound traffic are very different**, it\'s normal. Downloads (inbound) are usually much larger than uploads (outbound).'
          },
          {
            title: 'Protocol analysis',
            icon: 'science',
            content: 'Unexpected protocols with high usage (like BitTorrent or gaming) might indicate **policy violations** or unauthorized applications.'
          },
          {
            title: 'Capacity planning',
            icon: 'upgrade',
            content: 'If your **peak usage consistently exceeds 70% of bandwidth capacity**, it\'s time to consider upgrading your circuits.'
          }
        ]
      }
    ]
  }
};
