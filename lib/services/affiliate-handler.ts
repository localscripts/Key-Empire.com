import {
  DEFAULT_AFFILIATE_CODE,
  GLOBAL_RESELLERS,
  processAffiliateUrl,
  getResellerConfig,
} from "@/lib/config/global-affiliate-config"

export class AffiliateHandler {
  private static instance: AffiliateHandler
  private currentAffiliateCode: string

  private constructor() {
    this.currentAffiliateCode = ""
  }

  static getInstance(): AffiliateHandler {
    if (!AffiliateHandler.instance) {
      AffiliateHandler.instance = new AffiliateHandler()
    }
    return AffiliateHandler.instance
  }

  private getAffiliateCodeFromCookies(): string | null {
    if (typeof window === "undefined") return null

    const cookies = document.cookie.split(";")
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=")
      if (name === "affiliate_code") {
        return decodeURIComponent(value)
      }
    }
    return null
  }

  // Get current affiliate code (now uses centralized default)
  getCurrentAffiliateCode(): string {
    const cookieCode = this.getAffiliateCodeFromCookies()
    if (cookieCode) {
      return cookieCode
    }

    // Use centralized default affiliate code
    return DEFAULT_AFFILIATE_CODE
  }

  // Set the current affiliate code and store in cookies
  setAffiliateCode(code: string): void {
    if (typeof window !== "undefined") {
      const expiryDate = new Date()
      expiryDate.setFullYear(expiryDate.getFullYear() + 1)
      document.cookie = `affiliate_code=${encodeURIComponent(code)}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`
    }
  }

  // Process a single URL with current affiliate code
  processUrl(url: string, customCode?: string): string {
    const code = customCode || this.getCurrentAffiliateCode()
    return processAffiliateUrl(url, code)
  }

  // Process multiple URLs
  processUrls(urls: string[], customCode?: string): string[] {
    const code = customCode || this.getCurrentAffiliateCode()
    return urls.map((url) => processAffiliateUrl(url, code))
  }

  // Get reseller information
  getResellerInfo(url: string) {
    return getResellerConfig(url)
  }

  // Track affiliate click (for analytics)
  async trackClick(url: string, productName?: string): Promise<void> {
    try {
      const config = getResellerConfig(url)

      // TODO: Implement actual tracking (database, analytics service, etc.)
      // This could send data to your analytics endpoint
    } catch (error) {}
  }

  // Get all configured resellers (now uses centralized config)
  getAllResellers() {
    return GLOBAL_RESELLERS
  }

  // Validate affiliate code format
  isValidAffiliateCode(code: string): boolean {
    return /^[a-zA-Z0-9_-]{3,20}$/.test(code)
  }

  removeAffiliateCookie(): void {
    if (typeof window !== "undefined") {
      // Set cookie with past expiration date to remove it
      document.cookie = `affiliate_code=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`
    }
  }
}

// Export singleton instance
export const affiliateHandler = AffiliateHandler.getInstance()
