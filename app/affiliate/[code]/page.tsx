"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AffiliateManager } from "../../../lib/affiliate-utils"
import LoadingScreen from "../../../components/loading-screen"

interface AffiliateCodePageProps {
  params: {
    code: string
  }
}

export default function AffiliateCodePage({ params }: AffiliateCodePageProps) {
  const router = useRouter()

  useEffect(() => {
    const affiliateCode = decodeURIComponent(params.code)

    // Create affiliate manager instance with the code from URL
    const affiliateManager = new AffiliateManager(affiliateCode)

    // Store the affiliate code in cookies
    affiliateManager.setAffiliateCode(affiliateCode)

    // Redirect to homepage after a brief delay
    setTimeout(() => {
      router.push("/")
    }, 1000)
  }, [params.code, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <LoadingScreen onLoadingComplete={() => {}} />
        <div className="mt-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Setting up your affiliate link...
          </h1>
          <p className="text-gray-600 dark:text-gray-400">You'll be redirected to the homepage shortly.</p>
        </div>
      </div>
    </div>
  )
}
