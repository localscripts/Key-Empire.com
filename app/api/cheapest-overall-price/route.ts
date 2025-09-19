import { NextResponse } from "next/server"
import { LocalAffiliateService } from "../../../lib/services/affiliate-service"

export async function GET() {
  try {
    const affiliateService = LocalAffiliateService.getInstance()
    const cheapestPrice = await affiliateService.getCheapestOverallPrice()

    if (cheapestPrice === 0) {
      return NextResponse.json({
        cheapestPrice: "N/A",
        message: "No valid prices found.",
      })
    }

    return NextResponse.json(
      {
        cheapestPrice: cheapestPrice,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      },
    )
  } catch (error: any) {
    console.error("Error in cheapest-overall-price API route:", error)
    return new NextResponse(JSON.stringify({ error: "Internal Server Error", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
