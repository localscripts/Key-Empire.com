"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Cookies from "js-cookie"

export default function AffiliatePage() {
  const params = useParams()
  const router = useRouter()
  const affiliateCode = params.affiliateCode as string

  useEffect(() => {
    if (affiliateCode) {
      // Set the affiliate code in a cookie that expires in 30 days
      Cookies.set("affiliate_code", affiliateCode, { expires: 30, path: "/" })
      // Redirect to the main selections page
      router.replace("/selections")
    }
  }, [affiliateCode, router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white dark:bg-white dark:text-gray-900">
      <p>Redirecting to selections page...</p>
    </div>
  )
}
