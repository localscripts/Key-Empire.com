export interface DurationPricing {
  price: string
  url: string
}

export interface ResellerEntry {
  name: string
  link: string
  pfp: string
  payments: string[]
  durations: {
    [key: string]: DurationPricing
  }
  verified?: boolean
  premium?: boolean
}

export interface ProductResellers {
  [resellerName: string]: ResellerEntry
}

export interface AffiliateConfig {
  code: string
  defaultCode: string
  commissionRate: number
  payoutSchedule: string
}

export interface AffiliateStats {
  clicks: number
  conversions: number
  earnings: number
  conversionRate: number
}

export interface ResellerSite {
  url: string
  verified: boolean
  defaultAffiliate: string
  affiliatePatterns: {
    [domain: string]: {
      type: "path_replacement" | "query_param"
      pattern?: string
      replacement?: string
      param?: string
    }
  }
}

export interface LocalAffiliateData {
  resellers: {
    [productName: string]: ProductResellers
  }
  affiliateStats: {
    [affiliateCode: string]: AffiliateStats
  }
  lastUpdated: string
}
