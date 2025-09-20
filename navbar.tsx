"use client"

import { Menu, Flag, Sun, Moon, DollarSign } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import ReportModal from "./components/report-modal"
import GetStartedModal from "./components/get-started-modal"
import AffiliateModal from "./components/affiliate-modal"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showGetStartedModal, setShowGetStartedModal] = useState(false)
  const [isAffiliateModalOpen, setIsAffiliateModalOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle dark mode toggle
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark", !isDarkMode)
  }

  return (
    <>
      <nav
        className={`fixed top-1 sm:top-2 md:top-4 left-1/2 transform -translate-x-1/2 ${isOpen ? "z-[100]" : "z-[120]"} w-[96%] sm:w-[95%] max-w-7xl rounded-lg sm:rounded-xl md:rounded-2xl border shadow-2xl select-none transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-xl border-gray-200/50 dark:bg-gray-900/90 dark:border-gray-700/50"
            : "bg-white/95 backdrop-blur-lg border-gray-200 dark:bg-gray-900/95 dark:border-gray-700"
        }`}
      >
        <div className="px-2 sm:px-3 md:px-6">
          <div className="flex h-12 sm:h-14 md:h-16 lg:h-18 items-center justify-between gap-1 sm:gap-2 md:gap-4">
            {/* Left side with logo */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
              <Link href="/" className="flex items-center group">
                <div className="relative rounded-lg">
                  <Image
                    src="/images/key-empire-logo.png"
                    alt="Key-Empire"
                    width={160}
                    height={40}
                    className="h-6 sm:h-5 md:h-6 lg:h-8 w-auto select-none transform group-hover:scale-105 transition-all duration-300 drop-shadow-lg"
                    priority
                    draggable={false}
                  />
                </div>
              </Link>
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex md:items-center md:space-x-4 flex-shrink-0">
              {/* Dark Mode Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleDarkMode}
              >
                {isDarkMode ? <Sun className="h-4 w-4 text-yellow-500" /> : <Moon className="h-4 w-4" />}
              </Button>

              {/* Discord → goes to /discord */}
              <Link href="/discord">
                <Button variant="outline" size="sm">
                  <Image src="/images/discord-icon.svg" alt="Discord" width={16} height={16} />
                </Button>
              </Link>

              {/* Report Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowReportModal(true)}
              >
                <Flag className="h-4 w-4" />
              </Button>

              {/* Get Started → opens modal */}
              <Button
                size="sm"
                onClick={() => setShowGetStartedModal(true)}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white"
              >
                <DollarSign className="h-4 w-4" />
                Get Started
              </Button>

              {/* Referral → opens AffiliateModal */}
              <Button
                size="sm"
                onClick={() => setIsAffiliateModalOpen(true)}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
              >
                Referral
              </Button>
            </div>

            {/* Mobile Menu (unchanged except buttons trigger modals instead of links) */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-6">
                  <button onClick={toggleDarkMode} className="p-3 rounded-lg border">
                    {isDarkMode ? "Light Mode" : "Dark Mode"}
                  </button>

                  <Link href="/discord" onClick={() => setIsOpen(false)} className="p-3 border rounded-lg">
                    Join Discord
                  </Link>

                  <button
                    onClick={() => {
                      setShowReportModal(true)
                      setIsOpen(false)
                    }}
                    className="p-3 border rounded-lg"
                  >
                    Report Issue
                  </button>

                  <button
                    onClick={() => {
                      setShowGetStartedModal(true)
                      setIsOpen(false)
                    }}
                    className="p-3 bg-green-600 text-white rounded-lg"
                  >
                    Get Started
                  </button>

                  <button
                    onClick={() => {
                      setIsAffiliateModalOpen(true)
                      setIsOpen(false)
                    }}
                    className="p-3 bg-emerald-600 text-white rounded-lg"
                  >
                    Referral
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Modals */}
      <ReportModal isOpen={showReportModal} onClose={() => setShowReportModal(false)} />
      <GetStartedModal isOpen={showGetStartedModal} onClose={() => setShowGetStartedModal(false)} />
      <AffiliateModal isOpen={isAffiliateModalOpen} onClose={() => setIsAffiliateModalOpen(false)} />
    </>
  )
}
