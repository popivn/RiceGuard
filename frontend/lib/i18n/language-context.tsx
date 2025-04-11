"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { translations } from './translations'

type LanguageContextType = {
  language: string;
  t: (key: string, vars?: Record<string, string | number>) => string;
  changeLanguage: (lang: string) => void;
  availableLanguages: string[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<string>('en')
  
  // Try to get the language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])
  
  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])
  
  // Translation function
  const t = (key: string, vars?: Record<string, string | number>): string => {
    // Get the translation or fallback to the key if not found
    const translation = translations[language][key] || translations.en[key] || key
    
    // Replace variables in the translation if any
    if (vars) {
      return Object.entries(vars).reduce((acc, [k, v]) => {
        return acc.replace(new RegExp(`{${k}}`, 'g'), String(v))
      }, translation)
    }
    
    return translation
  }
  
  const changeLanguage = (lang: string) => {
    if (Object.keys(translations).includes(lang)) {
      setLanguage(lang)
    }
  }
  
  return (
    <LanguageContext.Provider value={{
      language,
      t,
      changeLanguage,
      availableLanguages: Object.keys(translations)
    }}>
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