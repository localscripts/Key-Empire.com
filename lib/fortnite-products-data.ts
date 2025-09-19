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
    title: "Fortnite Aimbot",
    price: "$12.99",
    resellers: "20+",
    image: "/images/fortnite-aimbot.png",
  },
  {
    title: "Fortnite ESP",
    price: "$8.99",
    resellers: "16+",
    image: "/images/fortnite-esp.png",
  },
  {
    title: "Fortnite Wallhack",
    price: "$10.99",
    resellers: "18+",
    image: "/images/fortnite-wallhack.png",
  },
  {
    title: "Fortnite Radar",
    price: "$6.99",
    resellers: "12+",
    image: "/images/fortnite-radar.png",
  },
  {
    title: "Fortnite Triggerbot",
    price: "$7.99",
    resellers: "14+",
    image: "/images/fortnite-triggerbot.png",
  },
  {
    title: "Fortnite Building Bot",
    price: "$15.99",
    resellers: "10+",
    image: "/images/fortnite-building.png",
  },
]

// Helper function to parse price strings
export const parsePrice = (priceStr: string): number => {
  if (!priceStr || typeof priceStr !== "string") return 0
  const cleanPrice = priceStr.replace(/[^0-9.]/g, "")
  const parsed = Number.parseFloat(cleanPrice)
  return isNaN(parsed) ? 0 : parsed
}
