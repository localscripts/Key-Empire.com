import type { LocalAffiliateData, ProductResellers } from "../types/affiliate"
import { RESELLER_SITES, KNOWN_EXPLOITS, PAYMENT_PATTERNS } from "../data/reseller-sites"
import { processAffiliateUrl } from "../config/global-affiliate-config"
import { DEFAULT_AFFILIATE_CODE, CACHE_DURATION } from "../config/global-affiliate-config"
import fs from "fs/promises"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const AFFILIATE_DATA_FILE = path.join(DATA_DIR, "affiliate-data.json")

export class LocalAffiliateService {
  private static instance: LocalAffiliateService
  private cache: LocalAffiliateData | null = null
  private lastCacheTime = 0

  private constructor() {}

  static getInstance(): LocalAffiliateService {
    if (!LocalAffiliateService.instance) {
      LocalAffiliateService.instance = new LocalAffiliateService()
    }
    return LocalAffiliateService.instance
  }

  private async ensureDataDirectory(): Promise<void> {
    try {
      await fs.access(DATA_DIR)
    } catch {
      try {
        await fs.mkdir(DATA_DIR, { recursive: true })
      } catch (error) {}
    }
  }

  private async loadData(): Promise<LocalAffiliateData> {
    try {
      await this.ensureDataDirectory()
      const data = await fs.readFile(AFFILIATE_DATA_FILE, "utf-8")
      return JSON.parse(data)
    } catch (error) {
      return {
        resellers: {},
        affiliateStats: {},
        lastUpdated: new Date().toISOString(),
      }
    }
  }

  private async saveData(data: LocalAffiliateData): Promise<void> {
    try {
      await this.ensureDataDirectory()
      await fs.writeFile(AFFILIATE_DATA_FILE, JSON.stringify(data, null, 2))
    } catch (error) {}
  }

  private async getCachedData(): Promise<LocalAffiliateData> {
    const now = Date.now()

    if (this.cache && now - this.lastCacheTime < CACHE_DURATION) {
      return this.cache
    }

    this.cache = await this.loadData()
    this.lastCacheTime = now
    return this.cache
  }

  private async scrapeResellerSite(
    site: any,
    affiliateCode: string,
  ): Promise<{ [productName: string]: ProductResellers }> {
    const results: { [productName: string]: ProductResellers } = {}

    try {
      const response = await fetch(site.url, {
        headers: {
          "User-Agent": "KeyEmpire-Scraper/5.0",
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(10000),
      })

      if (!response.ok) {
        return results
      }

      const data = await response.json()

      for (const [resellerName, offers] of Object.entries(data as any)) {
        if (!offers || typeof offers !== "object") continue

        const profilePic = offers.pfp || ""

        for (const [productName, details] of Object.entries(offers as any)) {
          if (productName === "pfp" || productName === "premium") continue

          const normalizedProductName = productName.toLowerCase()
          if (!KNOWN_EXPLOITS.includes(normalizedProductName)) {
            continue
          }

          if (!details || typeof details !== "object") continue

          const durations: { [key: string]: any } = {}

          for (const [durationKey, pricing] of Object.entries(details as any)) {
            if (pricing && typeof pricing === "object" && pricing.url && pricing.price) {
              const processedUrl = processAffiliateUrl(pricing.url, affiliateCode)
              durations[durationKey] = {
                price: String(pricing.price),
                url: processedUrl,
              }
            }
          }

          if (Object.keys(durations).length === 0) {
            continue
          }

          if (!results[normalizedProductName]) {
            results[normalizedProductName] = {}
          }

          const siteName = site.name || site.url.split("/").pop() || "unknown"
          const cleanSiteName = siteName.replace(/_endpoint\.json$/, "").replace(/\.json$/, "")
          const uniqueResellerKey = `${resellerName}_${cleanSiteName}`

          results[normalizedProductName][uniqueResellerKey] = {
            name: resellerName,
            link: site.url,
            pfp: profilePic,
            payments: details.payments || this.detectPayments(JSON.stringify(details)),
            durations,
            verified: site.verified || false,
            premium: offers.premium || false,
          }
        }
      }
    } catch (error) {}

    return results
  }

  private detectPayments(html: string): string[] {
    const found: string[] = []
    const lowerHtml = html.toLowerCase()

    for (const [method, patterns] of Object.entries(PAYMENT_PATTERNS)) {
      for (const pattern of patterns) {
        if (lowerHtml.includes(pattern.toLowerCase())) {
          found.push(method)
          break
        }
      }
    }

    return found.length > 0 ? found : ["crypto", "paypal"]
  }

  async getResellersData(affiliateCode = DEFAULT_AFFILIATE_CODE): Promise<{ [productName: string]: ProductResellers }> {
    try {
      const data = await this.getCachedData()
      const lastUpdated = new Date(data.lastUpdated)
      const now = new Date()
      const timeDiff = now.getTime() - lastUpdated.getTime()

      if (timeDiff > CACHE_DURATION || Object.keys(data.resellers).length === 0) {
        const allResults: { [productName: string]: ProductResellers } = {}

        const scrapePromises = RESELLER_SITES.map(async (site, index) => {
          try {
            const result = await this.scrapeResellerSite(site, affiliateCode)
            return result
          } catch (error) {
            return {}
          }
        })

        const siteResults = await Promise.allSettled(scrapePromises)

        siteResults.forEach((result, index) => {
          if (result.status === "fulfilled") {
            const siteData = result.value
            for (const [productName, resellers] of Object.entries(siteData)) {
              if (!allResults[productName]) {
                allResults[productName] = {}
              }
              Object.assign(allResults[productName], resellers)
            }
          }
        })

        data.resellers = allResults
        data.lastUpdated = now.toISOString()
        await this.saveData(data)
        this.cache = data
      } else {
        // Process all URLs in cached data with the current affiliate code
        const processedResellers: { [productName: string]: ProductResellers } = {}

        for (const [productName, resellers] of Object.entries(data.resellers)) {
          processedResellers[productName] = {}

          for (const [resellerKey, reseller] of Object.entries(resellers)) {
            const processedDurations: { [key: string]: any } = {}

            for (const [durationKey, duration] of Object.entries(reseller.durations)) {
              processedDurations[durationKey] = {
                ...duration,
                url: processAffiliateUrl(duration.url, affiliateCode),
              }
            }

            processedResellers[productName][resellerKey] = {
              ...reseller,
              durations: processedDurations,
            }
          }
        }

        return processedResellers
      }

      return data.resellers
    } catch (error) {
      return {}
    }
  }

  async getProductResellers(productName: string, affiliateCode = DEFAULT_AFFILIATE_CODE): Promise<ProductResellers> {
    try {
      const allResellers = await this.getResellersData(affiliateCode)
      const normalizedProductName = productName.toLowerCase()
      const productResellers = allResellers[normalizedProductName] || {}

      // Always process URLs with current affiliate code, even if data is from cache
      const processedResellers: ProductResellers = {}
      for (const [resellerKey, reseller] of Object.entries(productResellers)) {
        const processedDurations: { [key: string]: any } = {}

        for (const [durationKey, duration] of Object.entries(reseller.durations)) {
          processedDurations[durationKey] = {
            ...duration,
            url: processAffiliateUrl(duration.url, affiliateCode),
          }
        }

        processedResellers[resellerKey] = {
          ...reseller,
          durations: processedDurations,
        }
      }

      return processedResellers
    } catch (error) {
      return {}
    }
  }

  async getCheapestOverallPrice(): Promise<number> {
    try {
      const allResellers = await this.getResellersData()
      let cheapestPrice = Number.POSITIVE_INFINITY

      for (const productResellers of Object.values(allResellers)) {
        for (const reseller of Object.values(productResellers)) {
          for (const duration of Object.values(reseller.durations)) {
            const price = Number.parseFloat(duration.price.replace(/[^0-9.-]+/g, ""))
            if (!isNaN(price) && price < cheapestPrice) {
              cheapestPrice = price
            }
          }
        }
      }

      return cheapestPrice === Number.POSITIVE_INFINITY ? 0 : cheapestPrice
    } catch (error) {
      return 0
    }
  }

  async trackClick(affiliateCode: string): Promise<void> {
    try {
      // TODO: Implement actual click tracking logic here
      // This could store to database, send to analytics service, etc.
    } catch (error) {}
  }
}
