/**
 * ISC Portal Help Content Database
 *
 * Comprehensive terminology and feature explanations for contextual help system.
 * Organized by category and priority tier for progressive disclosure.
 */

export enum HelpCategory {
  NETWORKING = 'Networking Concepts',
  STATUS = 'Status Indicators',
  METRICS = 'Metrics & Measurements',
  FEATURES = 'Portal Features',
  WORKFLOWS = 'Common Tasks',
  PROTOCOLS = 'Network Protocols'
}

export interface HelpContent {
  id: string;
  term: string;
  category: HelpCategory;
  tier: 1 | 2 | 3;  // 1=Critical, 2=Important, 3=Helpful
  shortDescription: string;
  detailedDescription: string;
  examples?: string[];
  relatedTerms?: string[];
  icon?: string;  // Material icon name
  visualAid?: string;  // Path to diagram/image
}

export const HELP_CONTENT_DATABASE: HelpContent[] = [
  // ========================================================================
  // TIER 1: CRITICAL TERMS (Most Confusing)
  // ========================================================================

  {
    id: 'sd-wan',
    term: 'SD-WAN',
    category: HelpCategory.NETWORKING,
    tier: 1,
    icon: 'cloud_circle',
    shortDescription: 'Software-Defined Wide Area Network - Smart networking that connects your office locations',
    detailedDescription: `SD-WAN is a modern approach to connecting multiple office locations.

Think of it like an intelligent GPS for your network traffic. Instead of always taking the same route, SD-WAN automatically chooses the fastest, most reliable path for your data.

**How it helps:**
• **Cost savings** - Use internet connections instead of expensive dedicated circuits
• **Automatic failover** - If one connection fails, traffic switches instantly to another
• **Better performance** - Cloud apps and video calls get priority treatment
• **Centralized control** - Manage all locations from one dashboard

**Example:** Your video call from Dallas to New York automatically routes through the fastest available connection, switching paths if internet slows down.`,
    examples: [
      'Dallas office connects to New York office via SD-WAN',
      'Video conference switches from slow internet to LTE backup automatically'
    ],
    relatedTerms: ['mpls', 'circuit', 'bandwidth', 'dia']
  },

  {
    id: 'vprn',
    term: 'VPRN (Virtual Private Routed Network)',
    category: HelpCategory.NETWORKING,
    tier: 1,
    icon: 'vpn_lock',
    shortDescription: 'Layer 3 private network service that routes IP traffic between your locations',
    detailedDescription: `VPRN creates a private "highway system" for your data that operates at the IP (Internet Protocol) level.

**Think of it like:** A private toll road network connecting your offices. Only your company's traffic can use these roads, and they're completely separated from everyone else's traffic.

**Key characteristics:**
• **Layer 3** - Works with IP addresses and routing
• **Private** - Your traffic is isolated from other customers
• **Routed** - Intelligently directs traffic between locations
• **Scalable** - Easy to add new office locations

**When to use:** When you need to connect multiple offices securely and want automatic routing between them.`,
    examples: [
      'All your office locations share private IP addresses (10.x.x.x)',
      'Chicago office can directly access servers in Atlanta office'
    ],
    relatedTerms: ['vpls', 'layer-3', 'cloud', 'ip']
  },

  {
    id: 'vpls',
    term: 'VPLS (Virtual Private LAN Service)',
    category: HelpCategory.NETWORKING,
    tier: 1,
    icon: 'lan',
    shortDescription: 'Layer 2 network service that makes all your locations act like one big office LAN',
    detailedDescription: `VPLS makes multiple office locations appear as if they're all plugged into the same network switch.

**Think of it like:** All your offices sharing the same local network, as if they were different floors in the same building.

**Key characteristics:**
• **Layer 2** - Works with MAC addresses and Ethernet
• **Transparent** - Locations don't know they're geographically separated
• **Broadcast capable** - Supports network discovery protocols
• **Flexible** - Any network protocol can travel across it

**VPLS vs VPRN:**
• VPLS = Like being in the same building (Layer 2)
• VPRN = Like connected buildings with directions between them (Layer 3)

**When to use:** When you need locations to behave exactly like they're on the same local network.`,
    examples: [
      'Printer in Dallas office can be discovered by computer in Houston office',
      'All offices see each other on same subnet (192.168.1.x)'
    ],
    relatedTerms: ['vprn', 'layer-2', 'cloud', 'ethernet']
  },

  {
    id: 'layer-2-vs-3',
    term: 'Layer 2 vs Layer 3',
    category: HelpCategory.NETWORKING,
    tier: 1,
    icon: 'layers',
    shortDescription: 'Two different levels of network connectivity - Ethernet (Layer 2) vs IP routing (Layer 3)',
    detailedDescription: `Network layers are like floors in a building - each layer provides different services.

**Layer 2 (Data Link)** - The Ethernet Level
• Works with MAC addresses (like 00:1A:2B:3C:4D:5E)
• Thinks everyone is on the same local network
• Like rooms in the same house sharing hallways
• **Services:** VPLS, Ethernet, Switching

**Layer 3 (Network)** - The IP Level
• Works with IP addresses (like 192.168.1.100)
• Routes traffic between different networks
• Like houses on different streets with directions
• **Services:** VPRN, IP Routing, Internet

**Simple analogy:**
• **Layer 2** = Shouting to someone in the same building
• **Layer 3** = Mailing a letter with an address

**Which do you need?**
• Need locations to act like one big office? → **Layer 2 (VPLS)**
• Need to route between separate networks? → **Layer 3 (VPRN)**`,
    examples: [
      'Layer 2: Office devices discover each other automatically',
      'Layer 3: Traffic routes between office networks via IP addresses'
    ],
    relatedTerms: ['vpls', 'vprn', 'ethernet', 'ip']
  },

  {
    id: 'mpls',
    term: 'MPLS (Multiprotocol Label Switching)',
    category: HelpCategory.NETWORKING,
    tier: 1,
    icon: 'alt_route',
    shortDescription: 'High-performance private networking technology that routes traffic using labels',
    detailedDescription: `MPLS is like a private package delivery service for your network traffic.

**How it works:**
Instead of reading the full address on every package (like the internet does), MPLS puts a simple label on your data. Network devices just read the label and know exactly where to send it - much faster!

**Benefits:**
• **Performance** - Faster routing than standard internet
• **Reliability** - Guaranteed bandwidth and uptime (SLA)
• **Security** - Private network, not exposed to internet
• **Quality** - Prioritizes important traffic (video calls, VoIP)

**Drawbacks:**
• More expensive than internet connections
• Takes longer to install new connections
• Being replaced by SD-WAN in many cases

**When to use:** Mission-critical applications that need guaranteed performance and security.`,
    examples: [
      'Video conferencing gets priority over email downloads',
      'Traffic between offices never touches the public internet'
    ],
    relatedTerms: ['sd-wan', 'circuit', 'bandwidth', 'sla']
  },

  {
    id: 'dia',
    term: 'DIA (Dedicated Internet Access)',
    category: HelpCategory.NETWORKING,
    tier: 1,
    icon: 'public',
    shortDescription: 'Private, high-speed internet connection dedicated only to your business',
    detailedDescription: `DIA is like having your own private on-ramp to the internet highway.

**Standard Business Internet vs DIA:**

**Regular Business Internet:**
• Shared with neighbors (like a carpool lane)
• "Up to" speeds that vary by time of day
• Best effort, no guarantees

**DIA (Dedicated):**
• Only your company uses it (your own lane)
• Guaranteed speed 24/7
• Service Level Agreement (SLA) with uptime guarantees
• Symmetric speeds (same upload and download)

**Benefits:**
• **Predictable performance** - Know exactly what speed you'll get
• **SLA protection** - Provider must meet uptime guarantees
• **Symmetric speeds** - Upload as fast as download (great for video/backups)
• **Static IP addresses** - Host servers or VPN

**When to use:** When reliable, high-performance internet is critical for your business operations.`,
    examples: [
      'Upload large files as fast as you download them',
      'Host your own web server or email server',
      'Guaranteed 100 Mbps, 24/7, never slower'
    ],
    relatedTerms: ['bandwidth', 'sla', 'circuit', 'mpls']
  },

  {
    id: 'circuit-health-partially-inactive',
    term: 'Partially Inactive (Site Health)',
    category: HelpCategory.STATUS,
    tier: 1,
    icon: 'warning',
    shortDescription: 'Some network connections at this site are down, but the location is still online',
    detailedDescription: `"Partially Inactive" means your office has lost some, but not all, of its network connections.

**What's happening:**
Your site has multiple circuits (network connections) for redundancy. Some are down, but at least one is still working, so the office stays online.

**Think of it like:** Your office has two internet connections. One goes down, but the other keeps working. You're still online, just with less capacity or no backup.

**What to do:**
1. **Check impact** - Is anyone experiencing slowness?
2. **Review circuits** - Click the site to see which circuits are down
3. **Create ticket** - If the down circuit doesn't recover, open a support ticket
4. **Monitor** - The working circuit is handling all traffic now (higher load)

**Why it matters:** While you're still operational, you've lost redundancy. If the remaining circuit fails, the site goes completely offline.`,
    examples: [
      'Site has 2 circuits: One is Up (green), one is Down (red)',
      'Primary internet is down, but backup LTE connection is working'
    ],
    relatedTerms: ['circuit-health-down', 'circuit-health-no-info', 'circuit', 'redundancy']
  },

  {
    id: 'sparklines',
    term: 'Sparklines',
    category: HelpCategory.FEATURES,
    tier: 1,
    icon: 'show_chart',
    shortDescription: 'Mini inline charts showing traffic trends over time right in the table',
    detailedDescription: `Sparklines are tiny charts that show you traffic patterns at a glance, without leaving the table.

**What they show:**
Each sparkline displays 24 hours of network traffic data as a small line chart. You can quickly spot patterns, spikes, and trends.

**Color coding:**
• 📊 **Green** = Inbound traffic (data coming in)
• 📊 **Blue** = Outbound traffic (data going out)

**Reading patterns:**
• ↗️ **Spikes** = High usage periods (often business hours)
• ↘️ **Flat lines** = Steady, consistent traffic
• 📈 **Gradual increases** = Growing usage over the day
• ~ **Irregular patterns** = Sporadic usage

**Why they're useful:**
Instead of clicking each protocol to see a detailed chart, you can instantly compare traffic patterns for all protocols at once.

**Pro tip:** Look for protocols with unexpected spikes - they might indicate issues or unusual activity.`,
    examples: [
      'HTTP shows high peaks during 9am-5pm business hours',
      'Backup protocol shows one large spike at 2am nightly backup time',
      'Flat line at zero means no traffic for that protocol'
    ],
    relatedTerms: ['protocol', 'traffic', 'throughput', 'total-in-out']
  },

  // ========================================================================
  // TIER 2: IMPORTANT TERMS (Moderately Confusing)
  // ========================================================================

  {
    id: 'bandwidth',
    term: 'Bandwidth',
    category: HelpCategory.METRICS,
    tier: 2,
    icon: 'speed',
    shortDescription: 'The maximum amount of data that can travel through a network connection',
    detailedDescription: `Bandwidth is like the width of a highway - the wider it is, the more traffic can flow.

**Units explained:**
• **Gbps** (Gigabits per second) = 1,000 Mbps - Ultra-fast connections
• **Mbps** (Megabits per second) = 1,000 Kbps - Standard business speeds
• **Kbps** (Kilobits per second) = 1,000 bps - Slow/legacy connections
• **bps** (bits per second) = Base unit - Very slow

**Common speeds:**
• **1 Gbps** - Large enterprise offices
• **100-500 Mbps** - Medium business offices
• **10-50 Mbps** - Small branch offices
• **Below 10 Mbps** - Remote/legacy sites

**Important:** Bandwidth is maximum capacity, not actual usage. A 100 Mbps circuit might only use 30 Mbps on average.`,
    examples: [
      '100 Mbps circuit can download a 1 GB file in about 80 seconds',
      '10 Gbps data center connection handles hundreds of users simultaneously'
    ],
    relatedTerms: ['throughput', 'mbps', 'gbps', 'circuit']
  },

  {
    id: 'protocol',
    term: 'Protocol',
    category: HelpCategory.PROTOCOLS,
    tier: 2,
    icon: 'swap_horiz',
    shortDescription: 'A set of rules that defines how data is transmitted over the network',
    detailedDescription: `Protocols are like languages that computers use to communicate.

**Common protocols you'll see:**

**HTTP/HTTPS** - Web traffic
• Loading websites
• Web applications
• API calls

**SSH** - Secure remote access
• Remote server management
• Secure file transfers

**SMB/CIFS** - Windows file sharing
• Accessing network drives
• Printing to network printers

**Telnet** - Remote terminal (legacy)
• Old remote access method
• Not encrypted (security risk)

**RDP (TerminalSvcs)** - Remote Desktop
• Access Windows desktop remotely

Why it matters: Different protocols have different performance needs. Video calls need low latency, while file transfers need high bandwidth.`,
    examples: [
      'HTTP shows high traffic during business hours = web usage',
      'SSH spike at 2am = automated backup scripts',
      'SMB traffic = users accessing shared drives'
    ],
    relatedTerms: ['http', 'ssh', 'smb', 'traffic']
  },

  {
    id: 'throughput',
    term: 'Throughput',
    category: HelpCategory.METRICS,
    tier: 2,
    icon: 'trending_up',
    shortDescription: 'The actual amount of data successfully transmitted through the network',
    detailedDescription: `Throughput is actual data transferred, while bandwidth is maximum capacity.

**Analogy:**
• **Bandwidth** = Highway speed limit (55 mph)
• **Throughput** = Your actual driving speed (45 mph due to traffic)

**Inbound vs Outbound:**
• **Inbound (In)** - Data coming into your network (downloads, receiving emails)
• **Outbound (Out)** - Data leaving your network (uploads, sending emails)

**Why they might differ:**
• Video conferencing: High inbound (receiving video), lower outbound
• File backups: Very high outbound, minimal inbound
• Web browsing: High inbound (loading pages), lower outbound (clicking links)

**Metrics shown:**
• **Total** - All data transferred in time period (MB, GB)
• **Average** - Typical data rate (Mbps, Kbps)
• **Peak** - Highest data rate observed (Mbps, Kbps)`,
    examples: [
      'Total In: 131.2 MB = Downloaded 131 megabytes of data',
      'Peak Out: 55.2 Kbps = Highest upload speed was 55 kilobits/second',
      'Average In: 12.1 Kbps = Typical download rate was 12 kilobits/second'
    ],
    relatedTerms: ['bandwidth', 'total-in-out', 'average-in-out', 'peak-in-out']
  },

  {
    id: 'latency',
    term: 'Latency',
    category: HelpCategory.METRICS,
    tier: 2,
    icon: 'timer',
    shortDescription: 'The delay (in milliseconds) between sending and receiving data',
    detailedDescription: `Latency is response time - how long it takes for data to make a round trip.

**Measured in milliseconds (ms):**
• **<20 ms** - Excellent (feels instant)
• **20-50 ms** - Good (barely noticeable)
• **50-100 ms** - Fair (slight lag)
• **>100 ms** - Poor (noticeable delay)

**Why it matters:**
• **Video calls** - High latency = people talking over each other
• **Remote desktop** - High latency = mouse feels sluggish
• **Voice calls** - High latency = awkward conversation pauses
• **File downloads** - Latency doesn't matter much (bandwidth does)

**What causes it:**
• Geographic distance (speed of light!)
• Network congestion
• Router processing time
• Poor quality connections

**Think of it like:** Latency is reaction time. Low latency = quick reflexes. High latency = slow reflexes.`,
    examples: [
      '10 ms latency = Server response feels instant',
      '200 ms latency = Video call has noticeable delay',
      'Packet loss + high latency = Poor application performance'
    ],
    relatedTerms: ['packet-loss', 'performance', 'application-performance']
  },

  {
    id: 'packet-loss',
    term: 'Packet Loss',
    category: HelpCategory.METRICS,
    tier: 2,
    icon: 'error_outline',
    shortDescription: 'Percentage of data packets that fail to reach their destination',
    detailedDescription: `Packet loss is when pieces of your data go missing during transmission.

**Think of it like:** Mailing 100 letters, but only 98 arrive. You have 2% packet loss.

**Impact by percentage:**
• **0-0.5%** - Excellent (barely noticeable)
• **0.5-2%** - Good (slight quality reduction)
• **2-5%** - Fair (noticeable issues)
• **>5%** - Poor (significant problems)

**Symptoms:**
• **Voice/Video** - Choppy audio, pixelated video, dropped calls
• **Web browsing** - Slow page loads, connection timeouts
• **File transfers** - Slower speeds (data must be resent)
• **Applications** - Freezing, disconnections

**Common causes:**
• Network congestion
• Faulty equipment (cables, switches, routers)
• Wireless interference
• ISP issues

**What to do:**
Even 1-2% packet loss can impact voice and video quality. If you see consistent packet loss >1%, open a support ticket.`,
    examples: [
      '0.1% packet loss = Virtually no impact',
      '3% packet loss = Video calls become choppy',
      '10% packet loss = Applications become unusable'
    ],
    relatedTerms: ['latency', 'performance', 'application-performance']
  },

  {
    id: 'circuit-health-down',
    term: 'Down (Circuit Status)',
    category: HelpCategory.STATUS,
    tier: 2,
    icon: 'cancel',
    shortDescription: 'Circuit is not operational - no data can flow through this connection',
    detailedDescription: `A "Down" circuit means the network connection has failed and is not passing any traffic.

**What causes circuits to go down:**
• Equipment failure (router, switch, modem)
• Fiber cut or cable damage
• ISP/carrier issues
• Power outage at circuit location
• Configuration errors

**Impact:**
• If it's your only circuit: Site is completely offline
• If you have backup circuits: Traffic fails over to backup (may be slower)

**What happens automatically:**
1. Monitoring detects circuit failure
2. SD-WAN (if configured) fails over to backup circuit
3. NOC (Network Operations Center) is alerted
4. Ticket may be auto-created with carrier

**What you should do:**
1. Verify if site is completely down or using backup
2. Check if issue is affecting business operations
3. Review any open NOC tickets for this circuit
4. Contact support if critical and no ticket exists`,
    examples: [
      'Primary internet circuit down, site using backup LTE',
      'MPLS circuit down, SD-WAN routing traffic over internet',
      'Both circuits down = site completely offline'
    ],
    relatedTerms: ['circuit-health-partially-inactive', 'circuit', 'failover']
  },

  {
    id: 'circuit-health-no-info',
    term: 'No Info (Circuit Status)',
    category: HelpCategory.STATUS,
    tier: 2,
    icon: 'help_outline',
    shortDescription: 'Circuit health status cannot be determined - monitoring may be disabled',
    detailedDescription: `"No Info" means we cannot determine if the circuit is working or not.

**Common reasons:**
• **Monitoring disabled** - Health checks turned off for this circuit
• **Recently installed** - Monitoring not yet configured
• **Equipment offline** - Monitoring device has lost connectivity
• **Configuration issue** - Monitoring not properly set up

**Does NOT mean:**
• The circuit is down (it might be working fine)
• There's definitely a problem
• The site is offline

**What to do:**
1. **Check if site is operational** - Can users work? Is site responding?
2. **Review monitoring config** - Is monitoring supposed to be enabled?
3. **Verify equipment** - Is the monitoring device online?
4. **Contact support** - If monitoring should be enabled but shows "No Info"

**When it's normal:**
• Customer-provided circuits (you manage the equipment)
• Backup circuits with monitoring disabled
• Legacy circuits being decommissioned`,
    examples: [
      'Customer-managed circuit = No Info (you monitor it yourself)',
      'New circuit installation = No Info (monitoring not configured yet)',
      'Monitoring device offline = No Info (circuit might be fine)'
    ],
    relatedTerms: ['circuit-health-down', 'monitoring', 'circuit']
  },

  // ========================================================================
  // TIER 3: HELPFUL TERMS (Less Critical)
  // ========================================================================

  {
    id: 'sla',
    term: 'SLA (Service Level Agreement)',
    category: HelpCategory.NETWORKING,
    tier: 3,
    icon: 'verified',
    shortDescription: 'Guaranteed service levels (uptime, response time) with financial penalties if not met',
    detailedDescription: `An SLA is a contract that guarantees specific service performance levels.

**Common guarantees:**
• **Uptime** - Network must be available 99.9% of the time
• **Latency** - Round-trip time must be <50ms
• **Packet Loss** - Must be <0.5%
• **Mean Time to Repair** - Issues fixed within X hours

**Example SLA:**
"Circuit will have 99.95% uptime per month. If uptime falls below this, customer receives service credits proportional to downtime."

**Why it matters:**
• Financial protection if service fails
• Guaranteed response times
• Clear performance expectations
• Provider accountability

**SLA Report:** Shows whether provider met their guarantees each month.`,
    examples: [
      '99.9% uptime = Maximum 43 minutes downtime per month',
      '4-hour MTTR = Carrier must fix issues within 4 hours'
    ],
    relatedTerms: ['uptime', 'performance', 'dia', 'mpls']
  },

  {
    id: 'noc',
    term: 'NOC (Network Operations Center)',
    category: HelpCategory.WORKFLOWS,
    tier: 3,
    icon: 'support_agent',
    shortDescription: '24/7 team that monitors your network and responds to issues',
    detailedDescription: `The NOC is your network's mission control - monitoring everything 24/7/365.

**What they do:**
• **Monitor** - Watch all circuits, sites, and applications
• **Alert** - Detect issues before you notice them
• **Respond** - Begin troubleshooting immediately
• **Escalate** - Contact carriers to fix issues
• **Communicate** - Keep you updated via tickets

**When NOC creates tickets:**
• Circuit goes down
• High packet loss detected
• Latency exceeds thresholds
• Application performance degrades
• Scheduled maintenance windows

**Ticket types:**
• **Incident** - Unexpected problem (circuit down)
• **Maintenance** - Planned work (upgrades, patches)
• **Request** - You asked for something (configuration change)`,
    examples: [
      'NOC detects circuit down at 2am, opens ticket and contacts carrier',
      'NOC sees high latency, troubleshoots and updates ticket with findings'
    ],
    relatedTerms: ['ticket', 'incident', 'maintenance']
  },

  {
    id: 'bundle-id',
    term: 'Bundle ID',
    category: HelpCategory.NETWORKING,
    tier: 3,
    icon: 'tag',
    shortDescription: 'Unique identifier for a circuit or group of circuits',
    detailedDescription: `Bundle ID is the reference number for your circuit.

**Format examples:**
• ESRI.VANC.0001
• MB095666
• CKT-12345

**What it's used for:**
• Opening support tickets
• Billing references
• Configuration identification
• Tracking in reports

**Bundle vs Circuit:**
• **Bundle** - May contain multiple physical circuits
• **Circuit** - Individual network connection

**Bundle Alias:** You can give bundles friendly names (like "Dallas HQ Primary") instead of remembering the Bundle ID.`,
    examples: [
      'Bundle ID: MB095666 → Bundle Alias: "Dallas Main Office"',
      'One bundle might contain: Primary circuit + Backup circuit'
    ],
    relatedTerms: ['circuit', 'site', 'alias']
  },

  {
    id: 'two-factor-auth',
    term: 'Two Factor Authentication (2FA)',
    category: HelpCategory.FEATURES,
    tier: 3,
    icon: 'security',
    shortDescription: 'Extra security requiring both password and temporary code from phone/app',
    detailedDescription: `2FA adds an extra layer of security beyond just your password.

**How it works:**
1. Enter your username and password (factor 1)
2. Enter a temporary code from your phone or app (factor 2)
3. Only then can you log in

**Why it's important:**
Even if someone steals your password, they can't log in without access to your phone or authentication app.

**Methods:**
• **SMS Text** - Code sent via text message
• **Authenticator App** - Google Authenticator, Microsoft Authenticator, etc.
• **Hardware Token** - Physical security key

**Best practice:** Enable 2FA for all admin users and anyone with access to sensitive data.`,
    examples: [
      'Login with password, then enter 6-digit code from Google Authenticator app',
      'Receive text message with code, enter it to complete login'
    ],
    relatedTerms: ['security', 'authentication', 'access']
  }
];

/**
 * Helper function to get help content by ID
 */
export function getHelpContent(id: string): HelpContent | undefined {
  return HELP_CONTENT_DATABASE.find(item => item.id === id);
}

/**
 * Helper function to get help content by category
 */
export function getHelpByCategory(category: HelpCategory): HelpContent[] {
  return HELP_CONTENT_DATABASE.filter(item => item.category === category);
}

/**
 * Helper function to get help content by tier
 */
export function getHelpByTier(tier: 1 | 2 | 3): HelpContent[] {
  return HELP_CONTENT_DATABASE.filter(item => item.tier === tier);
}

/**
 * Helper function to search help content
 */
export function searchHelpContent(query: string): HelpContent[] {
  const lowerQuery = query.toLowerCase();
  return HELP_CONTENT_DATABASE.filter(item =>
    item.term.toLowerCase().includes(lowerQuery) ||
    item.shortDescription.toLowerCase().includes(lowerQuery) ||
    item.detailedDescription.toLowerCase().includes(lowerQuery)
  );
}
