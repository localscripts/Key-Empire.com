"use client"

import { useState } from "react"
import Navbar from "../navbar"
import LoadingScreen from "../components/loading-screen"
import Footer from "../components/footer"

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

      <main className="px-4 py-8 mt-32 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1
            className="text-4xl md:text-6xl font-bold text-green-500 mb-4"
            style={{
              opacity: 0,
              transform: "translateY(30px) scale(0.9)",
              animation: "popUpSlide 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s forwards",
            }}
          >
            Page Not Found
          </h1>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        @keyframes popUpBounce {
          0% {
            opacity: 0;
            transform: translateY(50px) scale(0.9);
          }
          60% {
            opacity: 1;
            transform: translateY(-10px) scale(1.02);
          }
          80% {
            transform: translateY(5px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes popUpSlide {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes popUpScale {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.8);
          }
          60% {
            transform: translateY(-5px) scale(1.02);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes popUpFlip {
          0% {
            opacity: 0;
            transform: scale(0.5) rotateY(180deg);
          }
          60% {
            opacity: 1;
            transform: scale(1.1) rotateY(-20deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotateY(0deg);
          }
        }
      `}</style>
    </div>
  )
}
