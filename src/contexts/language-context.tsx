'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Language, getTranslations } from '@/lib/i18n'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: ReturnType<typeof getTranslations>
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('zh')
  const [isClient, setIsClient] = useState(false)

  // Set client flag on mount
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load language from localStorage on client mount
  useEffect(() => {
    if (!isClient) return

    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'zh' || savedLanguage === 'en')) {
      setLanguage(savedLanguage)
    }
  }, [isClient])

  // Save language to localStorage when changed (client only)
  useEffect(() => {
    if (!isClient) return

    localStorage.setItem('language', language)
    // Update document language
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en'
  }, [language, isClient])

  const t = getTranslations(language)

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}