import type { ResellerSite } from "../types/affiliate"

export const RESELLER_SITES: ResellerSite[] = [
  {
    url: "https://raw.githubusercontent.com/aqrithebigman/keyempirestuff/refs/heads/main/endpoint.json",
    verified: false,
  },
  {
    url: "https://raw.githubusercontent.com/ilyaqqqq/keyempire/refs/heads/main/endpoint.json",
    verified: true,
  },
]

export const KNOWN_EXPLOITS = [
  "wave",
  "zenith",
  "ronin",
  "exoliner",
  "cryptic",
  "arceusx",
  "fluxus",
  "macsploit",
  "bunni",
  "valex",
  "seliware",
  "assembly",
  "potassium",
  "volcano",
  "codex",
  "matcha",
  "serotonin",
  "aureus",
  "isabelle",
]

export const PAYMENT_PATTERNS = {
  crypto: [
    "bitcoin",
    "btc",
    "cryptocurrency",
    "crypto",
    "ethereum",
    "eth",
    "litecoin",
    "ltc",
    "dogecoin",
    "doge",
    "monero",
    "xmr",
    "binance",
    "bnb",
    "usdt",
    "usdc",
    "tether",
  ],
  paypal: ["paypal", "pp", "paypal.me"],
  stripe: ["stripe", "card", "credit card", "visa", "mastercard", "amex"],
  cashapp: ["cashapp", "cash app", "$cashtag"],
  venmo: ["venmo", "@venmo"],
  zelle: ["zelle", "quickpay"],
  "apple-pay": ["apple pay", "applepay"],
  "google-pay": ["google pay", "googlepay", "gpay"],
  "bank-transfer": ["bank transfer", "wire transfer", "ach", "sepa"],
  "gift-cards": ["gift card", "amazon gift", "steam gift", "itunes gift"],
  robux: ["robux"],
}
