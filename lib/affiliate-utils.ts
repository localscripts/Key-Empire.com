export class AffiliateManager {
  private affiliateCode: string
  private defaultCode = "keyempire"

  constructor(code?: string) {
    this.affiliateCode = code || this.extractAffiliateFromUrl() || this.getStoredAffiliate() || this.defaultCode
    this.storeAffiliate(this.affiliateCode)
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
