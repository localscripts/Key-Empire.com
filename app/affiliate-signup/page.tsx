"use client"

import { useState } from "react"
import Navbar from "../../navbar"
import AnimatedBackground from "../../components/animated-background"
import { DollarSign, Copy, Check, ExternalLink } from "lucide-react"

export default function AffiliateSignupPage() {
  const [affiliateCode, setAffiliateCode] = useState("")
  const [generatedLink, setGeneratedLink] = useState("")
  const [copySuccess, setCopySuccess] = useState(false)

  const generateAffiliateLink = () => {
    if (!affiliateCode.trim()) return

    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://key-empire.com"
    const link = `${baseUrl}/affiliate/${affiliateCode.trim()}`
    setGeneratedLink(link)
  }

  const copyLink = async () => {
    if (!generatedLink) return

    try {
      await navigator.clipboard.writeText(generatedLink)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      console.error("Failed to copy link:", error)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AnimatedBackground />
      <Navbar />

      <main className="px-4 py-8 mt-40 relative z-10 md:mt-32">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <DollarSign className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Join Our Affiliate Program
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Earn 15% commission on every sale you refer. Create your custom affiliate link below.
            </p>
          </div>

          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Affiliate Code
                </label>
                <input
                  type="text"
                  placeholder="Enter your unique code (e.g., YOURNAME)"
                  value={affiliateCode}
                  onChange={(e) => setAffiliateCode(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-gray-100"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Choose a unique code that represents you (letters, numbers, no spaces)
                </p>
              </div>

              <button
                onClick={generateAffiliateLink}
                disabled={!affiliateCode.trim()}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
              >
                Generate Affiliate Link
              </button>

              {generatedLink && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Affiliate Link
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={generatedLink}
                        readOnly
                        className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100"
                      />
                      <button
                        onClick={copyLink}
                        className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                      >
                        {copySuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copySuccess ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">How it works:</h3>
                    <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                      <li>• Share your affiliate link with potential customers</li>
                      <li>• When they visit through your link, all reseller links will include your affiliate code</li>
                      <li>• You earn 15% commission on every purchase they make</li>
                      <li>• Payments are processed weekly</li>
                    </ul>
                  </div>

                  <a
                    href={generatedLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Test your affiliate link <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">15%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Commission Rate</div>
            </div>
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">Weekly</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Payouts</div>
            </div>
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">24/7</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Support</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
