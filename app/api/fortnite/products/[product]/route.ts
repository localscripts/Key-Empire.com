import { type NextRequest, NextResponse } from "next/server"
import { FortniteAffiliateService } from "../../../../../lib/services/fortnite-affiliate-service"

export async function GET(request: NextRequest, { params }: { params: { product: string } }) {
  try {
    const productName = params.product
    const affiliateService = FortniteAffiliateService.getInstance()
    const productData = await affiliateService.getProductData(productName)

    return NextResponse.json(productData, {
      headers: {
        "Cache-Control": "public, max-age=300", // 5 minutes
      },
    })
  } catch (error) {
    return NextResponse.json({ error: `Failed to fetch Fortnite product data for ${params.product}` }, { status: 500 })
  }
}
