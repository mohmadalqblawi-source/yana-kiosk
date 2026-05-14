'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie } from 'lucide-react'

const STORAGE_KEY = 'yana-kiosk-cookie-consent'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY)
    if (!consent) {
      setVisible(true)
    }
  }, [])

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50"
        >
          <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-[#0a1628] border border-blue-900/50 shadow-2xl shadow-black/40 p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
              <div className="hidden sm:flex w-10 h-10 rounded-xl bg-blue-500/10 items-center justify-center shrink-0">
                <Cookie className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-sm text-gray-300 flex-1 text-center sm:text-left">
                Diese Website verwendet Cookies, die für den Betrieb der Website notwendig sind.
              </p>
              <button
                onClick={accept}
                className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-blue-600/25 whitespace-nowrap"
              >
                Verstanden
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
