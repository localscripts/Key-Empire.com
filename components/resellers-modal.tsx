"use client"

import { X, Star, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import Image from "next/image"
import { affiliateHandler } from "@/lib/services/affiliate-handler"
import { AffiliateManager } from "@/lib/affiliate-utils"

interface DurationPricing {
  price: string
  url: string
}

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
  pfpUrl: string
  isVerified: boolean
}

interface ResellersModalProps {
  isOpen: boolean
  onClose: () => void
  productTitle: string
  resellers: ResellerData[]
  isLoading: boolean
  error: string | null
}

const durationTypes = [
  { key: "day1", label: "1 Day" },
  { key: "day3", label: "3 Days" },
  { key: "week1", label: "1 Week" },
  { key: "month1", label: "1 Month" },
  { key: "year1", label: "1 Year" },
]

export default function ResellersModal({
  isOpen,
  onClose,
  productTitle,
  resellers,
  isLoading,
  error,
}: ResellersModalProps) {
  const [isClosing, setIsClosing] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const [showPaymentsTooltip, setShowPaymentsTooltip] = useState<number | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      new AffiliateManager()
    }
  }, [])

  const getAvailableDurations = () => {
    const availableDurations = new Set<string>()
    resellers.forEach((reseller) => {
      Object.keys(reseller.durations).forEach((key) => {
        if (reseller.durations[key as keyof typeof reseller.durations]) {
          availableDurations.add(key)
        }
      })
    })
    return durationTypes.filter((duration) => availableDurations.has(duration.key))
  }

  const availableDurationTypes = getAvailableDurations()

  const handleCloseModal = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
      if (typeof window !== "undefined") {
        const event = new CustomEvent("deselectProduct")
        window.dispatchEvent(event)
      }
    }, 200)
  }

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedUrl(url)
      setTimeout(() => setCopiedUrl(null), 2000)
    } catch (err) {
      console.error("Failed to copy URL:", err)
    }
  }

  useEffect(() => {
    if (!isOpen) {
      setIsClosing(false)
      setCopiedUrl(null)
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        handleCloseModal()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  const PaymentMethodsDisplay = ({ payments, resellerIndex }: { payments: string[]; resellerIndex: number }) => {
    const maxVisiblePayments = 8 // Show up to 8 payment methods (3+3+2 layout)
    const visiblePayments = payments.slice(0, maxVisiblePayments)
    const remainingPayments = payments.slice(maxVisiblePayments)
    const hiddenCount = remainingPayments.length

    const getPaymentRows = () => {
      const rows = []
      // Row 1: First 3 payments
      if (visiblePayments.length > 0) {
        rows.push(visiblePayments.slice(0, 3))
      }
      // Row 2: Next 3 payments
      if (visiblePayments.length > 3) {
        rows.push(visiblePayments.slice(3, 6))
      }
      // Row 3: Last 2 payments + expand button if needed
      if (visiblePayments.length > 6) {
        const lastRowPayments = visiblePayments.slice(6, 8)
        rows.push(lastRowPayments)
      }
      return rows
    }

    const paymentRows = getPaymentRows()

    return (
      <div className="relative">
        <div className="space-y-1">
          {paymentRows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex flex-wrap gap-1">
              {row.map((payment, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-md text-gray-700 dark:text-gray-300 whitespace-nowrap"
                >
                  {payment}
                </span>
              ))}
              {rowIndex === paymentRows.length - 1 && hiddenCount > 0 && (
                <button
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-xs rounded-md text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all duration-200 whitespace-nowrap cursor-pointer"
                  onMouseEnter={() => setShowPaymentsTooltip(resellerIndex)}
                  onMouseLeave={() => setShowPaymentsTooltip(null)}
                >
                  +{hiddenCount} more
                </button>
              )}
            </div>
          ))}
        </div>

        {showPaymentsTooltip === resellerIndex && (
          <div
            className="absolute bottom-full left-0 mb-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-[160] min-w-[200px] max-w-[300px] animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-200"
            onMouseEnter={() => setShowPaymentsTooltip(resellerIndex)}
            onMouseLeave={() => setShowPaymentsTooltip(null)}
          >
            <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Additional Payment Methods:
            </div>
            <div className="flex flex-wrap gap-1">
              {remainingPayments.map((payment, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-md text-gray-700 dark:text-gray-300 whitespace-nowrap"
                >
                  {payment}
                </span>
              ))}
            </div>
            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white dark:border-t-gray-800"></div>
          </div>
        )}
      </div>
    )
  }

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 dark:bg-black/80 z-[130] backdrop-blur-sm"
        style={{
          opacity: isClosing ? 0 : 1,
          animation: isClosing ? "fadeOut 0.2s ease-out forwards" : "fadeIn 0.2s ease-out forwards",
        }}
        onClick={handleCloseModal}
      />

      <div
        data-resellers-modal
        className="fixed left-1/2 top-1/2 w-[95%] max-w-6xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl z-[140] overflow-hidden select-none max-h-[90vh] overflow-y-auto scrollbar-hide border border-gray-200 dark:border-gray-700"
        style={{
          opacity: isClosing ? 0 : 1,
          transform: isClosing
            ? "translate(-50%, calc(-50% + 30px)) scale(0.9) rotateX(8deg)"
            : "translate(-50%, -50%) scale(1) rotateX(0deg)",
          animation: isClosing
            ? "modalOut 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards"
            : "modalIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
        }}
      >
        <div className="p-4 md:p-6 lg:p-8">
          <div
            className="flex items-center justify-between mb-4 md:mb-6"
            style={{
              opacity: isClosing ? 0 : 0,
              animation: isClosing ? "fadeOut 0.1s ease-out forwards" : "fadeIn 0.3s ease-out 0.15s forwards",
            }}
          >
            <div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 md:mb-2">
                {productTitle} Resellers
              </h2>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                Compare prices and choose your preferred seller
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCloseModal}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 h-8 w-8 md:h-10 md:w-10 flex-shrink-0"
            >
              <X className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </div>

          <div
            className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 md:p-4 lg:p-6"
            style={{
              opacity: isClosing ? 0 : 0,
              animation: isClosing ? "fadeOut 0.1s ease-out forwards" : "fadeIn 0.3s ease-out 0.25s forwards",
            }}
          >
            {isLoading ? (
              <div className="text-center py-8 md:py-12">
                <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading resellers...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 md:py-12">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="h-6 w-6 md:h-8 md:w-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No Resellers Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{error}</p>
              </div>
            ) : resellers.length === 0 ? (
              <div className="text-center py-8 md:py-12">
                <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg">
                  No active resellers found for this product.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="hidden lg:block">
                  <div
                    className="grid gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg font-semibold text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700"
                    style={{ gridTemplateColumns: `3fr 2fr repeat(${availableDurationTypes.length}, 1fr)` }}
                  >
                    <div>Reseller</div>
                    <div>Payments</div>
                    {availableDurationTypes.map((duration) => (
                      <div key={duration.key} className="text-center">
                        {duration.label}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    {resellers.map((reseller, index) => (
                      <div
                        key={index}
                        className="grid gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 hover:shadow-md transition-all duration-300"
                        style={{
                          gridTemplateColumns: `3fr 2fr repeat(${availableDurationTypes.length}, 1fr)`,
                          opacity: isClosing ? 0 : 0,
                          transform: "translateX(-50px) scale(0.9)",
                          animation: isClosing
                            ? "itemOut 0.2s ease-out forwards"
                            : `itemIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${0.35 + index * 0.08}s forwards`,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Image
                              src={reseller.pfpUrl || "/placeholder.svg"}
                              alt={reseller.name}
                              width={40}
                              height={40}
                              className="rounded-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/images/key-empire-logo.png"
                              }}
                            />
                            {reseller.isVerified && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                <Shield className="h-2.5 w-2.5 text-white" />
                              </div>
                            )}
                            {reseller.isPremium && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                                <Star className="h-2.5 w-2.5 text-white" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                              {reseller.name}
                              {reseller.isVerified && <Shield className="h-4 w-4 text-blue-500" />}
                              {reseller.isPremium && <Star className="h-4 w-4 text-yellow-500" />}
                            </h4>
                            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                              From ${reseller.lowestPrice.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div>
                          <PaymentMethodsDisplay payments={reseller.payments} resellerIndex={index} />
                        </div>

                        {availableDurationTypes.map((duration) => {
                          const durationData = reseller.durations[duration.key as keyof typeof reseller.durations]
                          return (
                            <div key={duration.key} className="text-center">
                              {durationData ? (
                                <div className="space-y-2">
                                  <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                                    ${durationData.price}
                                  </p>
                                  <a
                                    href={affiliateHandler.processUrl(durationData.url)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors w-full"
                                    onClick={() => affiliateHandler.trackClick(durationData.url, productTitle)}
                                  >
                                    Buy
                                  </a>
                                </div>
                              ) : (
                                <span className="text-gray-400 dark:text-gray-600 text-sm">N/A</span>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:hidden space-y-4">
                  {resellers.map((reseller, index) => {
                    const resellerAvailableDurations = availableDurationTypes.filter(
                      (duration) => reseller.durations[duration.key as keyof typeof reseller.durations],
                    )

                    return (
                      <div
                        key={index}
                        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 hover:shadow-md transition-all duration-300 overflow-hidden"
                        style={{
                          opacity: isClosing ? 0 : 0,
                          transform: "translateY(20px) scale(0.95)",
                          animation: isClosing
                            ? "itemOut 0.2s ease-out forwards"
                            : `itemIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${0.35 + index * 0.08}s forwards`,
                        }}
                      >
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="relative">
                              <Image
                                src={reseller.pfpUrl || "/placeholder.svg"}
                                alt={reseller.name}
                                width={48}
                                height={48}
                                className="rounded-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = "/images/key-empire-logo.png"
                                }}
                              />
                              {reseller.isVerified && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                  <Shield className="h-3 w-3 text-white" />
                                </div>
                              )}
                              {reseller.isPremium && (
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                                  <Star className="h-3 w-3 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 text-lg">
                                {reseller.name}
                                {reseller.isVerified && <Shield className="h-4 w-4 text-blue-500" />}
                                {reseller.isPremium && <Star className="h-4 w-4 text-yellow-500" />}
                              </h4>
                              <p className="text-green-600 dark:text-green-400 font-medium">
                                From ${reseller.lowestPrice.toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Payment Methods:
                            </p>
                            <PaymentMethodsDisplay payments={reseller.payments} resellerIndex={index} />
                          </div>
                        </div>

                        <div className="p-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {resellerAvailableDurations.map((duration) => {
                              const durationData = reseller.durations[duration.key as keyof typeof reseller.durations]
                              return (
                                <div
                                  key={duration.key}
                                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                                >
                                  <div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">{duration.label}</p>
                                    <p className="text-green-600 dark:text-green-400 font-semibold">
                                      ${durationData!.price}
                                    </p>
                                  </div>
                                  <a
                                    href={affiliateHandler.processUrl(durationData!.url)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                                    onClick={() => affiliateHandler.trackClick(durationData!.url, productTitle)}
                                  >
                                    Buy
                                  </a>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <style jsx>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
          }
          
          @keyframes modalIn {
            0% {
              opacity: 0;
              transform: translate(-50%, calc(-50% + 40px)) scale(0.9) rotateX(12deg);
            }
            60% {
              opacity: 1;
              transform: translate(-50%, calc(-50% - 8px)) scale(1.01) rotateX(-3deg);
            }
            100% {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1) rotateX(0deg);
            }
          }

          @keyframes modalOut {
            0% {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1) rotateX(0deg);
            }
            100% {
              opacity: 0;
              transform: translate(-50%, calc(-50% + 30px)) scale(0.9) rotateX(8deg);
            }
          }

          @keyframes itemIn {
            0% {
              opacity: 0;
              transform: translateY(20px) scale(0.95);
            }
            60% {
              opacity: 1;
              transform: translateY(-2px) scale(1.01);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes itemOut {
            0% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
            100% {
              opacity: 0;
              transform: translateY(10px) scale(0.98);
            }
          }
        `}</style>
      </div>
    </>
  )
}
