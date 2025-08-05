// lib/payment-methods.ts
import type React from "react"
import Image from "next/image"
import { Wallet } from "lucide-react"

interface PaymentMethod {
  name: string
  icon: React.ReactNode // Use React.ReactNode for JSX elements
}


// Define your payment methods here.
// For Lucide React icons, use "lucide-icon-name" as the svgPath.
// For image files, use the path to the image in your public folder.
export const PAYMENT_METHODS: { [key: string]: { name: string; icon: React.ReactNode } } = {
  paypal: {
    name: "PayPal",
    icon: <Image src="/images/paypal-icon.svg" alt="PayPal" width={20} height={20} draggable={false} />,
  },
  stripe: {
    name: "Stripe",
    icon: <Image src="/images/stripe-icon.svg" alt="Stripe" width={20} height={20} draggable={false} />,
  },
  crypto: {
    name: "Crypto",
    icon: <Wallet className="w-5 h-5 text-gray-600 dark:text-gray-400" />, // Lucide React icon
  },
  visa: {
    name: "Visa",
    icon: <Image src="/images/visa-white-icon.png" alt="Visa" width={20} height={20} draggable={false} />,
  },
  mastercard: {
    name: "Mastercard",
    icon: <Image src="/images/mastercard-white-icon.png" alt="Mastercard" width={20} height={20} draggable={false} />,
  },
  "american express": {
    name: "American Express",
    icon: (
      <Image
        src="/images/american-express-white-icon.png"
        alt="American Express"
        width={20}
        height={20}
        draggable={false}
      />
    ),
  },
  "google pay": {
    name: "Google Pay",
    icon: <Image src="/images/google-pay-white-icon.png" alt="Google Pay" width={20} height={20} draggable={false} />,
  },
  "apple pay": {
    name: "Apple Pay",
    icon: <Image src="/images/apple-pay-white-icon.png" alt="Apple Pay" width={20} height={20} draggable={false} />,
  },
  bitcoin: {
    name: "Bitcoin",
    icon: <Image src="/images/bitcoin-white-icon.png" alt="Bitcoin" width={20} height={20} draggable={false} />,
  },
  ethereum: {
    name: "Ethereum",
    icon: <Image src="/images/ethereum-white-icon.png" alt="Ethereum" width={20} height={20} draggable={false} />,
  },
  litecoin: {
    name: "Litecoin",
    icon: <Image src="/images/litecoin-white-icon.png" alt="Litecoin" width={20} height={20} draggable={false} />,
  },
  "bank transfer": {
    name: "Bank Transfer",
    icon: (
      <Image src="/images/bank-transfer-white-icon.png" alt="Bank Transfer" width={20} height={20} draggable={false} />
    ),
  },
  skrill: {
    name: "Skrill",
    icon: <Image src="/images/skrill-white-icon.png" alt="Skrill" width={20} height={20} draggable={false} />,
  },
  neteller: {
    name: "Neteller",
    icon: <Image src="/images/neteller-white-icon.png" alt="Neteller" width={20} height={20} draggable={false} />,
  },
  klarna: {
    name: "Klarna",
    icon: <Image src="/images/klarna-white-icon.png" alt="Klarna" width={20} height={20} draggable={false} />,
  },
  afterpay: {
    name: "Afterpay",
    icon: <Image src="/images/afterpay-white-icon.png" alt="Afterpay" width={20} height={20} draggable={false} />,
  },
  // Add more payment methods here following the same structure
  // Example:
  // "new-method": {
  //   name: "New Method",
  //   icon: <Image src="/images/new-method-icon.svg" alt="New Method" width={20} height={20} draggable={false} />,
  // },
}
