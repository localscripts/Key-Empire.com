"use client"

import { X, DollarSign, LinkIcon, Copy, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

interface AffiliateModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AffiliateModal({ isOpen, onClose }: AffiliateModalProps) {
  const [affiliateCode, setAffiliateCode] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [affiliateLink, setAffiliateLink] = useState("")
  const [linkCopied, setLinkCopied] = useState(false)

  const handleCloseModal = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 200)
  }

  const handleSubmit = async () => {
    if (!affiliateCode.trim()) return

    setIsSubmitting(true)
    setError(null)

    try {
      const generatedLink = `https://key-empire.com/affiliate/${affiliateCode.toLowerCase().replace(/[^a-z0-9]/g, "")}`
      setAffiliateLink(generatedLink)

      await new Promise((resolve) => setTimeout(resolve, 1000))

      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        setAffiliateCode("")
        setAffiliateLink("")
        handleCloseModal()
      }, 4000)
    } catch (err) {
      console.error("Affiliate registration error:", err)
      setError("Failed to generate affiliate link. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(affiliateLink)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  useEffect(() => {
    if (!isOpen) {
      setShowSuccess(false)
      setAffiliateCode("")
      setAffiliateLink("")
      setIsClosing(false)
      setError(null)
      setIsSubmitting(false)
      setLinkCopied(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Modal Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 dark:bg-black/80 z-[130] backdrop-blur-sm"
        style={{
          opacity: isClosing ? 0 : 1,
          animation: isClosing ? "backdropFadeOut 0.3s ease-out forwards" : "backdropPopIn 0.4s ease-out forwards",
        }}
        onClick={!showSuccess ? handleCloseModal : undefined}
      />

      {/* Modal */}
      <div
        data-affiliate-modal
        className="fixed left-1/2 top-1/2 w-[90%] max-w-lg bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl z-[140] overflow-hidden select-none border border-gray-200 dark:border-gray-700"
        style={{
          opacity: isClosing ? 0 : 1,
          transform: isClosing
            ? "translate(-50%, calc(-50% + 20px)) scale(0.9) rotateX(10deg)"
            : "translate(-50%, -50%) scale(1) rotateX(0deg)",
          animation: isClosing
            ? "modalPopOut 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards"
            : "modalPopIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
        }}
      >
        {showSuccess ? (
          // Success Message with Affiliate Link
          <div
            className="p-8 text-center"
            style={{
              opacity: isClosing ? 0 : 0,
              transform: "translateY(30px) scale(0.8)",
              animation: isClosing
                ? "contentFadeOut 0.2s ease-out forwards"
                : `contentPopIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0s forwards`,
            }}
          >
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Welcome to the Program!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Your affiliate link has been generated</p>

              {/* Affiliate Link Display */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Your Affiliate Link:</p>
                <div className="flex items-center gap-2 bg-white dark:bg-gray-900 rounded-lg p-3 border">
                  <LinkIcon className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <code className="text-sm text-gray-900 dark:text-gray-100 flex-1 break-all">{affiliateLink}</code>
                  <Button onClick={copyToClipboard} size="sm" variant="ghost" className="flex-shrink-0 h-8 w-8 p-0">
                    {linkCopied ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                {linkCopied && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">Link copied to clipboard!</p>
                )}
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p>• Earn 15% commission on every sale</p>
                <p>• Weekly payouts to your account</p>
                <p>• Track your earnings in real-time</p>
              </div>
            </div>
          </div>
        ) : (
          // Affiliate Registration Form
          <div className="p-6">
            {/* Header with Icon */}
            <div
              className="flex items-center justify-between mb-6"
              style={{
                opacity: isClosing ? 0 : 0,
                transform: "translateY(30px) scale(0.8)",
                animation: isClosing
                  ? "contentFadeOut 0.2s ease-out forwards"
                  : `contentPopIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s forwards`,
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Join Affiliate Program</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Start earning 15% commission today</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseModal}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Benefits Section */}
            <div
              className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6"
              style={{
                opacity: isClosing ? 0 : 0,
                transform: "translateY(30px) scale(0.8)",
                animation: isClosing
                  ? "contentFadeOut 0.2s ease-out forwards"
                  : `contentPopIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.25s forwards`,
              }}
            >
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-green-900 dark:text-green-100 mb-1">Affiliate Benefits</h3>
                  <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                    <li>• 15% commission on every sale</li>
                    <li>• Weekly automatic payouts</li>
                    <li>• Real-time earnings tracking</li>
                    <li>• 24/7 dedicated support</li>
                  </ul>
                </div>
              </div>
            </div>

            <div
              className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6"
              style={{
                opacity: isClosing ? 0 : 0,
                transform: "translateY(30px) scale(0.8)",
                animation: isClosing
                  ? "contentFadeOut 0.2s ease-out forwards"
                  : `contentPopIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s forwards`,
              }}
            >
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <div>
                  <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-1">Important Notice</h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    To activate your referral earnings, you must register your affiliate code with our reseller
                    partners. Contact our support team after generating your link for setup assistance.
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-5">
              {/* Affiliate Code Field */}
              <div
                style={{
                  opacity: isClosing ? 0 : 0,
                  transform: "translateY(30px) scale(0.8)",
                  animation: isClosing
                    ? "contentFadeOut 0.2s ease-out forwards"
                    : `contentPopIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s forwards`,
                }}
              >
                <label
                  htmlFor="affiliateCode"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Affiliate Code
                </label>
                <input
                  type="text"
                  id="affiliateCode"
                  value={affiliateCode}
                  onChange={(e) => setAffiliateCode(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="your-affiliate-code"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  This will be used in your affiliate link: key-empire.com/affiliate/your-affiliate-code
                </p>
              </div>

              {/* Error Message Display */}
              {error && (
                <div
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
                  style={{
                    opacity: isClosing ? 0 : 0,
                    transform: "translateY(30px) scale(0.8)",
                    animation: isClosing
                      ? "contentFadeOut 0.2s ease-out forwards"
                      : `contentPopIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.45s forwards`,
                  }}
                >
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              )}

              {/* Generate Link Button */}
              <div
                className="pt-2"
                style={{
                  opacity: isClosing ? 0 : 0,
                  transform: "translateY(30px) scale(0.8)",
                  animation: isClosing
                    ? "contentFadeOut 0.2s ease-out forwards"
                    : `contentPopIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s forwards`,
                }}
              >
                <Button
                  onClick={handleSubmit}
                  disabled={!affiliateCode.trim() || isSubmitting}
                  className="w-full relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0 overflow-hidden group select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none py-3"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative z-10 flex items-center justify-center gap-2 select-none">
                    <DollarSign className="h-4 w-4" />
                    {isSubmitting ? "Generating..." : "Generate Affiliate Link"}
                  </span>
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </Button>
              </div>

              {/* Footer Note */}
              <div
                className="text-center pt-2"
                style={{
                  opacity: isClosing ? 0 : 0,
                  transform: "translateY(30px) scale(0.8)",
                  animation: isClosing
                    ? "contentFadeOut 0.2s ease-out forwards"
                    : `contentPopIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.55s forwards`,
                }}
              >
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  By joining, you agree to our affiliate terms and conditions
                </p>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes modalPopIn {
            0% {
              opacity: 0;
              transform: translate(-50%, calc(-50% + 30px)) scale(0.8) rotateX(15deg);
            }
            60% {
              opacity: 1;
              transform: translate(-50%, calc(-50% - 5px)) scale(1.02) rotateX(-2deg);
            }
            100% {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1) rotateX(0deg);
            }
          }

          @keyframes modalPopOut {
            0% {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1) rotateX(0deg);
            }
            100% {
              opacity: 0;
              transform: translate(-50%, calc(-50% + 20px)) scale(0.9) rotateX(10deg);
            }
          }

          @keyframes backdropPopIn {
            0% {
              opacity: 0;
              backdrop-filter: blur(0px);
            }
            100% {
              opacity: 1;
              backdrop-filter: blur(8px);
            }
          }

          @keyframes backdropFadeOut {
            0% {
              opacity: 1;
              backdrop-filter: blur(8px);
            }
            100% {
              opacity: 0;
              backdrop-filter: blur(0px);
            }
          }

          @keyframes contentPopIn {
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

          @keyframes contentFadeOut {
            0% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
            100% {
              opacity: 0;
              transform: translateY(-10px) scale(0.95);
            }
          }
        `}</style>
      </div>
    </>
  )
}
