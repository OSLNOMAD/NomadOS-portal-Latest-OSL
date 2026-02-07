export interface PlanChangeOption {
  planId: string;
  price: number;
  type: 'upgrade' | 'downgrade';
}

export interface PlanChangeRule {
  currentPlanId: string;
  currentPrice: number;
  options: PlanChangeOption[];
}

export interface PlanDescription {
  headline: string;
  bullets: string[];
  upgradeNudge: string;
  downgradeWarning: string;
}

export const PLAN_DESCRIPTIONS: Record<string, PlanDescription> = {
  'UNLIMITED-RESIDENTIAL-PLAN-USD-Monthly': {
    headline: 'Unlimited Residential Plan',
    bullets: [
      'Built for stable home use with consistent performance',
      'Reliable streaming, remote work, and daily browsing',
      'Supports multiple connected devices simultaneously',
    ],
    upgradeNudge: 'Upgrade to the Travel Plan for maximum flexibility and fewer restrictions wherever you use your service.',
    downgradeWarning: 'Downgrading means giving up performance reliability and suitability for heavier or multi-device usage.',
  },
  'Nomad-Unlimited-Travel-Plan-01-USD-Monthly': {
    headline: 'Nomad Unlimited Travel Plan',
    bullets: [
      'Maximum flexibility and fewer restrictions wherever you go',
      'Supports higher usage demands and changing locations',
      'Best-in-class reliability for work and streaming on the move',
    ],
    upgradeNudge: '',
    downgradeWarning: 'Downgrading to a residential plan limits where and how you can use your connection.',
  },
  'Nomad-Unlimited-Lite-Plan-USD-Monthly': {
    headline: 'Nomad Unlimited Lite Plan',
    bullets: [
      'Best for light users with minimal streaming needs',
      'Basic connectivity for browsing and email',
    ],
    upgradeNudge: 'Upgrade for stronger performance and better support for work, streaming, and multiple devices.',
    downgradeWarning: '',
  },
  'Nomad-Unlimited-Lite-Plan-01-USD-Monthly': {
    headline: 'Nomad Unlimited Lite Plan',
    bullets: [
      'Best for light users with minimal streaming needs',
      'Basic connectivity for browsing and email',
    ],
    upgradeNudge: 'Upgrade for stronger performance and better support for work, streaming, and multiple devices.',
    downgradeWarning: '',
  },
  'Nomad-Rural-Unlimited-100-MBPS-11995-USD-Monthly': {
    headline: 'Nomad Rural Unlimited 100 Mbps',
    bullets: [
      'Built for rural locations needing dependable speeds',
      'Supports everyday streaming and online activity',
    ],
    upgradeNudge: 'Upgrade to the Travel Plan for more flexibility and fewer usage constraints as your needs grow.',
    downgradeWarning: 'Downgrading reduces performance headroom and may impact streaming or remote work reliability.',
  },
  'Nomad-Rural-Unlimited-100-Mbps-9995-USD-Monthly': {
    headline: 'Nomad Rural Unlimited 100 Mbps',
    bullets: [
      'Built for rural locations needing dependable speeds',
      'Supports everyday streaming and online activity',
    ],
    upgradeNudge: 'Upgrade to the Travel Plan for more flexibility and fewer usage constraints as your needs grow.',
    downgradeWarning: '',
  },
  'Nomad-Rural-Unlimited-100-Mbps-9995-Upfront-USD-Monthly': {
    headline: 'Nomad Rural Unlimited 100 Mbps',
    bullets: [
      'Built for rural locations needing dependable speeds',
      'Supports everyday streaming and online activity',
    ],
    upgradeNudge: 'Upgrade to the Travel Plan for more flexibility and fewer usage constraints as your needs grow.',
    downgradeWarning: '',
  },
  'Nomad-Rural-Unlimited-100-Mbps-Oasis-USD-Monthly': {
    headline: 'Nomad Rural Unlimited 100 Mbps Oasis',
    bullets: [
      'Built for rural locations needing dependable speeds',
      'Supports everyday streaming and online activity',
    ],
    upgradeNudge: 'Upgrade to the Travel Plan for more flexibility and fewer usage constraints as your needs grow.',
    downgradeWarning: '',
  },
  'Nomad-Rural-Unlimited-Ultra-200-Mbps-14995-USD-Monthly': {
    headline: 'Nomad Rural Unlimited Ultra 200 Mbps',
    bullets: [
      'Designed for high-demand households with fast speeds',
      'Supports heavy streaming, gaming, and multiple devices',
      'Consistent performance even during peak usage',
    ],
    upgradeNudge: '',
    downgradeWarning: 'Downgrading sacrifices speed capacity and can affect performance during peak usage.',
  },
  'Nomad-Rural-Unlimited-Ultra-200-Mbps-12995-USD-Monthly': {
    headline: 'Nomad Rural Unlimited Ultra 200 Mbps',
    bullets: [
      'Designed for high-demand households with fast speeds',
      'Supports heavy streaming, gaming, and multiple devices',
    ],
    upgradeNudge: '',
    downgradeWarning: 'Downgrading sacrifices speed capacity and can affect performance during peak usage.',
  },
  'Nomad-Rural-Unlimited-Ultra-200-Mbps-16995-USD-Monthly': {
    headline: 'Nomad Rural Unlimited Ultra 200 Mbps',
    bullets: [
      'Designed for high-demand households with fast speeds',
      'Supports heavy streaming, gaming, and multiple devices',
      'Consistent performance even during peak usage',
    ],
    upgradeNudge: '',
    downgradeWarning: 'Downgrading sacrifices speed capacity and can affect performance during peak usage.',
  },
  'Nomad-Rural-Unlimited-Ultra-200-Mbps-Oasis-USD-Monthly': {
    headline: 'Nomad Rural Unlimited Ultra 200 Mbps Oasis',
    bullets: [
      'Designed for high-demand households with fast speeds',
      'Supports heavy streaming, gaming, and multiple devices',
    ],
    upgradeNudge: '',
    downgradeWarning: 'Downgrading sacrifices speed capacity and can affect performance during peak usage.',
  },
  'Nomad-Unlimited-Power-Plan-USD-Monthly': {
    headline: 'Nomad Unlimited Power Plan',
    bullets: [
      'Built for power users needing stable, high-performance connectivity',
      'Fewer interruptions for demanding use cases',
    ],
    upgradeNudge: '',
    downgradeWarning: 'Downgrading may introduce slower speeds and reduced reliability for demanding use cases.',
  },
  'Nomad-Unlimited-Power-Plan-9995-USD-Monthly': {
    headline: 'Nomad Unlimited Power Plan',
    bullets: [
      'Built for power users needing stable, high-performance connectivity',
      'Fewer interruptions for demanding use cases',
    ],
    upgradeNudge: 'Upgrade improves flexibility and reduces limitations as usage increases.',
    downgradeWarning: '',
  },
  'Truck-Freedom-USD-Monthly': {
    headline: 'Truck Freedom Plan',
    bullets: [
      'Designed for on-the-road connectivity needs',
      'Reliable coverage for mobile and travel use cases',
    ],
    upgradeNudge: 'Upgrade to the Travel Plan for maximum flexibility and fewer restrictions.',
    downgradeWarning: '',
  },
  'Everywhere-Unlimited-Residential-USD-Monthly': {
    headline: 'Everywhere Unlimited Residential',
    bullets: [
      'Reliable home internet with broad coverage',
      'Supports streaming, browsing, and remote work',
    ],
    upgradeNudge: 'Upgrade to the Travel Plan for maximum flexibility wherever you go.',
    downgradeWarning: '',
  },
  'Influencer-Kit-Program-USD-Monthly': {
    headline: 'Influencer Kit Program',
    bullets: [
      'Special program plan with basic connectivity',
    ],
    upgradeNudge: 'Upgrade to an Unlimited or Travel Plan for a full-featured experience with fewer restrictions.',
    downgradeWarning: '',
  },
  'Nomad-Dragon-Service-USD-Monthly': {
    headline: 'Nomad Dragon Service',
    bullets: [
      'Entry-level plan for basic connectivity needs',
    ],
    upgradeNudge: 'Upgrade to unlock stronger performance and support for streaming and multiple devices.',
    downgradeWarning: '',
  },
  'Nomad-Dragon-Service-Plan-USD-Monthly': {
    headline: 'Nomad Dragon Service Plan',
    bullets: [
      'Reliable connectivity for everyday use',
      'Supports standard browsing and streaming',
    ],
    upgradeNudge: 'Upgrade to the Travel Plan for maximum flexibility and fewer restrictions.',
    downgradeWarning: '',
  },
  'nomad-unlimited-home-USD-Monthly': {
    headline: 'Nomad Unlimited Home',
    bullets: [
      'Designed for consistent home internet usage',
      'Supports streaming and remote work',
    ],
    upgradeNudge: 'Upgrade to the Travel Plan for added flexibility with just a small increase.',
    downgradeWarning: '',
  },
  'Nomad-300GB-Rural-Plan-USD-Monthly': {
    headline: 'Nomad 300GB Rural Plan',
    bullets: [
      'Rural plan with 300GB data allocation',
      'Good for moderate usage households',
    ],
    upgradeNudge: 'Upgrade to an Unlimited plan to remove data limits and unlock full performance.',
    downgradeWarning: '',
  },
  'Nomad-Unlimited-Travel-119-USD-Monthly': {
    headline: 'Nomad Unlimited Travel',
    bullets: [
      'Flexible travel plan with solid coverage',
      'Supports changing locations and mobile use',
    ],
    upgradeNudge: '',
    downgradeWarning: 'Downgrading limits flexibility and may reduce coverage options.',
  },
  'Nomad-Unlimited-Lite-Plan-Paid-Upfront-USD-Monthly': {
    headline: 'Nomad Unlimited Lite Plan',
    bullets: [
      'Best for light users with minimal streaming needs',
      'Basic connectivity for browsing and email',
    ],
    upgradeNudge: 'Upgrade for stronger performance and better support for work, streaming, and multiple devices.',
    downgradeWarning: '',
  },
  'Nomad-Unlimited-Residential-Plan-Modem-USD-Monthly': {
    headline: 'Nomad Unlimited Residential Plan (Modem)',
    bullets: [
      'Stable home internet with modem hardware included',
      'Supports streaming, browsing, and remote work',
    ],
    upgradeNudge: 'Upgrade to the Travel Plan for maximum flexibility and fewer restrictions.',
    downgradeWarning: '',
  },
  'Unlimited-Fixed-Wireless-Access-Business-Internet-100Mbps-Plan-USD-Monthly': {
    headline: 'Fixed Wireless Business Internet 100 Mbps',
    bullets: [
      'Business-grade connectivity with consistent uptime',
      'Designed for professional workflows and operations',
    ],
    upgradeNudge: 'Upgrade for fewer limitations and better support for demanding business workflows.',
    downgradeWarning: '',
  },
  'Unlimited-Fixed-Wireless-Access-Business-Internet-200Mbps-USD-Monthly': {
    headline: 'Fixed Wireless Business Internet 200 Mbps',
    bullets: [
      'High-speed business-grade connectivity',
      'Designed for demanding professional operations',
    ],
    upgradeNudge: '',
    downgradeWarning: 'Downgrading may reduce reliability and is not recommended for critical business operations.',
  },
  'Nomad-SIM-Only-Unlimited-100-Mbps-USD-Monthly': {
    headline: 'Nomad SIM-Only Unlimited 100 Mbps',
    bullets: [
      'SIM-only plan for BYOD setups',
      'Supports standard usage across compatible devices',
    ],
    upgradeNudge: 'Upgrade to the Travel Plan to remove restrictions and improve overall experience.',
    downgradeWarning: '',
  },
  'Nomad-Internet-Unlimited-5G-PRIME-Plan-USD-Monthly': {
    headline: 'Nomad Unlimited 5G Prime',
    bullets: [
      'Premium 5G access with highest performance tier',
      'Optimized for heavy usage and demanding applications',
    ],
    upgradeNudge: '',
    downgradeWarning: 'Downgrading may limit network access and reduce overall performance consistency.',
  },
  'Nomad-Internet-Unlimited-5G-PLUS-Plan-99-USD-Monthly': {
    headline: 'Nomad Unlimited 5G Plus',
    bullets: [
      'Enhanced 5G access for stronger network performance',
      'Supports streaming, gaming, and heavy usage',
    ],
    upgradeNudge: 'Upgrade to the Travel Plan for increased flexibility across more environments.',
    downgradeWarning: '',
  },
  'Nomad-Internet-Unlimited-5G-PLUS-Plan-149-USD-Monthly': {
    headline: 'Nomad Unlimited 5G Plus',
    bullets: [
      'Enhanced 5G access with premium tier performance',
      'Supports the most demanding usage scenarios',
    ],
    upgradeNudge: '',
    downgradeWarning: 'Downgrading may limit 5G network access and reduce performance.',
  },
  'Nomad-Unlimited-Base-Residential-USD-Monthly': {
    headline: 'Nomad Unlimited Base Residential',
    bullets: [
      'Reliable home internet for everyday use',
      'Supports streaming, browsing, and remote work',
    ],
    upgradeNudge: 'Upgrade to the Travel Plan for maximum flexibility wherever you go.',
    downgradeWarning: '',
  },
  'Nomad-Cube-Plan-USD-Monthly': {
    headline: 'Nomad Cube Plan',
    bullets: [
      'Compact connectivity solution for home use',
      'Easy setup with reliable performance',
    ],
    upgradeNudge: 'Upgrade to the Travel Plan for added flexibility and fewer restrictions.',
    downgradeWarning: '',
  },
  'Nomad-Residential-5G-USD-Monthly': {
    headline: 'Nomad Residential 5G',
    bullets: [
      '5G-powered residential connectivity',
      'Fast speeds where 5G coverage is available',
    ],
    upgradeNudge: 'Upgrade to the Travel Plan for maximum flexibility and usage across more locations.',
    downgradeWarning: '',
  },
  'Nomad-Power-Plan-Promotional-First-Month-USD-Monthly': {
    headline: 'Nomad Power Plan (Promotional)',
    bullets: [
      'Promotional entry into high-performance connectivity',
      'Experience power-level service at a reduced rate',
    ],
    upgradeNudge: 'Upgrade to lock in full Unlimited or Travel Plan benefits with no promotional limitations.',
    downgradeWarning: '',
  },
  'Nomad-Unlimited-Travel-Plan-USD-Monthly': {
    headline: 'Nomad Unlimited Travel',
    bullets: [
      'Flexible travel plan with solid coverage',
      'Supports changing locations and mobile use',
    ],
    upgradeNudge: 'Upgrade to the latest Travel Plan for the best flexibility and performance.',
    downgradeWarning: '',
  },
  'Nomad-Unlimited-Residential-Plan-USD-Monthly': {
    headline: 'Nomad Unlimited Residential',
    bullets: [
      'Reliable home internet with consistent performance',
      'Great for streaming, work, and daily browsing',
    ],
    upgradeNudge: 'Upgrade to the Travel Plan for maximum flexibility wherever you go.',
    downgradeWarning: '',
  },
  'Nomad-Unlimited-Travel-Plan-Paid-Upfront-USD-Monthly': {
    headline: 'Nomad Unlimited Travel Plan',
    bullets: [
      'Maximum flexibility and fewer restrictions wherever you go',
      'Supports higher usage demands and changing locations',
    ],
    upgradeNudge: '',
    downgradeWarning: 'Downgrading to a residential plan limits where and how you can use your connection.',
  },
  'Unlimited-Residential-Plan-Paid-Upfront-USD-Monthly': {
    headline: 'Unlimited Residential Plan',
    bullets: [
      'Stable home use with consistent performance',
      'Supports streaming, work, and daily browsing',
    ],
    upgradeNudge: 'Upgrade to the Travel Plan for maximum flexibility and fewer restrictions.',
    downgradeWarning: '',
  },
  'UNLIMITED-TRAVEL-PLAN-PROMO-USD-Monthly': {
    headline: 'Unlimited Travel Plan (Promo)',
    bullets: [
      'Promotional travel plan at a reduced rate',
    ],
    upgradeNudge: 'Upgrade to a full Unlimited or Travel Plan to remove promotional limitations.',
    downgradeWarning: '',
  },
  'Nomad-Business-USD-Monthly': {
    headline: 'Nomad Business Plan',
    bullets: [
      'Professional and business-grade connectivity',
      'Consistent uptime for critical operations',
    ],
    upgradeNudge: '',
    downgradeWarning: 'Downgrading may reduce reliability and is not recommended for critical business operations.',
  },
  'Nomad-Residential-USD-Monthly': {
    headline: 'Nomad Residential',
    bullets: [
      'Reliable residential internet with solid coverage',
      'Supports everyday streaming and online activity',
    ],
    upgradeNudge: 'Upgrade to the Travel Plan for maximum flexibility and fewer restrictions.',
    downgradeWarning: '',
  },
  'Nomad-Unlimited-Light-Plan-Modem-USD-Monthly': {
    headline: 'Nomad Unlimited Light Plan (Modem)',
    bullets: [
      'Light usage plan with modem hardware included',
      'Basic connectivity for browsing and email',
    ],
    upgradeNudge: 'Upgrade for stronger performance and better support for streaming and multiple devices.',
    downgradeWarning: '',
  },
  'Nomad-Residential-4G-Plan-USD-Monthly': {
    headline: 'Nomad Residential 4G',
    bullets: [
      '4G residential connectivity for everyday use',
      'Reliable coverage for standard browsing and streaming',
    ],
    upgradeNudge: 'Upgrade to the Travel Plan for faster speeds and maximum flexibility.',
    downgradeWarning: '',
  },
  'Nomad-Unlimited-Ultra-Raptor-Plan-USD-Monthly': {
    headline: 'Nomad Unlimited Ultra Raptor',
    bullets: [
      'Premium tier with ultra-high performance',
      'Built for the most demanding usage scenarios',
    ],
    upgradeNudge: '',
    downgradeWarning: 'Downgrading sacrifices premium speed capacity and may noticeably affect performance.',
  },
  'Nomad-Rural-Power-Plan-checkout-Upfront-USD-Monthly': {
    headline: 'Nomad Rural Power Plan',
    bullets: [
      'High-performance plan for rural power users',
      'Stable connectivity for demanding use cases',
    ],
    upgradeNudge: '',
    downgradeWarning: 'Downgrading may introduce slower speeds and reduced reliability for demanding use cases.',
  },
  'Nomad-Unlimited-Power-Plan-30-First-Month-25-Gift-Card-USD-Monthly': {
    headline: 'Nomad Unlimited Power Plan (Promotional)',
    bullets: [
      'Promotional entry into high-performance connectivity',
      'Experience power-level service at a special rate',
    ],
    upgradeNudge: 'Upgrade to lock in full Unlimited or Travel Plan benefits.',
    downgradeWarning: '',
  },
  'Bring-Your-Own-Device-USD-Monthly': {
    headline: 'Bring Your Own Device',
    bullets: [
      'Flexible BYOD plan for compatible hardware',
      'SIM-based connectivity for your existing device',
    ],
    upgradeNudge: '',
    downgradeWarning: 'Downgrading removes BYOD flexibility and may limit device compatibility.',
  },
  'Verizon-Red-Dragon-TBYB-USD-Monthly': {
    headline: 'Verizon Red Dragon TBYB',
    bullets: [
      'Specialty plan with Verizon network access',
      'Designed for specific coverage requirements',
    ],
    upgradeNudge: 'Upgrade to the Travel Plan for broader flexibility and fewer usage constraints.',
    downgradeWarning: '',
  },
};

export function getPlanDescription(planId: string): PlanDescription | null {
  return PLAN_DESCRIPTIONS[planId] || null;
}

export const PLAN_CHANGE_RULES: Record<string, PlanChangeRule> = {
  'UNLIMITED-RESIDENTIAL-PLAN-USD-Monthly': {
    currentPlanId: 'UNLIMITED-RESIDENTIAL-PLAN-USD-Monthly',
    currentPrice: 99.95,
    options: [
      { planId: 'Nomad-Unlimited-Travel-Plan-01-USD-Monthly', price: 129.95, type: 'upgrade' },
    ],
  },
  'Nomad-Unlimited-Travel-Plan-01-USD-Monthly': {
    currentPlanId: 'Nomad-Unlimited-Travel-Plan-01-USD-Monthly',
    currentPrice: 129.95,
    options: [
      { planId: 'UNLIMITED-RESIDENTIAL-PLAN-USD-Monthly', price: 99.95, type: 'downgrade' },
    ],
  },
  'Nomad-Rural-Unlimited-100-MBPS-11995-USD-Monthly': {
    currentPlanId: 'Nomad-Rural-Unlimited-100-MBPS-11995-USD-Monthly',
    currentPrice: 119.95,
    options: [
      { planId: 'Nomad-Unlimited-Travel-Plan-01-USD-Monthly', price: 129.95, type: 'upgrade' },
    ],
  },
  'Truck-Freedom-USD-Monthly': {
    currentPlanId: 'Truck-Freedom-USD-Monthly',
    currentPrice: 119.95,
    options: [
      { planId: 'Nomad-Unlimited-Travel-Plan-01-USD-Monthly', price: 129.95, type: 'upgrade' },
    ],
  },
  'Nomad-Rural-Unlimited-Ultra-200-Mbps-14995-USD-Monthly': {
    currentPlanId: 'Nomad-Rural-Unlimited-Ultra-200-Mbps-14995-USD-Monthly',
    currentPrice: 149.95,
    options: [
      { planId: 'UNLIMITED-RESIDENTIAL-PLAN-USD-Monthly', price: 99.95, type: 'downgrade' },
      { planId: 'Nomad-Unlimited-Travel-Plan-01-USD-Monthly', price: 129.95, type: 'downgrade' },
    ],
  },
  'Nomad-Rural-Unlimited-Ultra-200-Mbps-12995-USD-Monthly': {
    currentPlanId: 'Nomad-Rural-Unlimited-Ultra-200-Mbps-12995-USD-Monthly',
    currentPrice: 129.95,
    options: [
      { planId: 'UNLIMITED-RESIDENTIAL-PLAN-USD-Monthly', price: 99.95, type: 'downgrade' },
    ],
  },
  'Nomad-Unlimited-Lite-Plan-USD-Monthly': {
    currentPlanId: 'Nomad-Unlimited-Lite-Plan-USD-Monthly',
    currentPrice: 59.95,
    options: [
      { planId: 'UNLIMITED-RESIDENTIAL-PLAN-USD-Monthly', price: 99.95, type: 'upgrade' },
      { planId: 'Nomad-Unlimited-Travel-Plan-01-USD-Monthly', price: 129.95, type: 'upgrade' },
    ],
  },
  'Everywhere-Unlimited-Residential-USD-Monthly': {
    currentPlanId: 'Everywhere-Unlimited-Residential-USD-Monthly',
    currentPrice: 99.95,
    options: [
      { planId: 'Nomad-Unlimited-Travel-Plan-01-USD-Monthly', price: 129.95, type: 'upgrade' },
    ],
  },
  'Influencer-Kit-Program-USD-Monthly': {
    currentPlanId: 'Influencer-Kit-Program-USD-Monthly',
    currentPrice: 0,
    options: [
      { planId: 'UNLIMITED-RESIDENTIAL-PLAN-USD-Monthly', price: 99.95, type: 'upgrade' },
      { planId: 'Nomad-Unlimited-Travel-Plan-01-USD-Monthly', price: 129.95, type: 'upgrade' },
    ],
  },
  'Nomad-Unlimited-Lite-Plan-01-USD-Monthly': {
    currentPlanId: 'Nomad-Unlimited-Lite-Plan-01-USD-Monthly',
    currentPrice: 59.95,
    options: [
      { planId: 'UNLIMITED-RESIDENTIAL-PLAN-USD-Monthly', price: 99.95, type: 'upgrade' },
      { planId: 'Nomad-Unlimited-Travel-Plan-01-USD-Monthly', price: 129.95, type: 'upgrade' },
    ],
  },
  'Nomad-Dragon-Service-USD-Monthly': {
    currentPlanId: 'Nomad-Dragon-Service-USD-Monthly',
    currentPrice: 29.95,
    options: [
      { planId: 'UNLIMITED-RESIDENTIAL-PLAN-USD-Monthly', price: 99.95, type: 'upgrade' },
      { planId: 'Nomad-Unlimited-Travel-Plan-01-USD-Monthly', price: 129.95, type: 'upgrade' },
    ],
  },
  'Nomad-Unlimited-Power-Plan-USD-Monthly': {
    currentPlanId: 'Nomad-Unlimited-Power-Plan-USD-Monthly',
    currentPrice: 149.95,
    options: [
      { planId: 'UNLIMITED-RESIDENTIAL-PLAN-USD-Monthly', price: 99.95, type: 'downgrade' },
      { planId: 'Nomad-Unlimited-Travel-Plan-01-USD-Monthly', price: 129.95, type: 'downgrade' },
    ],
  },
  'Nomad-Rural-Unlimited-Ultra-200-Mbps-16995-USD-Monthly': {
    currentPlanId: 'Nomad-Rural-Unlimited-Ultra-200-Mbps-16995-USD-Monthly',
    currentPrice: 169.95,
    options: [
      { planId: 'UNLIMITED-RESIDENTIAL-PLAN-USD-Monthly', price: 99.95, type: 'downgrade' },
      { planId: 'Nomad-Unlimited-Travel-Plan-01-USD-Monthly', price: 129.95, type: 'downgrade' },
    ],
  },
  'Nomad-Unlimited-Power-Plan-9995-USD-Monthly': {
    currentPlanId: 'Nomad-Unlimited-Power-Plan-9995-USD-Monthly',
    currentPrice: 99.95,
    options: [
      { planId: 'Nomad-Unlimited-Travel-Plan-01-USD-Monthly', price: 129.95, type: 'upgrade' },
    ],
  },
  'Nomad-Rural-Unlimited-100-Mbps-9995-Upfront-USD-Monthly': {
    currentPlanId: 'Nomad-Rural-Unlimited-100-Mbps-9995-Upfront-USD-Monthly',
    currentPrice: 99.95,
    options: [
      { planId: 'Nomad-Unlimited-Travel-Plan-01-USD-Monthly', price: 129.95, type: 'upgrade' },
    ],
  },
  'Verizon-Red-Dragon-TBYB-USD-Monthly': {
    currentPlanId: 'Verizon-Red-Dragon-TBYB-USD-Monthly',
    currentPrice: 99,
    options: [
      { planId: 'Nomad-Unlimited-Travel-Plan-01-USD-Monthly', price: 129.95, type: 'upgrade' },
    ],
  },
  'Nomad-Rural-Unlimited-100-Mbps-9995-USD-Monthly': {
    currentPlanId: 'Nomad-Rural-Unlimited-100-Mbps-9995-USD-Monthly',
    currentPrice: 99.95,
    options: [
      { planId: 'Nomad-Unlimited-Travel-Plan-01-USD-Monthly', price: 129.95, type: 'upgrade' },
    ],
  },
  'Nomad-Rural-Unlimited-Ultra-200-Mbps-Oasis-USD-Monthly': {
    currentPlanId: 'Nomad-Rural-Unlimited-Ultra-200-Mbps-Oasis-USD-Monthly',
    currentPrice: 149.95,
    options: [
      { planId: 'UNLIMITED-RESIDENTIAL-PLAN-USD-Monthly', price: 99.95, type: 'downgrade' },
      { planId: 'Nomad-Unlimited-Travel-Plan-01-USD-Monthly', price: 129.95, type: 'downgrade' },
    ],
  },
  'Nomad-Rural-Unlimited-100-Mbps-Oasis-USD-Monthly': {
    currentPlanId: 'Nomad-Rural-Unlimited-100-Mbps-Oasis-USD-Monthly',
    currentPrice: 99.95,
    options: [
      { planId: 'Nomad-Unlimited-Travel-Plan-01-USD-Monthly', price: 129.95, type: 'upgrade' },
    ],
  },
  'Nomad-Residential-5G-USD-Monthly': {
    currentPlanId: 'Nomad-Residential-5G-USD-Monthly',
    currentPrice: 109,
    options: [
      { planId: 'Nomad-Unlimited-Travel-Plan-01-USD-Monthly', price: 129.95, type: 'upgrade' },
    ],
  },
  'Nomad-Internet-Unlimited-5G-PLUS-Plan-99-USD-Monthly': {
    currentPlanId: 'Nomad-Internet-Unlimited-5G-PLUS-Plan-99-USD-Monthly',
    currentPrice: 99,
    options: [
      { planId: 'Nomad-Unlimited-Travel-Plan-01-USD-Monthly', price: 129.95, type: 'upgrade' },
    ],
  },
  'nomad-unlimited-home-USD-Monthly': {
    currentPlanId: 'nomad-unlimited-home-USD-Monthly',
    currentPrice: 119.95,
    options: [
      { planId: 'Nomad-Unlimited-Travel-Plan-01-USD-Monthly', price: 129.95, type: 'upgrade' },
    ],
  },
  'Nomad-300GB-Rural-Plan-USD-Monthly': {
    currentPlanId: 'Nomad-300GB-Rural-Plan-USD-Monthly',
    currentPrice: 79.95,
    options: [
      { planId: 'UNLIMITED-RESIDENTIAL-PLAN-USD-Monthly', price: 99.95, type: 'upgrade' },
      { planId: 'Nomad-Unlimited-Travel-Plan-01-USD-Monthly', price: 129.95, type: 'upgrade' },
    ],
  },
  'Nomad-Unlimited-Travel-119-USD-Monthly': {
    currentPlanId: 'Nomad-Unlimited-Travel-119-USD-Monthly',
    currentPrice: 119.95,
    options: [
      { planId: 'UNLIMITED-RESIDENTIAL-PLAN-USD-Monthly', price: 99.95, type: 'downgrade' },
    ],
  },
  'Nomad-Unlimited-Lite-Plan-Paid-Upfront-USD-Monthly': {
    currentPlanId: 'Nomad-Unlimited-Lite-Plan-Paid-Upfront-USD-Monthly',
    currentPrice: 59.95,
    options: [
      { planId: 'UNLIMITED-RESIDENTIAL-PLAN-USD-Monthly', price: 99.95, type: 'upgrade' },
      { planId: 'Nomad-Unlimited-Travel-Plan-01-USD-Monthly', price: 129.95, type: 'upgrade' },
    ],
  },
  'Nomad-Unlimited-Residential-Plan-Modem-USD-Monthly': {
    currentPlanId: 'Nomad-Unlimited-Residential-Plan-Modem-USD-Monthly',
    currentPrice: 99.95,
    options: [
      { planId: 'Nomad-Unlimited-Travel-Plan-01-USD-Monthly', price: 129.95, type: 'upgrade' },
    ],
  },
  'Unlimited-Fixed-Wireless-Access-Business-Internet-100Mbps-Plan-USD-Monthly': {
    currentPlanId: 'Unlimited-Fixed-Wireless-Access-Business-Internet-100Mbps-Plan-USD-Monthly',
    currentPrice: 79.95,
    options: [
      { planId: 'UNLIMITED-RESIDENTIAL-PLAN-USD-Monthly', price: 99.95, type: 'upgrade' },
      { planId: 'Nomad-Unlimited-Travel-Plan-01-USD-Monthly', price: 129.95, type: 'upgrade' },
    ],
  },
  'Nomad-SIM-Only-Unlimited-100-Mbps-USD-Monthly': {
    currentPlanId: 'Nomad-SIM-Only-Unlimited-100-Mbps-USD-Monthly',
    currentPrice: 99.95,
    options: [
      { planId: 'Nomad-Unlimited-Travel-Plan-01-USD-Monthly', price: 129.95, type: 'upgrade' },
    ],
  },
  'Nomad-Internet-Unlimited-5G-PRIME-Plan-USD-Monthly': {
    currentPlanId: 'Nomad-Internet-Unlimited-5G-PRIME-Plan-USD-Monthly',
    currentPrice: 199,
    options: [
      { planId: 'UNLIMITED-RESIDENTIAL-PLAN-USD-Monthly', price: 99.95, type: 'downgrade' },
      { planId: 'Nomad-Unlimited-Travel-Plan-01-USD-Monthly', price: 129.95, type: 'downgrade' },
    ],
  },
  'Nomad-Unlimited-Base-Residential-USD-Monthly': {
    currentPlanId: 'Nomad-Unlimited-Base-Residential-USD-Monthly',
    currentPrice: 99.95,
    options: [
      { planId: 'Nomad-Unlimited-Travel-Plan-01-USD-Monthly', price: 129.95, type: 'upgrade' },
    ],
  },
  'Nomad-Internet-Unlimited-5G-PLUS-Plan-149-USD-Monthly': {
    currentPlanId: 'Nomad-Internet-Unlimited-5G-PLUS-Plan-149-USD-Monthly',
    currentPrice: 149,
    options: [
      { planId: 'UNLIMITED-RESIDENTIAL-PLAN-USD-Monthly', price: 99.95, type: 'downgrade' },
      { planId: 'Nomad-Unlimited-Travel-Plan-01-USD-Monthly', price: 129.95, type: 'downgrade' },
    ],
  },
  'Nomad-Cube-Plan-USD-Monthly': {
    currentPlanId: 'Nomad-Cube-Plan-USD-Monthly',
    currentPrice: 109,
    options: [
      { planId: 'Nomad-Unlimited-Travel-Plan-01-USD-Monthly', price: 129.95, type: 'upgrade' },
    ],
  },
  'Nomad-Power-Plan-Promotional-First-Month-USD-Monthly': {
    currentPlanId: 'Nomad-Power-Plan-Promotional-First-Month-USD-Monthly',
    currentPrice: 49.95,
    options: [
      { planId: 'UNLIMITED-RESIDENTIAL-PLAN-USD-Monthly', price: 99.95, type: 'upgrade' },
      { planId: 'Nomad-Unlimited-Travel-Plan-01-USD-Monthly', price: 129.95, type: 'upgrade' },
    ],
  },
  'Unlimited-Fixed-Wireless-Access-Business-Internet-200Mbps-USD-Monthly': {
    currentPlanId: 'Unlimited-Fixed-Wireless-Access-Business-Internet-200Mbps-USD-Monthly',
    currentPrice: 129.95,
    options: [
      { planId: 'UNLIMITED-RESIDENTIAL-PLAN-USD-Monthly', price: 99.95, type: 'downgrade' },
    ],
  },
  'Nomad-Unlimited-Travel-Plan-USD-Monthly': {
    currentPlanId: 'Nomad-Unlimited-Travel-Plan-USD-Monthly',
    currentPrice: 119.95,
    options: [
      { planId: 'Nomad-Unlimited-Travel-Plan-01-USD-Monthly', price: 129.95, type: 'upgrade' },
    ],
  },
  'Nomad-Unlimited-Residential-Plan-USD-Monthly': {
    currentPlanId: 'Nomad-Unlimited-Residential-Plan-USD-Monthly',
    currentPrice: 99.95,
    options: [
      { planId: 'Nomad-Unlimited-Travel-Plan-01-USD-Monthly', price: 129.95, type: 'upgrade' },
    ],
  },
  'Nomad-Unlimited-Travel-Plan-Paid-Upfront-USD-Monthly': {
    currentPlanId: 'Nomad-Unlimited-Travel-Plan-Paid-Upfront-USD-Monthly',
    currentPrice: 129.95,
    options: [
      { planId: 'UNLIMITED-RESIDENTIAL-PLAN-USD-Monthly', price: 99.95, type: 'downgrade' },
    ],
  },
  'Unlimited-Residential-Plan-Paid-Upfront-USD-Monthly': {
    currentPlanId: 'Unlimited-Residential-Plan-Paid-Upfront-USD-Monthly',
    currentPrice: 99.95,
    options: [
      { planId: 'Nomad-Unlimited-Travel-Plan-01-USD-Monthly', price: 129.95, type: 'upgrade' },
    ],
  },
  'UNLIMITED-TRAVEL-PLAN-PROMO-USD-Monthly': {
    currentPlanId: 'UNLIMITED-TRAVEL-PLAN-PROMO-USD-Monthly',
    currentPrice: 19.95,
    options: [
      { planId: 'UNLIMITED-RESIDENTIAL-PLAN-USD-Monthly', price: 99.95, type: 'upgrade' },
      { planId: 'Nomad-Unlimited-Travel-Plan-01-USD-Monthly', price: 129.95, type: 'upgrade' },
    ],
  },
  'Nomad-Business-USD-Monthly': {
    currentPlanId: 'Nomad-Business-USD-Monthly',
    currentPrice: 199,
    options: [
      { planId: 'UNLIMITED-RESIDENTIAL-PLAN-USD-Monthly', price: 99.95, type: 'downgrade' },
      { planId: 'Nomad-Unlimited-Travel-Plan-01-USD-Monthly', price: 129.95, type: 'downgrade' },
    ],
  },
  'Nomad-Residential-USD-Monthly': {
    currentPlanId: 'Nomad-Residential-USD-Monthly',
    currentPrice: 109,
    options: [
      { planId: 'Nomad-Unlimited-Travel-Plan-01-USD-Monthly', price: 129.95, type: 'upgrade' },
    ],
  },
  'Nomad-Unlimited-Light-Plan-Modem-USD-Monthly': {
    currentPlanId: 'Nomad-Unlimited-Light-Plan-Modem-USD-Monthly',
    currentPrice: 59.95,
    options: [
      { planId: 'UNLIMITED-RESIDENTIAL-PLAN-USD-Monthly', price: 99.95, type: 'upgrade' },
      { planId: 'Nomad-Unlimited-Travel-Plan-01-USD-Monthly', price: 129.95, type: 'upgrade' },
    ],
  },
  'Nomad-Residential-4G-Plan-USD-Monthly': {
    currentPlanId: 'Nomad-Residential-4G-Plan-USD-Monthly',
    currentPrice: 89,
    options: [
      { planId: 'Nomad-Unlimited-Travel-Plan-01-USD-Monthly', price: 129.95, type: 'upgrade' },
    ],
  },
  'Nomad-Unlimited-Ultra-Raptor-Plan-USD-Monthly': {
    currentPlanId: 'Nomad-Unlimited-Ultra-Raptor-Plan-USD-Monthly',
    currentPrice: 169,
    options: [
      { planId: 'UNLIMITED-RESIDENTIAL-PLAN-USD-Monthly', price: 99.95, type: 'downgrade' },
      { planId: 'Nomad-Unlimited-Travel-Plan-01-USD-Monthly', price: 129.95, type: 'downgrade' },
    ],
  },
  'Nomad-Rural-Power-Plan-checkout-Upfront-USD-Monthly': {
    currentPlanId: 'Nomad-Rural-Power-Plan-checkout-Upfront-USD-Monthly',
    currentPrice: 149.95,
    options: [
      { planId: 'UNLIMITED-RESIDENTIAL-PLAN-USD-Monthly', price: 99.95, type: 'downgrade' },
      { planId: 'Nomad-Unlimited-Travel-Plan-01-USD-Monthly', price: 129.95, type: 'downgrade' },
    ],
  },
  'Nomad-Unlimited-Power-Plan-30-First-Month-25-Gift-Card-USD-Monthly': {
    currentPlanId: 'Nomad-Unlimited-Power-Plan-30-First-Month-25-Gift-Card-USD-Monthly',
    currentPrice: 59.95,
    options: [
      { planId: 'UNLIMITED-RESIDENTIAL-PLAN-USD-Monthly', price: 99.95, type: 'upgrade' },
      { planId: 'Nomad-Unlimited-Travel-Plan-01-USD-Monthly', price: 129.95, type: 'upgrade' },
    ],
  },
  'Bring-Your-Own-Device-USD-Monthly': {
    currentPlanId: 'Bring-Your-Own-Device-USD-Monthly',
    currentPrice: 119,
    options: [
      { planId: 'UNLIMITED-RESIDENTIAL-PLAN-USD-Monthly', price: 99.95, type: 'downgrade' },
    ],
  },
  'Nomad-Dragon-Service-Plan-USD-Monthly': {
    currentPlanId: 'Nomad-Dragon-Service-Plan-USD-Monthly',
    currentPrice: 99.95,
    options: [
      { planId: 'Nomad-Unlimited-Travel-Plan-01-USD-Monthly', price: 129.95, type: 'upgrade' },
    ],
  },
};

export function getPlanChangeOptions(planId: string): PlanChangeOption[] | null {
  const rule = PLAN_CHANGE_RULES[planId];
  if (!rule) return null;
  return rule.options;
}

export function isPlanChangeEligible(planId: string): boolean {
  return planId in PLAN_CHANGE_RULES;
}
