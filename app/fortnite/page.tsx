"use client"

import { useState, useRef, useEffect } from "react"
import Navbar from "../../navbar"
import LoadingScreen from "../../components/loading-screen"
import Footer from "../../components/footer"
import AnimatedBackground from "../../components/animated-background"
import SelectionsHeroSection from "../../components/selections-hero-section"
import QuickSelectionsGrid from "../../components/quick-selections-grid"
import ProductsGrid from "../../components/products-grid-2"
import GetStartedModal from "../../components/get-started-modal"
import Image from "next/image"

// Simplified initial selections to display "Soon"
const initialSelections = [
{
  id: 1,
  title: "Coming Soon",
  image: "/placeholder.svg?height=200&width=200",
  redirectUrl: "#",
  price: "Soon",
  resellers: "Soon",
  shadeColor: "gray",
  popular: false,
},
]

export default function SelectionsPage() {
const [showLoading, setShowLoading] = useState(true)
const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
const [showGetStartedModal, setShowGetStartedModal] = useState(false) // Add state for GetStartedModal

const handleLoadingComplete = () => {
  setShowLoading(false)
}

const handleGetStartedClick = () => {
  // Handler for Get Started button
  setShowGetStartedModal(true)
}

// Quick Links for QuickSelectionsGrid
const quickLinks = [
  {
    title: "Discord",
    description: "Browse our top selections",
    href: "/discord",
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Get Started",
    description: "View all products",
    href: "/",
    color: "from-green-500 to-green-600",
  },
  {
    title: "Referrals",
    description: "Find your perfect tool",
    href: "/discord",
    color: "from-purple-500 to-purple-600",
  },
]


// Handle product selection - now a no-op as products are "Soon"
const handleProductSelect = (productTitle: string) => {
  // Products are "Coming Soon", so no action on select
  console.log(`Product "${productTitle}" is coming soon!`)
  setSelectedProduct(null); // Ensure no product is "selected" for a non-existent detail view
}

// Silent GET request on site load (kept as it's a general site interaction)
useEffect(() => {
  const silentFetch = async () => {
    try {
      await fetch("https://api.voxlis.net/resellers", { method: "GET" })
      // Do nothing with the response
    } catch (e) {
      console.error("Silent fetch failed:", e)
    }
  }
  silentFetch()
}, [])

// `displayedSelections` now directly uses `initialSelections` as there's no dynamic data
const displayedSelections = initialSelections

return (
  <div
    className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
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
    <main className="px-4 py-8 mt-40 relative z-10 md:mt-32">
      <div className="w-[95%] max-w-7xl mx-auto">
        {/* Hero Section */}
        <SelectionsHeroSection />
        {/* Quick Selections Section */}
        <div className="mb-16">
          <div className="max-w-6xl mx-auto px-4">
            <QuickSelectionsGrid quickLinks={quickLinks} onOpenGetStartedModal={handleGetStartedClick} />{" "}
            {/* Pass the prop here */}
          </div>
        </div>
        {/* Products Grid */}
        <ProductsGrid
          selections={displayedSelections} // Use the dynamically updated selections
          onProductSelect={handleProductSelect}
          selectedProduct={selectedProduct}
        />
        {/* The Verified Resellers Section is removed as per the request */}
      </div>
    </main>
    <Footer />
    {/* Cryptic Modal is removed as per the request */}
    {/* Get Started Modal */}
    <GetStartedModal isOpen={showGetStartedModal} onClose={() => setShowGetStartedModal(false)} />
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
      @keyframes popUpBounce {
        from {
          opacity: 0;
          transform: translateY(40px) scale(0.9);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      @keyframes popUp3D {
        from {
          opacity: 0;
          transform: translateY(60px) scale(0.8) rotateX(15deg);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1) rotateX(0deg);
        }
      }
      @keyframes float-slow {
        0%,
        100% {
          transform: translateY(0px) translateX(0px);
        }
        25% {
          transform: translateY(-20px) translateX(10px);
        }
        50% {
          transform: translateY(-10px) translateX(-15px);
        }
        75% {
          transform: translateY(-25px) translateX(5px);
        }
      }
      @keyframes float-medium {
        0%,
        100% {
          transform: translateY(0px) translateX(0px);
        }
        33% {
          transform: translateY(-15px) translateX(-10px);
        }
        66% {
          transform: translateY(-25px) translateX(15px);
        }
      }
      @keyframes float-fast {
        0%,
        100% {
          transform: translateY(0px) translateX(0px);
        }
        50% {
          transform: translateY(-30px) translateX(-20px);
        }
      }
      @keyframes pulse-slow {
        0%,
        100% {
          opacity: 0.4;
          transform: scale(1);
        }
        50% {
          opacity: 0.8;
          transform: scale(1.2);
        }
      }
      @keyframes pulse-medium {
        0%,
        100% {
          opacity: 0.3;
          transform: scale(1);
        }
        50% {
          opacity: 0.7;
          transform: scale(1.3);
        }
      }
      @keyframes pulse-fast {
        0%,
        100% {
          opacity: 0.5;
          transform: scale(1);
        }
        50% {
          opacity: 0.9;
          transform: scale(1.4);
        }
      }
      @keyframes spin-slow {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
      @keyframes spin-reverse {
        from {
          transform: rotate(360deg);
        }
        to {
          transform: rotate(0deg);
        }
      }
      .animate-float-slow {
        animation: float-slow 8s ease-in-out infinite;
      }
      .animate-float-medium {
        animation: float-medium 6s ease-in-out infinite;
      }
      .animate-float-fast {
        animation: float-fast 4s ease-in-out infinite;
      }
      .animate-pulse-slow {
        animation: pulse-slow 4s ease-in-out infinite;
      }
      .animate-pulse-medium {
        animation: pulse-medium 3s ease-in-out infinite;
      }
      .animate-pulse-fast {
        animation: pulse-fast 2s ease-in-out infinite;
      }
      .animate-spin-slow {
        animation: spin-slow 20s linear infinite;
      }
      .animate-spin-reverse {
        animation: spin-reverse 15s linear infinite;
      }
    `}</style>
  </div>
)
}
