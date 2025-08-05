"use client"

import { useEffect } from "react"

export default function DiscordRedirect() {
  useEffect(() => {
    window.location.href = "https://discord.gg/KfaQHtD9Ap"
  }, [])

  return null
}
