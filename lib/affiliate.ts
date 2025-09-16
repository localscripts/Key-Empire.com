export interface AffiliateConfig {
  code: string | null
  isActive: boolean
}

// Get affiliate code from URL or localStorage
export const getAffiliateCode = (): string | null => {
  if (typeof window === "undefined") return null

  // First check URL for affiliate code
  const urlParams = new URLSearchParams(window.location.search)
  const urlCode = urlParams.get("affiliate") || urlParams.get("ref")

  if (urlCode) {
    // Store in localStorage for persistence
    localStorage.setItem("affiliate_code", urlCode)
    return urlCode
  }

  // Check localStorage for existing code
  return localStorage.getItem("affiliate_code")
}

// Transform reseller URL based on affiliate code
export const transformAffiliateUrl = (originalUrl: string, affiliateCode: string): string => {
  if (!affiliateCode || !originalUrl) return originalUrl

  try {
    const url = new URL(originalUrl)
    const hostname = url.hostname.toLowerCase()

    // Transform based on specific reseller domains
    if (hostname.includes("robloxcheatz.com")) {
      // https://robloxcheatz.com/group/wave → https://robloxcheatz.com/affiliate/(affiliate_code)
      return `https://robloxcheatz.com/affiliate/${affiliateCode}`
    }

    if (hostname.includes("cheapkeyz.store")) {
      // https://cheapkeyz.store/group/valex → https://cheapkeyz.store/affiliate/(affiliate_code)
      return `https://cheapkeyz.store/affiliate/${affiliateCode}`
    }

    if (hostname.includes("bloxproducts.com")) {
      // https://bloxproducts.com/#Zenith → https://bloxproducts.com/?affiliate_key={affiliate_code}#Zenith
      const hash = url.hash
      return `https://bloxproducts.com/?affiliate_key=${affiliateCode}${hash}`
    }

    // For other domains, append as query parameter
    url.searchParams.set("ref", affiliateCode)
    return url.toString()
  } catch (error) {
    console.error("[v0] Error transforming affiliate URL:", error)
    return originalUrl
  }
}

// Initialize affiliate system on page load
export const initializeAffiliate = (): AffiliateConfig => {
  const code = getAffiliateCode()

  if (code) {
    console.log("[v0] Affiliate system active with code:", code)
  }

  return {
    code,
    isActive: !!code,
  }
}

// Handle affiliate link clicks
export const handleAffiliateClick = (originalUrl: string): void => {
  const affiliateCode = getAffiliateCode()
  const finalUrl = affiliateCode ? transformAffiliateUrl(originalUrl, affiliateCode) : originalUrl

  if (affiliateCode) {
    console.log("[v0] Transforming URL with affiliate code:", affiliateCode)
    console.log("[v0] Original:", originalUrl)
    console.log("[v0] Transformed:", finalUrl)
  }

  window.open(finalUrl, "_blank")
}
