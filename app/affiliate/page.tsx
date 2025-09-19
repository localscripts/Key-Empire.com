"use client"

import { useState } from "react"
import { useAffiliate } from "../../lib/affiliate-utils"
import Navbar from "../../navbar"
import { Copy, Check } from "lucide-react"

export default function AffiliateGenerator() {
  const { affiliateCode, setAffiliateCode } = useAffiliate()
  const [customCode, setCustomCode] = useState("")
  const [affiliateLink, setAffiliateLink] = useState("")
  const [copied, setCopied] = useState(false)

  const generateLink = () => {
    if (!customCode.trim()) return

    const code = customCode.trim()
    setAffiliateCode(code)

    if (typeof window !== "undefined") {
      const baseUrl = window.location.origin
      const link = `${baseUrl}/affiliate/${code}`
      setAffiliateLink(link)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(affiliateLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />

      <main className="px-4 py-8 mt-32 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Generate Your Affiliate Link
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Create your custom affiliate link to start earning commissions
            </p>
          </div>

          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enter Your Affiliate Code
                </label>
                <input
                  type="text"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  placeholder="Enter your affiliate code (e.g., myaffiliate123)"
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Use letters, numbers, hyphens, and underscores only
                </p>
              </div>

              <button
                onClick={generateLink}
                disabled={!customCode.trim()}
                className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Generate Affiliate Link
              </button>

              {affiliateLink && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="text-sm text-green-800 dark:text-green-200 mb-2">Your Affiliate Link:</div>
                  <div className="flex items-center gap-2 bg-white dark:bg-gray-700 rounded-lg p-3">
                    <code className="flex-1 text-sm text-gray-800 dark:text-gray-200 break-all">{affiliateLink}</code>
                    <button
                      onClick={handleCopyLink}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md transition-colors duration-200"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-2">
                    Share this link to earn commissions on all purchases made through it!
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">How it works:</h3>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Generate your unique affiliate link above</li>
                <li>• Share it with friends or on social media</li>
                <li>
                  • When someone visits through your link, all reseller links automatically use your affiliate code
                </li>
                <li>• Earn commissions on every purchase made!</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
