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
  { params }: { params: Promise<{ productTitle: string }> }
) {
  const { productTitle } = await params

  try {
    const externalApiUrl = `https://api.voxlis.net/products/${productTitle}.json`
    
    console.log(`[API] Fetching from: ${externalApiUrl}`)

    const response = await fetch(externalApiUrl, {
      method: 'GET',
      cache: "no-store",
      headers: { 
        "User-Agent": "NextJS-Fresh-Fetch/1.0",
        "Accept": "application/json",
        "Content-Type": "application/json",
        // Add cache-busting headers to prevent production caching issues
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      },
    })

    console.log(`[API] Response status: ${response.status}`)
    console.log(`[API] Response headers:`, Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      console.error(`[API] External API error for ${productTitle}:`, response.status, response.statusText)
      return new NextResponse(
        JSON.stringify({
          error: `Failed to fetch data from external API: ${response.statusText}`,
          productTitle,
          status: response.status
        }),
        {
          status: response.status,
          headers: { 
            "Content-Type": "application/json",
            "Cache-Control": "no-store, max-age=0"
          },
        }
      )
    }

    // Get raw text first to debug potential parsing issues
    const rawText = await response.text()
    console.log(`[API] Raw response length: ${rawText.length}`)
    console.log(`[API] Raw response preview: ${rawText.substring(0, 200)}...`)

    let data
    try {
      data = JSON.parse(rawText)
    } catch (parseError) {
      console.error(`[API] JSON parse error:`, parseError)
      return new NextResponse(
        JSON.stringify({
          error: "Invalid JSON response from external API",
          productTitle,
          rawResponse: rawText.substring(0, 500)
        }),
        {
          status: 500,
          headers: { 
            "Content-Type": "application/json",
            "Cache-Control": "no-store, max-age=0"
          },
        }
      )
    }
    
    console.log(`[API] Parsed data type: ${typeof data}`)
    console.log(`[API] Number of resellers: ${Object.keys(data || {}).length}`)
    console.log(`[API] Reseller names: ${Object.keys(data || {}).join(', ')}`)
    
    // Add metadata to help debug the response
    const responseData = {
      ...data,
      _meta: {
        productTitle,
        fetchedAt: new Date().toISOString(),
        resellerCount: Object.keys(data || {}).length,
        environment: process.env.NODE_ENV || 'production'
      }
    }

    return NextResponse.json(responseData, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    })
  } catch (error: any) {
    console.error(`[API] Error in API route for ${productTitle}:`, error)
    return new NextResponse(
      JSON.stringify({ 
        error: "Internal Server Error", 
        details: error.message,
        productTitle,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          "Cache-Control": "no-store, max-age=0"
        },
      }
    )
  }
}
