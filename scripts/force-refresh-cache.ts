import { LocalAffiliateService } from "../lib/services/affiliate-service"

async function forceRefreshCache() {
  console.log("[v0] Force refreshing affiliate cache...")

  const affiliateService = LocalAffiliateService.getInstance()

  // Clear the cache by setting lastUpdated to a very old date
  const fs = await import("fs/promises")
  const path = await import("path")

  const DATA_DIR = path.join(process.cwd(), "data")
  const AFFILIATE_DATA_FILE = path.join(DATA_DIR, "affiliate-data.json")

  try {
    const data = await fs.readFile(AFFILIATE_DATA_FILE, "utf-8")
    const parsedData = JSON.parse(data)

    // Set lastUpdated to force refresh
    parsedData.lastUpdated = new Date(0).toISOString()

    await fs.writeFile(AFFILIATE_DATA_FILE, JSON.stringify(parsedData, null, 2))
    console.log("[v0] Cache timestamp reset, forcing refresh...")

    // Now fetch fresh data
    const freshData = await affiliateService.getResellersData("voxlis")

    console.log("[v0] Fresh data fetched:")
    Object.entries(freshData).forEach(([productName, resellers]) => {
      console.log(`[v0] - ${productName}: ${Object.keys(resellers).length} resellers`)
    })
  } catch (error) {
    console.error("[v0] Error force refreshing cache:", error)
  }
}

forceRefreshCache()
