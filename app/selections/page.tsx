"use client"

import { useState, useRef, useEffect } from "react"
import Navbar from "../../navbar"
import LoadingScreen from "../../components/loading-screen"
import Footer from "../../components/footer"
import AnimatedBackground from "../../components/animated-background"
import SelectionsHeroSection from "../../components/selections-hero-section"
import QuickSelectionsGrid from "../../components/quick-selections-grid"
import ProductsGrid from "../../components/products-grid"
import CrypticModal from "../../components/cryptic-modal" // Import CrypticModal
import { PAYMENT_METHODS } from "../../lib/payment-methods" // Import PAYMENT_METHODS
import Image from "next/image"

// New type definitions for API response
interface DurationPricing {
  price: string
  url: string
}

interface ApiResellerEntry {
  payments: string[]
  durations: {
    [key: string]: DurationPricing
  }
  premium?: boolean
  pfp?: string // Added pfp for profile picture URL
  verified?: boolean // Added verified flag
}

interface ApiProductResellersResponse {
  [key: string]: ApiResellerEntry
}

// Transformed reseller data structure for UI
interface ResellerData {
  name: string
  payments: string[]
  durations: {
    day1?: DurationPricing
    day3?: DurationPricing
    week1?: DurationPricing
    month1?: DurationPricing
    year1?: DurationPricing
  }
  lowestPrice: number
  isPremium: boolean
  pfpUrl: string // Added pfpUrl
  isVerified: boolean // Added isVerified
}

const initialSelections = [
  {
    id: 9,
    title: "Zenith",
    image: "/images/zenith.png",
    redirectUrl: "/phantom-suite",
    price: "$11.99", // Initial static price
    resellers: "99+", // Initial static resellers
    shadeColor: "purple",
    popular: true,
  },
  {
    id: 10,
    title: "Wave",
    image: "/images/wave.png",
    redirectUrl: "/cipher-vault",
    price: "$6.99", // Initial static price
    resellers: "99+", // Initial static resellers
    shadeColor: "cyan",
    popular: false,
  },
  {
    id: 11,
    title: "Bunni",
    image: "/images/bunni.png",
    redirectUrl: "/elite-package",
    price: "$8.99", // Initial static price
    resellers: "67", // Initial static resellers
    shadeColor: "orange",
    popular: false,
  },
  {
    id: 13, // Cryptic's ID
    title: "Cryptic",
    image: "/images/cryptic.png",
    redirectUrl: "/executor-elite",
    price: "Unknown", // Will be dynamically updated
    resellers: "N/A", // Will be dynamically updated
    shadeColor: "gray",
    popular: true,
  },
  {
    id: 12,
    title: "Fluxus",
    image: "/images/fluxus.png",
    redirectUrl: "/pro-tools",
    price: "$13.49", // Initial static price
    resellers: "99+", // Initial static resellers
    shadeColor: "slate",
    popular: true,
  },
  {
    id: 14,
    title: "Exoliner",
    image: "/images/exoliner.png",
    redirectUrl: "/",
    price: "$16.99", // Initial static price
    resellers: "54", // Initial static resellers
    shadeColor: "purple",
    popular: false,
  },
  {
    id: 15,
    title: "Macsploit",
    image: "/images/macsploit.png",
    redirectUrl: "/anime-scripts",
    price: "$5.99", // Initial static price
    resellers: "99+", // Initial static resellers
    shadeColor: "slate",
    popular: false,
  },
  {
    id: 16,
    title: "Ronin",
    image: "/images/ronin.png",
    redirectUrl: "/fox-tools",
    price: "$11.49", // Initial static price
    resellers: "73", // Initial static resellers
    shadeColor: "slate",
    popular: false,
  },
  {
    id: 17,
    title: "ArceusX",
    image: "/images/arceusx.png",
    redirectUrl: "/arceusx",
    price: "$14.99", // Initial static price
    resellers: "88", // Initial static resellers
    shadeColor: "pink",
    popular: true,
  },
]

// Function to parse price string to a number for sorting
const parsePrice = (priceString: string): number => {
  const parsed = Number.parseFloat(priceString.replace(/[^0-9.-]+/g, ""))
  return isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed // Return infinity for invalid prices
}

// Fixed duration types to display in the table
const durationTypes = [
  { key: "day1", label: "1 Day" },
  { key: "day3", label: "3 Days" },
  { key: "week1", label: "1 Week" },
  { key: "month1", label: "1 Month" },
  { key: "year1", label: "1 Year" },
]

export default function SelectionsPage() {
  const [showLoading, setShowLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [isResellersExiting, setIsResellersExiting] = useState(false)
  const [fetchedResellers, setFetchedResellers] = useState<ResellerData[]>([])
  const [fetchLoading, setFetchLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [dynamicProductInfo, setDynamicProductInfo] = useState<Record<string, { price: string; resellers: string }>>({})
  const [showCrypticModal, setShowCrypticModal] = useState(false) // State for Cryptic modal
  const [selectedCrypticPlatform, setSelectedCrypticPlatform] = useState<string | null>(null) // New state for selected Cryptic platform
  const resellersSectionRef = useRef<HTMLDivElement>(null)

  const handleLoadingComplete = () => {
    setShowLoading(false)
  }

  // Platforms for Cryptic
  const crypticPlatforms = ["windows", "macos", "ios", "android"]

  // Fetch initial data for all products on page load
  useEffect(() => {
    const fetchAllProductData = async () => {
      const newDynamicInfo: Record<string, { price: string; resellers: string }> = {}

      for (const product of initialSelections) {
        if (product.title === "Cryptic") {
          let overallLowestPrice = Number.POSITIVE_INFINITY
          let totalResellerCount = 0
          const uniqueResellers = new Set<string>() // To count unique resellers across platforms

          for (const platform of crypticPlatforms) {
            try {
              const response = await fetch(`/api/products/cryptic-${platform}`)
              if (!response.ok) {
                // If a specific platform's data is not found, treat it as no resellers/prices for that platform
                console.warn(`No data found for Cryptic ${platform}.`)
                continue
              }
              const data: ApiProductResellersResponse = await response.json()

              Object.entries(data).forEach(([resellerName, resellerData]) => {
                uniqueResellers.add(resellerName) // Add reseller to set for unique count
                Object.values(resellerData.durations).forEach((d) => {
                  const price = parsePrice(d.price)
                  if (!isNaN(price) && price < overallLowestPrice) {
                    overallLowestPrice = price
                  }
                })
              })
            } catch (e) {
              console.error(`Error fetching data for Cryptic ${platform}:`, e)
            }
          }

          totalResellerCount = uniqueResellers.size

          newDynamicInfo[product.title] = {
            price: overallLowestPrice === Number.POSITIVE_INFINITY ? "Unknown" : `$${overallLowestPrice.toFixed(2)}`,
            resellers: totalResellerCount > 0 ? `${totalResellerCount}+ sellers` : "N/A",
          }
        } else {
          // Existing logic for other products
          try {
            const response = await fetch(`/api/products/${product.title.toLowerCase()}`)
            if (!response.ok) {
              throw new Error(`Failed to fetch data for ${product.title}`)
            }
            const data: ApiProductResellersResponse = await response.json()

            let lowestPrice = Number.POSITIVE_INFINITY
            let resellerCount = 0

            const validResellers = Object.values(data).filter((reseller) => Object.keys(reseller.durations).length > 0)
            resellerCount = validResellers.length

            validResellers.forEach((resellerData) => {
              Object.values(resellerData.durations).forEach((d) => {
                const price = parsePrice(d.price)
                if (!isNaN(price) && price < lowestPrice) {
                  lowestPrice = price
                }
              })
            })

            newDynamicInfo[product.title] = {
              price: lowestPrice === Number.POSITIVE_INFINITY ? "Unknown" : `$${lowestPrice.toFixed(2)}`,
              resellers: resellerCount > 0 ? `${resellerCount}+ sellers` : "N/A",
            }
          } catch (e) {
            console.error(`Error fetching data for ${product.title}:`, e)
            newDynamicInfo[product.title] = {
              price: "Unknown",
              resellers: "N/A",
            }
          }
        }
      }
      setDynamicProductInfo(newDynamicInfo)
    }

    fetchAllProductData()
  }, []) // Run once on mount

  // Silent GET request on site load
  useEffect(() => {
    const silentFetch = async () => {
      try {
        await fetch("https://api.voxlis.net/resellers", { method: "GET" })
        // Do nothing with the response
      } catch (e) {
        console.error("Silent fetch failed:", e)
      }
    }
    silentFetch()
  }, [])

  // Fetch resellers for a specific product or Cryptic platform
  const fetchProductResellers = async (productTitle: string, platform?: string) => {
    setFetchLoading(true)
    setFetchError(null)
    setFetchedResellers([]) // Clear previous resellers

    try {
      let apiUrl = ""
      if (productTitle === "Cryptic" && platform) {
        apiUrl = `/api/products/cryptic-${platform}`
      } else {
        apiUrl = `/api/products/${productTitle.toLowerCase()}`
      }

      const response = await fetch(apiUrl)

      if (!response.ok) {
        throw new Error(`Failed to fetch data from external API: ${response.statusText}`)
      }

      const data: ApiProductResellersResponse = await response.json()

      // Transform and calculate lowest price for sorting
      const transformed: ResellerData[] = Object.entries(data).map(([resellerName, resellerData]) => {
        let lowestPrice = Number.POSITIVE_INFINITY
        const durations: ResellerData["durations"] = {}

        // Populate durations and find lowest price
        if (resellerData.durations["1"]) durations.day1 = resellerData.durations["1"]
        if (resellerData.durations["3"]) durations.day3 = resellerData.durations["3"]
        if (resellerData.durations["7"]) durations.week1 = resellerData.durations["7"]
        if (resellerData.durations["30"]) durations.month1 = resellerData.durations["30"]
        if (resellerData.durations["365"]) durations.year1 = resellerData.durations["365"]

        Object.values(resellerData.durations).forEach((d) => {
          const price = parsePrice(d.price)
          if (!isNaN(price) && price < lowestPrice) {
            lowestPrice = price
          }
        })

        return {
          name: resellerName,
          payments: resellerData.payments,
          durations,
          lowestPrice: lowestPrice === Number.POSITIVE_INFINITY ? 0 : lowestPrice, // Handle case with no valid prices
          isPremium: resellerData.premium || false, // Set premium status
          // Use key-empire-logo.png as fallback for pfp if not found or empty
          pfpUrl: resellerData.pfp && resellerData.pfp !== "" ? resellerData.pfp : "/images/key-empire-logo.png",
          isVerified: resellerData.verified || false, // Set verified status
        }
      })

      // Sort resellers by lowest price ascending
      transformed.sort((a, b) => a.lowestPrice - b.lowestPrice)

      if (transformed.length === 0 || transformed.every((r) => Object.keys(r.durations).length === 0)) {
        setFetchError("Resellers are not found for this product or platform.")
      } else {
        setFetchedResellers(transformed)
      }
    } catch (e: any) {
      console.error("Error fetching product resellers:", e)
      setFetchError("Resellers are not found for this product or platform.")
    } finally {
      setFetchLoading(false)
    }
  }

  // Handle product selection (including opening Cryptic modal)
  const handleProductSelect = (productTitle: string) => {
    if (productTitle === "Cryptic") {
      setSelectedProduct("Cryptic") // Keep Cryptic card selected
      setShowCrypticModal(true) // Open Cryptic modal
      setFetchedResellers([]) // Clear resellers table
      setFetchError(null) // Clear any previous fetch errors
      setSelectedCrypticPlatform(null) // Reset selected platform for Cryptic
    } else if (selectedProduct === productTitle) {
      // Start exit animation for other products
      setIsResellersExiting(true)
      setTimeout(() => {
        setSelectedProduct(null)
        setFetchedResellers([])
        setFetchError(null)
        setIsResellersExiting(false)
        setSelectedCrypticPlatform(null) // Ensure Cryptic platform is also reset
      }, 600)
    } else {
      setSelectedProduct(productTitle)
      setIsResellersExiting(false)
      setSelectedCrypticPlatform(null) // Clear Cryptic platform if another product is selected
      fetchProductResellers(productTitle) // Fetch data for the newly selected product
    }
  }

  // Handle platform selection from Cryptic modal
  const handleCrypticPlatformSelect = (platform: string) => {
    setSelectedCrypticPlatform(platform)
    setShowCrypticModal(false) // Close the modal
    setIsResellersExiting(false) // Ensure no exit animation is pending
    fetchProductResellers("Cryptic", platform) // Fetch resellers for the selected Cryptic platform
  }

  // Scroll to resellers section when a product is selected or a Cryptic platform is chosen
  useEffect(() => {
    if (
      (selectedProduct && !isResellersExiting) ||
      (selectedProduct === "Cryptic" && selectedCrypticPlatform && !isResellersExiting)
    ) {
      if (resellersSectionRef.current) {
        resellersSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
  }, [selectedProduct, selectedCrypticPlatform, isResellersExiting])

  // Determine which image to display in the "Welcome to Key-Empire" section
  const selectedProductDetails = selectedProduct ? initialSelections.find((s) => s.title === selectedProduct) : null
  const currentWelcomeImage = selectedProductDetails?.image || "/images/key-empire-logo.png"

  // Use the imported PAYMENT_METHODS directly
  const getPaymentIcon = (method: string) => {
    const lowerCaseMethod = method.toLowerCase()
    return (
      PAYMENT_METHODS[lowerCaseMethod]?.icon || (
        <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">{lowerCaseMethod}</span>
      )
    )
  }

  // Prepare selections for ProductsGrid with dynamic data
  const displayedSelections = initialSelections.map((selection) => ({
    ...selection,
    price: dynamicProductInfo[selection.title]?.price || selection.price, // Fallback to static if dynamic not loaded yet
    resellers: dynamicProductInfo[selection.title]?.resellers || selection.resellers, // Fallback to static
  }))

  // Determine if the resellers section should be visible
  const showResellersSection =
    (selectedProduct && selectedProduct !== "Cryptic") ||
    (selectedProduct === "Cryptic" && selectedCrypticPlatform) ||
    isResellersExiting

  return (
    <div
      className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      style={{
        backgroundImage: "url('/images/pattern-background.png')",
        backgroundRepeat: "repeat",
        backgroundSize: "400px 400px",
        backgroundPosition: "0 0",
        backgroundBlendMode: "overlay",
      }}
    >
      {/* Animated Background Bubbles */}
      <AnimatedBackground />

      {showLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}
      <Navbar />

      <main className="px-4 py-8 mt-40 relative z-10 md:mt-32">
        <div className="w-[95%] max-w-7xl mx-auto">
          {/* Hero Section */}
          <SelectionsHeroSection />

          {/* Quick Selections Section */}
          <div className="mb-16">
            <div className="max-w-6xl mx-auto px-4">
              <QuickSelectionsGrid />
            </div>
          </div>

          {/* Products Grid */}
          <ProductsGrid
            selections={displayedSelections} // Use the dynamically updated selections
            onProductSelect={handleProductSelect}
            selectedProduct={selectedProduct}
          />

          {/* Verified Resellers Section */}
          {showResellersSection && (fetchedResellers.length > 0 || fetchLoading || fetchError) && (
            <div
              className={`space-y-6 mb-8 scroll-mt-[120px] ${isResellersExiting ? "resellers-exit" : ""}`}
              ref={resellersSectionRef}
            >
              {/* Verified Resellers Banner */}
              <div
                className={`bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-700 p-8 text-center shadow-lg ${
                  isResellersExiting ? "banner-exit" : ""
                }`}
                style={{
                  opacity: isResellersExiting ? 1 : 0,
                  transform: isResellersExiting ? "translateY(0) scale(1)" : "translateY(50px) scale(0.9)",
                  animation: isResellersExiting
                    ? "resellerBannerOut 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards"
                    : "resellerBannerIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s forwards",
                }}
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div
                    className={`w-8 h-8 text-blue-600 dark:text-blue-400 ${isResellersExiting ? "icon-exit" : ""}`}
                    style={{
                      opacity: isResellersExiting ? 1 : 0,
                      transform: isResellersExiting ? "scale(1) rotate(0deg)" : "scale(0) rotate(-180deg)",
                      animation: isResellersExiting
                        ? "iconSpinOut 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards"
                        : "iconSpinIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.5s forwards",
                    }}
                  >
                    <svg fill="currentColor" viewBox="0 0 20 20" className="w-full h-full">
                      <path
                        fillRule="evenodd"
                        d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h2
                    className={`text-3xl font-bold text-gray-900 dark:text-gray-100 ${isResellersExiting ? "text-exit" : ""}`}
                    style={{
                      opacity: isResellersExiting ? 1 : 0,
                      transform: isResellersExiting ? "translateY(0)" : "translateY(20px)",
                      animation: isResellersExiting
                        ? "textSlideOut 0.4s ease-out forwards"
                        : "textSlideIn 0.6s ease-out 0.7s forwards",
                    }}
                  >
                    Verified Resellers
                  </h2>
                  <div
                    className={`w-8 h-8 text-blue-600 dark:text-blue-400 ${isResellersExiting ? "icon-exit" : ""}`}
                    style={{
                      opacity: isResellersExiting ? 1 : 0,
                      transform: isResellersExiting ? "scale(1) rotate(0deg)" : "scale(0) rotate(180deg)",
                      animation: isResellersExiting
                        ? "iconSpinOut 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards"
                        : "iconSpinIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.5s forwards",
                    }}
                  >
                    <svg fill="currentColor" viewBox="0 0 20 20" className="w-full h-full">
                      <path
                        fillRule="evenodd"
                        d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <p
                  className={`text-lg text-gray-700 dark:text-gray-300 ${isResellersExiting ? "text-exit" : ""}`}
                  style={{
                    opacity: isResellersExiting ? 1 : 0,
                    transform: isResellersExiting ? "translateY(0)" : "translateY(20px)",
                    animation: isResellersExiting
                      ? "textSlideOut 0.4s ease-out 0.1s forwards"
                      : "textSlideIn 0.6s ease-out 0.9s forwards",
                  }}
                >
                  Premium verified sellers with guaranteed quality and support for{" "}
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {selectedProduct}
                    {selectedProduct === "Cryptic" && selectedCrypticPlatform && ` (${selectedCrypticPlatform})`}
                  </span>
                  .
                </p>
              </div>

              {/* Loading State for Resellers */}
              {fetchLoading && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-2xl p-8 text-center shadow-lg">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 dark:border-blue-400"></div>
                    <p className="text-blue-800 dark:text-blue-200 font-medium">Loading resellers...</p>
                  </div>
                </div>
              )}

              {/* Error/No Resellers Found Message */}
              {fetchError && !fetchLoading && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-2xl p-6 text-center shadow-lg">
                  <p className="text-red-800 dark:text-red-200 font-medium">{fetchError}</p>
                </div>
              )}

              {/* Pricing Table */}
              {!fetchLoading && !fetchError && fetchedResellers.length > 0 && (
                <div
                  className={`bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden ${
                    isResellersExiting ? "table-exit" : ""
                  }`}
                  style={{
                    opacity: isResellersExiting ? 1 : 0,
                    transform: isResellersExiting ? "translateY(0) scale(1)" : "translateY(60px) scale(0.95)",
                    animation: isResellersExiting
                      ? "tableSlideOut 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.2s forwards"
                      : "tableSlideIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s forwards",
                  }}
                >
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                      {/* Table Header */}
                      <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
                        <tr>
                          <th className="text-left p-4 font-bold text-gray-900 dark:text-gray-100 min-w-[150px]">
                            Reseller
                          </th>
                          <th className="text-center p-4 font-bold text-gray-900 dark:text-gray-100 min-w-[120px]">
                            Payment
                          </th>
                          {durationTypes.map((duration, index) => (
                            <th
                              key={duration.key}
                              className={`text-center p-4 font-bold text-gray-900 dark:text-gray-100 min-w-[100px] ${
                                isResellersExiting ? "header-exit" : ""
                              }`}
                              style={{
                                opacity: isResellersExiting ? 1 : 0,
                                transform: isResellersExiting ? "translateY(0)" : "translateY(-20px)",
                                animation: isResellersExiting
                                  ? `headerSlideOut 0.3s ease-out ${index * 0.03}s forwards`
                                  : `headerSlideIn 0.4s ease-out ${0.6 + index * 0.05}s forwards`,
                              }}
                            >
                              {duration.label}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      {/* Table Body */}
                      <tbody>
                        {fetchedResellers.map((reseller, rowIndex) => (
                          <tr
                            key={reseller.name}
                            className={`border-b border-gray-100 dark:border-gray-600 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors duration-200 ${
                              isResellersExiting ? "row-exit" : ""
                            }`}
                            style={{
                              opacity: isResellersExiting ? 1 : 0,
                              transform: isResellersExiting ? "translateX(0)" : "translateX(-50px)",
                              animation: isResellersExiting
                                ? `rowSlideOut 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${0.1 + rowIndex * 0.05}s forwards`
                                : `rowSlideIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${1.0 + rowIndex * 0.1}s forwards`,
                            }}
                          >
                            {/* Reseller Info */}
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  {/* Reseller Avatar */}
                                  <div
                                    className={`w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-300 dark:bg-gray-600 ${
                                      isResellersExiting ? "avatar-exit" : ""
                                    }`}
                                    style={{
                                      opacity: isResellersExiting ? 1 : 0,
                                      transform: isResellersExiting ? "scale(1)" : "scale(0)",
                                      animation: isResellersExiting
                                        ? `avatarPopOut 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${0.15 + rowIndex * 0.05}s forwards`
                                        : `avatarPopIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${1.2 + rowIndex * 0.1}s forwards`,
                                    }}
                                  >
                                    <Image
                                      src={reseller.pfpUrl || "/placeholder.svg"} // Use the pfpUrl directly
                                      alt={`${reseller.name}'s profile picture`}
                                      width={40}
                                      height={40}
                                      className="object-cover w-full h-full"
                                      draggable={false}
                                    />
                                  </div>
                                  {/* Verified badge - Conditionally rendered */}
                                  {reseller.isVerified && (
                                    <div
                                      className={`absolute -top-1 -right-1 w-4 h-4 bg-blue-500 dark:bg-blue-400 rounded-full flex items-center justify-center shadow-md ${
                                        isResellersExiting ? "badge-exit" : ""
                                      }`}
                                      style={{
                                        opacity: isResellersExiting ? 1 : 0,
                                        transform: isResellersExiting
                                          ? "scale(1) rotate(0deg)"
                                          : "scale(0) rotate(-180deg)",
                                        animation: isResellersExiting
                                          ? `badgeSpinOut 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${0.2 + rowIndex * 0.05}s forwards`
                                          : `badgeSpinIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${1.4 + rowIndex * 0.1}s forwards`,
                                      }}
                                    >
                                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                          fillRule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <h4
                                    className={`font-semibold text-gray-900 dark:text-gray-100 text-sm ${
                                      isResellersExiting ? "name-exit" : ""
                                    }`}
                                    style={{
                                      opacity: isResellersExiting ? 1 : 0,
                                      transform: isResellersExiting ? "translateX(0)" : "translateX(-20px)",
                                      animation: isResellersExiting
                                        ? `nameSlideOut 0.3s ease-out ${0.1 + rowIndex * 0.05}s forwards`
                                        : `nameSlideIn 0.4s ease-out ${1.3 + rowIndex * 0.1}s forwards`,
                                    }}
                                  >
                                    {reseller.name}
                                  </h4>
                                </div>
                              </div>
                            </td>

                            {/* Payment Methods */}
                            <td className="p-4">
                              <div className="flex flex-wrap justify-center gap-2">
                                {" "}
                                {reseller.payments.map((method, methodIndex) => (
                                  <div
                                    key={methodIndex}
                                    className={`w-6 h-6 rounded flex items-center justify-center ${
                                      isResellersExiting ? "payment-icon-exit" : ""
                                    }`}
                                    style={{
                                      opacity: isResellersExiting ? 1 : 0,
                                      transform: isResellersExiting
                                        ? "scale(1) rotate(0deg)"
                                        : "scale(0) rotate(90deg)",
                                      animation: isResellersExiting
                                        ? `paymentIconOut 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${0.2 + rowIndex * 0.05 + methodIndex * 0.02}s forwards`
                                        : `paymentIconIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${1.5 + rowIndex * 0.1 + methodIndex * 0.05}s forwards`,
                                    }}
                                  >
                                    {getPaymentIcon(method)}
                                  </div>
                                ))}
                              </div>
                            </td>

                            {/* Pricing for each duration */}
                            {durationTypes.map((duration, priceIndex) => (
                              <td key={duration.key} className="p-4 text-center">
                                {reseller.durations[duration.key as keyof ResellerData["durations"]] ? (
                                  <a
                                    href={reseller.durations[duration.key as keyof ResellerData["durations"]]?.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-sm relative overflow-hidden group ${
                                      isResellersExiting ? "price-button-exit" : ""
                                    }`}
                                    style={{
                                      opacity: isResellersExiting ? 1 : 0,
                                      transform: isResellersExiting
                                        ? "translateY(0) scale(1)"
                                        : "translateY(30px) scale(0.8)",
                                      animation: isResellersExiting
                                        ? `priceButtonOut 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${0.3 + rowIndex * 0.05 + priceIndex * 0.02}s forwards`
                                        : `priceButtonIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${1.6 + rowIndex * 0.1 + priceIndex * 0.05}s forwards`,
                                    }}
                                  >
                                    <span className="relative z-10">
                                      {reseller.durations[duration.key as keyof ResellerData["durations"]]?.price}
                                    </span>
                                  </a>
                                ) : (
                                  <span
                                    className={`text-gray-500 dark:text-gray-400 text-sm opacity-0 ${
                                      isResellersExiting ? "price-button-exit" : ""
                                    }`}
                                    style={{
                                      opacity: isResellersExiting ? 1 : 0,
                                      transform: isResellersExiting
                                        ? "translateY(0) scale(1)"
                                        : "translateY(30px) scale(0.8)",
                                      animation: isResellersExiting
                                        ? `priceButtonOut 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${0.3 + rowIndex * 0.05 + priceIndex * 0.02}s forwards`
                                        : `priceButtonIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${1.6 + rowIndex * 0.1 + priceIndex * 0.05}s forwards`,
                                    }}
                                  >
                                    N/A
                                  </span>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bottom spacing */}
          <div className="h-16"></div>
        </div>
      </main>

      <Footer />

      {/* Cryptic Modal */}
      <CrypticModal
        isOpen={showCrypticModal}
        onClose={() => setShowCrypticModal(false)}
        onPlatformSelect={handleCrypticPlatformSelect}
      />

      <style jsx>{`
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes popUpBounce {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes popUp3D {
  from {
    opacity: 0;
    transform: translateY(60px) scale(0.8) rotateX(15deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1) rotateX(0deg);
  }
}

@keyframes float-slow {
  0%,
  100% {
    transform: translateY(0px) translateX(0px);
  }
  25% {
    transform: translateY(-20px) translateX(10px);
  }
  50% {
    transform: translateY(-10px) translateX(-15px);
  }
  75% {
    transform: translateY(-25px) translateX(5px);
  }
}

@keyframes float-medium {
  0%,
  100% {
    transform: translateY(0px) translateX(0px);
  }
  33% {
    transform: translateY(-15px) translateX(-10px);
  }
  66% {
    transform: translateY(-25px) translateX(15px);
  }
}

@keyframes float-fast {
  0%,
  100% {
    transform: translateY(0px) translateX(0px);
  }
  50% {
    transform: translateY(-30px) translateX(-20px);
  }
}

@keyframes pulse-slow {
  0%,
  100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.2);
  }
}

@keyframes pulse-medium {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.3);
  }
}

@keyframes pulse-fast {
  0%,
  100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.4);
  }
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes spin-reverse {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}

.animate-float-slow {
  animation: float-slow 8s ease-in-out infinite;
}

.animate-float-medium {
  animation: float-medium 6s ease-in-out infinite;
}

.animate-float-fast {
  animation: float-fast 4s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 4s ease-in-out infinite;
}

.animate-pulse-medium {
  animation: pulse-medium 3s ease-in-out infinite;
}

.animate-pulse-fast {
  animation: pulse-fast 2s ease-in-out infinite;
}

.animate-spin-slow {
  animation: spin-slow 20s linear infinite;
}

.animate-spin-reverse {
  animation: spin-reverse 15s linear infinite;
}

/* Reseller Section Entry Animations */
@keyframes resellerBannerIn {
  0% {
    opacity: 0;
    transform: translateY(50px) scale(0.9);
  }
  60% {
    opacity: 1;
    transform: translateY(-10px) scale(1.02);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes iconSpinIn {
  0% {
    opacity: 0;
    transform: scale(0) rotate(-180deg);
  }
  70% {
    opacity: 1;
    transform: scale(1.2) rotate(20deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

@keyframes textSlideIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes tableSlideIn {
  0% {
    opacity: 0;
    transform: translateY(60px) scale(0.95);
  }
  60% {
    opacity: 1;
    transform: translateY(-10px) scale(1.01);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes headerSlideIn {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes rowSlideIn {
  0% {
    opacity: 0;
    transform: translateX(-50px);
  }
  60% {
  opacity: 1;
  transform: translateX(5px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes avatarPopIn {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  60% {
    opacity: 1;
    transform: scale(1.2);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes badgeSpinIn {
  0% {
    opacity: 0;
    transform: scale(0) rotate(-180deg);
  }
  70% {
    opacity: 1;
    transform: scale(1.3) rotate(10deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

@keyframes nameSlideIn {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes paymentIconIn {
  0% {
    opacity: 0;
    transform: scale(0) rotate(90deg);
  }
  60% {
    opacity: 1;
    transform: scale(1.2) rotate(-10deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

@keyframes priceButtonIn {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.8);
  }
  60% {
    opacity: 1;
    transform: translateY(-5px) scale(1.05);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Reseller Section Exit Animations */
@keyframes resellerBannerOut {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-50px) scale(0.9);
  }
}

@keyframes iconSpinOut {
  0% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
  100% {
    opacity: 0;
    transform: scale(0) rotate(180deg);
  }
}

@keyframes textSlideOut {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-20px);
  }
}

@keyframes tableSlideOut {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(60px) scale(0.95);
  }
}

@keyframes headerSlideOut {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-20px);
  }
}

@keyframes rowSlideOut {
  0% {
    opacity: 1;
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateX(-50px);
  }
}

@keyframes avatarPopOut {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0);
  }
}

@keyframes badgeSpinOut {
  0% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
  100% {
    opacity: 0;
    transform: scale(0) rotate(-180deg);
  }
}

@keyframes nameSlideOut {
  0% {
    opacity: 1;
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateX(-20px);
  }
}

@keyframes paymentIconOut {
  0% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
  100% {
    opacity: 0;
    transform: scale(0) rotate(-90deg);
  }
}

@keyframes priceButtonOut {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(30px) scale(0.8);
  }
}
`}</style>
    </div>
  )
}
