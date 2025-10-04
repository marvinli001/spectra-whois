/**
 * LocalStorage utility for search history management
 * Provides safe access to localStorage with error handling
 */

export interface SearchHistoryItem {
  domain: string
  timestamp: number
  success: boolean
}

const STORAGE_KEY = 'spectra_whois_history'
const MAX_HISTORY_ITEMS = 20
const HISTORY_EXPIRY_DAYS = 30

/**
 * Check if localStorage is available
 */
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__storage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

/**
 * Get search history from localStorage
 */
export function getSearchHistory(): SearchHistoryItem[] {
  if (!isLocalStorageAvailable()) {
    return []
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return []
    }

    const history: SearchHistoryItem[] = JSON.parse(stored)
    const now = Date.now()
    const expiryTime = HISTORY_EXPIRY_DAYS * 24 * 60 * 60 * 1000

    // Filter out expired items
    const validHistory = history.filter(
      item => now - item.timestamp < expiryTime
    )

    // If we filtered any items, save the cleaned list
    if (validHistory.length !== history.length) {
      saveSearchHistory(validHistory)
    }

    return validHistory
  } catch (error) {
    console.error('Failed to read search history:', error)
    return []
  }
}

/**
 * Save search history to localStorage
 */
function saveSearchHistory(history: SearchHistoryItem[]): void {
  if (!isLocalStorageAvailable()) {
    return
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  } catch (error) {
    console.error('Failed to save search history:', error)
  }
}

/**
 * Add a new search to history
 */
export function addToSearchHistory(domain: string, success: boolean = true): void {
  const history = getSearchHistory()

  // Remove existing entry for this domain (if any)
  const filtered = history.filter(item => item.domain !== domain)

  // Add new entry at the beginning
  const newItem: SearchHistoryItem = {
    domain,
    timestamp: Date.now(),
    success
  }

  const updatedHistory = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS)
  saveSearchHistory(updatedHistory)
}

/**
 * Remove a specific domain from history
 */
export function removeFromSearchHistory(domain: string): void {
  const history = getSearchHistory()
  const filtered = history.filter(item => item.domain !== domain)
  saveSearchHistory(filtered)
}

/**
 * Clear all search history
 */
export function clearSearchHistory(): void {
  if (!isLocalStorageAvailable()) {
    return
  }

  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear search history:', error)
  }
}

/**
 * Get recent successful searches (for suggestions)
 */
export function getRecentSearches(limit: number = 5): string[] {
  const history = getSearchHistory()
  return history
    .filter(item => item.success)
    .slice(0, limit)
    .map(item => item.domain)
}
