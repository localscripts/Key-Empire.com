import { LocalAffiliateService } from "../lib/services/affiliate-service"

async function testScraper() {
  console.log("🚀 Starting scraper test...")

  try {
    const affiliateService = LocalAffiliateService.getInstance()

    console.log("📡 Fetching resellers data...")
    const resellers = await affiliateService.getResellersData("voxlis")

    console.log("📊 Results:")
    console.log(`Found ${Object.keys(resellers).length} products`)

    for (const [productName, productResellers] of Object.entries(resellers)) {
      console.log(`\n🎮 ${productName}:`)
      console.log(`  - ${Object.keys(productResellers).length} resellers`)

      for (const [resellerName, resellerData] of Object.entries(productResellers)) {
        const durationsCount = Object.keys(resellerData.durations).length
        console.log(`    • ${resellerName}: ${durationsCount} durations, verified: ${resellerData.verified}`)
      }
    }

    console.log("\n✅ Scraper test completed successfully!")
  } catch (error) {
    console.error("❌ Scraper test failed:", error)
  }
}

testScraper()
