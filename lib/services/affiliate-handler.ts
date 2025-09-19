import { AFFILIATE_CONFIG, processAffiliateUrl, getResellerConfig } from "@/lib/config/affiliate-config"

export class AffiliateHandler {
  private static instance: AffiliateHandler
  private currentAffiliateCode: string

  private constructor() {
    this.currentAffiliateCode = AFFILIATE_CONFIG.defaultAffiliate
  }

  static getInstance(): AffiliateHandler {
    if (!AffiliateHandler.instance) {
      AffiliateHandler.instance = new AffiliateHandler()
    }
    return AffiliateHandler.instance
  }

  // Set the current affiliate code (can be called from admin panel or config)
  setAffiliateCode(code: string): void {
    this.currentAffiliateCode = code
  }

  // Get current affiliate code
  getCurrentAffiliateCode(): string {
    return this.currentAffiliateCode
  }

  // Process a single URL with current affiliate code
  processUrl(url: string, customCode?: string): string {
    const code = customCode || this.currentAffiliateCode
    return processAffiliateUrl(url, code)
  }

  // Process multiple URLs
  processUrls(urls: string[], customCode?: string): string[] {
    const code = customCode || this.currentAffiliateCode
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

  // Get all configured resellers
  getAllResellers() {
    return AFFILIATE_CONFIG.resellers
  }

  // Validate affiliate code format
  isValidAffiliateCode(code: string): boolean {
    return /^[a-zA-Z0-9_-]{3,20}$/.test(code)
  }
}

// Export singleton instance
export const affiliateHandler = AffiliateHandler.getInstance()
