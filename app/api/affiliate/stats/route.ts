import { type NextRequest, NextResponse } from "next/server"
import { LocalAffiliateService } from "../../../../lib/services/affiliate-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const affiliateCode = searchParams.get("code")

    if (!affiliateCode) {
      return NextResponse.json({ error: "Affiliate code is required" }, { status: 400 })
    }

    const affiliateService = LocalAffiliateService.getInstance()
    const stats = await affiliateService.getAffiliateStats(affiliateCode)

    return NextResponse.json(stats, {
      headers: {
        "Cache-Control": "private, no-cache",
      },
    })
  } catch (error: any) {
    console.error("Error in affiliate stats API:", error)
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 })
  }
}
