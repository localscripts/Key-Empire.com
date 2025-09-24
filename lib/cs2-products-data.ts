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
    title: "KERNAIM",
    price: "$9.99",
    resellers: "15+",
    image: "/images/unknown.png",
  },
  {
    title: "predator",
    price: "$7.99",
    resellers: "12+",
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
