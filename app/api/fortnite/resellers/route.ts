import { type NextRequest, NextResponse } from "next/server"
import { RustAffiliateService } from "../../../../lib/services/rust-affiliate-service"
import { getAffiliateCode } from "../../../../lib/server-affiliate-utils"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const affiliateCode = getAffiliateCode(searchParams, request)

    const rustService = RustAffiliateService.getInstance()
    const resellers = await rustService.getRustResellersData(affiliateCode)

    return NextResponse.json(resellers, {
      headers: {
        "Cache-Control": "public, s-maxage=180, stale-while-revalidate=300",
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to fetch Rust resellers data",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
