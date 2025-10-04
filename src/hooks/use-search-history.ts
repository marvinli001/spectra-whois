/**
 * React hook for managing search history
 */

import { useState, useEffect, useCallback } from 'react'
import {
  getSearchHistory,
  addToSearchHistory,
  removeFromSearchHistory,
  clearSearchHistory,
  getRecentSearches,
  SearchHistoryItem
} from '@/utils/storage'

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  const loadHistory = useCallback(() => {
    const loaded = getSearchHistory()
    setHistory(loaded)
    setRecentSearches(getRecentSearches(5))
  }, [])

  // Load history on mount
  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  const addSearch = useCallback((domain: string, success: boolean = true) => {
    addToSearchHistory(domain, success)
    loadHistory()
  }, [loadHistory])

  const removeSearch = useCallback((domain: string) => {
    removeFromSearchHistory(domain)
    loadHistory()
  }, [loadHistory])

  const clearHistory = useCallback(() => {
    clearSearchHistory()
    loadHistory()
  }, [loadHistory])

  return {
    history,
    recentSearches,
    addSearch,
    removeSearch,
    clearHistory,
    refresh: loadHistory
  }
}
