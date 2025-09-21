// Single source of truth for all affiliate settings - easy to configure!

export interface AffiliatePattern {
  type: "path" | "query"
  pattern?: string // For path replacements like '/group/{code}' or '/affiliate/{code}'
  param?: string // For query params like 'affiliate_key' or 'ref'
}

export interface ResellerConfig {
  name: string
  domains: string[]
  pattern: AffiliatePattern
  verified?: boolean
}

// ========================================
// 🎯 MAIN CONFIGURATION - EDIT HERE ONLY!
// ========================================

// Default affiliate code used across all games and resellers
export const DEFAULT_AFFILIATE_CODE = "keyempire"

// Cache duration for product scraping (in milliseconds)
export const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

// Main reseller configurations
export const GLOBAL_RESELLERS: ResellerConfig[] = [
  {
    name: "RobloxCheatz",
    domains: ["robloxcheatz.com"],
    pattern: {
      type: "path",
      pattern: "/affiliate/{code}",
    },
    verified: true,
  },
  {
    name: "CheapKeyz",
    domains: ["cheapkeyz.store"],
    pattern: {
      type: "path",
      pattern: "/affiliate/{code}",
    },
    verified: true,
  },
  {
    name: "BloxProducts",
    domains: ["bloxproducts.com"],
    pattern: {
      type: "query",
      param: "affiliate_key",
    },
    verified: false,
  },
  {
    name: "KeyShop",
    domains: ["keyshop.io", "keyshop.com"],
    pattern: {
      type: "query",
      param: "ref",
    },
    verified: false,
  },
]

// Game-specific additional resellers (extends GLOBAL_RESELLERS)
export const CS2_RESELLERS: ResellerConfig[] = [
  {
    name: "CS2Cheats",
    domains: ["cs2cheats.com", "cs2hacks.net"],
    pattern: {
      type: "path",
      pattern: "/affiliate/{code}",
    },
    verified: true,
  },
  {
    name: "CounterStrikeHacks",
    domains: ["cshacks.store", "cs2marketplace.com"],
    pattern: {
      type: "query",
      param: "ref",
    },
    verified: true,
  },
  {
    name: "CS2Store",
    domains: ["cs2store.io"],
    pattern: {
      type: "path",
      pattern: "/group/{code}",
    },
    verified: false,
  },
  {
    name: "SteamCheats",
    domains: ["steamcheats.net", "valvehacks.com"],
    pattern: {
      type: "query",
      param: "affiliate_key",
    },
    verified: false,
  },
]

export const FORTNITE_RESELLERS: ResellerConfig[] = [
  {
    name: "FortniteCheats",
    domains: ["fortnitecheats.com", "fnhacks.net"],
    pattern: {
      type: "path",
      pattern: "/affiliate/{code}",
    },
    verified: true,
  },
  {
    name: "EpicHacks",
    domains: ["epichacks.store", "fortnitestore.com"],
    pattern: {
      type: "query",
      param: "ref",
    },
    verified: true,
  },
  {
    name: "FortniteMarketplace",
    domains: ["fnmarketplace.io", "fortnitehacks.net"],
    pattern: {
      type: "path",
      pattern: "/group/{code}",
    },
    verified: false,
  },
  {
    name: "BattleRoyaleCheats",
    domains: ["brcheats.net", "epicgameshacks.com"],
    pattern: {
      type: "query",
      param: "affiliate_key",
    },
    verified: false,
  },
]

export const RUST_RESELLERS: ResellerConfig[] = [
  {
    name: "RustCheats",
    domains: ["rustcheats.com", "rusthacks.net"],
    pattern: {
      type: "path",
      pattern: "/affiliate/{code}",
    },
    verified: true,
  },
  {
    name: "SurvivalHacks",
    domains: ["survivalhacks.store", "ruststore.com"],
    pattern: {
      type: "query",
      param: "ref",
    },
    verified: true,
  },
  {
    name: "RustMarketplace",
    domains: ["rustmarketplace.io", "facepunchhacks.net"],
    pattern: {
      type: "path",
      pattern: "/group/{code}",
    },
    verified: false,
  },
  {
    name: "SteamSurvival",
    domains: ["steamsurvival.net", "rustgamehacks.com"],
    pattern: {
      type: "query",
      param: "affiliate_key",
    },
    verified: false,
  },
]

// ========================================
// 🔧 UTILITY FUNCTIONS
// ========================================

// Get all resellers for a specific game (includes global + game-specific)
export function getResellersForGame(game: "cs2" | "fortnite" | "rust" | "global"): ResellerConfig[] {
  const gameResellers = {
    cs2: [...GLOBAL_RESELLERS, ...CS2_RESELLERS],
    fortnite: [...GLOBAL_RESELLERS, ...FORTNITE_RESELLERS],
    rust: [...GLOBAL_RESELLERS, ...RUST_RESELLERS],
    global: GLOBAL_RESELLERS,
  }

  return gameResellers[game] || GLOBAL_RESELLERS
}

// Get reseller config by domain
export function getResellerConfig(url: string, game?: "cs2" | "fortnite" | "rust"): ResellerConfig | null {
  try {
    const domain = new URL(url).hostname.toLowerCase()
    const resellers = game ? getResellersForGame(game) : GLOBAL_RESELLERS

    return resellers.find((reseller) => reseller.domains.some((d) => domain.includes(d.toLowerCase()))) || null
  } catch {
    return null
  }
}

// Process affiliate URL with the centralized default
export function processAffiliateUrl(url: string, affiliateCode?: string, game?: "cs2" | "fortnite" | "rust"): string {
  const config = getResellerConfig(url, game)
  if (!config) {
    const code = affiliateCode || DEFAULT_AFFILIATE_CODE
    return `${url}${url.includes("?") ? "&" : "?"}affiliate=${code}`
  }

  const code = affiliateCode || DEFAULT_AFFILIATE_CODE
  const urlObj = new URL(url)

  if (config.pattern.type === "path") {
    const newPath = config.pattern.pattern?.replace("{code}", code) || `/affiliate/${code}`
    urlObj.pathname = newPath
  } else if (config.pattern.type === "query" && config.pattern.param) {
    urlObj.searchParams.set(config.pattern.param, code)
  }

  return urlObj.toString()
}
