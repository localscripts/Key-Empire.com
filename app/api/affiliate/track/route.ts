import { type NextRequest, NextResponse } from "next/server"
import { LocalAffiliateService } from "../../../../lib/services/affiliate-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { affiliateCode, type, amount } = body

    if (!affiliateCode || !type) {
      return NextResponse.json({ error: "Affiliate code and type are required" }, { status: 400 })
    }

    const affiliateService = LocalAffiliateService.getInstance()

    if (type === "click") {
      await affiliateService.trackClick(affiliateCode)
    } else if (type === "conversion" && amount) {
      await affiliateService.trackConversion(affiliateCode, Number.parseFloat(amount))
    } else {
      return NextResponse.json({ error: "Invalid tracking type or missing amount for conversion" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error in affiliate tracking API:", error)
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 })
  }
}
