import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { productTitle: string } }) {
  const { productTitle } = params

  try {
    const externalApiUrl = `https://api.voxlis.net/products/${productTitle}.json`
    const response = await fetch(externalApiUrl)

    if (!response.ok) {
      // If the external API returns an error, propagate it
      return new NextResponse(
        JSON.stringify({ error: `Failed to fetch data from external API: ${response.statusText}` }),
        { status: response.status, headers: { "Content-Type": "application/json" } },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error in API route:", error)
    return new NextResponse(JSON.stringify({ error: "Internal Server Error", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
