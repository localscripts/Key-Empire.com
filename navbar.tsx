"use client"

import { Menu, Flag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import ReportModal from "./components/report-modal"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <nav
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-[120] w-[95%] max-w-7xl rounded-2xl border border-black/30 shadow-lg select-none transition-all duration-300 ${
          isScrolled ? "bg-white/40 backdrop-blur-lg" : "bg-white"
        }`}
        style={{
          opacity: 0,
          animation: "fadeIn 0.8s ease-out 0.5s forwards",
        }}
      >
        <div className="px-4 md:px-6">
          <div className="flex h-14 items-center justify-between gap-4">
            {/* Left side with logo */}
            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
              <Link href="/" className="flex items-center group">
                <div className="relative rounded-lg">
                  <Image
                    src="/images/key-empire-logo.png"
                    alt="Key-Empire"
                    width={160}
                    height={40}
                    className="h-6 md:h-8 w-auto select-none transform group-hover:scale-105 transition-all duration-300"
                    priority
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </div>
              </Link>
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex md:items-center md:space-x-4 flex-shrink-0">
              <Link href="/discord">
                <Button
                  variant="outline"
                  size="sm"
                  className={`select-none relative overflow-hidden group transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:bg-blue-50 hover:border-blue-300 ${
                    isScrolled ? "bg-white/60 backdrop-blur-sm border-gray-300/60" : "bg-transparent border-gray-300"
                  }`}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                  <Image
                    src="/images/discord-icon.svg"
                    alt="Discord"
                    width={16}
                    height={16}
                    className="h-4 w-4 select-none relative z-10"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowReportModal(true)}
                className={`select-none relative overflow-hidden group transform hover:scale-105 transition-all duration-300 hover:shadow-lg text-gray-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600 ${
                  isScrolled ? "bg-white/60 backdrop-blur-sm border-gray-300/60" : "bg-transparent border-gray-300"
                }`}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                <Flag className="h-4 w-4 select-none hover:text-red-600 relative z-10" />
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </Button>
              <Link href="/404">
                <Button
                  size="sm"
                  className="select-none relative overflow-hidden group transform hover:scale-105 transition-all duration-300 hover:shadow-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold border-0"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative z-10 select-none">Start Earning</span>
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </Button>
              </Link>
            </div>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-gray-800 hover:text-green-600 select-none"
                >
                  <Menu className="h-5 w-5 select-none" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] select-none animate-slideInRight">
                <div className="flex flex-col space-y-4 mt-8">
                  <Link
                    href="/discord"
                    className="flex items-center justify-center w-12 h-12 rounded-lg border border-gray-300 text-gray-800 transition-colors hover:bg-blue-50 hover:border-blue-300 select-none relative overflow-hidden group transform hover:scale-105 duration-300 hover:shadow-lg animate-popInDelay1"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                    <Image
                      src="/images/discord-icon.svg"
                      alt="Discord"
                      width={20}
                      height={20}
                      className="h-5 w-5 select-none relative z-10"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  </Link>

                  <button
                    onClick={() => {
                      setShowReportModal(true)
                      setIsOpen(false)
                    }}
                    className="flex items-center justify-center w-12 h-12 rounded-lg border border-gray-300 text-gray-800 transition-colors hover:bg-red-50 hover:border-red-300 hover:text-red-600 select-none relative overflow-hidden group transform hover:scale-105 duration-300 hover:shadow-lg animate-popInDelay2"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                    <Flag className="h-5 w-5 select-none relative z-10" />
                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  </button>

                  <Link href="/404">
                    <Button
                      onClick={() => setIsOpen(false)}
                      className="w-full select-none relative overflow-hidden group transform hover:scale-105 transition-all duration-300 hover:shadow-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold border-0 animate-popInDelay3"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span className="relative z-10 select-none">Start Earning</span>
                      <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          
          @keyframes fadeInScale {
            from {
              opacity: 0;
              transform: translateY(-10px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}</style>
      </nav>

      {/* Report Modal */}
      <ReportModal isOpen={showReportModal} onClose={() => setShowReportModal(false)} />
    </>
  )
}
