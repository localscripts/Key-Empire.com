import { type NextRequest, NextResponse } from "next/server"
import { LocalAffiliateService } from "../../../lib/services/affiliate-service"
import { getAffiliateCode } from "../../../lib/server-affiliate-utils"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const affiliateCode = getAffiliateCode(searchParams, request)

    const affiliateService = LocalAffiliateService.getInstance()
    const resellers = await affiliateService.getResellersData(affiliateCode)

    // Track the click for analytics - commented out until trackClick method is implemented
    // if (affiliateCode !== "voxlisnet") {
    //   await affiliateService.trackClick(affiliateCode)
    // }

    return NextResponse.json(resellers, {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to fetch resellers data",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
