"use client"

import Link from "next/link"
import { useState } from "react"
import Navbar from "../navbar"
import LoadingScreen from "../components/loading-screen"
import Footer from "../components/footer"
import { Home, Search, ArrowLeft } from "lucide-react"

export default function NotFound() {
  const [showLoading, setShowLoading] = useState(true)

  const handleLoadingComplete = () => {
    setShowLoading(false)
  }

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
        <div className="max-w-4xl mx-auto text-center">
          {/* 404 Hero */}
          <div
            className="bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg p-12 mb-8"
            style={{
              opacity: 0,
              animation: "fadeInUp 0.8s ease-out 0.2s forwards",
            }}
          >
            <div className="text-8xl font-bold text-gray-300 mb-4">404</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
            <p className="text-xl text-gray-600 mb-8">The page you're looking for doesn't exist or has been moved.</p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Home className="w-5 h-5" />
                Go Home
              </Link>
              <Link
                href="/selections"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Search className="w-5 h-5" />
                Browse Products
              </Link>
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
                Go Back
              </button>
            </div>
          </div>

          {/* Helpful Links */}
          <div
            className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl border border-blue-200 p-8"
            style={{
              opacity: 0,
              animation: "fadeInUp 0.8s ease-out 0.4s forwards",
            }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Popular Pages</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/"
                className="p-4 bg-white/80 rounded-lg hover:bg-white transition-colors duration-200 text-gray-700 hover:text-blue-600"
              >
                <h3 className="font-semibold mb-2">Homepage</h3>
                <p className="text-sm">Discover Key-Empire</p>
              </Link>
              <Link
                href="/selections"
                className="p-4 bg-white/80 rounded-lg hover:bg-white transition-colors duration-200 text-gray-700 hover:text-blue-600"
              >
                <h3 className="font-semibold mb-2">Selections</h3>
                <p className="text-sm">Browse premium executors</p>
              </Link>
              <Link
                href="/resellers"
                className="p-4 bg-white/80 rounded-lg hover:bg-white transition-colors duration-200 text-gray-700 hover:text-blue-600"
              >
                <h3 className="font-semibold mb-2">Resellers</h3>
                <p className="text-sm">Find verified sellers</p>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
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
