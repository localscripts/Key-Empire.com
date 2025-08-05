"use client"
import QuickSelectionsGrid from "./quick-selections-grid" // Import QuickSelectionsGrid

interface QuickLink {
  title: string
  description: string
  href: string
  color: string
}

const quickLinks: QuickLink[] = [
  {
    title: "Discord",
    description: "Browse our top selections",
    href: "/selections",
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Get Started",
    description: "View all products",
    href: "/selections",
    color: "from-green-500 to-green-600",
  },
  {
    title: "Referrals",
    description: "Find your perfect tool",
    href: "/selections",
    color: "from-purple-500 to-purple-600",
  },
]

interface QuickAccessSectionProps {
  onOpenGetStartedModal: () => void // New prop
}

export default function QuickAccessSection({ onOpenGetStartedModal }: QuickAccessSectionProps) {
  return (
    <div className="mb-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2
          className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12 select-none text-shadow"
          style={{
            opacity: 0,
            transform: "translateY(40px) scale(0.9)",
            animation: "popUpBounce 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.8s forwards",
            textShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
          }}
        >
          Quick Selections
        </h2>
        {/* Pass onOpenGetStartedModal to QuickSelectionsGrid */}
        <QuickSelectionsGrid quickLinks={quickLinks} onOpenGetStartedModal={onOpenGetStartedModal} />
      </div>
    </div>
  )
}
