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

// Main affiliate configuration - easy to modify and extend
export const AFFILIATE_CONFIG = {
  // Reseller-specific configurations
  resellers: [
    {
      name: "RobloxCheatz",
      domains: ["robloxcheatz.com"],
      defaultAffiliate: "voxlisnet",
      pattern: {
        type: "path" as const,
        pattern: "/affiliate/{code}",
      },
      verified: true,
    },
    {
      name: "CheapKeyz",
      domains: ["cheapkeyz.store"],
      defaultAffiliate: "voxlis",
      pattern: {
        type: "path" as const,
        pattern: "/affiliate/{code}",
      },
      verified: true,
    },
    {
      name: "BloxProducts",
      domains: ["bloxproducts.com"],
      defaultAffiliate: "1270744029168009258",
      pattern: {
        type: "query" as const,
        param: "affiliate_key",
      },
      verified: false,
    },
    {
      name: "KeyShop",
      domains: ["keyshop.io", "keyshop.com"],
      defaultAffiliate: "voxlisnet",
      pattern: {
        type: "query" as const,
        param: "ref",
      },
      verified: false,
    },
  ] as ResellerConfig[],
}

// Utility function to get reseller config by domain
export function getResellerConfig(url: string): ResellerConfig | null {
  try {
    const domain = new URL(url).hostname.toLowerCase()
    return (
      AFFILIATE_CONFIG.resellers.find((reseller) => reseller.domains.some((d) => domain.includes(d.toLowerCase()))) ||
      null
    )
  } catch {
    return null
  }
}

// Utility function to process affiliate URLs
export function processAffiliateUrl(url: string, affiliateCode?: string): string {
  const config = getResellerConfig(url)
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
