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
  const [isDarkMode, setIsDarkMode] = useState(true) // default dark

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode((v) => !v)
    document.documentElement.classList.toggle("dark", isDarkMode) // use previous value
  }

  return (
    <>
      <nav
        className={`fixed top-1 sm:top-2 md:top-4 left-1/2 -translate-x-1/2 ${isOpen ? "z-[100]" : "z-[120]"} w-[96%] sm:w-[95%] max-w-7xl rounded-lg sm:rounded-xl md:rounded-2xl border shadow-2xl select-none transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-xl border-gray-200/50 dark:bg-gray-900/90 dark:border-gray-700/50"
            : "bg-white/95 backdrop-blur-lg border-gray-200 dark:bg-gray-900/95 dark:border-gray-700"
        }`}
        style={{
          opacity: 0,
          animation: "fadeIn 0.8s ease-out 0.5s forwards",
          boxShadow: isScrolled
            ? "0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1)"
            : "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
        }}
      >
        <div className="px-2 sm:px-3 md:px-6">
          <div className="flex h-12 sm:h-14 md:h-16 lg:h-18 items-center justify-between gap-1 sm:gap-2 md:gap-4">
            {/* Logo */}
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
                    style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))" }}
                  />
                </div>
              </Link>
            </div>

            {/* Desktop CTAs */}
            <div className="hidden md:flex md:items-center md:space-x-4 flex-shrink-0">
              {/* Dark Mode */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleDarkMode}
                className={`select-none relative overflow-hidden group transform hover:scale-105 transition-all duration-300 hover:shadow-lg border-2 ${
                  isScrolled
                    ? "bg-white/80 backdrop-blur-sm border-gray-300/60 hover:bg-gray-50 hover:border-gray-400 dark:bg-gray-800/80 dark:border-gray-600/60 dark:hover:bg-gray-700 dark:hover:border-gray-500"
                    : "bg-white/90 border-gray-300 hover:bg-gray-50 hover:border-gray-400 dark:bg-gray-800/90 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-500"
                }`}
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4 select-none relative z-10 text-yellow-500" />
                ) : (
                  <Moon className="h-4 w-4 select-none relative z-10" />
                )}
              </Button>

              {/* Discord → /discord (kept as Link) */}
              <Link href="/discord">
                <Button
                  variant="outline"
                  size="sm"
                  className={`select-none relative overflow-hidden group transform hover:scale-105 transition-all duration-300 hover:shadow-lg border-2 ${
                    isScrolled
                      ? "bg-white/80 backdrop-blur-sm border-gray-300/60 hover:bg-blue-50 hover:border-blue-300 dark:bg-gray-800/80 dark:border-gray-600/60 dark:hover:bg-blue-900/20 dark:hover:border-blue-400"
                      : "bg-white/90 border-gray-300 hover:bg-blue-50 hover:border-blue-300 dark:bg-gray-800/90 dark:border-gray-600 dark:hover:bg-blue-900/20 dark:hover:border-blue-400"
                  }`}
                >
                  <Image
                    src="/images/discord-icon.svg"
                    alt="Discord"
                    width={16}
                    height={16}
                    className="h-4 w-4 select-none relative z-10"
                    draggable={false}
                  />
                </Button>
              </Link>

              {/* Report */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowReportModal(true)}
                className={`select-none relative overflow-hidden group transform hover:scale-105 transition-all duration-300 hover:shadow-lg border-2 text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 ${
                  isScrolled
                    ? "bg-white/80 backdrop-blur-sm border-gray-300/60 hover:bg-red-50 hover:border-red-300 dark:bg-gray-800/80 dark:border-gray-600/60 dark:hover:bg-red-900/20 dark:hover:border-red-400"
                    : "bg-white/90 border-gray-300 hover:bg-red-50 hover:border-red-300 dark:bg-gray-800/90 dark:border-gray-600 dark:hover:bg-red-900/20 dark:hover:border-red-400"
                }`}
              >
                <Flag className="h-4 w-4 select-none relative z-10" />
              </Button>

              {/* Get Started → OPEN MODAL (no Link) */}
              <Button
                size="sm"
                onClick={() => setShowGetStartedModal(true)}
                className="select-none relative overflow-hidden group transform hover:scale-105 transition-all duration-300 hover:shadow-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold border-0 shadow-lg"
              >
                <span className="relative z-10 select-none flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Get Started
                </span>
              </Button>

              {/* Referral → OPEN AffiliateModal (no Link) */}
              <Button
                size="sm"
                onClick={() => setIsAffiliateModalOpen(true)}
                className="select-none relative overflow-hidden group transform hover:scale-105 transition-all duration-300 hover:shadow-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold border-0 shadow-lg"
              >
                Referral
              </Button>
            </div>

            {/* Mobile */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`md:hidden text-gray-800 hover:text-green-600 dark:text-gray-200 dark:hover:text-green-400 select-none h-7 w-7 sm:h-8 sm:w-8 ${
                    isScrolled ? "bg-white/60 backdrop-blur-sm dark:bg-gray-900/60" : "bg-transparent"
                  }`}
                >
                  <Menu className="h-4 w-4 sm:h-5 sm:w-5 select-none" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[280px] sm:w-[300px] md:w-[400px] select-none bg-white/95 backdrop-blur-xl border-l border-gray-200 dark:bg-gray-900/95 dark:border-gray-700 shadow-2xl z-[150]"
              >
                <div className="flex flex-col space-y-4 sm:space-y-6 mt-6 sm:mt-8">
                  {/* Dark mode */}
                  <button
                    onClick={() => {
                      toggleDarkMode()
                    }}
                    className="flex items-center gap-3 p-3 sm:p-4 rounded-xl border-2 border-gray-300 text-gray-800 transition-colors hover:bg-gray-50 hover:border-gray-400 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:border-gray-500 select-none"
                  >
                    {isDarkMode ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5" />}
                    <span className="font-medium">{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
                  </button>

                  {/* Discord keeps link */}
                  <Link
                    href="/discord"
                    className="flex items-center gap-3 p-3 sm:p-4 rounded-xl border-2 border-gray-300 text-gray-800 transition-colors hover:bg-blue-50 hover:border-blue-300 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-blue-900/20 dark:hover:border-blue-400 select-none"
                    onClick={() => setIsOpen(false)}
                  >
                    <Image src="/images/discord-icon.svg" alt="Discord" width={20} height={20} className="h-5 w-5" />
                    <span className="font-medium">Join Discord</span>
                  </Link>

                  {/* Report */}
                  <button
                    onClick={() => {
                      setShowReportModal(true)
                      setIsOpen(false)
                    }}
                    className="flex items-center gap-3 p-3 sm:p-4 rounded-xl border-2 border-gray-300 text-gray-800 hover:text-red-600 hover:bg-red-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-red-900/20 dark:hover:border-red-400 dark:hover:text-red-400 select-none"
                  >
                    <Flag className="h-5 w-5" />
                    <span className="font-medium">Report Issue</span>
                  </button>

                  {/* Get Started → OPEN MODAL (no Link) */}
                  <button
                    onClick={() => {
                      setShowGetStartedModal(true)
                      setIsOpen(false)
                    }}
                    className="w-full p-3 sm:p-4 h-auto select-none relative overflow-hidden group transform hover:scale-105 transition-all duration-300 hover:shadow-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold border-0 rounded-xl shadow-lg"
                  >
                    <span className="relative z-10 select-none font-medium flex items-center justify-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Get Started
                    </span>
                  </button>

                  {/* Referral → OPEN AffiliateModal (no Link) */}
                  <button
                    onClick={() => {
                      setIsAffiliateModalOpen(true)
                      setIsOpen(false)
                    }}
                    className="w-full p-3 sm:p-4 h-auto select-none relative overflow-hidden group transform hover:scale-105 transition-all duration-300 hover:shadow-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold border-0 rounded-xl shadow-lg"
                  >
                    <span className="relative z-10 select-none font-medium flex items-center justify-center">
                      Referral
                    </span>
                  </button>
      
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
      </nav>

      {/* Modals (mounted once here) */}
      <ReportModal isOpen={showReportModal} onClose={() => setShowReportModal(false)} />
      <GetStartedModal isOpen={showGetStartedModal} onClose={() => setShowGetStartedModal(false)} />
      <AffiliateModal isOpen={isAffiliateModalOpen} onClose={() => setIsAffiliateModalOpen(false)} />
    </>
  )
}
