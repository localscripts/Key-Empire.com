import { type NextRequest, NextResponse } from "next/server"

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

    if (!products || !Array.isArray(products) || products.length === 0) {
      return new NextResponse(JSON.stringify({ error: "Invalid request: products array is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    console.log("Batch fetch requested for:", products.length, "products")

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

              const response = await fetch(`https://api.voxlis.net/products/cryptic-${platform}.json`, {
                signal: controller.signal,
                headers: { "Cache-Control": "no-cache" },
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
              console.log(`Failed to fetch Cryptic ${platform}:`, error)
            }
          })

          await Promise.allSettled(platformPromises)
          batchResults[productTitle] = { resellers: crypticResults }
        } else {
          // Regular product fetch
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 5000)

          const response = await fetch(`https://api.voxlis.net/products/${productTitle.toLowerCase()}.json`, {
            signal: controller.signal,
            headers: { "Cache-Control": "no-cache" },
          })

          clearTimeout(timeoutId)

          if (response.ok) {
            const data = await response.json()
            batchResults[productTitle] = { resellers: data }
          } else {
            console.log(`Failed to fetch ${productTitle}:`, response.status)
            batchResults[productTitle] = { resellers: {} }
          }
        }
      } catch (error) {
        console.log(`Error fetching ${productTitle}:`, error)
        batchResults[productTitle] = { resellers: {} }
      }
    })

    const globalTimeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Batch request timeout")), 10000),
    )

    try {
      await Promise.race([Promise.allSettled(fetchPromises), globalTimeout])
    } catch (error) {
      console.log("Batch request timed out, returning partial results")
    }

    console.log("Batch fetch completed for", Object.keys(batchResults).length, "products")

    return NextResponse.json(batchResults, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Content-Type": "application/json",
      },
    })
  } catch (error: any) {
    console.error("Error in batch API route:", error)
    return new NextResponse(JSON.stringify({ error: "Internal Server Error", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
