"use client"

import { Heart, Shield, Zap, Star, Mail, MessageCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    products: [
      { name: "Executors", href: "/executors" },
      { name: "Scripts", href: "/scripts" },
      { name: "Premium Tools", href: "/premium" },
      { name: "Selections", href: "/selections" },
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Contact Us", href: "/contact" },
      { name: "Discord Support", href: "/discord" },
      { name: "Report Issue", href: "#", onClick: true },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Refund Policy", href: "/refunds" },
    ],
    community: [
      { name: "Discord Server", href: "/discord" },
      { name: "Community Guidelines", href: "/guidelines" },
      { name: "Developer API", href: "/api" },
      { name: "Status Page", href: "/status" },
    ],
  }

  const features = [
    { icon: Shield, text: "Secure Transactions" },
    { icon: Zap, text: "Instant Delivery" },
    { icon: Star, text: "Premium Quality" },
    { icon: MessageCircle, text: "24/7 Support" },
  ]

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200 mt-16 animate-fadeInUp">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 animate-slideInLeft">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/images/key-empire-logo.png"
                alt="Key-Empire"
                width={160}
                height={40}
                className="h-8 w-auto select-none"
                draggable={false}
              />
            </div>
            <p className="text-gray-600 text-sm mb-6 max-w-sm">
              Your trusted marketplace for premium executors, scripts, and tools. Join thousands of satisfied customers
              worldwide.
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3">
              {features.map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <div key={index} className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4 text-green-600" />
                    <span className="text-xs text-gray-600">{feature.text}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Products */}
          <div className="animate-popInDelay1">
            <h3 className="font-semibold text-gray-900 mb-4">Products</h3>
            <ul className="space-y-3">
              {footerLinks.products.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-green-600 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="animate-popInDelay2">
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  {link.onClick ? (
                    <button
                      onClick={() => {
                        // This would trigger the report modal
                        const reportButton = document.querySelector("[data-report-trigger]") as HTMLButtonElement
                        if (reportButton) reportButton.click()
                      }}
                      className="text-sm text-gray-600 hover:text-green-600 transition-colors duration-200 text-left"
                    >
                      {link.name}
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-green-600 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="animate-popInDelay3">
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-green-600 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div className="animate-popInDelay4">
            <h3 className="font-semibold text-gray-900 mb-4">Community</h3>
            <ul className="space-y-3">
              {footerLinks.community.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-green-600 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 animate-popInUp">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h3 className="font-semibold text-gray-900 mb-1">Stay Updated</h3>
              <p className="text-sm text-gray-600">Get notified about new products and exclusive offers</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                />
              </div>
              <button className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-200 animate-fadeInUp">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 md:mb-0">
            <span>© {currentYear} Key-Empire. Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>for the community</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">All systems operational</span>
            </div>
            <Link
              href="/discord"
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors duration-200 group"
            >
              <Image
                src="/images/discord-icon.svg"
                alt="Discord"
                width={16}
                height={16}
                className="h-4 w-4 group-hover:scale-110 transition-transform duration-200"
                draggable={false}
              />
              <span className="text-sm text-blue-700 font-medium">Join Discord</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
