import { type NextRequest, NextResponse } from "next/server"
import { LocalAffiliateService } from "../../../../lib/services/affiliate-service"
import { getAffiliateCode } from "../../../../lib/server-affiliate-utils"

export async function GET(request: NextRequest, { params }: { params: { productTitle: string } }) {
  const { productTitle } = params
  const { searchParams } = new URL(request.url)

  try {
    const affiliateCode = getAffiliateCode(searchParams, request)

    const affiliateService = LocalAffiliateService.getInstance()

    if (productTitle === "cryptic") {
      return new NextResponse(
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    if (productTitle.startsWith("cryptic-")) {
      const platform = productTitle.replace("cryptic-", "")
      const validPlatforms = ["windows", "macos", "ios", "android"]

      if (!validPlatforms.includes(platform)) {
        
        return new NextResponse(
          JSON.stringify({
            error: `Invalid cryptic platform: ${platform}. Valid platforms: ${validPlatforms.join(", ")}`,
          }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          },
        )
      }

      const crypticData = await affiliateService.getProductResellers(productTitle, affiliateCode)

      if (Object.keys(crypticData).length === 0) {
        return new NextResponse(JSON.stringify({ error: `No resellers found for ${productTitle}` }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        })
      }

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
