"use client"

import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import Navbar from "../../navbar"
import LoadingScreen from "../../components/loading-screen"
import AnimatedBackground from "../../components/animated-background"
import SelectionsHeroSection from "../../components/selections-hero-section"
import QuickSelectionsGrid from "../../components/quick-selections-grid"
import ProductsGrid from "../../components/products-grid"
import { PRODUCTS_LIST, parsePrice } from "../../lib/products-data"
import Image from "next/image"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { getPaymentMethodIcon } from "../../lib/payment-methods" // Updated to use new simplified payment methods system
import { initializeAffiliate, type AffiliateConfig } from "../../lib/affiliate"

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

// Function to parse price string to a number for sorting
// const parsePrice = (priceString: string): number => {
//   const parsed = Number.parseFloat(priceString.replace(/[^0-9.-]+/g, ""))
//   return isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed // Return infinity for invalid prices
// }

// Fixed duration types to display in the table
const durationTypes = [
  { key: "day1", label: "1 Day" },
  { key: "day3", label: "3 Days" },
  { key: "week1", label: "1 Week" },
  { key: "month1", label: "1 Month" },
  { key: "year1", label: "1 Year" },
]

// Helper function to filter out hidden products
const getVisibleProducts = () => {
  return PRODUCTS_LIST.filter((product) => !product.hidden)
}

const filterProductsWithResellers = (products: any[]) => {
  return products.filter((product) => {
    const resellersCount = Number.parseInt(product.resellers?.replace(/[^\d]/g, "") || "0")
    return resellersCount > 0
  })
}

const deduplicatePaymentMethods = (payments: string[]): string[] => {
  const seen = new Set<string>()
  return payments.filter((method) => {
    const normalizedMethod = method.toLowerCase().trim()
    if (seen.has(normalizedMethod)) {
      return false
    }
    seen.add(normalizedMethod)
    return true
  })
}

export default function SelectionsPage() {
  const [showLoading, setShowLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [isResellersExiting, setIsResellersExiting] = useState(false)
  const [fetchedResellers, setFetchedResellers] = useState<ResellerData[]>([])
  const [fetchLoading, setFetchLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [dynamicProductInfo, setDynamicProductInfo] = useState<Record<string, { price: string; resellers: string }>>({})
  const [showCrypticModal, setShowCrypticModal] = useState(false)
  const [selectedCrypticPlatform, setSelectedCrypticPlatform] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 10 // Updated from 8 to 10 products per page
  const resellersSectionRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [affiliateConfig, setAffiliateConfig] = useState<AffiliateConfig>({ code: null, isActive: false })

  const fetchAllProductData = async () => {
    const newDynamicInfo: Record<string, { price: string; resellers: string }> = {}

    try {
      console.log("[v0] Starting instant batch fetch for all products")

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 6000) // Reduced timeout for instant feel

      let batchUrl = "/api/products/batch"
      if (affiliateConfig.code) {
        batchUrl += `?affiliate=${encodeURIComponent(affiliateConfig.code)}`
        console.log("[v0] [PHP_AFFILIATE] Using affiliate batch URL:", batchUrl)
      }

      const batchResponse = await fetch(batchUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify({
          products: PRODUCTS_LIST.map((p) => p.title),
          timestamp: Date.now(),
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (batchResponse.ok) {
        const batchData = await batchResponse.json()
        console.log("[v0] Batch fetch successful, processing", Object.keys(batchData).length, "products")

        Object.entries(batchData).forEach(([productTitle, productData]: [string, any]) => {
          if (productData && productData.resellers) {
            let lowestPrice = Number.POSITIVE_INFINITY
            let resellerCount = 0

            Object.values(productData.resellers).forEach((resellerData: any) => {
              if (resellerData.durations && Object.keys(resellerData.durations).length > 0) {
                resellerCount++
                Object.values(resellerData.durations).forEach((d: any) => {
                  const price = parsePrice(d.price)
                  if (!isNaN(price) && price < lowestPrice) {
                    lowestPrice = price
                  }
                })
              }
            })

            newDynamicInfo[productTitle] = {
              price: lowestPrice === Number.POSITIVE_INFINITY ? "Unknown" : `$${lowestPrice.toFixed(2)}`,
              resellers: resellerCount > 0 ? `${resellerCount}+ sellers` : "N/A",
            }
          }
        })

        setDynamicProductInfo(newDynamicInfo)
        console.log("[v0] Batch processing complete, updated", Object.keys(newDynamicInfo).length, "products")
        return // Early return to skip individual fetching when batch succeeds
      } else {
        console.log("[v0] Batch response not ok:", batchResponse.status, "falling back to individual fetching")
      }
    } catch (error) {
      console.log("[v0] Batch fetch failed, falling back to individual fetching:", error)
    }

    console.log("[v0] Starting individual product fetching fallback")

    const individualPromises = PRODUCTS_LIST.map(async (product) => {
      if (product.title === "Cryptic") {
        let overallLowestPrice = Number.POSITIVE_INFINITY
        let totalResellerCount = 0
        const uniqueResellers = new Set<string>()

        const crypticPromises = ["windows", "macos", "ios", "android"].map(async (platform) => {
          try {
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 4000)

            const response = await fetch(`/api/products/cryptic-${platform}`, {
              signal: controller.signal,
              headers: { "Cache-Control": "no-cache" },
            })

            clearTimeout(timeoutId)

            if (!response.ok) {
              console.warn(`No data found for Cryptic ${platform}.`)
              return
            }

            const data: ApiProductResellersResponse = await response.json()

            Object.entries(data).forEach(([resellerName, resellerData]) => {
              uniqueResellers.add(resellerName)
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
        })

        await Promise.allSettled(crypticPromises)
        totalResellerCount = uniqueResellers.size

        newDynamicInfo[product.title] = {
          price: overallLowestPrice === Number.POSITIVE_INFINITY ? "Unknown" : `$${overallLowestPrice.toFixed(2)}`,
          resellers: totalResellerCount > 0 ? `${totalResellerCount}+ sellers` : "N/A",
        }
      } else {
        try {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 4000)

          const response = await fetch(`/api/products/${product.title.toLowerCase()}`, {
            signal: controller.signal,
            headers: { "Cache-Control": "no-cache" },
          })

          clearTimeout(timeoutId)

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
    })

    await Promise.allSettled(individualPromises)
    setDynamicProductInfo(newDynamicInfo)
    console.log("[v0] Individual fetching fallback complete")
  }

  useEffect(() => {
    fetchAllProductData()
  }, [])

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

  const visibleProducts = useMemo(() => {
    return filterProductsWithResellers(getVisibleProducts())
  }, [])

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return visibleProducts
    }
    return visibleProducts.filter((product) => product.title.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [searchQuery, visibleProducts])

  const fetchProductResellers = useCallback(
    async (productTitle: string, platform?: string) => {
      console.log("[v0] Starting fetch for:", productTitle, platform)
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

        if (affiliateConfig.code) {
          const url = new URL(apiUrl, window.location.origin)
          url.searchParams.set("affiliate", affiliateConfig.code)
          apiUrl = url.pathname + url.search
          console.log("[v0] [PHP_AFFILIATE] Using affiliate API URL:", apiUrl)
        }

        console.log("[v0] Fetching from:", apiUrl)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000)

        const response = await fetch(apiUrl, {
          signal: controller.signal,
          headers: {
            "Cache-Control": "no-cache",
            Accept: "application/json",
          },
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          console.log("[v0] Response not ok:", response.status, response.statusText)
          throw new Error(`Failed to fetch data from external API: ${response.statusText}`)
        }

        const data: ApiProductResellersResponse = await response.json()
        console.log("[v0] Received data:", Object.keys(data).length, "resellers")

        const transformed: ResellerData[] = Object.entries(data).map(([resellerName, resellerData]) => {
          let lowestPrice = Number.POSITIVE_INFINITY
          const durations: ResellerData["durations"] = {}

          if (resellerData.durations["1"]) {
            durations.day1 = resellerData.durations["1"]
          }
          if (resellerData.durations["3"]) {
            durations.day3 = resellerData.durations["3"]
          }
          if (resellerData.durations["7"]) {
            durations.week1 = resellerData.durations["7"]
          }
          if (resellerData.durations["30"]) {
            durations.month1 = resellerData.durations["30"]
          }
          if (resellerData.durations["365"]) {
            durations.year1 = resellerData.durations["365"]
          }

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
            lowestPrice: lowestPrice === Number.POSITIVE_INFINITY ? 0 : lowestPrice,
            isPremium: resellerData.premium || false,
            pfpUrl: resellerData.pfp && resellerData.pfp !== "" ? resellerData.pfp : "/images/key-empire-logo.png",
            isVerified: resellerData.verified || false,
          }
        })

        transformed.sort((a, b) => {
          // Verified resellers always come first
          if (a.isVerified && !b.isVerified) return -1
          if (!a.isVerified && b.isVerified) return 1
          // If both are verified or both are not verified, sort by price
          return a.lowestPrice - b.lowestPrice
        })

        console.log("[v0] Transformed resellers:", transformed.length)
        if (affiliateConfig.isActive) {
          console.log(
            "[v0] [PHP_AFFILIATE] All reseller URLs pre-transformed by PHP API with affiliate code:",
            affiliateConfig.code,
          )
        }

        if (transformed.length === 0 || transformed.every((r) => Object.keys(r.durations).length === 0)) {
          console.log("[v0] No valid resellers found")
          setFetchError("Resellers are not found for this product or platform.")
        } else {
          console.log("[v0] Setting resellers:", transformed.length)
          setFetchedResellers(transformed)
        }
      } catch (e: any) {
        console.error("[v0] Error fetching product resellers:", e)
        if (e.name === "AbortError") {
          setFetchError("Request timed out. Please try again.")
        } else {
          setFetchError("Resellers are not found for this product or platform.")
        }
      } finally {
        setFetchLoading(false)
      }
    },
    [affiliateConfig], // Simplified dependencies - PHP handles all transformations
  )

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
  const selectedProductDetails = selectedProduct ? PRODUCTS_LIST.find((s) => s.title === selectedProduct) : null
  const currentWelcomeImage = selectedProductDetails?.image || "/images/key-empire-logo.png"

  const getPaymentIcon = (method: string) => {
    const iconPath = getPaymentMethodIcon(method)
    if (!iconPath) {
      console.log("[v0] No icon found for payment method:", method)
      return null
    }

    return (
      <Image
        key={`${method}-${iconPath}`} // Added unique key to prevent duplicates
        src={iconPath || "/placeholder.svg"}
        alt={method}
        width={24}
        height={24}
        className="w-6 h-6 object-contain"
        onError={(e) => {
          console.log("[v0] Failed to load payment icon:", method, iconPath)
          e.currentTarget.style.display = "none"
        }}
      />
    )
  }

  const displayedSelections = useMemo(() => {
    return getVisibleProducts().map((product) => ({
      ...product,
      price: dynamicProductInfo[product.title]?.price || product.price,
      resellers: dynamicProductInfo[product.title]?.resellers || product.resellers,
    }))
  }, [dynamicProductInfo])

  // Determine if the resellers section should be visible
  const showResellersSection =
    (selectedProduct && selectedProduct !== "Cryptic") ||
    (selectedProduct === "Cryptic" && selectedCrypticPlatform) ||
    isResellersExiting

  const filteredSelections = useMemo(() => {
    // First filter by search query
    const searchFiltered = displayedSelections.filter((selection) =>
      selection.title.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    // Then filter out products without resellers (same logic as ProductsGrid)
    return searchFiltered.filter((selection) => {
      const resellersCount = Number.parseInt(selection.resellers?.replace(/[^\d]/g, "") || "0")
      return resellersCount > 0
    })
  }, [displayedSelections, searchQuery])

  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredSelections.length / productsPerPage)
    const startIndex = (currentPage - 1) * productsPerPage
    const endIndex = startIndex + productsPerPage
    const currentProducts = filteredSelections.slice(startIndex, endIndex)

    return {
      totalPages,
      startIndex,
      endIndex,
      currentProducts,
    }
  }, [filteredSelections, currentPage, productsPerPage])

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1 || page > paginationData.totalPages) return
      setCurrentPage(page)
      // Scroll to top of page smoothly
      window.scrollTo({ top: 0, behavior: "smooth" })
    },
    [paginationData.totalPages],
  )

  useEffect(() => {
    const config = initializeAffiliate()
    setAffiliateConfig(config)
  }, [])

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

      {showLoading && <LoadingScreen />}
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

          <div className="mb-12">
            <div className="max-w-2xl mx-auto px-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400/70 dark:text-gray-400/70" />
                </div>
                <input
                  type="text"
                  placeholder="Search executors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl focus:outline-none focus:ring-2 focus:ring-white/30 dark:focus:ring-white/20 focus:border-white/30 dark:focus:border-white/20 text-gray-900 dark:text-white placeholder-gray-600/70 dark:placeholder-gray-300/50 transition-all duration-300 hover:bg-white/15 dark:hover:bg-black/15 hover:border-white/30 dark:hover:border-white/15"
                />
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <ProductsGrid
            selections={paginationData.currentProducts} // Use memoized current products
            onProductSelect={handleProductSelect}
            selectedProduct={selectedProduct}
          />

          {filteredSelections.length > productsPerPage && (
            <div className="mb-16">
              <div className="flex items-center justify-center gap-2">
                {/* Previous button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-gray-900 dark:text-gray-100"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                {/* Page numbers */}
                <div className="flex gap-1">
                  {Array.from({ length: paginationData.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                        currentPage === page
                          ? "bg-blue-500 text-white shadow-lg"
                          : "bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:shadow-lg"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                {/* Next button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === paginationData.totalPages}
                  className="flex items-center gap-2 px-4 py-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-gray-900 dark:text-gray-100"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Results info */}
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {paginationData.startIndex + 1}-{Math.min(paginationData.endIndex, filteredSelections.length)}{" "}
                  of {filteredSelections.length} products
                  {searchQuery && (
                    <span className="ml-1">
                      for "<span className="font-semibold text-gray-900 dark:text-gray-100">{searchQuery}</span>"
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}

          {searchQuery && filteredSelections.length === 0 && (
            <div className="mb-16">
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <Search className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No products found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No executors match your search for "<span className="font-semibold">{searchQuery}</span>"
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors duration-200"
                >
                  Clear search
                </button>
              </div>
            </div>
          )}

          {/* Resellers Section */}
          {showResellersSection && (
            <div ref={resellersSectionRef} className="mb-16">
              <div className="max-w-7xl mx-auto px-2 sm:px-4">
                <div
                  className={`transition-all duration-600 ${
                    isResellersExiting ? "opacity-0 transform translate-y-8" : "opacity-100 transform translate-y-0"
                  }`}
                >
                  {/* Section Header */}
                  <div className="text-center mb-8 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 text-shadow">
                      {selectedProduct === "Cryptic" && selectedCrypticPlatform
                        ? `Cryptic ${selectedCrypticPlatform} Resellers`
                        : `${selectedProduct} Resellers`}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
                      Choose from our trusted resellers below
                    </p>
                  </div>

                  {/* Loading State */}
                  {fetchLoading && (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center gap-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="text-gray-600 dark:text-gray-400 text-lg">Loading resellers...</span>
                      </div>
                    </div>
                  )}

                  {/* Error State */}
                  {fetchError && !fetchLoading && (
                    <div className="text-center py-12">
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
                        <div className="flex items-center gap-3 mb-3">
                          <svg
                            className="w-6 h-6 text-red-600 dark:text-red-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">No Resellers Found</h3>
                        </div>
                        <p className="text-red-700 dark:text-red-300">{fetchError}</p>
                        <button
                          onClick={() => {
                            if (selectedProduct === "Cryptic" && selectedCrypticPlatform) {
                              fetchProductResellers("Cryptic", selectedCrypticPlatform)
                            } else if (selectedProduct) {
                              fetchProductResellers(selectedProduct)
                            }
                          }}
                          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                          Try Again
                        </button>
                      </div>
                    </div>
                  )}

                  {!fetchLoading && !fetchError && fetchedResellers.length > 0 && (
                    <div className="space-y-4 sm:space-y-6">
                      {fetchedResellers.map((reseller, index) => (
                        <div
                          key={`${reseller.name}-${index}`}
                          className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/60 dark:border-gray-700/60 overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600"
                          style={{
                            opacity: 0,
                            animation: `fadeInUp 0.5s ease-out ${index * 0.1}s forwards`,
                          }}
                        >
                          <div className="p-4 sm:p-6">
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                              <div className="flex items-center gap-3 sm:gap-4">
                                {/* Larger profile picture */}
                                <div className="relative">
                                  <Image
                                    src={reseller.pfpUrl || "/placeholder.svg"}
                                    alt={reseller.name}
                                    width={48}
                                    height={48}
                                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                                    onError={(e) => {
                                      e.currentTarget.src = "/images/key-empire-logo.png"
                                    }}
                                  />
                                  {reseller.isPremium && (
                                    <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                                      <svg
                                        className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-.181h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                    </div>
                                  )}
                                </div>

                                {/* Enhanced reseller info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
                                      {reseller.name}
                                    </h3>
                                    {reseller.isPremium && (
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                        Premium
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm text-gray-600 dark:text-gray-400 mr-1">Accepts:</span>
                                    {deduplicatePaymentMethods(reseller.payments)
                                      .slice(0, 6)
                                      .map((method) => {
                                        const icon = getPaymentIcon(method)
                                        return icon ? (
                                          <div key={method} className="flex-shrink-0">
                                            <Image
                                              src={getPaymentMethodIcon(method) || "/placeholder.svg"}
                                              alt={method}
                                              width={28}
                                              height={28}
                                              className="w-7 h-7 object-contain opacity-80 hover:opacity-100 transition-opacity"
                                              onError={(e) => {
                                                e.currentTarget.style.display = "none"
                                              }}
                                            />
                                          </div>
                                        ) : null
                                      })}
                                    {reseller.payments.length > 6 && (
                                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                                        +{reseller.payments.length - 6} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Enhanced price badge */}
                              <div className="text-right">
                                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Starting from</div>
                                <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
                                  ${reseller.lowestPrice.toFixed(2)}
                                </div>
                              </div>
                            </div>

                            <div className="block sm:hidden">
                              {/* Mobile: Vertical stack (older version style) */}
                              <div className="space-y-3">
                                {Object.entries(reseller.durations).map(([durationType, duration]) => (
                                  <div
                                    key={`${reseller.name}-${durationType}`}
                                    className="bg-gray-50 dark:bg-gray-700/40 rounded-lg p-4 border border-gray-200/60 dark:border-gray-600/60 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200 hover:shadow-md"
                                  >
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                                          {durationType === "day1" && "1 Day"}
                                          {durationType === "day3" && "3 Days"}
                                          {durationType === "week1" && "1 Week"}
                                          {durationType === "month1" && "1 Month"}
                                          {durationType === "year1" && "1 Year"}
                                        </div>
                                        <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                          {duration.price.startsWith("$") ? duration.price : `$${duration.price}`}
                                        </div>
                                      </div>
                                      <button
                                        onClick={() => window.open(duration.url, "_blank")}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg transform hover:scale-105 active:scale-95"
                                      >
                                        Purchase
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="hidden sm:block">
                              {/* Desktop: Enhanced grid layout */}
                              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                                {Object.entries(reseller.durations).map(([durationType, duration]) => (
                                  <div
                                    key={`${reseller.name}-${durationType}`}
                                    className="bg-gray-50 dark:bg-gray-700/40 rounded-lg p-4 border border-gray-200/60 dark:border-gray-600/60 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200 hover:shadow-md group"
                                  >
                                    <div className="text-center">
                                      <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                        {durationType === "day1" && "1 Day"}
                                        {durationType === "day3" && "3 Days"}
                                        {durationType === "week1" && "1 Week"}
                                        {durationType === "month1" && "1 Month"}
                                        {durationType === "year1" && "1 Year"}
                                      </div>
                                      <div className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
                                        {duration.price.startsWith("$") ? duration.price : `$${duration.price}`}
                                      </div>
                                      <button
                                        onClick={() => window.open(duration.url, "_blank")}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-3 rounded-lg transition-all duration-200 hover:shadow-md transform hover:scale-105 active:scale-95 group-hover:bg-blue-700"
                                      >
                                        Buy Now
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <style jsx>{`
        /* Add mobile-specific animations */
        @keyframes mobileCardIn {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes mobileCardOut {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
        }

        .animate-mobileCardIn {
          animation: mobileCardIn 0.6s ease-out forwards;
        }

        .animate-mobileCardOut {
          animation: mobileCardOut 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
