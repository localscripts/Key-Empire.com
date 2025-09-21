import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"

export const metadata: Metadata = {
  title: "Key-Empire!",
  description:
    "Your premium marketplace for executors, scripts, and digital tools. Join thousands of satisfied customers worldwide.",
  keywords: "executors, scripts, premium tools, marketplace, digital products, gaming tools",
  authors: [{ name: "Key-Empire" }],
  creator: "Key-Empire",
  publisher: "Key-Empire",

  // Theme color for mobile browsers and Discord
  themeColor: "#80E26F",

  // Open Graph tags for Discord, Facebook, etc.
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

  // Twitter Card tags
  twitter: {
    card: "summary_large_image",
    site: "@KeyEmpire",
    creator: "@KeyEmpire",
    title: "Key-Empire!",
    description:
      "Your premium marketplace for executors, scripts, and digital tools. Join thousands of satisfied customers worldwide.",
    images: ["/images/key-empire-banner.png"],
  },

  // Additional meta tags
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
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Theme color meta tags */}
        <meta name="theme-color" content="#80E26F" />
        <meta name="msapplication-TileColor" content="#80E26F" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

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
