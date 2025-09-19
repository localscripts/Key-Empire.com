"use client"

import Navbar from "../../navbar"
import AnimatedBackground from "../../components/animated-background"
import { DollarSign, Users, TrendingUp, Clock, Shield, Headphones } from "lucide-react"
import Link from "next/link"

export default function AffiliateInfoPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AnimatedBackground />
      <Navbar />

      <main className="px-4 py-8 mt-40 relative z-10 md:mt-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <DollarSign className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Affiliate Program Details
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Learn everything about our affiliate program and start earning today
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">15% Commission</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Earn 15% on every sale made through your affiliate links. No caps, no limits.
              </p>
            </div>

            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Weekly Payouts</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get paid every week via your preferred payment method. Fast and reliable.
              </p>
            </div>

            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Easy Sharing</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get your custom affiliate link and start sharing with your audience immediately.
              </p>
            </div>

            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Real-time Tracking</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Monitor your clicks, conversions, and earnings with our detailed analytics dashboard.
              </p>
            </div>

            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Trusted Platform</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Join thousands of affiliates who trust Key-Empire for reliable commissions.
              </p>
            </div>

            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center mb-4">
                <Headphones className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">24/7 Support</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get help whenever you need it with our dedicated affiliate support team.
              </p>
            </div>
          </div>

          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-gray-700 p-8 mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Sign Up</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Create your unique affiliate code and get your custom link
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Share</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Share your affiliate link with your audience through any channel
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Convert</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  When visitors purchase through your link, you earn commission
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">4</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Get Paid</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive your 15% commission every week automatically
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/affiliate-signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <DollarSign className="w-5 h-5" />
              Start Earning Today
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
