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
