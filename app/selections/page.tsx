"use client"

import { useState } from "react"
import Navbar from "../../navbar"
import LoadingScreen from "../../components/loading-screen"
import Image from "next/image"
import Link from "next/link"
import Footer from "../../components/footer"

export default function SelectionsPage() {
  const [showLoading, setShowLoading] = useState(true)

  const handleLoadingComplete = () => {
    setShowLoading(false)
  }

  const selections = [
    {
      id: 1,
      title: "Premium Executors",
      image: "/images/selection-icon.png",
      redirectUrl: "/premium-executors",
    },
    {
      id: 2,
      title: "Shooter Pro",
      image: "/images/shooter-icon.png",
      redirectUrl: "/shooter-pro",
    },
    {
      id: 3,
      title: "Mystery Box Alpha",
      image: "/images/question-icon.png",
      redirectUrl: "/mystery-alpha",
    },
    {
      id: 4,
      title: "Secret Scripts",
      image: "/images/question-icon.png",
      redirectUrl: "/secret-scripts",
    },
    {
      id: 5,
      title: "Hidden Tools",
      image: "/images/question-icon.png",
      redirectUrl: "/hidden-tools",
    },
    {
      id: 6,
      title: "Unknown Package",
      image: "/images/question-icon.png",
      redirectUrl: "/unknown-package",
    },
    {
      id: 7,
      title: "Classified Beta",
      image: "/images/question-icon.png",
      redirectUrl: "/classified-beta",
    },
    {
      id: 8,
      title: "Enigma Collection",
      image: "/images/question-icon.png",
      redirectUrl: "/enigma-collection",
    },
    {
      id: 9,
      title: "Phantom Suite",
      image: "/images/question-icon.png",
      redirectUrl: "/phantom-suite",
    },
    {
      id: 10,
      title: "Cipher Vault",
      image: "/images/question-icon.png",
      redirectUrl: "/cipher-vault",
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
      <main className="px-4 py-8 mt-28 md:mt-20">
        <div className="w-[95%] max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 md:mb-12 bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-200 shadow-lg">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">Product Selections</h1>
            <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Choose from our premium collection of tools and scripts. Click on any image to explore.
            </p>
          </div>

          {/* Selections Grid - Mobile Optimized */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {selections.map((selection, index) => (
              <Link
                key={selection.id}
                href={selection.redirectUrl}
                className="group block"
                style={{
                  opacity: 0,
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`,
                }}
              >
                <div className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden shadow-md md:shadow-lg hover:shadow-xl md:hover:shadow-2xl transition-all duration-300 group-hover:scale-105 bg-white/90 backdrop-blur-sm border border-gray-200">
                  {/* Full-sized Image */}
                  <Image
                    src={selection.image || "/placeholder.svg"}
                    alt={selection.title}
                    fill
                    className="object-cover transform group-hover:scale-110 transition-transform duration-300"
                    draggable={false}
                  />

                  {/* Hover Overlay with Title */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <h3 className="text-white font-bold text-sm md:text-lg text-center px-2 md:px-4">
                      {selection.title}
                    </h3>
                  </div>

                  {/* Animated Border */}
                  <div className="absolute inset-0 rounded-xl md:rounded-2xl border-2 border-transparent group-hover:border-blue-400 transition-colors duration-300 pointer-events-none"></div>
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile-friendly bottom spacing */}
          <div className="h-8 md:h-16"></div>
        </div>
      </main>
      <Footer />
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
