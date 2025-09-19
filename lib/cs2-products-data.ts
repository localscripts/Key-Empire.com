// CS2-specific products data
export interface CS2Product {
  title: string
  price: string
  resellers: string
  image: string
  hidden?: boolean
}

export const CS2_PRODUCTS_LIST: CS2Product[] = [
  {
    title: "CS2 Aimbot",
    price: "$9.99",
    resellers: "15+",
    image: "/images/cs2-aimbot.png",
  },
  {
    title: "CS2 Wallhack",
    price: "$7.99",
    resellers: "12+",
    image: "/images/cs2-wallhack.png",
  },
  {
    title: "CS2 ESP",
    price: "$5.99",
    resellers: "18+",
    image: "/images/cs2-esp.png",
  },
  {
    title: "CS2 Triggerbot",
    price: "$4.99",
    resellers: "10+",
    image: "/images/cs2-triggerbot.png",
  },
  {
    title: "CS2 Bhop",
    price: "$3.99",
    resellers: "8+",
    image: "/images/cs2-bhop.png",
  },
  {
    title: "CS2 Radar",
    price: "$6.99",
    resellers: "14+",
    image: "/images/cs2-radar.png",
  },
]

// Helper function to parse price strings
export const parsePrice = (priceStr: string): number => {
  if (!priceStr || typeof priceStr !== "string") return 0
  const cleanPrice = priceStr.replace(/[^0-9.]/g, "")
  const parsed = Number.parseFloat(cleanPrice)
  return isNaN(parsed) ? 0 : parsed
}
