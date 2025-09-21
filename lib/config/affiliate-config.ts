import {
  DEFAULT_AFFILIATE_CODE,
  GLOBAL_RESELLERS,
  getResellerConfig as getGlobalResellerConfig,
  processAffiliateUrl as processGlobalAffiliateUrl,
  type ResellerConfig,
  type AffiliatePattern,
} from "./global-affiliate-config"

// Re-export types for backward compatibility
export type { AffiliatePattern, ResellerConfig }

// Main affiliate configuration using centralized settings
export const AFFILIATE_CONFIG = {
  resellers: GLOBAL_RESELLERS.map((reseller) => ({
    ...reseller,
    defaultAffiliate: DEFAULT_AFFILIATE_CODE,
  })),
}

// Utility functions using centralized logic
export function getResellerConfig(url: string): ResellerConfig | null {
  return getGlobalResellerConfig(url)
}

export function processAffiliateUrl(url: string, affiliateCode?: string): string {
  return processGlobalAffiliateUrl(url, affiliateCode)
}
