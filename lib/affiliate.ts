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

// Create API URL with affiliate parameter for PHP processing
export const getAffiliateApiUrl = (baseUrl: string, affiliateCode?: string): string => {
  if (!affiliateCode) return baseUrl

  try {
    const url = new URL(baseUrl)
    url.searchParams.set("affiliate", affiliateCode)
    const affiliateUrl = url.toString()
    console.log("[v0] API URL with affiliate code:", affiliateUrl)
    return affiliateUrl
  } catch (error) {
    console.error("[v0] Error creating affiliate API URL:", error)
    return baseUrl
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

export const handleAffiliateClick = (url: string): void => {
  console.log("[v0] Opening URL (pre-transformed by PHP):", url)
  window.open(url, "_blank")
}
