import { NextResponse } from "next/server"

// Define types for the external API response for better type safety
interface DurationPricing {
  price: string
  url: string
}

interface ProductEntry {
  durations: {
    [key: string]: DurationPricing
  }
  // Other product properties if any
}

interface ResellerEntry {
  products: {
    [key: string]: ProductEntry
  }
  // Other reseller properties if any
}

interface ResellersApiResponse {
  [key: string]: ResellerEntry
}

// Helper function to parse price string to a number
const parsePrice = (priceString: string): number => {
  const parsed = Number.parseFloat(priceString.replace(/[^0-9.-]+/g, ""))
  return isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed
}

export async function GET() {
  try {
    const externalApiUrl = "https://api.voxlis.net/resellers"
    const response = await fetch(externalApiUrl)

    if (!response.ok) {
      const errorBody = await response.text()
      console.error(
        `Failed to fetch from external API: Status=${response.status}, StatusText="${response.statusText}", Body="${errorBody}"`,
      )
      return new NextResponse(
        JSON.stringify({
          error: `Failed to fetch data from external API: ${response.statusText || "Unknown Error"}`,
          details: errorBody,
        }),
        { status: response.status, headers: { "Content-Type": "application/json" } },
      )
    }

    const data: ResellersApiResponse = await response.json()

    let overallLowestPrice = Number.POSITIVE_INFINITY
    let cheapestReseller: string | null = null
    let cheapestProduct: string | null = null
    let cheapestDuration: string | null = null

    // Iterate through all resellers
    for (const resellerName in data) {
      const reseller = data[resellerName]
      // Iterate through all products offered by the reseller
      for (const productName in reseller.products) {
        const product = reseller.products[productName]
        // Iterate through all durations for the product
        for (const durationKey in product.durations) {
          const duration = product.durations[durationKey]
          const price = parsePrice(duration.price)
          if (!isNaN(price) && price < overallLowestPrice) {
            overallLowestPrice = price
            cheapestReseller = resellerName
            cheapestProduct = productName
            cheapestDuration = durationKey
          }
        }
      }
    }

    if (overallLowestPrice === Number.POSITIVE_INFINITY) {
      return new NextResponse(JSON.stringify({ cheapestPrice: "N/A", message: "No valid prices found." }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    }

    return NextResponse.json({
      cheapestPrice: overallLowestPrice,
      reseller: cheapestReseller,
      product: cheapestProduct,
      duration: cheapestDuration,
    })
  } catch (error: any) {
    console.error("Error in cheapest-overall-price API route:", error)
    return new NextResponse(JSON.stringify({ error: "Internal Server Error", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
