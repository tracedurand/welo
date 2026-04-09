const pool = require('../src/db');

async function initDb() {
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        tagline VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        business_size VARCHAR(50) NOT NULL,
        max_users VARCHAR(50) NOT NULL,
        throughput VARCHAR(50) NOT NULL,
        price VARCHAR(50) NOT NULL,
        features TEXT[] NOT NULL,
        category VARCHAR(50) NOT NULL,
        is_popular BOOLEAN DEFAULT FALSE,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const { rows } = await client.query('SELECT COUNT(*) FROM products');
    if (parseInt(rows[0].count) > 0) {
      console.log('Products table already has data. Skipping seed.');
      return;
    }

    const products = [
      {
        name: 'Welo Shield 100',
        slug: 'shield-100',
        tagline: 'Essential protection for small offices',
        description: 'Entry-level next-gen firewall designed for small offices and remote teams. Delivers enterprise-grade threat prevention with simple setup and management through Welo\'s cloud console.',
        business_size: 'Small Office',
        max_users: 'Up to 25',
        throughput: '500 Mbps',
        price: '$499/yr',
        features: ['Stateful packet inspection', 'Basic IPS/IDS', 'URL filtering', 'SSL/TLS inspection', 'Cloud management portal', 'Automatic firmware updates'],
        category: 'Edge Firewall',
        is_popular: false,
        sort_order: 1
      },
      {
        name: 'Welo Shield 250',
        slug: 'shield-250',
        tagline: 'Complete security for growing businesses',
        description: 'Mid-range firewall with advanced threat prevention, built for growing businesses that need robust security without complexity. Includes SD-WAN capabilities and application-aware traffic control.',
        business_size: 'Small Business',
        max_users: 'Up to 100',
        throughput: '1.5 Gbps',
        price: '$1,299/yr',
        features: ['Deep packet inspection', 'Advanced IPS/IDS', 'Application-layer filtering', 'SD-WAN integration', 'SSL/TLS inspection', 'VPN gateway (50 tunnels)', 'Sandboxing', 'Cloud management portal'],
        category: 'Edge Firewall',
        is_popular: true,
        sort_order: 2
      },
      {
        name: 'Welo Shield 500',
        slug: 'shield-500',
        tagline: 'High-performance firewall for mid-market',
        description: 'High-throughput next-gen firewall for mid-size organizations requiring advanced threat intelligence and automated response. Features AI-powered anomaly detection and full SIEM integration.',
        business_size: 'Mid-Market',
        max_users: 'Up to 500',
        throughput: '5 Gbps',
        price: '$3,999/yr',
        features: ['AI-powered threat detection', 'Advanced IPS/IDS', 'Application-layer filtering', 'SD-WAN with traffic optimization', 'SSL/TLS deep inspection', 'VPN gateway (200 tunnels)', 'Sandboxing with ML analysis', 'SIEM integration', 'Geo-IP blocking', 'DDoS mitigation'],
        category: 'Edge Firewall',
        is_popular: false,
        sort_order: 3
      },
      {
        name: 'Welo Fortress 1000',
        slug: 'fortress-1000',
        tagline: 'Enterprise-grade perimeter defense',
        description: 'Enterprise next-gen firewall with carrier-grade throughput and full-spectrum threat prevention. Purpose-built for organizations with complex network architectures and stringent compliance requirements.',
        business_size: 'Enterprise',
        max_users: 'Up to 5,000',
        throughput: '20 Gbps',
        price: '$12,499/yr',
        features: ['AI/ML threat engine', 'Zero-day exploit prevention', 'Encrypted traffic analysis', 'Micro-segmentation', 'Full SD-WAN suite', 'VPN gateway (unlimited)', 'Advanced sandboxing', 'SIEM/SOAR integration', 'Compliance reporting (SOC2, HIPAA, PCI)', 'HA clustering', 'API-driven policy management', '24/7 threat monitoring'],
        category: 'Enterprise Firewall',
        is_popular: true,
        sort_order: 4
      },
      {
        name: 'Welo Fortress 5000',
        slug: 'fortress-5000',
        tagline: 'Maximum performance for large enterprises',
        description: 'Our highest-performance hardware firewall for large enterprises and data centers. Delivers line-rate inspection at massive scale with sub-millisecond latency and full redundancy.',
        business_size: 'Large Enterprise',
        max_users: 'Unlimited',
        throughput: '100 Gbps',
        price: '$49,999/yr',
        features: ['Hardware-accelerated inspection', 'AI/ML threat engine with custom models', 'Zero-day and APT prevention', 'Full encrypted traffic analysis', 'Network micro-segmentation', 'Global SD-WAN orchestration', 'Dedicated threat analyst support', 'Custom integration APIs', 'Multi-tenant management', 'HA active-active clustering', 'FedRAMP ready', 'Dedicated customer success manager'],
        category: 'Enterprise Firewall',
        is_popular: false,
        sort_order: 5
      },
      {
        name: 'Welo CloudGuard',
        slug: 'cloudguard',
        tagline: 'Cloud-native firewall for AWS, Azure & GCP',
        description: 'Virtual next-gen firewall purpose-built for public cloud environments. Deploy consistent security policies across multi-cloud architectures with auto-scaling and infrastructure-as-code support.',
        business_size: 'Any Size',
        max_users: 'Per workload',
        throughput: 'Auto-scaling',
        price: 'From $799/mo',
        features: ['Cloud-native architecture', 'Auto-scaling with demand', 'Multi-cloud support (AWS, Azure, GCP)', 'Infrastructure-as-code (Terraform)', 'Container and Kubernetes protection', 'East-west traffic inspection', 'Cloud workload segmentation', 'API security gateway', 'Cloud SIEM integration', 'Real-time compliance monitoring'],
        category: 'Cloud Firewall',
        is_popular: true,
        sort_order: 6
      },
      {
        name: 'Welo CloudGuard Enterprise',
        slug: 'cloudguard-enterprise',
        tagline: 'Advanced multi-cloud security platform',
        description: 'Full-featured cloud security platform combining NGFW, WAF, and CSPM capabilities. Provides unified visibility and policy management across hybrid and multi-cloud environments.',
        business_size: 'Enterprise',
        max_users: 'Unlimited',
        throughput: 'Auto-scaling',
        price: 'Custom pricing',
        features: ['Unified multi-cloud console', 'NGFW + WAF + CSPM combined', 'Serverless function protection', 'CI/CD pipeline security scanning', 'Cloud identity governance', 'Advanced API protection', 'Cloud DLP', 'Custom threat intelligence feeds', 'SOC2/HIPAA/PCI automation', 'Dedicated cloud security architect'],
        category: 'Cloud Firewall',
        is_popular: false,
        sort_order: 7
      },
      {
        name: 'Welo WebShield',
        slug: 'webshield',
        tagline: 'Web application firewall for modern apps',
        description: 'AI-powered web application firewall that protects websites, APIs, and web applications from OWASP Top 10 attacks, bot abuse, and credential stuffing with near-zero false positives.',
        business_size: 'Any Size',
        max_users: 'Per application',
        throughput: 'Edge-delivered',
        price: 'From $299/mo',
        features: ['OWASP Top 10 protection', 'Bot management & detection', 'API protection & rate limiting', 'Credential stuffing prevention', 'DDoS protection (L3-L7)', 'Custom security rules engine', 'Real-time analytics dashboard', 'CDN integration', 'Virtual patching', 'PCI DSS compliant'],
        category: 'Web Application Firewall',
        is_popular: false,
        sort_order: 8
      },
      {
        name: 'Welo WebShield Pro',
        slug: 'webshield-pro',
        tagline: 'Enterprise WAF with advanced bot protection',
        description: 'Enterprise-grade WAF with advanced behavioral analysis, machine learning-based bot detection, and full API lifecycle security. Designed for organizations with complex web application portfolios.',
        business_size: 'Enterprise',
        max_users: 'Unlimited apps',
        throughput: 'Edge-delivered',
        price: 'From $1,499/mo',
        features: ['Advanced behavioral analysis', 'ML-based bot detection', 'Full API lifecycle security', 'GraphQL & gRPC protection', 'Account takeover prevention', 'Client-side protection', 'Advanced DDoS mitigation', 'Managed ruleset with auto-tuning', 'Multi-CDN support', 'Custom threat intelligence', 'SLA-backed uptime guarantee', 'Dedicated WAF engineer'],
        category: 'Web Application Firewall',
        is_popular: false,
        sort_order: 9
      },
      {
        name: 'Welo NetSentry',
        slug: 'netsentry',
        tagline: 'Internal network segmentation firewall',
        description: 'East-west traffic firewall for internal network segmentation. Prevents lateral movement by applying Zero Trust principles inside your network perimeter with microsegmentation.',
        business_size: 'Mid-Market to Enterprise',
        max_users: 'Per segment',
        throughput: '10 Gbps',
        price: '$5,999/yr',
        features: ['Internal traffic inspection', 'Zero Trust microsegmentation', 'Lateral movement prevention', 'User and device identity policies', 'Application dependency mapping', 'Automated policy recommendation', 'Integration with NAC systems', 'Compliance zone enforcement', 'Visual network topology', 'Behavioral anomaly detection'],
        category: 'Internal Segmentation',
        is_popular: false,
        sort_order: 10
      },
      {
        name: 'Welo Shield Remote',
        slug: 'shield-remote',
        tagline: 'Secure remote access for distributed teams',
        description: 'Cloud-delivered firewall-as-a-service that extends full network security to remote and hybrid workers. Replaces traditional VPNs with ZTNA and ensures every connection is inspected and authorized.',
        business_size: 'Any Size',
        max_users: 'Per user',
        throughput: 'Cloud-delivered',
        price: '$8/user/mo',
        features: ['Zero Trust Network Access (ZTNA)', 'Always-on cloud firewall', 'Split tunneling controls', 'Device posture assessment', 'SaaS application control', 'DNS security', 'Browser isolation', 'Data loss prevention', 'Per-user analytics', 'SSO/MFA integration'],
        category: 'Firewall as a Service',
        is_popular: true,
        sort_order: 11
      }
    ];

    for (const p of products) {
      await client.query(
        `INSERT INTO products (name, slug, tagline, description, business_size, max_users, throughput, price, features, category, is_popular, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [p.name, p.slug, p.tagline, p.description, p.business_size, p.max_users, p.throughput, p.price, p.features, p.category, p.is_popular, p.sort_order]
      );
    }

    console.log(`Seeded ${products.length} products.`);
  } finally {
    client.release();
    await pool.end();
  }
}

initDb().catch(err => {
  console.error('DB init failed:', err);
  process.exit(1);
});
