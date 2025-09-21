import {
  DEFAULT_AFFILIATE_CODE,
  getResellersForGame,
  getResellerConfig as getGlobalResellerConfig,
  processAffiliateUrl as processGlobalAffiliateUrl,
  type ResellerConfig,
  type AffiliatePattern,
} from "./global-affiliate-config"

// Re-export types for backward compatibility
export type { AffiliatePattern, ResellerConfig }

// Fortnite-specific affiliate configuration using centralized settings
export const FORTNITE_AFFILIATE_CONFIG = {
  resellers: getResellersForGame("fortnite").map((reseller) => ({
    ...reseller,
    defaultAffiliate: DEFAULT_AFFILIATE_CODE,
  })),
}

// Utility functions using centralized logic
export function getFortniteResellerConfig(url: string): ResellerConfig | null {
  return getGlobalResellerConfig(url, "fortnite")
}

export function processFortniteAffiliateUrl(url: string, affiliateCode?: string): string {
  return processGlobalAffiliateUrl(url, affiliateCode, "fortnite")
}
