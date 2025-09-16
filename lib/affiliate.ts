export interface AffiliateConfig {
  code: string | null
  isActive: boolean
}

// Cookie utilities for affiliate code management
const AFFILIATE_COOKIE_NAME = "affiliate_code"
const COOKIE_EXPIRY_HOURS = 1

const setCookie = (name: string, value: string, hours: number): void => {
  if (typeof document === "undefined") return

  const expires = new Date()
  expires.setTime(expires.getTime() + hours * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
}

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null

  const nameEQ = name + "="
  const ca = document.cookie.split(";")

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === " ") c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

// Get affiliate code from URL or cookies
export const getAffiliateCode = (): string | null => {
  if (typeof window === "undefined") return null

  // First check URL for affiliate code
  const urlParams = new URLSearchParams(window.location.search)
  const urlCode = urlParams.get("affiliate") || urlParams.get("ref")

  if (urlCode) {
    // Store in cookie for site-wide persistence
    setCookie(AFFILIATE_COOKIE_NAME, urlCode, COOKIE_EXPIRY_HOURS)
    console.log("[v0] Affiliate code stored in cookie:", urlCode)
    return urlCode
  }

  // Check cookie for existing code
  const cookieCode = getCookie(AFFILIATE_COOKIE_NAME)
  if (cookieCode) {
    console.log("[v0] Affiliate code retrieved from cookie:", cookieCode)
  }

  return cookieCode
}

// Set affiliate code in cookie
export const setAffiliateCode = (code: string): void => {
  setCookie(AFFILIATE_COOKIE_NAME, code, COOKIE_EXPIRY_HOURS)
  console.log("[v0] Affiliate code set in cookie:", code)
}

// Transform reseller URL based on affiliate code
export const transformAffiliateUrl = (originalUrl: string, affiliateCode: string): string => {
  if (!affiliateCode || !originalUrl) return originalUrl

  try {
    const url = new URL(originalUrl)
    const hostname = url.hostname.toLowerCase()

    console.log("[v0] Transforming URL for affiliate:", affiliateCode, "Original:", originalUrl)

    // Transform based on specific reseller domains
    if (hostname.includes("robloxcheatz.com")) {
      // https://robloxcheatz.com/group/wave → https://robloxcheatz.com/affiliate/(affiliate_code)
      const transformedUrl = `https://robloxcheatz.com/affiliate/${affiliateCode}`
      console.log("[v0] RobloxCheatz transformed:", transformedUrl)
      return transformedUrl
    }

    if (hostname.includes("cheapkeyz.store")) {
      // https://cheapkeyz.store/group/valex → https://cheapkeyz.store/affiliate/(affiliate_code)
      const transformedUrl = `https://cheapkeyz.store/affiliate/${affiliateCode}`
      console.log("[v0] CheapKeyz transformed:", transformedUrl)
      return transformedUrl
    }

    if (hostname.includes("bloxproducts.com")) {
      // https://bloxproducts.com/#Zenith → https://bloxproducts.com/?affiliate_key={affiliate_code}#Zenith
      const hash = url.hash
      const transformedUrl = `https://bloxproducts.com/?affiliate_key=${affiliateCode}${hash}`
      console.log("[v0] BloxProducts transformed:", transformedUrl)
      return transformedUrl
    }

    // For other domains, append as query parameter
    url.searchParams.set("ref", affiliateCode)
    const transformedUrl = url.toString()
    console.log("[v0] Generic affiliate transformation:", transformedUrl)
    return transformedUrl
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
  } else {
    console.log("[v0] No affiliate code found")
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
    console.log("[v0] Opening affiliate URL:", finalUrl)
  } else {
    console.log("[v0] Opening original URL (no affiliate):", finalUrl)
  }

  window.open(finalUrl, "_blank")
}
