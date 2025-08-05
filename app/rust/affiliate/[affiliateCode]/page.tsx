"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Cookies from "js-cookie"

export default function CounterStrike2AffiliatePage() {
  const params = useParams()
  const router = useRouter()
  const affiliateCode = params.affiliateCode as string

  useEffect(() => {
    if (affiliateCode) {
      Cookies.set("affiliate_code", affiliateCode, { expires: 30, path: "/" })
      router.replace("/rust")
    }
  }, [affiliateCode, router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white dark:bg-white dark:text-gray-900">
      <p>Redirecting to Rust page...</p>
    </div>
  )
}

export async function generateStaticParams() {
  const affiliateCodes = ["majster"]

  return affiliateCodes.map(code => ({
    affiliateCode: code,
  }))
}
