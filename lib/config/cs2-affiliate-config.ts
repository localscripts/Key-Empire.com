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

// CS2-specific affiliate configuration using centralized settings
export const CS2_AFFILIATE_CONFIG = {
  resellers: getResellersForGame("cs2").map((reseller) => ({
    ...reseller,
    defaultAffiliate: DEFAULT_AFFILIATE_CODE,
  })),
}

// Utility functions using centralized logic
export function getCS2ResellerConfig(url: string): ResellerConfig | null {
  return getGlobalResellerConfig(url, "cs2")
}

export function processCS2AffiliateUrl(url: string, affiliateCode?: string): string {
  return processGlobalAffiliateUrl(url, affiliateCode, "cs2")
}
