import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(value: string, language: "zh" | "en" = "en") {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date)
}

export function formatRelativeTime(
  value: string,
  language: "zh" | "en" = "en"
) {
  const timestamp = new Date(value).getTime()

  if (Number.isNaN(timestamp)) {
    return ""
  }

  const delta = timestamp - Date.now()
  const absolute = Math.abs(delta)
  const minute = 60_000
  const hour = 60 * minute
  const day = 24 * hour
  const month = 30 * day
  const year = 365 * day
  const formatter = new Intl.RelativeTimeFormat(
    language === "zh" ? "zh-CN" : "en",
    { numeric: "auto" }
  )

  if (absolute < hour) {
    return formatter.format(Math.round(delta / minute), "minute")
  }
  if (absolute < day) {
    return formatter.format(Math.round(delta / hour), "hour")
  }
  if (absolute < month) {
    return formatter.format(Math.round(delta / day), "day")
  }
  if (absolute < year) {
    return formatter.format(Math.round(delta / month), "month")
  }
  return formatter.format(Math.round(delta / year), "year")
}
