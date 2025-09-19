export interface AffiliatePattern {
  type: "path" | "query"
  pattern?: string // For path replacements like '/group/{code}' or '/affiliate/{code}'
  param?: string // For query params like 'affiliate_key' or 'ref'
}

export interface ResellerConfig {
  name: string
  domains: string[]
  defaultAffiliate: string
  pattern: AffiliatePattern
  verified?: boolean
}

// Rust-specific affiliate configuration
export const RUST_AFFILIATE_CONFIG = {
  // Rust reseller-specific configurations
  resellers: [

  ] as ResellerConfig[],
}

// Utility function to get Rust reseller config by domain
export function getRustResellerConfig(url: string): ResellerConfig | null {
  try {
    const domain = new URL(url).hostname.toLowerCase()
    return (
      RUST_AFFILIATE_CONFIG.resellers.find((reseller) =>
        reseller.domains.some((d) => domain.includes(d.toLowerCase())),
      ) || null
    )
  } catch {
    return null
  }
}

// Utility function to process Rust affiliate URLs
export function processRustAffiliateUrl(url: string, affiliateCode?: string): string {
  const config = getRustResellerConfig(url)
  if (!config) {
    return affiliateCode ? `${url}${url.includes("?") ? "&" : "?"}affiliate=${affiliateCode}` : url
  }

  const code = affiliateCode || config.defaultAffiliate
  const urlObj = new URL(url)

  if (config.pattern.type === "path") {
    // Replace or set path-based affiliate
    const newPath = config.pattern.pattern?.replace("{code}", code) || `/affiliate/${code}`
    urlObj.pathname = newPath
  } else if (config.pattern.type === "query" && config.pattern.param) {
    // Set query parameter
    urlObj.searchParams.set(config.pattern.param, code)
  }

  return urlObj.toString()
}
