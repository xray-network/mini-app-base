import { SLOT_CONFIG_NETWORK, SLOT_EPOCH_DURATION, SLOT_STARTING_EPOCH } from "@/config"
import * as Types from "@/types"

export const truncate = (string: string, start = 6, end = 6) => {
  return `${string.slice(0, start)}...${string.slice(-end)}`
}

export const randomString = () => (Math.random() + 1).toString(36).substring(2)

export const quantityWithCommas = (value: number | string | bigint | undefined): string => {
  const str = (value ?? 0).toString()
  if (str.length <= 3) return str
  return str.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export const quantityWithLetter = (value: number | string | bigint | undefined): string => {
  const num = Number(value ?? 0)
  if (!Number.isFinite(num)) return "0"
  return Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(num)
}

export const quantityFormat = (quantity: number | string | bigint | undefined, decimals = 6, skipZero = false) => {
  const raw = (quantity ?? 0).toString().replace(/^0+/, "")
  const isZero = raw === "" || /^0+$/.test(raw)

  if (skipZero && isZero) {
    return { a: "0", b: "", final: "0" }
  }

  if (decimals <= 0) {
    const formatted = quantityWithCommas(raw || "0")
    return { a: formatted, b: "", final: formatted }
  }

  const integerPart = raw.length > decimals ? raw.slice(0, -decimals) : "0"
  const fractionPart = raw.slice(-decimals).padStart(decimals, "0")

  const a = quantityWithCommas(integerPart)
  const b = fractionPart
  const final = `${a}.${b}`

  return { a, b, final }
}

export const numberFromString = (string: string) => {
  const a = string.slice(7, 15)
  let encode = ""
  for (let i = 0; i < a.length; i += 1) {
    const x = a.slice(i, i + 1)
    encode += x.charCodeAt(0)
  }

  return parseInt(encode, 10)
}

export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.toLowerCase().slice(1)
}

export const isChromiumBased = (): boolean => {
  return typeof window !== "undefined" && "chrome" in window && !!(window.chrome && (window.chrome as any).app)
}

export const epochStartTime = (epoch: number, network: Types.CW3Types.NetworkName) => {
  const config = SLOT_CONFIG_NETWORK[network]
  const startingEpoch = SLOT_STARTING_EPOCH[network]
  const epochDuration = SLOT_EPOCH_DURATION[network]
  return (epoch * epochDuration + (config.zeroTime / 1000 - startingEpoch * 432000)) * 1000
}

export const epochEndTime = (epoch: number, network: Types.CW3Types.NetworkName) => {
  const config = SLOT_CONFIG_NETWORK[network]
  const startingEpoch = SLOT_STARTING_EPOCH[network]
  const epochDuration = SLOT_EPOCH_DURATION[network]
  return (epoch * epochDuration + epochDuration + (config.zeroTime / 1000 - startingEpoch * 432000)) * 1000
}

export const epochProgress = (epoch: number, network: Types.CW3Types.NetworkName) => {
  const epochDuration = SLOT_EPOCH_DURATION[network] * 1000
  return Math.min(((Date.now() - epochStartTime(epoch, network)) / epochDuration) * 100, 100).toFixed(1)
}
