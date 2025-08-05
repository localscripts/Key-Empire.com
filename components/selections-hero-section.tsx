"use client"

interface SelectionsHeroSectionProps {
  title?: string
  subtitle?: string
}

export default function SelectionsHeroSection({
  title = "Quick Selections",
  subtitle = "Browse our top selections",
}: SelectionsHeroSectionProps) {
  return (
    <div className="mb-16">
      <h1 className="text-4xl font-bold text-center">{title}</h1>
      <p className="text-xl text-center mt-4">{subtitle}</p>
    </div>
  )
}
