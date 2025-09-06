"use client"

import { useEffect } from "react"

export default function DiscordRedirect() {
  useEffect(() => {
    // Redirect to Discord invite link
    window.location.href = "https://discord.gg/keyempire"
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold mb-2">Redirecting to Discord...</h1>
        <p className="text-indigo-100">
          If you're not redirected automatically,{" "}
          <a href="https://discord.gg/keyempire" className="underline hover:text-white">
            click here
          </a>
        </p>
      </div>
    </div>
  )
}
