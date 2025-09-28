export interface DurationOption {
  key: string
  label: string
  sortOrder: number
}

export const parseDurationFromKey = (durationKey: string): { label: string; sortOrder: number } => {
  const normalizedKey = durationKey.toLowerCase().trim()

  // Handle lifetime variations
  if (["lifetime", "permanent", "forever", "perm"].includes(normalizedKey)) {
    return { label: "Lifetime", sortOrder: 10000 }
  }

  // Parse numeric values with optional units
  const numericMatch = normalizedKey.match(/^(\d+)\s*(day|days|d|week|weeks|w|month|months|m|year|years|y)?s?$/i)
  if (numericMatch) {
    const value = Number.parseInt(numericMatch[1])
    const unit = numericMatch[2]?.toLowerCase() || "day"

    let daysEquivalent: number
    let label: string

    switch (unit.charAt(0)) {
      case "w": // weeks
        daysEquivalent = value * 7
        label = value === 1 ? "1 Week" : `${value} Weeks`
        break
      case "m": // months
        daysEquivalent = value * 30
        label = value === 1 ? "1 Month" : `${value} Months`
        break
      case "y": // years
        daysEquivalent = value * 365
        label = value === 1 ? "1 Year" : `${value} Years`
        break
      default: // days
        daysEquivalent = value
        if (value >= 365) {
          const years = Math.floor(value / 365)
          const remainingDays = value % 365
          if (remainingDays === 0) {
            label = years === 1 ? "1 Year" : `${years} Years`
          } else if (remainingDays <= 30) {
            label = years === 1 ? `1 Year ${remainingDays} Days` : `${years} Years ${remainingDays} Days`
          } else {
            label = `${value} Days`
          }
        } else if (value >= 30) {
          const months = Math.floor(value / 30)
          const remainingDays = value % 30
          if (remainingDays === 0) {
            label = months === 1 ? "1 Month" : `${months} Months`
          } else if (remainingDays <= 7) {
            label = months === 1 ? `1 Month ${remainingDays} Days` : `${months} Months ${remainingDays} Days`
          } else {
            label = `${value} Days`
          }
        } else if (value >= 7) {
          const weeks = Math.floor(value / 7)
          const remainingDays = value % 7
          if (remainingDays === 0) {
            label = weeks === 1 ? "1 Week" : `${weeks} Weeks`
          } else {
            label = `${value} Days`
          }
        } else {
          label = value === 1 ? "1 Day" : `${value} Days`
        }
        break
    }

    return { label, sortOrder: daysEquivalent }
  }

  const textMappings: Record<string, { label: string; sortOrder: number }> = {
    daily: { label: "1 Day", sortOrder: 1 },
    weekly: { label: "1 Week", sortOrder: 7 },
    monthly: { label: "1 Month", sortOrder: 30 },
    yearly: { label: "1 Year", sortOrder: 365 },
    annual: { label: "1 Year", sortOrder: 365 },
    trial: { label: "Trial", sortOrder: 0.5 },
    demo: { label: "Demo", sortOrder: 0.1 },
    normal: { label: "Normal", sortOrder: 100 },
    premium: { label: "Premium", sortOrder: 200 },
    basic: { label: "Basic", sortOrder: 50 },
    standard: { label: "Standard", sortOrder: 150 },
    pro: { label: "Pro", sortOrder: 300 },
    enterprise: { label: "Enterprise", sortOrder: 500 },
    starter: { label: "Starter", sortOrder: 25 },
    advanced: { label: "Advanced", sortOrder: 250 },
    ultimate: { label: "Ultimate", sortOrder: 400 },
    subscription: { label: "Subscription", sortOrder: 1000 },
    recurring: { label: "Recurring", sortOrder: 1100 },
    onetime: { label: "One-time", sortOrder: 0.8 },
    "one-time": { label: "One-time", sortOrder: 0.8 },
    temporary: { label: "Temporary", sortOrder: 10 },
    extended: { label: "Extended", sortOrder: 600 },
  }

  if (textMappings[normalizedKey]) {
    return textMappings[normalizedKey]
  }

  // Fallback for unknown formats - try to extract any numbers
  const fallbackMatch = normalizedKey.match(/(\d+)/)
  if (fallbackMatch) {
    const value = Number.parseInt(fallbackMatch[1])
    return {
      label: `${value} Days`,
      sortOrder: value,
    }
  }

  return {
    label: normalizedKey.charAt(0).toUpperCase() + normalizedKey.slice(1),
    sortOrder: 9999, // Custom text gets high sort order to appear at end
  }
}

export const generateDurationKey = (durationKey: string): string => {
  const normalizedKey = durationKey.toLowerCase().trim()

  // Handle lifetime variations
  if (["lifetime", "permanent", "forever", "perm"].includes(normalizedKey)) {
    return "lifetime"
  }

  // Parse and normalize numeric durations
  const numericMatch = normalizedKey.match(/^(\d+)\s*(day|days|d|week|weeks|w|month|months|m|year|years|y)?s?$/i)
  if (numericMatch) {
    const value = Number.parseInt(numericMatch[1])
    const unit = numericMatch[2]?.toLowerCase() || "day"

    // Convert everything to days for consistent keys
    switch (unit.charAt(0)) {
      case "w": // weeks
        return (value * 7).toString()
      case "m": // months
        return (value * 30).toString()
      case "y": // years
        return (value * 365).toString()
      default: // days
        return value.toString()
    }
  }

  // Return as-is for text-based keys
  return normalizedKey
}

export const getDynamicDurationOptions = (resellersData: any[]): DurationOption[] => {
  if (!resellersData || resellersData.length === 0) {
    return []
  }

  const availableDurations = new Set<string>()

  // Collect all available duration keys from resellers
  resellersData.forEach((reseller) => {
    if (reseller.durations && typeof reseller.durations === "object") {
      Object.keys(reseller.durations).forEach((durationKey) => {
        if (reseller.durations[durationKey] && reseller.durations[durationKey].price) {
          const normalizedKey = generateDurationKey(durationKey)
          availableDurations.add(normalizedKey)
        }
      })
    }
  })

  // Convert to duration options with automatic parsing
  const durationOptions: DurationOption[] = []

  availableDurations.forEach((durationKey) => {
    const parsed = parseDurationFromKey(durationKey)
    durationOptions.push({
      key: durationKey,
      label: parsed.label,
      sortOrder: parsed.sortOrder,
    })
  })

  // Sort by sort order (days equivalent)
  return durationOptions.sort((a, b) => a.sortOrder - b.sortOrder)
}

export const transformResellerDurations = (resellerData: any): any => {
  if (!resellerData.durations || typeof resellerData.durations !== "object") {
    return resellerData
  }

  const transformedDurations: any = {}

  Object.entries(resellerData.durations).forEach(([originalKey, durationData]) => {
    const normalizedKey = generateDurationKey(originalKey)
    transformedDurations[normalizedKey] = durationData
  })

  return {
    ...resellerData,
    durations: transformedDurations,
  }
}

export const getDurationLabel = (durationKey: string): string => {
  return parseDurationFromKey(durationKey).label
}

export const sortDurationKeys = (keys: string[]): string[] => {
  return keys.sort((a, b) => {
    const aOrder = parseDurationFromKey(a).sortOrder
    const bOrder = parseDurationFromKey(b).sortOrder
    return aOrder - bOrder
  })
}

export const parseDurationInput = (input: string): string => {
  const normalizedInput = input.toLowerCase().trim()

  // Handle lifetime variations first
  if (["lifetime", "permanent", "forever", "perm"].includes(normalizedInput)) {
    return "lifetime"
  }

  // Try numeric parsing with units (preserves existing days regex functionality)
  const dayMatch = normalizedInput.match(/(\d+)\s*(days?)/)
  if (dayMatch) {
    return dayMatch[1]
  }

  const monthMatch = normalizedInput.match(/(\d+)\s*(months?)/)
  if (monthMatch) {
    return (Number.parseInt(monthMatch[1]) * 30).toString()
  }

  const yearMatch = normalizedInput.match(/(\d+)\s*(years?)/)
  if (yearMatch) {
    return (Number.parseInt(yearMatch[1]) * 365).toString()
  }

  const weekMatch = normalizedInput.match(/(\d+)\s*(weeks?)/)
  if (weekMatch) {
    return (Number.parseInt(weekMatch[1]) * 7).toString()
  }

  // Handle pure numbers (existing functionality)
  const numberMatch = normalizedInput.match(/^(\d+)$/)
  if (numberMatch) {
    return numberMatch[1]
  }

  // This allows "normal", "premium", etc. to be stored directly
  if (normalizedInput.length > 0) {
    return normalizedInput
  }

  return ""
}
