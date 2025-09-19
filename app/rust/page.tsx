"use client"

import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import Navbar from "../../navbar"
import LoadingScreen from "../../components/loading-screen"
import AnimatedBackground from "../../components/animated-background"
import SelectionsHeroSection from "../../components/selections-hero-section"
import QuickSelectionsGrid from "../../components/quick-selections-grid"
import ProductsGrid from "../../components/products-grid"
import ResellersModal from "../../components/resellers-modal"
import { RUST_PRODUCTS_LIST } from "../../lib/rust-products-data"
import { useAffiliate } from "../../lib/affiliate-utils"

export default function RustPage() {
  const [dynamicProductInfo, setDynamicProductInfo] = useState<Record<string, { price: string; resellers: string }>>({})
  const [showLoading, setShowLoading] = useState(true)
  const [showResellersModal, setShowResellersModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filteredSelections, setFilteredSelections] = useState(RUST_PRODUCTS_LIST.filter((product) => !product.hidden))
  const [fetchedResellers, setFetchedResellers] = useState<string[]>([])
  const [fetchLoading, setFetchLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const controller = useRef(new AbortController()).current
  const productsPerPage = 10
  const affiliate = useAffiliate()

  const handleLoadingComplete = () => {
    setShowLoading(false)
  }

  const handleProductSelect = (productTitle: string) => {
    setSelectedProduct(productTitle)
    setShowResellersModal(true)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const getVisibleProducts = () => {
    return RUST_PRODUCTS_LIST.filter((product) => !product.hidden)
  }

  useEffect(() => {
    const fetchAllProductData = async () => {
      const newDynamicInfo: Record<string, { price: string; resellers: string }> = {}

      try {
        const batchResponse = await fetch(`/api/rust/resellers?affiliate=${affiliate}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
          signal: controller.signal,
        })

        const batchData = await batchResponse.json()
        Object.keys(batchData).forEach((key) => {
          newDynamicInfo[key] = {
            price: batchData[key].price,
            resellers: batchData[key].resellers,
          }
        })
      } catch (error) {}

      const individualPromises = RUST_PRODUCTS_LIST.map(async (product) => {
        try {
          const response = await fetch(`/api/rust/products/${product.title.toLowerCase()}?affiliate=${affiliate}`, {
            signal: controller.signal,
            headers: { "Cache-Control": "no-cache" },
          })

          const data = await response.json()
          newDynamicInfo[product.title] = {
            price: data.price,
            resellers: data.resellers,
          }
        } catch (e) {
          newDynamicInfo[product.title] = {
            price: "Unknown",
            resellers: "N/A",
          }
        }
      })

      await Promise.all(individualPromises)
      setDynamicProductInfo(newDynamicInfo)
    }

    fetchAllProductData()
  }, [affiliate])

  const fetchProductResellers = useCallback(
    async (productTitle: string) => {
      setFetchLoading(true)
      setFetchError(null)
      setFetchedResellers([])

      try {
        const apiUrl = `/api/rust/products/${productTitle.toLowerCase()}?affiliate=${affiliate}`

        const response = await fetch(apiUrl, {
          headers: {
            "Cache-Control": "no-cache",
            Accept: "application/json",
          },
        })

        const data = await response.json()
        setFetchedResellers(data.resellers)
      } catch (e: any) {
        if (e.name === "AbortError") {
          setFetchError("Request timed out. Please try again.")
        } else {
          setFetchError("Resellers are not found for this product.")
        }
      } finally {
        setFetchLoading(false)
      }
    },
    [affiliate],
  )

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

  const paginationData = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage
    const endIndex = startIndex + productsPerPage
    const currentProducts = filteredSelections.slice(startIndex, endIndex)
    return {
      currentProducts,
      startIndex,
      endIndex,
      totalPages: Math.ceil(filteredSelections.length / productsPerPage),
    }
  }, [filteredSelections, currentPage, productsPerPage])

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
      <AnimatedBackground />
      {showLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}
      <Navbar />

      <main className="px-4 py-8 mt-40 relative z-10 md:mt-32">
        <div className="w-[95%] max-w-7xl mx-auto">
          <SelectionsHeroSection />

          <div className="mb-16">
            <div className="max-w-6xl mx-auto px-4">
              <QuickSelectionsGrid />
            </div>
          </div>

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
