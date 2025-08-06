import { type NextRequest, NextResponse } from "next/server"

// Generate static params for all possible product titles
export async function generateStaticParams() {
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
    productTitle,
  }))
}

export async function GET(
  request: NextRequest,
  { params }: { params: { productTitle: string } }
) {
  const { productTitle } = params

  try {
    const externalApiUrl = `https://api.voxlis.net/products/${productTitle}.json`

    const response = await fetch(externalApiUrl, {
      cache: "no-store",
      headers: { "User-Agent": "NextJS-Fresh-Fetch/1.0" },
    })

    if (!response.ok) {
      return new NextResponse(
        JSON.stringify({
          error: `Failed to fetch data from external API: ${response.statusText}`,
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    // parse the JSON body—you’ll always get the full payload
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error in API route:", error)
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error", details: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}
