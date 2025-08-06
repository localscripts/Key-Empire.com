import { type NextRequest, NextResponse } from "next/server"

// Generate static params for all possible product titles
export async function generateStaticParams() {
  // List of all possible product titles that might be requested
  const productTitles = [
    "zenith",
    "wave",
    "bunni",
    "cryptic",
    "cryptic-windows",
    "cryptic-macos",
    "cryptic-ios",
    "cryptic-android",
    "fluxus",
    "exoliner",
    "macsploit",
    "ronin",
    "arceusx",
    "seliware",
    "valex",
    "assembly",
    "potassium",
    "volcano",
    "codex",
    "matcha",
    "serotonin",
    "aureus",
    "isabelle",
  ]

  return productTitles.map((productTitle) => ({
    productTitle: productTitle,
  }))
}

export async function GET(request: NextRequest, { params }: { params: { productTitle: string } }) {
  const { productTitle } = params

  try {
    const externalApiUrl = `https://api.voxlis.net/products/${productTitle}.json`
    console.log(`[API Route] Fetching from external API: ${externalApiUrl}`); // Log external API URL
    const response = await fetch(externalApiUrl)

    if (!response.ok) {
      const errorBody = await response.text(); // Read response body as text for more details
      console.error(`[API Route] External API response not OK for ${externalApiUrl}: Status ${response.status}, Body: ${errorBody}`);
      // If the external API returns an error, propagate it with more detail
      return new NextResponse(
        JSON.stringify({ 
          error: `Failed to fetch data from external API: ${response.statusText}`,
          details: errorBody,
          statusCode: response.status
        }),
        { status: response.status, headers: { "Content-Type": "application/json" } },
      )
    }

    const data = await response.json()
    console.log(`[API Route] Successfully fetched data for ${productTitle}:`, data); // Log successful data
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[API Route] Error in API route:", error)
    return new NextResponse(JSON.stringify({ error: "Internal Server Error", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }

}
