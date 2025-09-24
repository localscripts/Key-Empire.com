// Rust-specific products data
export interface RustProduct {
  title: string
  price: string
  resellers: string
  image: string
  hidden?: boolean
}

export const RUST_PRODUCTS_LIST: RustProduct[] = [
  {
    title: "RUSTSENSE-Script",
    price: "$14.99",
    resellers: "22+",
    image: "/images/unknown.png",
  },
  {
    title: "Fluent",
    price: "$11.99",
    resellers: "19+",
    image: "/images/unknown.png",
  },
  {
    title: "Radiance External",
    price: "$13.99",
    resellers: "17+",
    image: "/images/unknown.png",
  },
  {
    title: "Reported Spoofer",
    price: "$8.99",
    resellers: "15+",
    image: "/images/unknown.png",
  },
  {
    title: "Quantum Rust Internal",
    price: "$9.99",
    resellers: "13+",
    image: "/images/unknown.png",
  },
  {
    title: "Exception Spoofer",
    price: "$12.99",
    resellers: "11+",
    image: "/images/unknown.png",
  },
    {
    title: "Mek Rust Cheat External",
    price: "$9.99",
    resellers: "13+",
    image: "/images/unknown.png",
  },
  {
    title: "Rust External Cheat (Ancient)",
    price: "$12.99",
    resellers: "11+",
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
