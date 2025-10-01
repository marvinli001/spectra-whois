'use client'

import { motion } from 'framer-motion'
import { Languages } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { LiquidButton } from './liquid-glass'

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh')
  }

  return (
    <motion.div
      className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.3 }}
    >
      <LiquidButton
        onClick={toggleLanguage}
        variant="ghost"
        size="sm"
        className="px-3 py-2 text-sm"
      >
        <div className="flex items-center gap-2">
          <Languages className="w-4 h-4" />
          <span>{language === 'zh' ? 'EN' : '中文'}</span>
        </div>
      </LiquidButton>
    </motion.div>
  )
}