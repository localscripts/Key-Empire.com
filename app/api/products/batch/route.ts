import { type NextRequest, NextResponse } from "next/server"
import { LocalAffiliateService } from "../../../../lib/services/affiliate-service"
import { getAffiliateCode } from "../../../../lib/server-affiliate-utils"

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

    const affiliateCode = getAffiliateCode(searchParams, request)

    if (!products || !Array.isArray(products) || products.length === 0) {
      return new NextResponse(JSON.stringify({ error: "Invalid request: products array is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const affiliateService = LocalAffiliateService.getInstance()
    const batchResults: Record<string, any> = {}

    const fetchPromises = products.map(async (productTitle) => {
      try {
        const productResellers = await affiliateService.getProductResellers(productTitle, affiliateCode)
        batchResults[productTitle] = { resellers: productResellers }
      } catch (error) {
        batchResults[productTitle] = { resellers: {} }
      }
    })

    const globalTimeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Batch request timeout")), 10000),
    )

    try {
      await Promise.race([Promise.allSettled(fetchPromises), globalTimeout])
    } catch (error) {}

    return NextResponse.json(batchResults, {
      headers: {
        "Cache-Control": "public, s-maxage=180, stale-while-revalidate=300",
        "Content-Type": "application/json",
      },
    })
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: "Internal Server Error", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const affiliateCode = getAffiliateCode(searchParams, request)

    const affiliateService = LocalAffiliateService.getInstance()
    const allResellers = await affiliateService.getResellersData(affiliateCode)

    // Format as batch response
    const batchResults: Record<string, any> = {}
    for (const [productName, resellers] of Object.entries(allResellers)) {
      batchResults[productName] = { resellers }
    }

    return NextResponse.json(batchResults, {
      headers: {
        "Cache-Control": "public, s-maxage=180, stale-while-revalidate=300",
        "Content-Type": "application/json",
      },
    })
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: "Internal Server Error", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
