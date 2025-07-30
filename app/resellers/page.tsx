"use client"

import { useState } from "react"
import Navbar from "../../navbar"
import LoadingScreen from "../../components/loading-screen"
import Footer from "../../components/footer"
import { Star, Shield, DollarSign, Clock } from "lucide-react"

export default function ResellersPage() {
  const [showLoading, setShowLoading] = useState(true)

  const handleLoadingComplete = () => {
    setShowLoading(false)
  }

  const resellers = [
    {
      id: 1,
      name: "Premium Scripts Hub",
      rating: 4.9,
      totalSales: "15,000+",
      responseTime: "< 1 hour",
      commission: "15%",
      specialties: ["Executors", "Premium Scripts", "Custom Tools"],
      description: "Top-rated reseller with premium quality products and excellent customer service.",
      verified: true,
      featured: true,
    },
    {
      id: 2,
      name: "Script Masters",
      rating: 4.8,
      totalSales: "12,500+",
      responseTime: "< 2 hours",
      commission: "12%",
      specialties: ["Game Scripts", "Automation", "Utilities"],
      description: "Specialized in game automation scripts with fast delivery and reliable support.",
      verified: true,
      featured: false,
    },
    {
      id: 3,
      name: "Elite Executors",
      rating: 4.7,
      totalSales: "8,900+",
      responseTime: "< 3 hours",
      commission: "10%",
      specialties: ["Executors", "Advanced Tools", "Security"],
      description: "Focus on high-end executors and security tools for professional users.",
      verified: true,
      featured: false,
    },
    {
      id: 4,
      name: "Quick Scripts",
      rating: 4.6,
      totalSales: "6,200+",
      responseTime: "< 4 hours",
      commission: "8%",
      specialties: ["Basic Scripts", "Beginner Tools", "Tutorials"],
      description: "Perfect for beginners with affordable prices and comprehensive tutorials.",
      verified: false,
      featured: false,
    },
    {
      id: 5,
      name: "Pro Tools Market",
      rating: 4.5,
      totalSales: "4,800+",
      responseTime: "< 6 hours",
      commission: "6%",
      specialties: ["Professional Tools", "Enterprise", "Bulk Orders"],
      description: "Catering to professional developers and enterprise customers.",
      verified: true,
      featured: false,
    },
    {
      id: 6,
      name: "Script Vault",
      rating: 4.4,
      totalSales: "3,100+",
      responseTime: "< 8 hours",
      commission: "5%",
      specialties: ["Archive Scripts", "Legacy Tools", "Rare Finds"],
      description: "Specializing in rare and legacy scripts that are hard to find elsewhere.",
      verified: false,
      featured: false,
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
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">View Resellers</h1>
            <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Compare prices and find the best resellers for your needs. All verified partners with quality guarantees.
            </p>
          </div>

          {/* Resellers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resellers.map((reseller, index) => (
              <div
                key={reseller.id}
                className={`bg-white/95 backdrop-blur-sm rounded-2xl border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden ${
                  reseller.featured ? "border-green-300 ring-2 ring-green-100" : "border-gray-200"
                }`}
                style={{
                  opacity: 0,
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`,
                }}
              >
                {/* Featured Badge */}
                {reseller.featured && (
                  <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-3 py-1 text-center">
                    ⭐ FEATURED RESELLER
                  </div>
                )}

                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                        {reseller.name}
                        {reseller.verified && <Shield className="w-5 h-5 text-blue-500" title="Verified Reseller" />}
                      </h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-semibold text-gray-700">{reseller.rating}</span>
                        <span className="text-xs text-gray-500">({reseller.totalSales} sales)</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">{reseller.commission}</div>
                      <div className="text-xs text-gray-500">Commission</div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{reseller.description}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <div>
                        <div className="text-xs text-gray-500">Response Time</div>
                        <div className="text-sm font-semibold text-gray-700">{reseller.responseTime}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <div>
                        <div className="text-xs text-gray-500">Total Sales</div>
                        <div className="text-sm font-semibold text-gray-700">{reseller.totalSales}</div>
                      </div>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 mb-2">Specialties</div>
                    <div className="flex flex-wrap gap-1">
                      {reseller.specialties.map((specialty, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden group text-sm">
                      <span className="relative z-10">View Products</span>
                      <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </button>
                    <button className="px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:scale-105 text-sm">
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Info */}
          <div className="mt-12 bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Want to become a reseller?</h3>
              <p className="text-gray-600 mb-4">
                Join our network of trusted resellers and start earning commissions on every sale.
              </p>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden group">
                <span className="relative z-10">Apply Now</span>
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>
            </div>
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
