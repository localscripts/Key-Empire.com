import { type NextRequest, NextResponse } from "next/server"
import { getAffiliateApiUrl } from "@/lib/affiliate"

interface BatchRequest {
  products: string[]
  timestamp?: number
}

interface DurationPricing {
  price: string
  url: string
}

interface ApiResellerEntry {
  payments: string[]
  durations: {
    [key: string]: DurationPricing
  }
  premium?: boolean
  pfp?: string
  verified?: boolean
}

interface ApiProductResellersResponse {
  [key: string]: ApiResellerEntry
}

export async function POST(request: NextRequest) {
  try {
    const body: BatchRequest = await request.json()
    const { products } = body

    const { searchParams } = new URL(request.url)
    const affiliateCode = searchParams.get("affiliate")

    if (!products || !Array.isArray(products) || products.length === 0) {
      return new NextResponse(JSON.stringify({ error: "Invalid request: products array is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    console.log(
      "[v0] [PHP_AFFILIATE] Batch fetch requested for:",
      products.length,
      "products",
      "with affiliate:",
      affiliateCode,
    )

    const batchResults: Record<string, ApiProductResellersResponse> = {}
    const fetchPromises = products.map(async (productTitle) => {
      try {
        // Handle Cryptic special case - fetch all platforms
        if (productTitle === "Cryptic") {
          const crypticPlatforms = ["windows", "macos", "ios", "android"]
          const crypticResults: Record<string, ApiResellerEntry> = {}

          const platformPromises = crypticPlatforms.map(async (platform) => {
            try {
              const controller = new AbortController()
              const timeoutId = setTimeout(() => controller.abort(), 5000)

              const baseApiUrl = `https://api.voxlis.net/resellers/cryptic-${platform}`
              const apiUrl = getAffiliateApiUrl(baseApiUrl, affiliateCode || undefined)

              const response = await fetch(apiUrl, {
                signal: controller.signal,
                headers: {
                  "Cache-Control": "no-cache",
                  "User-Agent": "KeyEmpire-Frontend/1.0",
                },
              })

              clearTimeout(timeoutId)

              if (response.ok) {
                const data = await response.json()
                // Merge platform data into cryptic results
                Object.entries(data).forEach(([resellerName, resellerData]) => {
                  if (!crypticResults[resellerName]) {
                    crypticResults[resellerName] = resellerData as ApiResellerEntry
                  } else {
                    // Merge durations from different platforms
                    crypticResults[resellerName].durations = {
                      ...crypticResults[resellerName].durations,
                      ...(resellerData as ApiResellerEntry).durations,
                    }
                  }
                })
              }
            } catch (error) {
              console.log(`[v0] [PHP_AFFILIATE] Failed to fetch Cryptic ${platform}:`, error)
            }
          })

          await Promise.allSettled(platformPromises)
          batchResults[productTitle] = { resellers: crypticResults }
        } else {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 5000)

          const baseApiUrl = `https://api.voxlis.net/resellers/${productTitle.toLowerCase()}`
          const apiUrl = getAffiliateApiUrl(baseApiUrl, affiliateCode || undefined)

          const response = await fetch(apiUrl, {
            signal: controller.signal,
            headers: {
              "Cache-Control": "no-cache",
              "User-Agent": "KeyEmpire-Frontend/1.0",
            },
          })

          clearTimeout(timeoutId)

          if (response.ok) {
            const data = await response.json()
            batchResults[productTitle] = { resellers: data }
          } else {
            console.log(`[v0] [PHP_AFFILIATE] Failed to fetch ${productTitle}:`, response.status)
            batchResults[productTitle] = { resellers: {} }
          }
        }
      } catch (error) {
        console.log(`[v0] [PHP_AFFILIATE] Error fetching ${productTitle}:`, error)
        batchResults[productTitle] = { resellers: {} }
      }
    })

    const globalTimeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Batch request timeout")), 10000),
    )

    try {
      await Promise.race([Promise.allSettled(fetchPromises), globalTimeout])
    } catch (error) {
      console.log("[v0] [PHP_AFFILIATE] Batch request timed out, returning partial results")
    }

    console.log("[v0] [PHP_AFFILIATE] Batch fetch completed for", Object.keys(batchResults).length, "products")

    return NextResponse.json(batchResults, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Content-Type": "application/json",
      },
    })
  } catch (error: any) {
    console.error("[v0] [PHP_AFFILIATE] Error in batch API route:", error)
    return new NextResponse(JSON.stringify({ error: "Internal Server Error", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
