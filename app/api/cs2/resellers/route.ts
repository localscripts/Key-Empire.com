import { type NextRequest, NextResponse } from "next/server"
import { CS2AffiliateService } from "../../../../lib/services/cs2-affiliate-service"
import { getAffiliateCode } from "../../../../lib/server-affiliate-utils"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const affiliateCode = getAffiliateCode(searchParams, request)

    const cs2Service = CS2AffiliateService.getInstance()
    const resellers = await cs2Service.getCS2ResellersData(affiliateCode)

    return NextResponse.json(resellers, {
      headers: {
        "Cache-Control": "public, s-maxage=180, stale-while-revalidate=300",
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to fetch CS2 resellers data",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
