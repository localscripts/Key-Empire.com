"use client"

import { Menu, Sun, Moon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import ReportModal from "./components/report-modal"
import QuickSelectionsGrid from "./components/quick-selections-grid"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark", !isDarkMode)
  }

  return (
    <>
      <nav
        className={`fixed top-2 left-1/2 -translate-x-1/2 w-[96%] sm:w-[95%] max-w-7xl rounded-xl border shadow-2xl transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-xl border-gray-200/50 dark:bg-gray-900/90 dark:border-gray-700/50"
            : "bg-white/95 backdrop-blur-lg border-gray-200 dark:bg-gray-900/95 dark:border-gray-700"
        }`}
      >
        <div className="px-4">
          <div className="flex h-14 md:h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/images/key-empire-logo.png"
                alt="Key-Empire"
                width={160}
                height={40}
                className="h-6 md:h-8 w-auto"
                priority
                draggable={false}
              />
            </Link>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-6">
              {/* Dark Mode */}
              <Button variant="outline" size="sm" onClick={toggleDarkMode}>
                {isDarkMode ? (
                  <Sun className="h-4 w-4 text-yellow-500" />
                ) : (
                  <Moon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                )}
              </Button>

              {/* QuickSelectionsGrid Inline */}
              <div className="w-[500px]">
                <QuickSelectionsGrid />
              </div>
            </div>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden h-8 w-8"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] bg-white/95 dark:bg-gray-900/95"
              >
                <div className="mt-8 space-y-6">
                  {/* Dark Mode */}
                  <button
                    onClick={toggleDarkMode}
                    className="flex items-center gap-3 p-3 rounded-lg border"
                  >
                    {isDarkMode ? (
                      <Sun className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                    <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
                  </button>

                  {/* QuickSelectionsGrid in Mobile */}
                  <QuickSelectionsGrid />

                  {/* Example nav links */}
                  <div className="pt-4 border-t">
                    <Link
                      href="/homepage"
                      onClick={() => setIsOpen(false)}
                      className="block py-2"
                    >
                      Browse Products
                    </Link>
                    <Link
                      href="/selections"
                      onClick={() => setIsOpen(false)}
                      className="block py-2"
                    >
                      View Resellers
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
      />
    </>
  )
}
