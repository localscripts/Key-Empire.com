"use client"

import { X, Flag, AlertTriangle, MessageSquare, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ReportModal({ isOpen, onClose }: ReportModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [showThankYou, setShowThankYou] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  const handleCloseModal = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 200) // Match the fade-out duration
  }

  const handleSubmit = () => {
    console.log("Report submitted:", { title, description })
    setShowThankYou(true)

    // Auto-close thank you message after 2.5 seconds
    setTimeout(() => {
      setShowThankYou(false)
      setTitle("")
      setDescription("")
      handleCloseModal()
    }, 2500)
  }

  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowThankYou(false)
      setTitle("")
      setDescription("")
      setIsClosing(false)
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen && !showThankYou) {
        handleCloseModal()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, showThankYou])

  if (!isOpen) return null

  return (
    <>
      {/* Modal Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-[130] backdrop-blur-sm"
        style={{
          opacity: isClosing ? 0 : 1,
          animation: isClosing ? "backdropFadeOut 0.3s ease-out forwards" : "backdropPopIn 0.4s ease-out forwards",
        }}
        onClick={!showThankYou ? handleCloseModal : undefined}
      />

      {/* Modal */}
      <div
        data-report-modal
        className="fixed left-1/2 top-1/2 w-[90%] max-w-lg bg-white rounded-2xl shadow-2xl z-[140] overflow-hidden select-none"
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
        {showThankYou ? (
          // Thank You Message
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
            <div className="mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
              <p className="text-gray-600">Your report has been sent</p>
            </div>
          </div>
        ) : (
          // Report Form
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
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Flag className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Report an Issue</h2>
                  <p className="text-sm text-gray-600">Help us improve your experience</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseModal}
                className="text-gray-600 hover:text-gray-900 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Info Section - Changed to Green */}
            <div
              className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
              style={{
                opacity: isClosing ? 0 : 0,
                transform: "translateY(30px) scale(0.8)",
                animation: isClosing
                  ? "contentFadeOut 0.2s ease-out forwards"
                  : `contentPopIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.25s forwards`,
              }}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-green-900 mb-1">What can you report?</h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Technical issues or bugs</li>
                    <li>• Content or policy violations</li>
                    <li>• Rseeller violations</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-5">
              {/* Title Field */}
              <div
                style={{
                  opacity: isClosing ? 0 : 0,
                  transform: "translateY(30px) scale(0.8)",
                  animation: isClosing
                    ? "contentFadeOut 0.2s ease-out forwards"
                    : `contentPopIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.35s forwards`,
                }}
              >
                <label htmlFor="title" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FileText className="h-4 w-4" />
                  Issue Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="e.g., Unable to access premium features"
                />
              </div>

              {/* Description Field */}
              <div
                style={{
                  opacity: isClosing ? 0 : 0,
                  transform: "translateY(30px) scale(0.8)",
                  animation: isClosing
                    ? "contentFadeOut 0.2s ease-out forwards"
                    : `contentPopIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.45s forwards`,
                }}
              >
                <label htmlFor="description" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <MessageSquare className="h-4 w-4" />
                  Detailed Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
                  placeholder="Please provide as much detail as possible about the issue you're experiencing. Include steps to reproduce the problem if applicable."
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">Be specific to help us resolve your issue faster</p>
                  <p className="text-xs text-gray-400">{description.length}/500</p>
                </div>
              </div>

              {/* Send Button */}
              <div
                className="pt-2"
                style={{
                  opacity: isClosing ? 0 : 0,
                  transform: "translateY(30px) scale(0.8)",
                  animation: isClosing
                    ? "contentFadeOut 0.2s ease-out forwards"
                    : `contentPopIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.55s forwards`,
                }}
              >
                <Button
                  onClick={handleSubmit}
                  disabled={!title.trim() || !description.trim()}
                  className="w-full relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0 overflow-hidden group select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none py-3"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative z-10 flex items-center justify-center gap-2 select-none">
                    <Flag className="h-4 w-4" />
                    Send Report
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
                    : `contentPopIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.65s forwards`,
                }}
              >
                <p className="text-xs text-gray-500">Our team will get your message </p>
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
