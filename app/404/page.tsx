"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Custom404Page() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to home page immediately
    router.push("/")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Redirecting...</h2>
        <p className="text-gray-600">Taking you back to the home page.</p>
      </div>
    </div>
  )
}
