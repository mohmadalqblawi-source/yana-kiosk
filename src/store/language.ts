'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Lang } from '@/lib/translations'

interface LanguageStore {
  lang: Lang
  setLang: (lang: Lang) => void
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      lang: 'de',
      setLang: (lang: Lang) => set({ lang }),
    }),
    {
      name: 'yana-lang',
    }
  )
)
