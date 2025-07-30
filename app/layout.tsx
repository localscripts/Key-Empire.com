import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"

export const metadata: Metadata = {
  title: "Key-Empire - Premium Executor Marketplace",
  description:
    "Your trusted marketplace for premium executors, scripts, and digital tools. Join thousands of satisfied customers worldwide with 24/7 support and instant delivery.",
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
    title: "Key-Empire - Premium Executor Marketplace",
    description:
      "Your trusted marketplace for premium executors, scripts, and digital tools. Join thousands of satisfied customers worldwide with 24/7 support and instant delivery.",
    images: [
      {
        url: "/images/key-empire-logo.png",
        width: 1200,
        height: 630,
        alt: "Key-Empire - Premium Executor Marketplace",
        type: "image/png",
      },
    ],
  },

  // Twitter Card tags
  twitter: {
    card: "summary_large_image",
    site: "@KeyEmpire",
    creator: "@KeyEmpire",
    title: "Key-Empire - Premium Executor Marketplace",
    description:
      "Your trusted marketplace for premium executors, scripts, and digital tools. Join thousands of satisfied customers worldwide with 24/7 support and instant delivery.",
    images: ["/images/key-empire-logo.png"],
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

  // Verification tags (add your actual verification codes)
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Additional meta tags for better Discord embed support */}
        <meta name="theme-color" content="#80E26F" />
        <meta name="msapplication-TileColor" content="#80E26F" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* Discord-specific meta tags */}
        <meta property="og:site_name" content="Key-Empire" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Key-Empire - Premium Executor Marketplace" />
        <meta
          property="og:description"
          content="Your trusted marketplace for premium executors, scripts, and digital tools. Join thousands of satisfied customers worldwide with 24/7 support and instant delivery."
        />
        <meta property="og:image" content="/images/key-empire-logo.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Key-Empire - Premium Executor Marketplace" />
        <meta property="og:url" content="https://key-empire.com" />

        {/* Twitter Card meta tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@KeyEmpire" />
        <meta name="twitter:creator" content="@KeyEmpire" />
        <meta name="twitter:title" content="Key-Empire - Premium Executor Marketplace" />
        <meta
          name="twitter:description"
          content="Your trusted marketplace for premium executors, scripts, and digital tools. Join thousands of satisfied customers worldwide with 24/7 support and instant delivery."
        />
        <meta name="twitter:image" content="/images/key-empire-logo.png" />

        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/images/key-empire-logo.png" />

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
