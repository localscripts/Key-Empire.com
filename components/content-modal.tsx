"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ContentModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ContentModal({ isOpen, onClose }: ContentModalProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Modal Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-60 backdrop-blur-sm"
        style={{
          animation: "backdropPopIn 0.4s ease-out forwards",
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-4xl bg-white rounded-2xl shadow-2xl z-70 overflow-hidden select-none"
        style={{
          opacity: 0,
          transform: "translate(-50%, -50%) scale(0.85) rotateY(10deg)",
          animation: "modalMegaPopIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
        }}
      >
        <div className="flex flex-col md:flex-row min-h-[500px]">
          {/* Left side - Image */}
          <div className="w-full md:w-1/2 bg-gray-50 border-r border-gray-200 flex items-center justify-center p-8">
            <div className="w-full max-w-sm aspect-square bg-white rounded-xl border-2 border-gray-300 flex items-center justify-center shadow-sm">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-400 mb-2">IMG</div>
                <div className="text-sm text-gray-500">Image Placeholder</div>
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="w-full md:w-1/2 p-8 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Welcome to Key-Empire</h2>
                <p className="text-gray-600 mt-1">Your premium executor marketplace</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-600 hover:text-gray-900 h-8 w-8 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Featured Products</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Zenith Executor</h4>
                        <p className="text-sm text-gray-600">Premium script execution</p>
                      </div>
                      <span className="text-green-600 font-semibold">$1.00</span>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Arceus X</h4>
                        <p className="text-sm text-gray-600">Advanced features</p>
                      </div>
                      <span className="text-green-600 font-semibold">$1.00</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Why Choose Us?</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Premium quality executors</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>24/7 customer support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Regular updates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Secure transactions</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
              <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={onClose}>
                Browse Products
              </Button>
              <Button variant="outline" onClick={onClose} className="border-gray-300 bg-transparent">
                Learn More
              </Button>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes modalMegaPopIn {
            0% {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.85) rotateY(10deg);
            }
            50% {
              opacity: 0.8;
              transform: translate(-50%, -50%) scale(1.02) rotateY(-2deg);
            }
            100% {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1) rotateY(0deg);
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
        `}</style>
      </div>
    </>
  )
}
