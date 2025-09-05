export interface PaymentMethod {
  id: string
  name: string
  iconPath?: string // Optional custom icon path, defaults to /images/{id}-icon.png
}

// Simple list of payment methods - just add new entries here!
export const PAYMENT_METHODS_LIST: PaymentMethod[] = [
  { id: "paypal", name: "PayPal", iconPath: "/images/paypal-icon.svg" },
  { id: "stripe", name: "Stripe", iconPath: "/images/stripe-icon.svg" },
  { id: "crypto", name: "Crypto" }, // Will use default crypto icon or fallback
  { id: "visa", name: "Visa" },
  { id: "mastercard", name: "Mastercard" },
  { id: "american-express", name: "American Express" },
  { id: "google-pay", name: "Google Pay" },
  { id: "apple-pay", name: "Apple Pay" },
  { id: "bitcoin", name: "Bitcoin" },
  { id: "ethereum", name: "Ethereum" },
  { id: "litecoin", name: "Litecoin" },
  { id: "bank-transfer", name: "Bank Transfer" },
  { id: "skrill", name: "Skrill" },
  { id: "neteller", name: "Neteller" },
  { id: "klarna", name: "Klarna" },
  { id: "afterpay", name: "Afterpay" },
]

export function getPaymentMethod(id: string): PaymentMethod | undefined {
  return PAYMENT_METHODS_LIST.find(
    (method) => method.id.toLowerCase() === id.toLowerCase() || method.name.toLowerCase() === id.toLowerCase(),
  )
}

export function getPaymentMethodIcon(id: string): string {
  const method = getPaymentMethod(id)
  if (method?.iconPath) {
    return method.iconPath
  }
  // Auto-generate icon path based on ID
  const normalizedId = method?.id || id.toLowerCase().replace(/\s+/g, "-")
  return `/images/${normalizedId}-white-icon.png`
}

export function getPaymentMethodName(id: string): string {
  const method = getPaymentMethod(id)
  return method?.name || id.charAt(0).toUpperCase() + id.slice(1)
}

export function getPaymentMethodsMap() {
  const map: { [key: string]: { name: string; iconPath: string } } = {}
  PAYMENT_METHODS_LIST.forEach((method) => {
    map[method.id] = {
      name: method.name,
      iconPath: method.iconPath || getPaymentMethodIcon(method.id),
    }
  })
  return map
}

export const PAYMENT_METHODS = getPaymentMethodsMap()
