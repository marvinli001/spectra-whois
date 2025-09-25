import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatDate(date: string): string {
  if (!date) return ''

  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })
  } catch {
    return date
  }
}

export function formatRelativeTime(date: string): string {
  if (!date) return ''

  try {
    const now = new Date()
    const target = new Date(date)
    const diff = target.getTime() - now.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days < 0) {
      return `${Math.abs(days)} days ago`
    } else if (days === 0) {
      return 'Today'
    } else if (days === 1) {
      return 'Tomorrow'
    } else if (days < 30) {
      return `In ${days} days`
    } else if (days < 365) {
      const months = Math.floor(days / 30)
      return `In ${months} month${months > 1 ? 's' : ''}`
    } else {
      const years = Math.floor(days / 365)
      return `In ${years} year${years > 1 ? 's' : ''}`
    }
  } catch {
    return date
  }
}