import type { ResellerSite } from "../types/affiliate"

export const CS2_RESELLER_SITES: ResellerSite[] = [

]

export const KNOWN_CS2_CHEATS = [
  "aimbot",
  "wallhack",
  "esp",
  "triggerbot",
  "bhop",
  "radar",
  "spinbot",
  "norecoil",
  "autofire",
  "skinchanger",
]

export const CS2_PAYMENT_PATTERNS = {
  crypto: ["bitcoin", "btc", "cryptocurrency", "crypto", "ethereum", "eth", "litecoin", "ltc", "usdt", "usdc"],
  paypal: ["paypal", "pp", "paypal.me"],
  stripe: ["stripe", "card", "credit card", "visa", "mastercard"],
  cashapp: ["cashapp", "cash app", "$cashtag"],
  venmo: ["venmo", "@venmo"],
  steam: ["steam wallet", "steam gift", "steam card"],
  "cs2-skins": ["cs2 skins", "counter-strike skins", "csgo skins"],
}
