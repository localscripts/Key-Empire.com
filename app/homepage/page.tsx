"use client"

import type React from "react"

import { useState, useRef } from "react"
import Navbar from "../../navbar"
import LoadingScreen from "../../components/loading-screen"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Footer from "../../components/footer"

export default function Homepage() {
  const [showLoading, setShowLoading] = useState(true)
  const executorsRef = useRef<HTMLDivElement>(null)
  const scriptsRef = useRef<HTMLDivElement>(null)

  const handleLoadingComplete = () => {
    setShowLoading(false)
  }

  const scroll = (ref: React.RefObject<HTMLDivElement>, direction: "left" | "right") => {
    if (ref.current) {
      const scrollAmount = 320 // Width of card + gap
      const currentScroll = ref.current.scrollLeft
      const targetScroll = direction === "left" ? currentScroll - scrollAmount : currentScroll + scrollAmount

      ref.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      })
    }
  }

  const executors = [
    {
      name: "Zenith",
      price: "$1.00",
      description: "Premium script executor with advanced features",
    },
    {
      name: "Ronin",
      price: "$2.20",
      description: "Powerful and reliable execution engine",
    },
    { name: "Wave", price: "$1.00", description: "Smooth and efficient script runner" },
    {
      name: "Exoliner",
      price: "$1.00",
      description: "High-performance executor for professionals",
    },
    { name: "Cryptic", price: "$1.00", description: "Secure and fast script execution" },
    {
      name: "Arceus X",
      price: "$1.00",
      description: "Advanced executor with premium tools",
    },
    { name: "Fluxus", price: "$1.00", description: "Versatile executor for all your needs" },
    { name: "Synapse X", price: "$3.50", description: "Industry-leading script executor" },
  ]

  const scripts = [
    {
      name: "Auto Farm",
      price: "Free",
      description: "Automated farming script for efficiency",
    },
    { name: "Speed Hack", price: "$0.50", description: "Enhanced movement speed script" },
    {
      name: "ESP Script",
      price: "$1.00",
      description: "Enhanced visual awareness tools",
    },
    { name: "Aimbot Pro", price: "$2.00", description: "Advanced targeting assistance" },
    {
      name: "Fly Script",
      price: "$0.75",
      description: "Flight capabilities for your character",
    },
    {
      name: "God Mode",
      price: "$1.50",
      description: "Invincibility and protection script",
    },
    { name: "Teleport", price: "$0.25", description: "Instant location transportation" },
    {
      name: "Auto Clicker",
      price: "Free",
      description: "Automated clicking functionality",
    },
  ]

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: "url('/images/pattern-background.png')",
        backgroundRepeat: "repeat",
        backgroundSize: "400px 400px",
        backgroundPosition: "0 0",
      }}
    >
      {showLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}
      <Navbar />
      <main className="px-4 py-8 mt-20">
        <div className="w-[95%] max-w-6xl mx-auto space-y-12">
          {/* Executors Section */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-black/30 shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Executors</h2>
                <p className="text-gray-600">Premium script execution tools</p>
              </div>

              <div
                ref={executorsRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {executors.map((executor, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-80 bg-gray-50/90 backdrop-blur-sm rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    {/* 1:1 Image */}
                    <div className="w-full aspect-square bg-white rounded-lg mb-4 flex items-center justify-center shadow-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-400">IMG</div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-900">{executor.name}</h3>
                        <p className="text-lg font-bold text-green-600">{executor.price}</p>
                      </div>
                      <p className="text-gray-600 text-sm">{executor.description}</p>

                      {/* Buy Button */}
                      <button
                        className="w-full px-4 py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                        onClick={() => console.log(`Buying ${executor.name} for ${executor.price}`)}
                      >
                        <span className="relative z-10">Buy Now</span>
                        <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Scroll Buttons - Bottom Center */}
              <div className="flex justify-center gap-2 mt-6">
                <button
                  onClick={() => scroll(executorsRef, "left")}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => scroll(executorsRef, "right")}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Scripts Section */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-black/30 shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Scripts</h2>
                <p className="text-gray-600">Ready-to-use script collection</p>
              </div>

              <div
                ref={scriptsRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {scripts.map((script, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-80 bg-gray-50/90 backdrop-blur-sm rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    {/* 1:1 Image */}
                    <div className="w-full aspect-square bg-white rounded-lg mb-4 flex items-center justify-center shadow-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-400">IMG</div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-900">{script.name}</h3>
                        <p className="text-lg font-bold text-green-600">{script.price}</p>
                      </div>
                      <p className="text-gray-600 text-sm">{script.description}</p>

                      {/* Buy Button */}
                      <button
                        className="w-full px-4 py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                        onClick={() => console.log(`Buying ${script.name} for ${script.price}`)}
                      >
                        <span className="relative z-10">Buy Now</span>
                        <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Scroll Buttons - Bottom Center */}
              <div className="flex justify-center gap-2 mt-6">
                <button
                  onClick={() => scroll(scriptsRef, "left")}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => scroll(scriptsRef, "right")}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
