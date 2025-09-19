import { cookies } from "next/headers"

/**
 * Server-side utility to get affiliate code from cookies or URL parameters
 */
export function getAffiliateCode(searchParams?: URLSearchParams, request?: Request): string {
  // First check URL parameters
  if (searchParams) {
    const urlAffiliate = searchParams.get("affiliate")
    if (urlAffiliate && urlAffiliate.trim()) {
      return urlAffiliate.trim()
    }
  }

  // Then check cookies
  try {
    const cookieStore = cookies()
    const affiliateCookie = cookieStore.get("affiliate_code")
    if (affiliateCookie?.value && affiliateCookie.value.trim()) {
      const decodedAffiliate = decodeURIComponent(affiliateCookie.value).trim()
      return decodedAffiliate
    }
  } catch (error) {}

  return "voxlisnet"
}
