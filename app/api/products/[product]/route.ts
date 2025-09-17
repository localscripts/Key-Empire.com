import { type NextRequest, NextResponse } from "next/server"
import { getAffiliateApiUrl } from "@/lib/affiliate"

export async function GET(request: NextRequest, { params }: { params: { product: string } }) {
  try {
    const { product } = params
    const { searchParams } = new URL(request.url)
    const affiliateCode = searchParams.get("affiliate")

    console.log("[v0] [PHP_AFFILIATE] Product API called for:", product, "with affiliate:", affiliateCode)

    const baseApiUrl = `https://api.voxlis.net/resellers/${product}`
    const apiUrl = getAffiliateApiUrl(baseApiUrl, affiliateCode || undefined)

    const response = await fetch(apiUrl, {
      headers: {
        "Cache-Control": "no-cache",
        "User-Agent": "KeyEmpire-Frontend/1.0",
      },
    })

    if (!response.ok) {
      console.error("[v0] [PHP_AFFILIATE] PHP API error:", response.status, response.statusText)
      return NextResponse.json({ error: "Failed to fetch product data" }, { status: response.status })
    }

    const data = await response.json()
    console.log("[v0] [PHP_AFFILIATE] Successfully fetched data for:", product, "resellers:", Object.keys(data).length)

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] [PHP_AFFILIATE] API route error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
