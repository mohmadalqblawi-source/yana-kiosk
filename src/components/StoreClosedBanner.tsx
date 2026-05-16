'use client'

import { useEffect, useState } from 'react'
import { WifiOff } from 'lucide-react'

/** Site-wide notice when admin closes the shop (browse-only). */
export default function StoreClosedBanner() {
  const [closed, setClosed] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/store-status')
        const data = await res.json()
        setClosed(data.isOpen === false)
      } catch {
        setClosed(false)
      } finally {
        setReady(true)
      }
    }
    load()
    const onFocus = () => load()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  if (!ready || !closed) return null

  return (
    <div className="sticky top-[4.6rem] md:top-[5.35rem] z-20 bg-amber-500 text-white px-4 py-2.5 text-center text-sm font-medium shadow-md border-b border-amber-600/30">
      <p className="max-w-3xl mx-auto flex items-center justify-center gap-2 flex-wrap">
        <WifiOff className="w-4 h-4 shrink-0" aria-hidden />
        <span>
          Der Online-Shop ist derzeit geschlossen. Sie können Produkte ansehen, aber keine Bestellungen aufgeben.
        </span>
      </p>
    </div>
  )
}
