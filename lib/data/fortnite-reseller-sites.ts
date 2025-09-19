import type { ResellerSite } from "../types/affiliate"

export const FORTNITE_RESELLER_SITES: ResellerSite[] = [

]

export const KNOWN_FORTNITE_CHEATS = [
  "aimbot",
  "esp",
  "wallhack",
  "softaim",
  "triggerbot",
  "norecoil",
  "radar",
  "skinchanger",
  "autofire",
  "speedhack",
]

export const FORTNITE_PAYMENT_PATTERNS = {
  crypto: ["bitcoin", "btc", "cryptocurrency", "crypto", "ethereum", "eth", "usdt", "usdc"],
  paypal: ["paypal", "pp", "paypal.me"],
  stripe: ["stripe", "card", "credit card", "visa", "mastercard"],
  cashapp: ["cashapp", "cash app", "$cashtag"],
  venmo: ["venmo", "@venmo"],
  "epic-games": ["epic games", "fortnite vbucks", "v-bucks"],
  "fortnite-skins": ["fortnite skins", "fn skins", "cosmetics"],
}
