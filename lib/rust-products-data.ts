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
    title: "Rust Aimbot",
    price: "$14.99",
    resellers: "22+",
    image: "/images/rust-aimbot.png",
  },
  {
    title: "Rust ESP",
    price: "$11.99",
    resellers: "19+",
    image: "/images/rust-esp.png",
  },
  {
    title: "Rust Wallhack",
    price: "$13.99",
    resellers: "17+",
    image: "/images/rust-wallhack.png",
  },
  {
    title: "Rust Radar",
    price: "$8.99",
    resellers: "15+",
    image: "/images/rust-radar.png",
  },
  {
    title: "Rust No Recoil",
    price: "$9.99",
    resellers: "13+",
    image: "/images/rust-norecoil.png",
  },
  {
    title: "Rust Speedhack",
    price: "$12.99",
    resellers: "11+",
    image: "/images/rust-speedhack.png",
  },
]

// Helper function to parse price strings
export const parsePrice = (priceStr: string): number => {
  if (!priceStr || typeof priceStr !== "string") return 0
  const cleanPrice = priceStr.replace(/[^0-9.]/g, "")
  const parsed = Number.parseFloat(cleanPrice)
  return isNaN(parsed) ? 0 : parsed
}
