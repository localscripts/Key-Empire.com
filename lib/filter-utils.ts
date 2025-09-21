// Helper function to filter out hidden products
export const getVisibleProducts = (products: any[]) => {
  return products.filter((product) => !product.hidden)
}

// Filter products that have reseller data available
export const filterProductsWithResellers = (
  products: any[],
  dynamicInfo: Record<string, { price: string; resellers: string }>,
) => {
  return products.filter((product) => {
    const dynamicData = dynamicInfo[product.title]

    // Only show products that have actual reseller data (not N/A or Unknown)
    if (!dynamicData) return false

    // Hide products that have no resellers or failed to load
    if (dynamicData.resellers === "N/A" || dynamicData.resellers === "0+") {
      return false
    }

    // Show products that have actual reseller count
    return true
  })
}
