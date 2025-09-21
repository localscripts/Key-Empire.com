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

// Rust-specific affiliate configuration using centralized settings
export const RUST_AFFILIATE_CONFIG = {
  resellers: getResellersForGame("rust").map((reseller) => ({
    ...reseller,
    defaultAffiliate: DEFAULT_AFFILIATE_CODE,
  })),
}

// Utility functions using centralized logic
export function getRustResellerConfig(url: string): ResellerConfig | null {
  return getGlobalResellerConfig(url, "rust")
}

export function processRustAffiliateUrl(url: string, affiliateCode?: string): string {
  return processGlobalAffiliateUrl(url, affiliateCode, "rust")
}
