"use client"

import ProductCard from "./product-card"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"

interface Selection {
  id: number
  title: string
  image: string
  redirectUrl: string
  price: string
  resellers: string
  shadeColor: string
  popular: boolean
}

interface ProductsGridProps {
  selections: Selection[]
  onProductSelect?: (productTitle: string) => void
  selectedProduct?: string | null
  searchQuery?: string
  onSearchChange?: (query: string) => void
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  totalResults?: number
  startIndex?: number
  endIndex?: number
  showPagination?: boolean
}

export default function ProductsGrid({
  selections,
  onProductSelect,
  selectedProduct,
  searchQuery = "",
  onSearchChange,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalResults = 0,
  startIndex = 0,
  endIndex = 0,
  showPagination = false,
}: ProductsGridProps) {
  const productsWithResellers = selections

  return (
    <div className="mb-16">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-white/15 to-white/5 dark:from-black/40 dark:via-black/25 dark:to-black/10 backdrop-blur-xl rounded-3xl border-2 border-white/30 dark:border-white/20 shadow-2xl ring-1 ring-white/20 dark:ring-white/10" />

          {/* Subtle inner glow for more frame visibility */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 dark:from-blue-400/10 dark:via-transparent dark:to-purple-400/10" />

          {/* Content container */}
          <div className="relative z-10 p-6 sm:p-8 lg:p-12">
            <div className="mb-8 sm:mb-10">
              <div className="max-w-2xl mx-auto">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-gray-600 dark:group-focus-within:text-gray-300 transition-colors duration-200" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search executors..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200/60 dark:border-gray-700/60 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300/50 dark:focus:ring-gray-600/50 focus:border-gray-300 dark:focus:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 hover:bg-white/90 dark:hover:bg-gray-900/90 hover:border-gray-300/80 dark:hover:border-gray-600/80 text-base font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Section Header */}
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent mb-4">
                Premium Executors
              </h2>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 mb-8">
              {productsWithResellers.map((selection, index) => (
                <div key={selection.id} className="w-full">
                  <ProductCard
                    {...selection}
                    index={index}
                    onProductSelect={onProductSelect}
                    isSelected={selectedProduct === selection.title}
                  />
                </div>
              ))}
            </div>

            {productsWithResellers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 text-lg">No products with active resellers found.</p>
              </div>
            )}

            {showPagination && (
              <div className="mt-8 pt-6 border-t border-white/20 dark:border-white/10">
                <div className="flex items-center justify-center gap-2 mb-4">
                  {/* Previous button */}
                  <button
                    onClick={() => onPageChange?.(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-black/40 backdrop-blur-lg border border-white/40 dark:border-white/25 rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-gray-900 dark:text-gray-100 hover:bg-white/70 dark:hover:bg-black/50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  {/* Page numbers */}
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => onPageChange?.(page)}
                        className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                          currentPage === page
                            ? "bg-blue-500 text-white shadow-lg ring-2 ring-blue-500/30"
                            : "bg-white/60 dark:bg-black/40 backdrop-blur-lg border border-white/40 dark:border-white/25 text-gray-900 dark:text-gray-100 hover:shadow-md hover:bg-white/70 dark:hover:bg-black/50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  {/* Next button */}
                  <button
                    onClick={() => onPageChange?.(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-black/40 backdrop-blur-lg border border-white/40 dark:border-white/25 rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-gray-900 dark:text-gray-100 hover:bg-white/70 dark:hover:bg-black/50"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Results info */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {startIndex + 1}-{Math.min(endIndex, totalResults)} of {totalResults} products
                    {searchQuery && (
                      <span className="ml-1">
                        for "<span className="font-semibold text-gray-900 dark:text-gray-100">{searchQuery}</span>"
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
