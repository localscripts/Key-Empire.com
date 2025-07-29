"use client"

import { Menu, Search, Clock, TrendingUp, Zap, Shield, Star, Flag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import ReportModal from "./components/report-modal"

const searchTerms = [
  "Search products...",
  "Find executors...",
  "Browse scripts...",
  "Discover tools...",
  "Explore premium...",
  "Search Zenith...",
  "Find Arceus X...",
  "Browse Wave...",
  "Search Ronin...",
  "Find Fluxus...",
]

const recentSearches = ["Zenith executor", "Roblox scripts", "Premium tools", "Arceus X"]

const trendingProducts = [
  { name: "Zenith", category: "Executor", price: "$1.00", icon: Zap },
  { name: "Wave", category: "Executor", price: "$1.00", icon: Shield },
  { name: "Arceus X", category: "Premium", price: "$1.00", icon: Star },
]

const quickCategories = [
  { name: "Executors", count: 7, icon: Zap },
  { name: "Scripts", count: 25, icon: Search },
  { name: "Premium", count: 5, icon: Star },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [isClosingModal, setIsClosingModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const [currentSearchTerm, setCurrentSearchTerm] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSearchTerm((prev) => (prev + 1) % searchTerms.length)
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleCloseSearchModal = () => {
    setIsClosingModal(true)
    setTimeout(() => {
      setShowSearchModal(false)
      setIsClosingModal(false)
    }, 200) // Match the fade-out duration
  }

  // Handle clicking outside or pressing escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showSearchModal) {
        handleCloseSearchModal()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [showSearchModal])

  return (
    <>
      <nav
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-[120] w-[95%] max-w-7xl rounded-2xl border border-black/30 shadow-lg select-none transition-all duration-300 ${
          isScrolled ? "bg-white/40 backdrop-blur-lg" : "bg-white"
        }`}
        style={{
          opacity: 0,
          animation: "fadeIn 0.8s ease-out 0.5s forwards",
        }}
      >
        <div className="px-4 md:px-6">
          <div className="flex h-14 items-center justify-between gap-4">
            {/* Left side with logo */}
            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
              <Link href="/" className="flex items-center group">
                <div className="relative overflow-hidden rounded-lg">
                  <Image
                    src="/images/key-empire-logo.png"
                    alt="Key-Empire"
                    width={160}
                    height={40}
                    className="h-6 md:h-8 w-auto select-none transform group-hover:scale-105 transition-all duration-300"
                    priority
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </div>
              </Link>
            </div>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 z-10 select-none pointer-events-none" />
                <input
                  type="text"
                  placeholder={searchTerms[currentSearchTerm]}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClick={() => setShowSearchModal(true)}
                  onFocus={() => setShowSearchModal(true)}
                  onBlur={(e) => {
                    // Only close if not clicking on modal content
                    const relatedTarget = e.relatedTarget as HTMLElement
                    if (!relatedTarget || !relatedTarget.closest("[data-search-modal]")) {
                      setTimeout(() => {
                        if (!document.querySelector("[data-search-modal]:hover")) {
                          handleCloseSearchModal()
                        }
                      }, 100)
                    }
                  }}
                  className={`w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 cursor-pointer outline-none transition-all duration-300 ${
                    isScrolled ? "bg-white/60 backdrop-blur-sm" : "bg-white"
                  }`}
                />
              </div>
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex md:items-center md:space-x-4 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                className={`select-none relative overflow-hidden group transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:bg-blue-50 hover:border-blue-300 ${
                  isScrolled ? "bg-white/60 backdrop-blur-sm border-gray-300/60" : "bg-transparent border-gray-300"
                }`}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                <Image
                  src="/images/discord-icon.svg"
                  alt="Discord"
                  width={16}
                  height={16}
                  className="h-4 w-4 select-none relative z-10"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowReportModal(true)}
                className={`select-none relative overflow-hidden group transform hover:scale-105 transition-all duration-300 hover:shadow-lg text-gray-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600 ${
                  isScrolled ? "bg-white/60 backdrop-blur-sm border-gray-300/60" : "bg-transparent border-gray-300"
                }`}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                <Flag className="h-4 w-4 select-none hover:text-red-600 relative z-10" />
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </Button>
            </div>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-gray-800 hover:text-green-600 select-none"
                >
                  <Menu className="h-5 w-5 select-none" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] select-none">
                <div className="flex flex-col space-y-4 mt-8">
                  <Link
                    href="/discord"
                    className="flex items-center justify-center w-12 h-12 rounded-lg border border-gray-300 text-gray-800 transition-colors hover:bg-blue-50 hover:border-blue-300 select-none relative overflow-hidden group transform hover:scale-105 duration-300 hover:shadow-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                    <Image
                      src="/images/discord-icon.svg"
                      alt="Discord"
                      width={20}
                      height={20}
                      className="h-5 w-5 select-none relative z-10"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  </Link>

                  <button
                    onClick={() => {
                      setShowReportModal(true)
                      setIsOpen(false)
                    }}
                    className="flex items-center justify-center w-12 h-12 rounded-lg border border-gray-300 text-gray-800 transition-colors hover:bg-red-50 hover:border-red-300 hover:text-red-600 select-none relative overflow-hidden group transform hover:scale-105 duration-300 hover:shadow-lg"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                    <Flag className="h-5 w-5 select-none relative z-10" />
                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Mobile Search Bar - Below logo */}
          <div className="md:hidden px-2 pb-3">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 z-10 select-none pointer-events-none" />
              <input
                type="text"
                placeholder={searchTerms[currentSearchTerm]}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={() => setShowSearchModal(true)}
                onFocus={() => setShowSearchModal(true)}
                onBlur={(e) => {
                  // Only close if not clicking on modal content
                  const relatedTarget = e.relatedTarget as HTMLElement
                  if (!relatedTarget || !relatedTarget.closest("[data-search-modal]")) {
                    setTimeout(() => {
                      if (!document.querySelector("[data-search-modal]:hover")) {
                        handleCloseSearchModal()
                      }
                    }, 100)
                  }
                }}
                className={`w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 cursor-pointer outline-none transition-all duration-300 ${
                  isScrolled ? "bg-white/60 backdrop-blur-sm" : "bg-white"
                }`}
              />
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}</style>
      </nav>

      {/* Report Modal */}
      <ReportModal isOpen={showReportModal} onClose={() => setShowReportModal(false)} />

      {/* Search Modal */}
      {showSearchModal && (
        <>
          {/* Modal Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 z-[100]"
            style={{
              opacity: isClosingModal ? 0 : 1,
              animation: isClosingModal ? "fadeOut 0.2s ease-out forwards" : "fadeIn 0.2s ease-out forwards",
            }}
            onClick={handleCloseSearchModal}
          />

          {/* Search Modal */}
          <div
            data-search-modal
            className="fixed left-1/2 top-36 md:top-28 transform -translate-x-1/2 w-[90%] max-w-2xl bg-white rounded-2xl shadow-2xl z-[110] overflow-hidden select-none"
            style={{
              opacity: isClosingModal ? 0 : 1,
              transform: isClosingModal
                ? "translateX(-50%) translateY(-10px) scale(0.95)"
                : "translateX(-50%) translateY(0) scale(1)",
              animation: isClosingModal ? "fadeOutScale 0.2s ease-out forwards" : "fadeInScale 0.3s ease-out forwards",
            }}
            onMouseEnter={() => {
              // Prevent closing when hovering over modal
            }}
          >
            <div className="p-6">
              {/* Quick Categories */}
              <div
                className="mb-6"
                style={{
                  opacity: isClosingModal ? 0 : 0,
                  animation: isClosingModal ? "fadeOut 0.1s ease-out forwards" : "fadeIn 0.3s ease-out 0.15s forwards",
                }}
              >
                <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-3 select-none">
                  Quick Categories
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {quickCategories.map((category, index) => {
                    const IconComponent = category.icon
                    return (
                      <button
                        key={category.name}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-200 transition-all text-left group select-none"
                        style={{
                          opacity: isClosingModal ? 0 : 0,
                          animation: isClosingModal
                            ? "fadeOut 0.1s ease-out forwards"
                            : `fadeIn 0.3s ease-out ${0.25 + index * 0.1}s forwards`,
                        }}
                        onClick={handleCloseSearchModal}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <IconComponent className="h-4 w-4 text-green-600 select-none" />
                          <span className="font-medium text-gray-900 text-sm select-none">{category.name}</span>
                        </div>
                        <span className="text-xs text-gray-500 select-none">{category.count} items</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Recent Searches */}
              <div
                className="mb-6"
                style={{
                  opacity: isClosingModal ? 0 : 0,
                  animation: isClosingModal ? "fadeOut 0.1s ease-out forwards" : "fadeIn 0.3s ease-out 0.35s forwards",
                }}
              >
                <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-3 select-none">
                  Recent Searches
                </h3>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-50 transition-all text-left select-none"
                      style={{
                        opacity: isClosingModal ? 0 : 0,
                        animation: isClosingModal
                          ? "fadeOut 0.1s ease-out forwards"
                          : `fadeIn 0.3s ease-out ${0.45 + index * 0.05}s forwards`,
                      }}
                      onClick={() => {
                        setSearchQuery(search)
                        handleCloseSearchModal()
                      }}
                    >
                      <Clock className="h-4 w-4 text-gray-400 select-none" />
                      <span className="text-gray-700 select-none">{search}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending Products */}
              <div
                style={{
                  opacity: isClosingModal ? 0 : 0,
                  animation: isClosingModal ? "fadeOut 0.1s ease-out forwards" : "fadeIn 0.3s ease-out 0.55s forwards",
                }}
              >
                <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-3 flex items-center gap-2 select-none">
                  <TrendingUp className="h-4 w-4 select-none" />
                  <span className="select-none">Trending Products</span>
                </h3>
                <div className="space-y-2">
                  {trendingProducts.map((product, index) => {
                    const IconComponent = product.icon
                    return (
                      <button
                        key={product.name}
                        className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-200 transition-all select-none"
                        style={{
                          opacity: isClosingModal ? 0 : 0,
                          animation: isClosingModal
                            ? "fadeOut 0.1s ease-out forwards"
                            : `fadeIn 0.3s ease-out ${0.65 + index * 0.1}s forwards`,
                        }}
                        onClick={handleCloseSearchModal}
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-5 w-5 text-green-600 select-none" />
                          <div className="text-left">
                            <div className="font-medium text-gray-900 select-none">{product.name}</div>
                            <div className="text-sm text-gray-500 select-none">{product.category}</div>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-green-600 select-none">{product.price}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
            
            @keyframes fadeOut {
              from {
                opacity: 1;
              }
              to {
                opacity: 0;
              }
            }
            
            @keyframes fadeInScale {
              from {
                opacity: 0;
                transform: translateX(-50%) translateY(-10px) scale(0.95);
              }
              to {
                opacity: 1;
                transform: translateX(-50%) translateY(0) scale(1);
              }
            }
            
            @keyframes fadeOutScale {
              from {
                opacity: 1;
                transform: translateX(-50%) translateY(0) scale(1);
              }
              to {
                opacity: 0;
                transform: translateX(-50%) translateY(-10px) scale(0.95);
              }
            }
          `}</style>
        </>
      )}
    </>
  )
}
