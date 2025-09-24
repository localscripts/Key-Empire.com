// Fortnite-specific products data
export interface FortniteProduct {
  title: string
  price: string
  resellers: string
  image: string
  hidden?: boolean
}

export const FORTNITE_PRODUCTS_LIST: FortniteProduct[] = [
  {
    title: "Reported Spoofer",
    price: "$12.99",
    resellers: "20+",
    image: "/images/unknown.png",
  },
  {
    title: "Klar",
    price: "$8.99",
    resellers: "16+",
    image: "/images/unknown.png",
  },
  {
    title: "FN External",
    price: "$10.99",
    resellers: "18+",
    image: "/images/unknown.png",
  },
]

// Helper function to parse price strings
export const parsePrice = (priceStr: string): number => {
  if (!priceStr || typeof priceStr !== "string") return 0
  const cleanPrice = priceStr.replace(/[^0-9.]/g, "")
  const parsed = Number.parseFloat(cleanPrice)
  return isNaN(parsed) ? 0 : parsed
}
