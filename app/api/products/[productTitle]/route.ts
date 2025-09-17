import { type NextRequest, NextResponse } from "next/server"
import { getAffiliateApiUrl } from "@/lib/affiliate"

export async function GET(request: NextRequest, { params }: { params: { productTitle: string } }) {
  const { productTitle } = params

  try {
    const { searchParams } = new URL(request.url)
    const affiliateCode = searchParams.get("affiliate")

    console.log("[v0] [PHP_AFFILIATE] ProductTitle API called for:", productTitle, "with affiliate:", affiliateCode)

    const baseApiUrl = `https://api.voxlis.net/resellers/${productTitle}`
    const apiUrl = getAffiliateApiUrl(baseApiUrl, affiliateCode || undefined)

    const response = await fetch(apiUrl, {
      headers: {
        "Cache-Control": "no-cache",
        "User-Agent": "KeyEmpire-Frontend/1.0",
      },
    })

    if (!response.ok) {
      console.error("[v0] [PHP_AFFILIATE] PHP API error:", response.status, response.statusText)
      return new NextResponse(
        JSON.stringify({ error: `Failed to fetch data from external API: ${response.statusText}` }),
        { status: response.status, headers: { "Content-Type": "application/json" } },
      )
    }

    const data = await response.json()
    console.log(
      "[v0] [PHP_AFFILIATE] Successfully fetched data for:",
      productTitle,
      "resellers:",
      Object.keys(data).length,
    )

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[v0] [PHP_AFFILIATE] Error in API route:", error)
    return new NextResponse(JSON.stringify({ error: "Internal Server Error", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
