import { type NextRequest, NextResponse } from "next/server"
import { LocalAffiliateService } from "../../../../lib/services/affiliate-service"
import { getAffiliateCode } from "../../../../lib/server-affiliate-utils"

export async function GET(request: NextRequest, { params }: { params: { productTitle: string } }) {
  const { productTitle } = params
  const { searchParams } = new URL(request.url)

  try {
    const affiliateCode = getAffiliateCode(searchParams, request)

    const affiliateService = LocalAffiliateService.getInstance()

    // Handle special case for Cryptic platform-specific requests
    if (productTitle.startsWith("cryptic-")) {
      const platform = productTitle.replace("cryptic-", "")

      const crypticData = await affiliateService.getProductResellers("cryptic", affiliateCode)

      return NextResponse.json(crypticData, {
        headers: {
          "Cache-Control": "public, s-maxage=180, stale-while-revalidate=300",
        },
      })
    }

    const data = await affiliateService.getProductResellers(productTitle, affiliateCode)

    if (Object.keys(data).length === 0) {
      return new NextResponse(JSON.stringify({ error: `No resellers found for product: ${productTitle}` }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=180, stale-while-revalidate=300",
      },
    })
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
        productTitle,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
