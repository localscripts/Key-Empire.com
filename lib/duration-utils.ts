export interface DurationOption {
  key: string
  label: string
  sortOrder: number
}

const parseDurationFromKey = (durationKey: string): { days: number; isLifetime: boolean; originalKey: string } => {
  const normalizedKey = durationKey.toLowerCase().trim()
  const originalKey = durationKey

  // Handle lifetime variations
  if (["lifetime", "permanent", "forever", "life", "perm"].includes(normalizedKey)) {
    return { days: Number.POSITIVE_INFINITY, isLifetime: true, originalKey }
  }

  // Handle numeric-only keys (assume days)
  const numericMatch = normalizedKey.match(/^(\d+)$/)
  if (numericMatch) {
    return { days: Number.parseInt(numericMatch[1]), isLifetime: false, originalKey }
  }

  // Handle various duration formats with regex patterns
  const patterns = [
    // Days: "1day", "3days", "7-days", "30_days"
    { regex: /(\d+)[-_\s]*days?/i, multiplier: 1 },
    // Weeks: "1week", "2weeks", "1-week", "4_weeks"
    { regex: /(\d+)[-_\s]*weeks?/i, multiplier: 7 },
    // Months: "1month", "3months", "6-months", "12_months"
    { regex: /(\d+)[-_\s]*months?/i, multiplier: 30 },
    // Years: "1year", "2years", "1-year", "5_years"
    { regex: /(\d+)[-_\s]*years?/i, multiplier: 365 },
    // Special formats: "1m" (month), "1y" (year), "1w" (week), "1d" (day)
    { regex: /(\d+)d$/i, multiplier: 1 },
    { regex: /(\d+)w$/i, multiplier: 7 },
    { regex: /(\d+)m$/i, multiplier: 30 },
    { regex: /(\d+)y$/i, multiplier: 365 },
  ]

  for (const pattern of patterns) {
    const match = normalizedKey.match(pattern.regex)
    if (match) {
      const number = Number.parseInt(match[1])
      return { days: number * pattern.multiplier, isLifetime: false, originalKey }
    }
  }

  // If no pattern matches, try to extract any number and assume it's days
  const anyNumberMatch = normalizedKey.match(/(\d+)/)
  if (anyNumberMatch) {
    return { days: Number.parseInt(anyNumberMatch[1]), isLifetime: false, originalKey }
  }

  // Default fallback - treat as unknown duration
  return { days: 0, isLifetime: false, originalKey }
}

const generateDurationLabel = (days: number, isLifetime: boolean): string => {
  if (isLifetime) {
    return "Lifetime"
  }

  if (days === 0) {
    return "Unknown"
  }

  // Handle exact matches for common durations
  const exactMatches: Record<number, string> = {
    1: "1 Day",
    2: "2 Days",
    3: "3 Days",
    4: "4 Days",
    5: "5 Days",
    6: "6 Days",
    7: "1 Week",
    14: "2 Weeks",
    21: "3 Weeks",
    28: "4 Weeks",
    30: "1 Month",
    60: "2 Months",
    90: "3 Months",
    120: "4 Months",
    150: "5 Months",
    180: "6 Months",
    365: "1 Year",
    730: "2 Years",
    1095: "3 Years",
  }

  if (exactMatches[days]) {
    return exactMatches[days]
  }

  // Smart conversion for other durations
  if (days >= 365) {
    const years = Math.floor(days / 365)
    const remainingDays = days % 365

    if (remainingDays === 0) {
      return years === 1 ? "1 Year" : `${years} Years`
    } else if (remainingDays <= 31) {
      // Close to exact years, show as years + days
      return `${years} Year${years > 1 ? "s" : ""} + ${remainingDays} Day${remainingDays > 1 ? "s" : ""}`
    } else {
      // Show total days for complex durations
      return `${days} Days`
    }
  } else if (days >= 30) {
    const months = Math.floor(days / 30)
    const remainingDays = days % 30

    if (remainingDays === 0) {
      return months === 1 ? "1 Month" : `${months} Months`
    } else if (remainingDays <= 7) {
      // Close to exact months, show as months + days
      return `${months} Month${months > 1 ? "s" : ""} + ${remainingDays} Day${remainingDays > 1 ? "s" : ""}`
    } else {
      // Show total days for complex durations
      return `${days} Days`
    }
  } else if (days >= 7) {
    const weeks = Math.floor(days / 7)
    const remainingDays = days % 7

    if (remainingDays === 0) {
      return weeks === 1 ? "1 Week" : `${weeks} Weeks`
    } else {
      // Show as weeks + days or just days if close
      if (weeks === 1 && remainingDays <= 3) {
        return `1 Week + ${remainingDays} Day${remainingDays > 1 ? "s" : ""}`
      } else {
        return `${days} Days`
      }
    }
  } else {
    // Less than a week, show as days
    return days === 1 ? "1 Day" : `${days} Days`
  }
}

const calculateSortOrder = (days: number, isLifetime: boolean): number => {
  if (isLifetime) {
    return 10000 // Lifetime always comes last
  }

  if (days === 0) {
    return 9999 // Unknown durations near the end
  }

  // Use days as sort order directly for precise sorting
  return days
}

// Generate duration key from any duration format
export const generateDurationKey = (durationKey: string): string => {
  const parsed = parseDurationFromKey(durationKey)

  if (parsed.isLifetime) {
    return "lifetime"
  }

  if (parsed.days === 0) {
    // Keep original key for unknown formats
    return durationKey.toLowerCase()
  }

  // Use days as the normalized key
  return parsed.days.toString()
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
        if (reseller.durations[durationKey]) {
          availableDurations.add(durationKey)
        }
      })
    }
  })

  // Convert to duration options with automatic parsing and labeling
  const durationOptions: DurationOption[] = []

  availableDurations.forEach((durationKey) => {
    const parsed = parseDurationFromKey(durationKey)
    const label = generateDurationLabel(parsed.days, parsed.isLifetime)
    const sortOrder = calculateSortOrder(parsed.days, parsed.isLifetime)
    const normalizedKey = generateDurationKey(durationKey)

    // Avoid duplicates (same normalized key)
    if (!durationOptions.find((option) => option.key === normalizedKey)) {
      durationOptions.push({
        key: normalizedKey,
        label,
        sortOrder,
      })
    }
  })

  // Sort by sort order (days ascending, lifetime last)
  return durationOptions.sort((a, b) => a.sortOrder - b.sortOrder)
}

// Transform reseller data to use consistent duration keys
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
