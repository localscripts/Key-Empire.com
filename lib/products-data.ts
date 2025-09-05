// Just add new products to this array and they'll automatically appear on the selections page

export interface ProductData {
  id: number
  title: string
  image: string
  redirectUrl: string
  price: string // Initial static price (will be updated dynamically)
  resellers: string // Initial static resellers count (will be updated dynamically)
  shadeColor: "purple" | "cyan" | "orange" | "gray" | "slate" | "pink" | "blue" | "green" | "red" | "yellow"
  popular: boolean
  hide?: boolean // If true, product will be hidden from the selections page
  category?: string // Optional category for filtering
  description?: string // Optional description
}

// EASY PRODUCT MANAGEMENT
// To add a new product, simply add a new entry to this array
// The system will automatically:
// - Display it on the selections page (unless hide: true)
// - Fetch dynamic pricing data from the API
// - Handle search and pagination
// - Apply the website's styling

export const PRODUCTS_LIST: ProductData[] = [
  {
    id: 9,
    title: "Zenith",
    image: "/images/zenith.png",
    redirectUrl: "/phantom-suite",
    price: "$11.99",
    resellers: "99+",
    shadeColor: "purple",
    popular: true,
    category: "executor",
    description: "Premium Roblox executor with advanced features",
  },
  {
    id: 10,
    title: "Wave",
    image: "/images/wave.png",
    redirectUrl: "/cipher-vault",
    price: "$6.99",
    resellers: "99+",
    shadeColor: "cyan",
    popular: false,
    category: "executor",
    description: "Reliable and fast Roblox executor",
  },
  {
    id: 11,
    title: "Bunni",
    image: "/images/bunni.png",
    redirectUrl: "/elite-package",
    price: "$8.99",
    resellers: "67",
    shadeColor: "orange",
    popular: false,
    category: "executor",
    description: "User-friendly executor with great support",
  },
  {
    id: 13,
    title: "Cryptic",
    image: "/images/cryptic.png",
    redirectUrl: "/executor-elite",
    price: "Unknown",
    resellers: "N/A",
    shadeColor: "gray",
    popular: true,
    category: "executor",
    description: "Multi-platform executor for all devices",
  },
  {
    id: 12,
    title: "Fluxus",
    image: "/images/fluxus.png",
    redirectUrl: "/pro-tools",
    price: "$13.49",
    resellers: "99+",
    shadeColor: "slate",
    popular: true,
    category: "executor",
    description: "Professional-grade executor with premium features",
  },
  {
    id: 14,
    title: "Exoliner",
    image: "/images/exoliner.png",
    redirectUrl: "/",
    price: "$16.99",
    resellers: "54",
    shadeColor: "purple",
    popular: false,
    category: "executor",
    description: "Advanced executor with unique capabilities",
  },
  {
    id: 15,
    title: "Macsploit",
    image: "/images/macsploit.png",
    redirectUrl: "/anime-scripts",
    price: "$5.99",
    resellers: "99+",
    shadeColor: "slate",
    popular: false,
    category: "executor",
    description: "Mac-compatible executor solution",
  },
  {
    id: 16,
    title: "Ronin",
    image: "/images/ronin.png",
    redirectUrl: "/fox-tools",
    price: "$11.49",
    resellers: "73",
    shadeColor: "slate",
    popular: false,
    category: "executor",
    description: "Stable and secure executor platform",
  },
  {
    id: 17,
    title: "ArceusX",
    image: "/images/arceusx.png",
    redirectUrl: "/arceusx",
    price: "$14.99",
    resellers: "88",
    shadeColor: "pink",
    popular: true,
    category: "executor",
    description: "Feature-rich executor with excellent performance",
  },
    {
    id: 17,
    title: "e",
    image: "/images/arceusx.png",
    redirectUrl: "/arceusx",
    price: "$14.99",
    resellers: "88",
    shadeColor: "pink",
    popular: true,
    category: "executor",
    description: "Feature-rich executor with excellent performance",
  },
  // ADD NEW PRODUCTS HERE - Example:
  // {
  //   id: 18,
  //   title: "NewExecutor",
  //   image: "/images/new-executor.png",
  //   redirectUrl: "/new-executor",
  //   price: "$9.99",
  //   resellers: "25",
  //   shadeColor: "blue",
  //   popular: false,
  //   hide: false, // Set to true to hide this product
  //   category: "executor",
  //   description: "Description of the new executor"
  // },
]

// Helper function to get all visible products
export const getVisibleProducts = (): ProductData[] => {
  return PRODUCTS_LIST.filter((product) => !product.hide)
}

// Helper function to get all unique categories from visible products
export const getProductCategories = (): string[] => {
  const categories = getVisibleProducts()
    .map((product) => product.category)
    .filter(Boolean) as string[]
  return [...new Set(categories)]
}

// Helper function to get visible products by category
export const getProductsByCategory = (category: string): ProductData[] => {
  return getVisibleProducts().filter((product) => product.category === category)
}

// Helper function to get popular visible products
export const getPopularProducts = (): ProductData[] => {
  return getVisibleProducts().filter((product) => product.popular)
}
