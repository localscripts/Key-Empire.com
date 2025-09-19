import { type NextRequest, NextResponse } from "next/server"
import { LocalAffiliateService } from "../../../../lib/services/affiliate-service"
import { generateSecurePassword, hashPassword } from "../../../../lib/utils/password-generator"
import fs from "fs/promises"
import path from "path"

const AFFILIATES_FILE = path.join(process.cwd(), "data", "affiliates.json")

interface AffiliateRecord {
  code: string
  passwordHash: string
  createdAt: string
  clicks: number
  conversions: number
  earnings: number
}

async function loadAffiliates(): Promise<{ [code: string]: AffiliateRecord }> {
  try {
    const data = await fs.readFile(AFFILIATES_FILE, "utf-8")
    return JSON.parse(data)
  } catch {
    return {}
  }
}

async function saveAffiliates(affiliates: { [code: string]: AffiliateRecord }): Promise<void> {
  await fs.mkdir(path.dirname(AFFILIATES_FILE), { recursive: true })
  await fs.writeFile(AFFILIATES_FILE, JSON.stringify(affiliates, null, 2))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { affiliateCode } = body

    if (!affiliateCode || typeof affiliateCode !== "string") {
      return NextResponse.json({ error: "Valid affiliate code is required" }, { status: 400 })
    }

    // Validate affiliate code format (alphanumeric, underscore, hyphen only)
    if (!/^[a-zA-Z0-9_-]+$/.test(affiliateCode)) {
      return NextResponse.json(
        { error: "Affiliate code can only contain letters, numbers, underscores, and hyphens" },
        { status: 400 },
      )
    }

    if (affiliateCode.length < 3 || affiliateCode.length > 20) {
      return NextResponse.json({ error: "Affiliate code must be between 3 and 20 characters" }, { status: 400 })
    }

    // Load existing affiliates
    const affiliates = await loadAffiliates()

    // Check if affiliate code already exists
    if (affiliates[affiliateCode]) {
      return NextResponse.json(
        { error: "Affiliate code already exists. Please choose a different one." },
        { status: 409 },
      )
    }

    const securePassword = generateSecurePassword(32)
    const passwordHash = hashPassword(securePassword)

    // Create new affiliate record
    const newAffiliate: AffiliateRecord = {
      code: affiliateCode,
      passwordHash,
      createdAt: new Date().toISOString(),
      clicks: 0,
      conversions: 0,
      earnings: 0,
    }

    affiliates[affiliateCode] = newAffiliate
    await saveAffiliates(affiliates)

    // Also initialize in the affiliate service
    const affiliateService = LocalAffiliateService.getInstance()
    await affiliateService.trackClick(affiliateCode) // This will create the stats entry

    return NextResponse.json({
      success: true,
      affiliateCode,
      password: securePassword,
      affiliateUrl: `key-empire.com/affiliate/${affiliateCode}`,
    })
  } catch (error: any) {
    console.error("Error generating affiliate code:", error)
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const affiliateCode = searchParams.get("code")
    const password = searchParams.get("password")

    if (!affiliateCode) {
      return NextResponse.json({ error: "Affiliate code is required" }, { status: 400 })
    }

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 401 })
    }

    const affiliates = await loadAffiliates()
    const affiliate = affiliates[affiliateCode]

    if (!affiliate) {
      return NextResponse.json({ error: "Affiliate code not found" }, { status: 404 })
    }

    const providedPasswordHash = hashPassword(password)
    if (providedPasswordHash !== affiliate.passwordHash) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    // Get updated stats from affiliate service
    const affiliateService = LocalAffiliateService.getInstance()
    const stats = await affiliateService.getAffiliateStats(affiliateCode)

    return NextResponse.json({
      code: affiliate.code,
      createdAt: affiliate.createdAt,
      ...stats,
      affiliateUrl: `key-empire.com/affiliate/${affiliateCode}`,
    })
  } catch (error: any) {
    console.error("Error fetching affiliate data:", error)
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 })
  }
}
