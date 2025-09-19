// Test script to check if external APIs are working
const RESELLER_SITES = [
  {
    url: "https://raw.githubusercontent.com/aqrithebigman/keyempirestuff/refs/heads/main/endpoint.json",
    verified: false,
  },
  {
    url: "https://raw.githubusercontent.com/ilyaqqqq/keyempire/refs/heads/main/endpoint.json",
    verified: true,
  },
]

async function testExternalAPIs() {
  console.log("[v0] Testing external APIs...")

  for (const [index, site] of RESELLER_SITES.entries()) {
    console.log(`\n[v0] Testing site ${index + 1}: ${site.url}`)

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      const response = await fetch(site.url, {
        headers: {
          "User-Agent": "KeyEmpire-Scraper/5.0",
          Accept: "application/json",
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      console.log(`[v0] Response status: ${response.status}`)
      console.log(`[v0] Response headers:`, Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        console.error(`[v0] Failed to fetch: ${response.status} ${response.statusText}`)
        continue
      }

      const data = await response.json()
      console.log(`[v0] Data type:`, typeof data)
      console.log(`[v0] Data keys:`, Object.keys(data))
      console.log(`[v0] Sample data:`, JSON.stringify(data, null, 2).substring(0, 500) + "...")

      // Check for specific products
      const sampleReseller = Object.keys(data)[0]
      if (sampleReseller) {
        console.log(`[v0] Sample reseller: ${sampleReseller}`)
        console.log(
          `[v0] Sample reseller data:`,
          JSON.stringify(data[sampleReseller], null, 2).substring(0, 300) + "...",
        )
      }
    } catch (error: any) {
      console.error(`[v0] Error testing ${site.url}:`, error.message)
      if (error.name === "AbortError") {
        console.error(`[v0] Request timed out`)
      }
    }
  }

  console.log("\n[v0] External API testing complete")
}

testExternalAPIs().catch(console.error)
