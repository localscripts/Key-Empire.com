import { AFFILIATE_CONFIG, processAffiliateUrl, getResellerConfig } from "@/lib/config/affiliate-config"

export class AffiliateHandler {
  private static instance: AffiliateHandler
  private currentAffiliateCode: string
  private exitHandlerAdded = false

  private constructor() {
    this.currentAffiliateCode = ""
    this.setupExitHandler()
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

  // Get current affiliate code (now reads from cookies)
  getCurrentAffiliateCode(): string {
    const cookieCode = this.getAffiliateCodeFromCookies()
    if (cookieCode) {
      return cookieCode
    }

    // Fallback to first reseller's default if no cookie
    const firstReseller = AFFILIATE_CONFIG.resellers[0]
    return firstReseller?.defaultAffiliate || "voxlisnet"
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

  // Get all configured resellers
  getAllResellers() {
    return AFFILIATE_CONFIG.resellers
  }

  // Validate affiliate code format
  isValidAffiliateCode(code: string): boolean {
    return /^[a-zA-Z0-9_-]{3,20}$/.test(code)
  }

  clearAffiliateCode(): void {
    if (typeof window !== "undefined") {
      document.cookie = "affiliate_code=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax"
    }
  }

  private setupExitHandler(): void {
    if (typeof window !== "undefined" && !this.exitHandlerAdded) {
      const handleBeforeUnload = () => {
        this.clearAffiliateCode()
      }

      window.addEventListener("beforeunload", handleBeforeUnload)
      this.exitHandlerAdded = true
    }
  }
}

// Export singleton instance
export const affiliateHandler = AffiliateHandler.getInstance()
