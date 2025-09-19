import { type NextRequest, NextResponse } from "next/server"
import { FortniteAffiliateService } from "../../../../lib/services/fortnite-affiliate-service"

export async function GET(request: NextRequest) {
  try {
    const affiliateService = FortniteAffiliateService.getInstance()
    const allData = await affiliateService.getAllProductsData()

    return NextResponse.json(allData, {
      headers: {
        "Cache-Control": "public, max-age=300", // 5 minutes
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch Fortnite reseller data" }, { status: 500 })
  }
}
