"use client"

import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import Navbar from "../../navbar"
import LoadingScreen from "../../components/loading-screen"
import AnimatedBackground from "../../components/animated-background"
import SelectionsHeroSection from "../../components/selections-hero-section"
import QuickSelectionsGrid from "../../components/quick-selections-grid"
import ProductsGrid from "../../components/products-grid"
import ResellersModal from "../../components/resellers-modal" // Added ResellersModal import
import { PRODUCTS_LIST, parsePrice } from "../../lib/products-data"
import Image from "next/image"
import { getPaymentMethodIcon } from "../../lib/payment-methods" // Updated to use new simplified payment methods system
import { useAffiliate } from "../../lib/affiliate-utils" // Import useAffiliate

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
  name?: string // Added name field for reseller
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
  const { affiliateCode } = useAffiliate() // Use the affiliate hook
  const [showLoading, setShowLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [isResellersExiting, setIsResellersExiting] = useState(false)
  const [fetchedResellers, setFetchedResellers] = useState<ResellerData[]>([])
  const [fetchLoading, setFetchLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [dynamicProductInfo, setDynamicProductInfo] = useState<Record<string, { price: string; resellers: string }>>({})
  const [forceUpdate, setForceUpdate] = useState(0)
  const [showCrypticModal, setShowCrypticModal] = useState(false)
  const [selectedCrypticPlatform, setSelectedCrypticPlatform] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("") // Declare searchQuery
  const [showResellersModal, setShowResellersModal] = useState(false) // Added state for resellers modal
  const productsPerPage = 10 // Updated from 8 to 10 products per page
  const resellersSectionRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1) // Added state management for current page

  const handleLoadingComplete = () => {
    setShowLoading(false)
  }

  // Platforms for Cryptic
  const crypticPlatforms = ["windows", "macos", "ios", "android"]

  useEffect(() => {
    const fetchAllProductData = async () => {
      const newDynamicInfo: Record<string, { price: string; resellers: string }> = {}

      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // Increased timeout

        const batchResponse = await fetch(`/api/resellers?affiliate=${affiliateCode}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (batchResponse.ok) {
          const batchData = await batchResponse.json()

          const productNameMapping: Record<string, string> = {}
          PRODUCTS_LIST.forEach((product) => {
            productNameMapping[product.title.toLowerCase()] = product.title
          })

          Object.entries(batchData).forEach(([productKey, productData]: [string, any]) => {

            const displayName = productNameMapping[productKey] || productKey

            if (!productData || typeof productData !== "object") {
              return
            }

            let lowestPrice = Number.POSITIVE_INFINITY
            const uniqueResellerNames = new Set<string>()
            const resellerKeys = Object.keys(productData)


            resellerKeys.forEach((resellerKey, index) => {
              const resellerData = productData[resellerKey]

              if (!resellerData || typeof resellerData !== "object") {
                return
              }

              if (!resellerData.durations || typeof resellerData.durations !== "object") {
                return
              }

              const durationsCount = Object.keys(resellerData.durations).length

              if (durationsCount > 0) {
                // Extract reseller name more reliably
                const resellerName = resellerData.name || resellerKey.split("_")[0] || "Unknown"
                const wasNew = !uniqueResellerNames.has(resellerName)
                uniqueResellerNames.add(resellerName)


                // Calculate lowest price
                Object.entries(resellerData.durations).forEach(([durationKey, duration]: [string, any]) => {
                  if (duration && duration.price) {
                    const price = parsePrice(duration.price)
                    if (!isNaN(price) && price < lowestPrice) {
                      lowestPrice = price
                    }
                  }
                })
              } else {
              }
            })

            const finalResellerCount = uniqueResellerNames.size
            const uniqueResellersList = Array.from(uniqueResellerNames)

            let displayCount: string
            if (finalResellerCount === 0) {
              displayCount = "N/A"
            } else if (finalResellerCount >= 99) {
              displayCount = "99+"
            } else {
              displayCount = `${finalResellerCount}+`
            }

            newDynamicInfo[displayName] = {
              price: lowestPrice === Number.POSITIVE_INFINITY ? "Unknown" : `$${lowestPrice.toFixed(2)}`,
              resellers: displayCount,
            }

          })

          Object.entries(newDynamicInfo).forEach(([product, info]) => {
          })


          setDynamicProductInfo(newDynamicInfo)
          setForceUpdate((prev) => prev + 1)

          setTimeout(() => {
            Object.entries(newDynamicInfo).forEach(([product, info]) => {
            })
          }, 100)

          return
        } else {
        }
      } catch (error) {
      }


      const individualPromises = PRODUCTS_LIST.map(async (product) => {
        if (product.title === "Cryptic") {
          let overallLowestPrice = Number.POSITIVE_INFINITY
          const uniqueResellers = new Set<string>()

          const crypticPromises = crypticPlatforms.map(async (platform) => {
            try {
              const controller = new AbortController()
              const timeoutId = setTimeout(() => controller.abort(), 4000)

              const response = await fetch(`/api/products/cryptic-${platform}?affiliate=${affiliateCode}`, {
                signal: controller.signal,
                headers: { "Cache-Control": "no-cache" },
              })

              clearTimeout(timeoutId)

              if (!response.ok) {
                console.warn(`No data found for Cryptic ${platform}.`)
                return
              }

              const data: ApiProductResellersResponse = await response.json()

              Object.entries(data).forEach(([resellerKey, resellerData]) => {
                const resellerName = resellerData.name || resellerKey.split("_")[0] || "Unknown"
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
          const totalResellerCount = uniqueResellers.size

          let displayCount: string
          if (totalResellerCount === 0) {
            displayCount = "N/A"
          } else if (totalResellerCount >= 99) {
            displayCount = "99+"
          } else {
            displayCount = `${totalResellerCount}+`
          }

          newDynamicInfo[product.title] = {
            price: overallLowestPrice === Number.POSITIVE_INFINITY ? "Unknown" : `$${overallLowestPrice.toFixed(2)}`,
            resellers: displayCount,
          }

          console.log(
            `[v0] Cryptic reseller count: ${totalResellerCount} (displayed as: ${newDynamicInfo[product.title].resellers})`,
          )
        } else {
          try {
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 4000)

            const response = await fetch(`/api/products/${product.title.toLowerCase()}?affiliate=${affiliateCode}`, {
              signal: controller.signal,
              headers: { "Cache-Control": "no-cache" },
            })

            clearTimeout(timeoutId)

            if (!response.ok) {
              throw new Error(`Failed to fetch data for ${product.title}`)
            }

            const data: ApiProductResellersResponse = await response.json()

            let lowestPrice = Number.POSITIVE_INFINITY
            const uniqueResellerNames = new Set<string>()

            const validResellers = Object.values(data).filter((reseller) => Object.keys(reseller.durations).length > 0)

            validResellers.forEach((resellerData) => {
              const resellerName = resellerData.name || "Unknown"
              uniqueResellerNames.add(resellerName)
              Object.values(resellerData.durations).forEach((d) => {
                const price = parsePrice(d.price)
                if (!isNaN(price) && price < lowestPrice) {
                  lowestPrice = price
                }
              })
            })

            const resellerCount = uniqueResellerNames.size

            let displayCount: string
            if (resellerCount === 0) {
              displayCount = "N/A"
            } else if (resellerCount >= 99) {
              displayCount = "99+"
            } else {
              displayCount = `${resellerCount}+`
            }

            newDynamicInfo[product.title] = {
              price: lowestPrice === Number.POSITIVE_INFINITY ? "Unknown" : `$${lowestPrice.toFixed(2)}`,
              resellers: displayCount,
            }

            console.log(
              `[v0] Product ${product.title}: ${resellerCount} unique resellers found (displayed as: ${newDynamicInfo[product.title].resellers})`,
            )
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
      setForceUpdate((prev) => prev + 1)
      console.log("[v0] Individual fetching fallback complete")
    }

    fetchAllProductData()
  }, [affiliateCode]) // Added affiliateCode to dependency array

  useEffect(() => {
    const silentFetch = async () => {
      try {
        await fetch("/api/resellers", { method: "GET" })
        // Do nothing with the response
      } catch (e) {
        console.error("Silent fetch failed:", e)
      }
    }
    silentFetch()
  }, [])

  useEffect(() => {
    const handleDeselectProduct = () => {
      setSelectedProduct(null)
      setSelectedCrypticPlatform(null)
      setShowCrypticModal(false)
    }

    if (typeof window !== "undefined") {
      window.addEventListener("deselectProduct", handleDeselectProduct)
      return () => window.removeEventListener("deselectProduct", handleDeselectProduct)
    }
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
      console.log("[v0] Starting fetch for:", productTitle, platform, "with affiliate:", affiliateCode) // Log affiliate code
      setFetchLoading(true)
      setFetchError(null)
      setFetchedResellers([]) // Clear previous resellers

      try {
        let apiUrl = ""
        if (productTitle === "Cryptic" && platform) {
          apiUrl = `/api/products/cryptic-${platform}?affiliate=${affiliateCode}`
        } else {
          apiUrl = `/api/products/${productTitle.toLowerCase()}?affiliate=${affiliateCode}`
        }


        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000) // Reduced timeout for faster response

        const response = await fetch(apiUrl, {
          signal: controller.signal,
          headers: {
            "Cache-Control": "no-cache",
            Accept: "application/json",
          },
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`Failed to fetch data from local API: ${response.statusText}`)
        }

        const data: ApiProductResellersResponse = await response.json()

        // Transform and calculate lowest price for sorting
        const transformed: ResellerData[] = Object.entries(data).map(([resellerKey, resellerData]) => {
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
            name: resellerData.name || resellerKey.split("_")[0] || "Unknown",
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

        if (transformed.length === 0 || transformed.every((r) => Object.keys(r.durations).length === 0)) {
          setFetchError("Resellers are not found for this product or platform.")
        } else {
          setFetchedResellers(transformed)
        }
      } catch (e: any) {
        if (e.name === "AbortError") {
          setFetchError("Request timed out. Please try again.")
        } else {
          setFetchError("Resellers are not found for this product or platform.")
        }
      } finally {
        setFetchLoading(false)
      }
    },
    [affiliateCode],
  ) // Added affiliateCode to dependency array

  // Handle product selection (including opening Cryptic modal)
  const handleProductSelect = (productTitle: string) => {
    if (productTitle === "Cryptic") {
      setSelectedProduct("Cryptic") // Keep Cryptic card selected
      setShowCrypticModal(true) // Open Cryptic modal
      setFetchedResellers([]) // Clear resellers table
      setFetchError(null) // Clear any previous fetch errors
      setSelectedCrypticPlatform(null) // Reset selected platform for Cryptic
    } else if (selectedProduct === productTitle) {
      // If clicking the same product, open resellers modal
      setShowResellersModal(true)
      fetchProductResellers(productTitle)
    } else {
      setSelectedProduct(productTitle)
      setIsResellersExiting(false)
      setSelectedCrypticPlatform(null) // Clear Cryptic platform if another product is selected
      setShowResellersModal(true) // Open resellers modal
      fetchProductResellers(productTitle) // Fetch data for the newly selected product
    }
  }

  // Handle platform selection from Cryptic modal
  const handleCrypticPlatformSelect = (platform: string) => {
    setSelectedCrypticPlatform(platform)
    setShowCrypticModal(false) // Close the modal
    setIsResellersExiting(false) // Ensure no exit animation is pending
    setShowResellersModal(true) // Open resellers modal
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

    const result = getVisibleProducts().map((product) => {
      const dynamicInfo = dynamicProductInfo[product.title]
      const finalProduct = {
        ...product,
        price: dynamicInfo?.price || product.price,
        resellers: dynamicInfo?.resellers || product.resellers,
      }

      return finalProduct
    })

    return result
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

    return searchFiltered.filter((selection) => {
      // Hide products with N/A resellers
      if (selection.resellers === "N/A" || selection.resellers === "Unknown") {
        return false
      }

      // Hide products with 0 resellers
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
      currentPage,
    }
  }, [filteredSelections, productsPerPage, currentPage])

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1)
    if (typeof window !== "undefined") {
      ;(window as any).currentPage = 1
    }
  }, [searchQuery])

  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1 || page > paginationData.totalPages) return
      setCurrentPage(page)
      if (typeof window !== "undefined") {
        ;(window as any).currentPage = page
      }
    },
    [paginationData.totalPages],
  )

  // Keep track of which products are currently selected to pass to ProductCard
  const selectedProducts = useMemo(() => {
    if (!selectedProduct) return []
    return [selectedProduct]
  }, [selectedProduct])

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

          {/* Products Grid with integrated search and pagination */}
          <ProductsGrid
            selections={paginationData.currentProducts}
            onProductSelect={handleProductSelect}
            selectedProduct={selectedProduct}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            currentPage={currentPage}
            totalPages={paginationData.totalPages}
            onPageChange={handlePageChange}
            totalResults={filteredSelections.length}
            startIndex={paginationData.startIndex}
            endIndex={paginationData.endIndex}
            showPagination={filteredSelections.length > productsPerPage}
          />
        </div>
      </main>

      <ResellersModal
        isOpen={showResellersModal}
        onClose={() => setShowResellersModal(false)}
        productTitle={selectedProduct || ""}
        resellers={fetchedResellers}
        isLoading={fetchLoading}
        error={fetchError}
      />
    </div>
  )
}
