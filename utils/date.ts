/**
 * Format an ISO-8601 date string into a human-readable label.
 * Today → "Today, 2:30 PM"
 * Yesterday → "Yesterday, 2:30 PM"
 * Older → "Mar 15, 2024 · 2:30 PM"
 */
export function formatActivityDate(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfYesterday = new Date(startOfToday)
  startOfYesterday.setDate(startOfYesterday.getDate() - 1)
  const startOfActivity = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  if (startOfActivity.getTime() === startOfToday.getTime()) return `Today · ${time}`
  if (startOfActivity.getTime() === startOfYesterday.getTime()) return `Yesterday · ${time}`

  const day = date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
  return `${day} · ${time}`
}

/** Full date for the detail screen header */
export function formatFullDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}
