'use client'

import { useCallback, useRef } from 'react'

const MAX_TILT = 6

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useCardTilt() {
  const ref = useRef<HTMLElement | null>(null)

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(900px) rotateY(${x * MAX_TILT}deg) rotateX(${-y * MAX_TILT}deg) translateY(-4px)`
  }, [])

  const onMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = ''
  }, [])

  return { ref, onMouseMove, onMouseLeave }
}
