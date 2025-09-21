// Import centralized configuration
import { DEFAULT_AFFILIATE_CODE } from "./config/global-affiliate-config"

export class AffiliateManager {
  private affiliateCode: string
  private defaultCode = DEFAULT_AFFILIATE_CODE

  constructor(code?: string) {
    this.affiliateCode = code || this.extractAffiliateFromUrl() || this.getStoredAffiliate() || this.defaultCode
    this.storeAffiliate(this.affiliateCode)
    this.setupCookieRemovalOnExit()
  }

  private extractAffiliateFromUrl(): string | null {
    if (typeof window === "undefined") return null

    const path = window.location.pathname
    const match = path.match(/\/affiliate\/([a-zA-Z0-9_-]+)/)

    if (match) {
      return match[1]
    }

    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get("affiliate")
  }

  private getStoredAffiliate(): string | null {
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

  private storeAffiliate(code: string): void {
    if (typeof window === "undefined") return

    // Store for 1 year
    const expiryDate = new Date()
    expiryDate.setFullYear(expiryDate.getFullYear() + 1)

    document.cookie = `affiliate_code=${encodeURIComponent(code)}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`
  }

  public getAffiliateCode(): string {
    return this.affiliateCode
  }

  public setAffiliateCode(code: string): void {
    this.affiliateCode = code
    this.storeAffiliate(code)
  }

  public removeAffiliateCookie(): void {
    if (typeof window === "undefined") return

    // Set cookie with past expiration date to remove it
    document.cookie = `affiliate_code=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`
  }

  private setupCookieRemovalOnExit(): void {
    if (typeof window === "undefined") return

    const handleBeforeUnload = () => {
      this.removeAffiliateCookie()
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        this.removeAffiliateCookie()
      }
    }

    // Remove cookie when user closes tab/window or navigates away
    window.addEventListener("beforeunload", handleBeforeUnload)

    // Remove cookie when tab becomes hidden (user switches tabs or minimizes)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    // Cleanup function (though it may not always run)
    const cleanup = () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }

    // Store cleanup function for potential manual cleanup
    ;(window as any).__affiliateCleanup = cleanup
  }
}

// Global affiliate manager instance
export const affiliateManager = new AffiliateManager()

// Hook for React components
export function useAffiliate() {
  return {
    affiliateCode: affiliateManager.getAffiliateCode(),
    setAffiliateCode: (code: string) => affiliateManager.setAffiliateCode(code),
  }
}
