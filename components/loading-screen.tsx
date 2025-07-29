"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface LoadingScreenProps {
  onLoadingComplete: () => void
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => {
        onLoadingComplete()
      }, 500) // Wait for fade out animation to complete
    }, 2500) // Show loading screen for 2.5 seconds

    return () => clearTimeout(timer)
  }, [onLoadingComplete])

  if (!isVisible) {
    return (
      <div
        className="fixed inset-0 bg-white z-[200] flex flex-col items-center justify-center select-none"
        style={{
          opacity: 1,
          animation: "fadeOut 0.5s ease-out forwards",
        }}
      >
        <div className="flex flex-col items-center">
          <Image
            src="/images/key-empire-logo.png"
            alt="Key-Empire"
            width={240}
            height={60}
            className="h-16 w-auto select-none"
            priority
            draggable={false}
          />
        </div>

        <style jsx>{`
          @keyframes fadeOut {
            from {
              opacity: 1;
            }
            to {
              opacity: 0;
            }
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-white z-[200] flex flex-col items-center justify-center select-none">
      <div className="flex flex-col items-center">
        <Image
          src="/images/key-empire-logo.png"
          alt="Key-Empire"
          width={240}
          height={60}
          className="h-16 w-auto select-none"
          priority
          draggable={false}
          style={{
            opacity: 0,
            animation: "fadeIn 0.8s ease-out 0.3s forwards",
          }}
        />
      </div>
    </div>
  )
}
