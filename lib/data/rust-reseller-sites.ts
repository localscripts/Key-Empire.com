import type { ResellerSite } from "../types/affiliate"

export const RUST_RESELLER_SITES: ResellerSite[] = [

]

export const KNOWN_RUST_CHEATS = [
  "aimbot",
  "esp",
  "wallhack",
  "norecoil",
  "speedhack",
  "flyhack",
  "radar",
  "triggerbot",
  "autofire",
  "bhop",
]

export const RUST_PAYMENT_PATTERNS = {
  crypto: ["bitcoin", "btc", "cryptocurrency", "crypto", "ethereum", "eth", "litecoin", "ltc", "usdt", "usdc"],
  paypal: ["paypal", "pp", "paypal.me"],
  stripe: ["stripe", "card", "credit card", "visa", "mastercard"],
  cashapp: ["cashapp", "cash app", "$cashtag"],
  venmo: ["venmo", "@venmo"],
  steam: ["steam wallet", "steam gift", "steam card"],
  "rust-skins": ["rust skins", "rust items", "rust marketplace"],
}
