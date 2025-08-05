"use client"

import { useState, useEffect } from "react"
import Navbar from "../navbar"
import LoadingScreen from "../components/loading-screen"
import Footer from "../components/footer"
import HeroSection from "../components/hero-section"
import QuickAccessSection from "../components/quick-access-section"
import AffiliateProgramSection from "../components/affiliate-program-section"
import FeaturesSection from "../components/features-section"
import ScrollIndicator from "../components/scroll-indicator"
import AnimatedBackground from "../components/animated-background"
import GetStartedModal from "../components/get-started-modal" // Import GetStartedModal

export default function HomePage() {
  const [showLoading, setShowLoading] = useState(true)
  const [showScrollIndicator, setShowScrollIndicator] = useState(true)
  const [showGetStartedModal, setShowGetStartedModal] = useState(false) // Add state for modal

  const handleLoadingComplete = () => {
    setShowLoading(false)
  }

  const handleGetStartedClick = () => {
    // Handler for Get Started button
    setShowGetStartedModal(true)
  }

  useEffect(() => {
    if (showLoading) return // Don't set up scroll listener while loading

    let ticking = false
    let hasScrolled = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollPosition = window.scrollY
          const shouldShow = scrollPosition < 100

          // Only update if this is the first scroll or if visibility should change
          if (!hasScrolled || shouldShow !== showScrollIndicator) {
            setShowScrollIndicator(shouldShow)
            if (scrollPosition > 0) {
              hasScrolled = true
            }
          }

          ticking = false
        })
        ticking = true
      }
    }

    // Set initial state after loading completes
    if (!showLoading && !hasScrolled) {
      setShowScrollIndicator(true)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [showLoading])

  return (
    <div
      className="select-none min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      style={{
        backgroundImage: "url('/images/pattern-background.png')",
        backgroundRepeat: "repeat",
        backgroundSize: "400px 400px",
        backgroundPosition: "0 0",
        backgroundBlendMode: "overlay",
      }}
    >
      {/* Animated Background Bubbles */}
      <AnimatedBackground />

      {showLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}
      <Navbar />

      <main className="px-4 py-8 mt-32 relative z-10">
        <div className="w-[95%] max-w-7xl mx-auto">
          <HeroSection onButtonClick={handleGetStartedClick} /> {/* Pass handler to HeroSection */}
          <QuickAccessSection onOpenGetStartedModal={handleGetStartedClick} />
          <AffiliateProgramSection />
          <FeaturesSection />
        </div>
      </main>

      <ScrollIndicator show={showScrollIndicator && !showLoading} />
      <Footer />

      {/* Get Started Modal */}
      <GetStartedModal isOpen={showGetStartedModal} onClose={() => setShowGetStartedModal(false)} />
    </div>
  )
}
