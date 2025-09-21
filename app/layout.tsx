import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"

export const metadata: Metadata = {
  title: "Key-Empire!",
  description:
    "Your premium marketplace for executors, scripts, and digital tools. Join thousands of satisfied customers worldwide.",
  keywords:
    "executors, scripts, premium tools, marketplace, digital products, gaming tools",
  authors: [{ name: "Key-Empire" }],
  creator: "Key-Empire",
  publisher: "Key-Empire",

  // Theme color for mobile browsers and Discord
  themeColor: "#80E26F",

  // Icons (let Next.js generate the <link> tags)
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: ["/favicon.ico"],
  },

  // Optional: PWA manifest
  manifest: "/site.webmanifest",

  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://key-empire.com",
    siteName: "Key-Empire",
    title: "Key-Empire!",
    description:
      "Your premium marketplace for executors, scripts, and digital tools. Join thousands of satisfied customers worldwide.",
    images: [
      {
        url: "/images/key-empire-banner.png",
        width: 1200,
        height: 630,
        alt: "Key-Empire - Premium Marketplace",
        type: "image/png",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    site: "@KeyEmpire",
    creator: "@KeyEmpire",
    title: "Key-Empire!",
    description:
      "Your premium marketplace for executors, scripts, and digital tools. Join thousands of satisfied customers worldwide.",
    images: ["/images/key-empire-banner.png"],
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Optional: these are now covered by `metadata.themeColor` and icons.
            Keep only what isn't covered by Metadata (like this inline font style). */}
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
