"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

export default function AffiliateClient({ affiliateCode }: { affiliateCode: string }) {
  const router = useRouter()

  useEffect(() => {
    if (affiliateCode) {
      Cookies.set("affiliate_code", affiliateCode, { expires: 30, path: "/" })
      router.replace("/counterstrike2")
    }
  }, [affiliateCode, router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white dark:bg-white dark:text-gray-900">
      <p>Redirecting to Counter-Strike 2 page...</p>
    </div>
  )
}
