"use client"

import { X, DollarSign, Clock, Users, Shield, TrendingUp, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface AffiliateInfoModalProps {
  isOpen: boolean
  onClose: () => void
  onStartEarning: () => void
}

export default function AffiliateInfoModal({ isOpen, onClose, onStartEarning }: AffiliateInfoModalProps) {
  const [isClosing, setIsClosing] = useState(false)

  const handleCloseModal = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 200)
  }

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 dark:bg-black/80 z-[9998] backdrop-blur-sm"
        style={{
          opacity: isClosing ? 0 : 1,
          animation: isClosing ? "backdropFadeOut 0.3s ease-out forwards" : "backdropPopIn 0.4s ease-out forwards",
        }}
        onClick={handleCloseModal}
      />

      <div
        className="fixed left-1/2 top-1/2 w-[90%] max-w-sm bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl z-[9999] overflow-hidden select-none border border-gray-200 dark:border-gray-700 max-h-[75vh] overflow-y-auto"
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
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700"
          style={{
            opacity: isClosing ? 0 : 1,
            transform: isClosing ? "translateY(30px) scale(0.8)" : "translateY(0) scale(1)",
            animation: isClosing
              ? "contentFadeOut 0.2s ease-out forwards"
              : `contentPopIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s forwards`,
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Affiliate Program Details</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCloseModal}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Hero Section */}
          <div
            className="text-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-4"
            style={{
              opacity: isClosing ? 0 : 1,
              transform: isClosing ? "translateY(30px) scale(0.8)" : "translateY(0) scale(1)",
              animation: isClosing
                ? "contentFadeOut 0.2s ease-out forwards"
                : `contentPopIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.25s forwards`,
            }}
          >
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
              Earn 15% Commission on Every Sale!
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Join thousands of affiliates earning passive income by promoting Key-Empire
            </p>
          </div>

          {/* Features Grid */}
          <div
            className="grid grid-cols-1 gap-3"
            style={{
              opacity: isClosing ? 0 : 1,
              transform: isClosing ? "translateY(30px) scale(0.8)" : "translateY(0) scale(1)",
              animation: isClosing
                ? "contentFadeOut 0.2s ease-out forwards"
                : `contentPopIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.35s forwards`,
            }}
          >
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-green-500" />
                <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">High Commission</h4>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300">Earn 15% on every successful referral</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-blue-500" />
                <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">Weekly Payouts</h4>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300">Get paid every week via PayPal or Bitcoin</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-purple-500" />
                <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">24/7 Support</h4>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300">Dedicated affiliate support team</p>
            </div>

            
          </div>

          {/* How It Works */}
          <div
            className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4"
            style={{
              opacity: isClosing ? 0 : 1,
              transform: isClosing ? "translateY(30px) scale(0.8)" : "translateY(0) scale(1)",
              animation: isClosing
                ? "contentFadeOut 0.2s ease-out forwards"
                : `contentPopIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.45s forwards`,
            }}
          >
            <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <Gift className="w-4 h-4 text-green-500" />
              How It Works
            </h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-900 dark:text-gray-100">Sign Up</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    Create your affiliate account and get your unique referral link
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-900 dark:text-gray-100">Promote</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    Share your link on social media or with friends
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-900 dark:text-gray-100">Earn</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">Get 15% commission on every purchase</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div
            className="text-center pt-2"
            style={{
              opacity: isClosing ? 0 : 1,
              transform: isClosing ? "translateY(30px) scale(0.8)" : "translateY(0) scale(1)",
              animation: isClosing
                ? "contentFadeOut 0.2s ease-out forwards"
                : `contentPopIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.55s forwards`,
            }}
          >
            <Button
              onClick={onStartEarning}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2.5 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Start Earning Now
            </Button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">No setup fees • No monthly costs</p>
          </div>
        </div>

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
