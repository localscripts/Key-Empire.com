"use client"

import { useState } from "react"
import Navbar from "../navbar"
import LoadingScreen from "../components/loading-screen"
import { CreditCard, Smartphone, ChevronUp, ChevronDown, ArrowUpDown, Shield } from "lucide-react"
import Footer from "../components/footer"

export default function Page() {
  const [showLoading, setShowLoading] = useState(true)
  const [sortBy, setSortBy] = useState<"daily" | "weekly" | "monthly" | "threeMonths" | "sixMonths" | "yearly" | null>(
    null,
  )
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [verifiedSortBy, setVerifiedSortBy] = useState<
    "daily" | "weekly" | "monthly" | "threeMonths" | "sixMonths" | "yearly" | null
  >(null)
  const [verifiedSortOrder, setVerifiedSortOrder] = useState<"asc" | "desc">("asc")

  const handleLoadingComplete = () => {
    setShowLoading(false)
  }

  const resellers = [
    {
      name: "Budget Buys Dealer",
      avatar: "/images/cowboy-cat.png",
      daily: "$2.00",
      weekly: "$12.00",
      monthly: "$35.00",
      threeMonths: "$85.00",
      sixMonths: "$120.00",
      yearly: "$150.00",
      featured: true,
    },
    {
      name: "Local Deals Business",
      avatar: "/images/cowboy-cat.png",
      daily: "$2.50",
      weekly: "$15.00",
      monthly: "$40.00",
      threeMonths: "$95.00",
      sixMonths: "$130.00",
      yearly: "$145.00",
      featured: false,
    },
    {
      name: "Global Reseller Agency",
      avatar: "/images/cowboy-cat.png",
      daily: "$3.00",
      weekly: "$18.00",
      monthly: "$45.00",
      threeMonths: "$100.00",
      sixMonths: "$135.00",
      yearly: "$140.00",
      featured: false,
    },
    {
      name: "Quick Ship Factory",
      avatar: "/images/cowboy-cat.png",
      daily: "$3.50",
      weekly: "$20.00",
      monthly: "$50.00",
      threeMonths: "$110.00",
      sixMonths: "$140.00",
      yearly: "$135.00",
      featured: false,
    },
    {
      name: "Elite Partners Enterprise",
      avatar: "/images/cowboy-cat.png",
      daily: "$4.00",
      weekly: "$25.00",
      monthly: "$55.00",
      threeMonths: "$115.00",
      sixMonths: "$145.00",
      yearly: "$130.00",
      featured: false,
    },
  ]

  const verifiedResellers = [
    {
      name: "Premium Pro Authority",
      avatar: "/images/cowboy-cat.png",
      daily: "$5.00",
      weekly: "$30.00",
      monthly: "$75.00",
      threeMonths: "$120.00",
      sixMonths: "$140.00",
      yearly: "$150.00",
      featured: true,
    },
    {
      name: "Trusted Vendor Business",
      avatar: "/images/cowboy-cat.png",
      daily: "$5.50",
      weekly: "$35.00",
      monthly: "$85.00",
      threeMonths: "$125.00",
      sixMonths: "$145.00",
      yearly: "$135.00",
      featured: false,
    },
    {
      name: "Verified Elite Corporation",
      avatar: "/images/cowboy-cat.png",
      daily: "$6.00",
      weekly: "$40.00",
      monthly: "$95.00",
      threeMonths: "$130.00",
      sixMonths: "$150.00",
      yearly: "$125.00",
      featured: false,
    },
  ]

  const handleSort = (column: "daily" | "weekly" | "monthly" | "threeMonths" | "sixMonths" | "yearly") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  const handleVerifiedSort = (column: "daily" | "weekly" | "monthly" | "threeMonths" | "sixMonths" | "yearly") => {
    if (verifiedSortBy === column) {
      setVerifiedSortOrder(verifiedSortOrder === "asc" ? "desc" : "asc")
    } else {
      setVerifiedSortBy(column)
      setVerifiedSortOrder("asc")
    }
  }

  const sortedResellers = [...resellers].sort((a, b) => {
    if (!sortBy) return 0

    const aPrice = Number.parseFloat(a[sortBy].replace("$", ""))
    const bPrice = Number.parseFloat(b[sortBy].replace("$", ""))

    if (sortOrder === "asc") {
      return aPrice - bPrice
    } else {
      return bPrice - aPrice
    }
  })

  const sortedVerifiedResellers = [...verifiedResellers].sort((a, b) => {
    if (!verifiedSortBy) return 0

    const aPrice = Number.parseFloat(a[verifiedSortBy].replace("$", ""))
    const bPrice = Number.parseFloat(b[verifiedSortBy].replace("$", ""))

    if (verifiedSortOrder === "asc") {
      return aPrice - bPrice
    } else {
      return bPrice - aPrice
    }
  })

  const getSortIcon = (
    column: "daily" | "weekly" | "monthly" | "threeMonths" | "sixMonths" | "yearly",
    currentSort: string | null,
    currentOrder: string,
  ) => {
    if (currentSort !== column) {
      return <ArrowUpDown className="w-4 h-4 ml-1 inline text-gray-400" />
    }
    return currentOrder === "asc" ? (
      <ChevronUp className="w-4 h-4 ml-1 inline text-green-600" />
    ) : (
      <ChevronDown className="w-4 h-4 ml-1 inline text-green-600" />
    )
  }

  const getVerifiedSortIcon = (
    column: "daily" | "weekly" | "monthly" | "threeMonths" | "sixMonths" | "yearly",
    currentSort: string | null,
    currentOrder: string,
  ) => {
    if (currentSort !== column) {
      return <ArrowUpDown className="w-4 h-4 ml-1 inline text-gray-400" />
    }
    return currentOrder === "asc" ? (
      <ChevronUp className="w-4 h-4 ml-1 inline text-blue-600" />
    ) : (
      <ChevronDown className="w-4 h-4 ml-1 inline text-blue-600" />
    )
  }

  return (
    <div>
      {showLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}
      <Navbar />
      <main className="px-4 py-8 mt-20">
        <div className="w-[95%] max-w-7xl mx-auto space-y-8">
          {/* Main Content Card */}
          <div className="bg-white rounded-2xl border border-black/30 overflow-hidden">
            <div className="flex flex-col md:flex-row min-h-[400px]">
              {/* Left side - Image */}
              <div className="w-full md:w-1/2 bg-gray-50 border-r border-gray-200 flex items-center justify-center p-8">
                <div className="w-full max-w-sm aspect-square bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-400 mb-2">IMG</div>
                    <div className="text-sm text-gray-500">Image Placeholder</div>
                  </div>
                </div>
              </div>

              {/* Right side - Content */}
              <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Welcome to Key-Empire</h2>
                <p className="text-gray-600 text-center">Your premium executor marketplace</p>
              </div>
            </div>
          </div>

          {/* Verified Resellers Table - Now at the top */}
          <div className="bg-white rounded-2xl border border-black/30 shadow-lg overflow-hidden">
            {/* Blue Header Section */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 p-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <h3 className="text-2xl font-bold text-blue-900">Verified Resellers</h3>
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-blue-700">Premium verified sellers with guaranteed quality and support.</p>
              </div>
            </div>

            <div className="p-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-6 text-gray-900 font-medium w-64">Reseller</th>
                      <th className="text-center py-4 px-6 text-gray-900 font-medium w-32">Payment Methods</th>
                      <th
                        className={`text-center py-4 px-4 font-medium cursor-pointer hover:bg-gray-50 transition-colors rounded-lg border-2 border-transparent w-24 ${
                          verifiedSortBy === "daily" ? "bg-blue-50 border-blue-200 text-blue-700" : "text-gray-900"
                        }`}
                        onClick={() => handleVerifiedSort("daily")}
                      >
                        <div className="flex items-center justify-center">
                          Daily
                          {getVerifiedSortIcon("daily", verifiedSortBy, verifiedSortOrder)}
                        </div>
                      </th>
                      <th
                        className={`text-center py-4 px-4 font-medium cursor-pointer hover:bg-gray-50 transition-colors rounded-lg border-2 border-transparent w-24 ${
                          verifiedSortBy === "weekly" ? "bg-blue-50 border-blue-200 text-blue-700" : "text-gray-900"
                        }`}
                        onClick={() => handleVerifiedSort("weekly")}
                      >
                        <div className="flex items-center justify-center">
                          Weekly
                          {getVerifiedSortIcon("weekly", verifiedSortBy, verifiedSortOrder)}
                        </div>
                      </th>
                      <th
                        className={`text-center py-4 px-4 font-medium cursor-pointer hover:bg-gray-50 transition-colors rounded-lg border-2 border-transparent w-24 ${
                          verifiedSortBy === "monthly" ? "bg-blue-50 border-blue-200 text-blue-700" : "text-gray-900"
                        }`}
                        onClick={() => handleVerifiedSort("monthly")}
                      >
                        <div className="flex items-center justify-center">
                          Monthly
                          {getVerifiedSortIcon("monthly", verifiedSortBy, verifiedSortOrder)}
                        </div>
                      </th>
                      <th
                        className={`text-center py-4 px-4 font-medium cursor-pointer hover:bg-gray-50 transition-colors rounded-lg border-2 border-transparent w-24 ${
                          verifiedSortBy === "threeMonths"
                            ? "bg-blue-50 border-blue-200 text-blue-700"
                            : "text-gray-900"
                        }`}
                        onClick={() => handleVerifiedSort("threeMonths")}
                      >
                        <div className="flex items-center justify-center">
                          3 Months
                          {getVerifiedSortIcon("threeMonths", verifiedSortBy, verifiedSortOrder)}
                        </div>
                      </th>
                      <th
                        className={`text-center py-4 px-4 font-medium cursor-pointer hover:bg-gray-50 transition-colors rounded-lg border-2 border-transparent w-24 ${
                          verifiedSortBy === "sixMonths" ? "bg-blue-50 border-blue-200 text-blue-700" : "text-gray-900"
                        }`}
                        onClick={() => handleVerifiedSort("sixMonths")}
                      >
                        <div className="flex items-center justify-center">
                          6 Months
                          {getVerifiedSortIcon("sixMonths", verifiedSortBy, verifiedSortOrder)}
                        </div>
                      </th>
                      <th
                        className={`text-center py-4 px-4 font-medium cursor-pointer hover:bg-gray-50 transition-colors rounded-lg border-2 border-transparent w-24 ${
                          verifiedSortBy === "yearly" ? "bg-blue-50 border-blue-200 text-blue-700" : "text-gray-900"
                        }`}
                        onClick={() => handleVerifiedSort("yearly")}
                      >
                        <div className="flex items-center justify-center">
                          Yearly
                          {getVerifiedSortIcon("yearly", verifiedSortBy, verifiedSortOrder)}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedVerifiedResellers.map((reseller, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-6 px-6">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <img
                                src={reseller.avatar || "/placeholder.svg"}
                                alt={reseller.name}
                                className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
                              />
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                <Shield className="w-2.5 h-2.5 text-white" />
                              </div>
                            </div>
                            <span className="text-gray-900 font-medium text-sm min-w-0 flex-1">{reseller.name}</span>
                          </div>
                        </td>
                        <td className="py-6 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <CreditCard className="w-4 h-4 text-gray-600" />
                            <Smartphone className="w-4 h-4 text-gray-600" />
                          </div>
                        </td>
                        <td className="py-6 px-4 text-center">
                          <button
                            className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 transform relative overflow-hidden group border-0 ${
                              reseller.featured && index === 0
                                ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
                                : "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg"
                            }`}
                            onClick={() => {
                              console.log(`Selected ${reseller.name} - Daily plan for ${reseller.daily}`)
                            }}
                          >
                            <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                            <span className="relative z-10">{reseller.daily}</span>
                            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                          </button>
                        </td>
                        <td className="py-6 px-4 text-center">
                          <button
                            className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 transform relative overflow-hidden group border-0 ${
                              reseller.featured && index === 0
                                ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
                                : "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg"
                            }`}
                            onClick={() => {
                              console.log(`Selected ${reseller.name} - Weekly plan for ${reseller.weekly}`)
                            }}
                          >
                            <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                            <span className="relative z-10">{reseller.weekly}</span>
                            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                          </button>
                        </td>
                        <td className="py-6 px-4 text-center">
                          <button
                            className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 transform relative overflow-hidden group border-0 ${
                              reseller.featured && index === 0
                                ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
                                : "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg"
                            }`}
                            onClick={() => {
                              console.log(`Selected ${reseller.name} - Monthly plan for ${reseller.monthly}`)
                            }}
                          >
                            <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                            <span className="relative z-10">{reseller.monthly}</span>
                            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                          </button>
                        </td>
                        <td className="py-6 px-4 text-center">
                          <button
                            className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 transform relative overflow-hidden group border-0 ${
                              reseller.featured && index === 0
                                ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
                                : "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg"
                            }`}
                            onClick={() => {
                              console.log(`Selected ${reseller.name} - 3 Months plan for ${reseller.threeMonths}`)
                            }}
                          >
                            <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                            <span className="relative z-10">{reseller.threeMonths}</span>
                            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                          </button>
                        </td>
                        <td className="py-6 px-4 text-center">
                          <button
                            className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 transform relative overflow-hidden group border-0 ${
                              reseller.featured && index === 0
                                ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
                                : "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg"
                            }`}
                            onClick={() => {
                              console.log(`Selected ${reseller.name} - 6 Months plan for ${reseller.sixMonths}`)
                            }}
                          >
                            <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                            <span className="relative z-10">{reseller.sixMonths}</span>
                            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                          </button>
                        </td>
                        <td className="py-6 px-4 text-center">
                          <button
                            className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 transform relative overflow-hidden group border-0 ${
                              reseller.featured && index === 0
                                ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
                                : "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg"
                            }`}
                            onClick={() => {
                              console.log(`Selected ${reseller.name} - Yearly plan for ${reseller.yearly}`)
                            }}
                          >
                            <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                            <span className="relative z-10">{reseller.yearly}</span>
                            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Standard Resellers Table */}
          <div className="bg-white rounded-2xl border border-black/30 shadow-lg overflow-hidden">
            {/* Green Header Section */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200 p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-green-900 mb-2">Standard Resellers</h3>
                <p className="text-green-700">Reliable options for everyday needs and great value.</p>
              </div>
            </div>

            <div className="p-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-6 text-gray-900 font-medium w-64">Reseller</th>
                      <th className="text-center py-4 px-6 text-gray-900 font-medium w-32">Payment Methods</th>
                      <th
                        className={`text-center py-4 px-4 font-medium cursor-pointer hover:bg-gray-50 transition-colors rounded-lg border-2 border-transparent w-24 ${
                          sortBy === "daily" ? "bg-green-50 border-green-200 text-green-700" : "text-gray-900"
                        }`}
                        onClick={() => handleSort("daily")}
                      >
                        <div className="flex items-center justify-center">
                          Daily
                          {getSortIcon("daily", sortBy, sortOrder)}
                        </div>
                      </th>
                      <th
                        className={`text-center py-4 px-4 font-medium cursor-pointer hover:bg-gray-50 transition-colors rounded-lg border-2 border-transparent w-24 ${
                          sortBy === "weekly" ? "bg-green-50 border-green-200 text-green-700" : "text-gray-900"
                        }`}
                        onClick={() => handleSort("weekly")}
                      >
                        <div className="flex items-center justify-center">
                          Weekly
                          {getSortIcon("weekly", sortBy, sortOrder)}
                        </div>
                      </th>
                      <th
                        className={`text-center py-4 px-4 font-medium cursor-pointer hover:bg-gray-50 transition-colors rounded-lg border-2 border-transparent w-24 ${
                          sortBy === "monthly" ? "bg-green-50 border-green-200 text-green-700" : "text-gray-900"
                        }`}
                        onClick={() => handleSort("monthly")}
                      >
                        <div className="flex items-center justify-center">
                          Monthly
                          {getSortIcon("monthly", sortBy, sortOrder)}
                        </div>
                      </th>
                      <th
                        className={`text-center py-4 px-4 font-medium cursor-pointer hover:bg-gray-50 transition-colors rounded-lg border-2 border-transparent w-24 ${
                          sortBy === "threeMonths" ? "bg-green-50 border-green-200 text-green-700" : "text-gray-900"
                        }`}
                        onClick={() => handleSort("threeMonths")}
                      >
                        <div className="flex items-center justify-center">
                          3 Months
                          {getSortIcon("threeMonths", sortBy, sortOrder)}
                        </div>
                      </th>
                      <th
                        className={`text-center py-4 px-4 font-medium cursor-pointer hover:bg-gray-50 transition-colors rounded-lg border-2 border-transparent w-24 ${
                          sortBy === "sixMonths" ? "bg-green-50 border-green-200 text-green-700" : "text-gray-900"
                        }`}
                        onClick={() => handleSort("sixMonths")}
                      >
                        <div className="flex items-center justify-center">
                          6 Months
                          {getSortIcon("sixMonths", sortBy, sortOrder)}
                        </div>
                      </th>
                      <th
                        className={`text-center py-4 px-4 font-medium cursor-pointer hover:bg-gray-50 transition-colors rounded-lg border-2 border-transparent w-24 ${
                          sortBy === "yearly" ? "bg-green-50 border-green-200 text-green-700" : "text-gray-900"
                        }`}
                        onClick={() => handleSort("yearly")}
                      >
                        <div className="flex items-center justify-center">
                          Yearly
                          {getSortIcon("yearly", sortBy, sortOrder)}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedResellers.map((reseller, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-6 px-6">
                          <div className="flex items-center gap-4">
                            <img
                              src={reseller.avatar || "/placeholder.svg"}
                              alt={reseller.name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                            />
                            <span className="text-gray-900 font-medium text-sm min-w-0 flex-1">{reseller.name}</span>
                          </div>
                        </td>
                        <td className="py-6 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <CreditCard className="w-4 h-4 text-gray-600" />
                            <Smartphone className="w-4 h-4 text-gray-600" />
                          </div>
                        </td>
                        <td className="py-6 px-4 text-center">
                          <button
                            className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 transform relative overflow-hidden group border-0 ${
                              reseller.featured && index === 0
                                ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
                                : "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg"
                            }`}
                            onClick={() => {
                              console.log(`Selected ${reseller.name} - Daily plan for ${reseller.daily}`)
                            }}
                          >
                            <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                            <span className="relative z-10">{reseller.daily}</span>
                            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                          </button>
                        </td>
                        <td className="py-6 px-4 text-center">
                          <button
                            className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 transform relative overflow-hidden group border-0 ${
                              reseller.featured && index === 0
                                ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
                                : "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg"
                            }`}
                            onClick={() => {
                              console.log(`Selected ${reseller.name} - Weekly plan for ${reseller.weekly}`)
                            }}
                          >
                            <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                            <span className="relative z-10">{reseller.weekly}</span>
                            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                          </button>
                        </td>
                        <td className="py-6 px-4 text-center">
                          <button
                            className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 transform relative overflow-hidden group border-0 ${
                              reseller.featured && index === 0
                                ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
                                : "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg"
                            }`}
                            onClick={() => {
                              console.log(`Selected ${reseller.name} - Monthly plan for ${reseller.monthly}`)
                            }}
                          >
                            <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                            <span className="relative z-10">{reseller.monthly}</span>
                            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                          </button>
                        </td>
                        <td className="py-6 px-4 text-center">
                          <button
                            className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 transform relative overflow-hidden group border-0 ${
                              reseller.featured && index === 0
                                ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
                                : "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg"
                            }`}
                            onClick={() => {
                              console.log(`Selected ${reseller.name} - 3 Months plan for ${reseller.threeMonths}`)
                            }}
                          >
                            <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                            <span className="relative z-10">{reseller.threeMonths}</span>
                            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                          </button>
                        </td>
                        <td className="py-6 px-4 text-center">
                          <button
                            className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 transform relative overflow-hidden group border-0 ${
                              reseller.featured && index === 0
                                ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
                                : "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg"
                            }`}
                            onClick={() => {
                              console.log(`Selected ${reseller.name} - 6 Months plan for ${reseller.sixMonths}`)
                            }}
                          >
                            <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                            <span className="relative z-10">{reseller.sixMonths}</span>
                            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                          </button>
                        </td>
                        <td className="py-6 px-4 text-center">
                          <button
                            className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 transform relative overflow-hidden group border-0 ${
                              reseller.featured && index === 0
                                ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
                                : "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg"
                            }`}
                            onClick={() => {
                              console.log(`Selected ${reseller.name} - Yearly plan for ${reseller.yearly}`)
                            }}
                          >
                            <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                            <span className="relative z-10">{reseller.yearly}</span>
                            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
