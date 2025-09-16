"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { setAffiliateCode } from "@/lib/affiliate"

export default function AffiliatePage() {
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    const affiliateCode = params.code as string

    if (affiliateCode) {
      setAffiliateCode(affiliateCode)
      console.log("[v0] Affiliate code stored in cookie:", affiliateCode)

      // Redirect to main site with affiliate parameter
      router.replace(`/?affiliate=${affiliateCode}`)
    } else {
      // No code provided, redirect to home
      router.replace("/")
    }
  }, [params.code, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Setting up your affiliate experience...</p>
      </div>
    </div>
  )
}
