"use client"

import { useEffect } from "react"

export default function DiscordRedirect() {
  useEffect(() => {
    // Try multiple redirect methods for better compatibility
    const redirectToDiscord = () => {
      // Use a more reliable Discord invite link
      const discordUrl = "https://discord.gg/keyempire"

      try {
        // Method 1: Direct window location
        window.location.href = discordUrl
      } catch (error) {
        // Method 2: Fallback using window.open
        window.open(discordUrl, "_self")
      }
    }

    // Small delay to ensure page loads properly
    const timer = setTimeout(redirectToDiscord, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-200 max-w-md">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Redirecting to Discord...</h2>
        <p className="text-gray-600 mb-4">You'll be redirected to our Discord server shortly.</p>

        {/* Manual fallback link */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Not redirecting automatically?</p>
          <a
            href="https://discord.gg/keyempire"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
          >
            Click here to join Discord
          </a>
        </div>
      </div>
    </div>
  )
}
