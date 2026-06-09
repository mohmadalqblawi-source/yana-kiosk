'use client'

import { useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { Product } from '@/types'
import { formatPrice, calculateVAT } from '@/lib/utils'
import { resolveProductCategoryStyle } from '@/lib/category-styles'
import { useCartStore } from '@/store/cart'
import { useUIStore } from '@/store/ui'
import { useLanguageStore } from '@/store/language'
import { ShoppingBag } from 'lucide-react'

interface ProductCardProps {
  product: Product
  index?: number
  categoryLookup?: Record<string, { icon?: string | null; color?: string | null }>
}

const DESC_TOGGLE_MIN_CHARS = 85
const TILT_STRENGTH = 12

const cardVariants = {
  hidden: { opacity: 0, y: 36, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  },
}

const inlineTranslations = {
  addedToast: { de: 'wurde hinzugefügt', en: 'was added', fa: 'اضافه شد', ar: 'تمت الإضافة' },
  onlyLeft: { de: 'Nur', en: 'Only', fa: 'فقط', ar: 'تبقى فقط' },
  left: { de: 'übrig', en: 'left', fa: 'مانده', ar: 'متبقي' },
  soldOut: { de: 'Ausverkauft', en: 'Sold out', fa: 'تمام شد', ar: 'نفد' },
  add: { de: 'Hinzufügen', en: 'Add', fa: 'افزودن', ar: 'إضافة' },
  inclVat: { de: 'inkl. MwSt.', en: 'incl. VAT', fa: 'شامل مالیات', ar: 'شامل الضريبة' },
  showMore: { de: 'Mehr anzeigen', en: 'Show more', fa: 'نمایش بیشتر', ar: 'عرض المزيد' },
  showLess: { de: 'Weniger anzeigen', en: 'Show less', fa: 'نمایش کمتر', ar: 'عرض أقل' },
}

export default function ProductCard({ product, categoryLookup }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const addItem = useCartStore((s) => s.addItem)
  const addToast = useUIStore((s) => s.addToast)
  const { lang } = useLanguageStore()
  const reducedMotion = useReducedMotion()
  const [imageError, setImageError] = useState(false)
  const [descExpanded, setDescExpanded] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const { gross } = calculateVAT(product.priceNet, product.vatRate)
  const style = resolveProductCategoryStyle(product.category, categoryLookup)
  const IconComponent = style.icon
  const showPlaceholder = !product.image || imageError
  const description = product.description?.trim() ?? ''
  const canToggleDescription = description.length > DESC_TOGGLE_MIN_CHARS

  const tr = (key: keyof typeof inlineTranslations) => inlineTranslations[key][lang] || inlineTranslations[key]['de']

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      productId: product.id,
      name: product.name,
      image: product.image,
      priceNet: product.priceNet,
      vatRate: product.vatRate,
      quantity: 1,
    })
    addToast(`${product.name} ${tr('addedToast')}`, 'success')
  }

  const toggleDescription = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDescExpanded((v) => !v)
  }

  /** FOX STORE cosmic ProductCard — same tilt math */
  function onMouseMove(e: React.MouseEvent) {
    if (reducedMotion) return
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * TILT_STRENGTH
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -TILT_STRENGTH
    setTilt({ x, y })
  }

  function onMouseLeave() {
    setTilt({ x: 0, y: 0 })
  }

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="group relative h-full"
      style={{ perspective: '1200px' }}
    >
      {/* Tilt layer — identical structure to FOX STORE */}
      <div
        className="relative h-full rounded-2xl p-px transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-xl group-hover:shadow-emerald-500/15"
        style={{
          background:
            'linear-gradient(135deg, rgba(16,185,129,0.22), rgba(255,255,255,0.4) 42%, rgba(255,255,255,0.4) 58%, rgba(16,185,129,0.12))',
          transform: reducedMotion ? undefined : `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="relative flex flex-col h-full overflow-hidden rounded-[15px] bg-white border border-gray-100">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden shrink-0 bg-gray-50">
            <Link href={`/product/${product.id}`} className="relative block w-full h-full overflow-hidden">
              {!showPlaceholder ? (
                <>
                  <div
                    className="absolute inset-0 opacity-40 transition-opacity duration-700 group-hover:opacity-70 pointer-events-none z-[1]"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, rgba(16,185,129,0.35), transparent 65%)`,
                    }}
                  />
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                    loading="lazy"
                    onError={() => setImageError(true)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-[2]" />
                  <div
                    className="absolute inset-0 pointer-events-none z-[3] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    aria-hidden
                  >
                    <div
                      className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[750ms] ease-out"
                      style={{
                        background:
                          'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.4) 50%, transparent 65%)',
                      }}
                    />
                  </div>
                </>
              ) : (
                <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${style.color}`}>
                  <div className="w-20 h-20 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110">
                    <IconComponent className="w-10 h-10 text-white" strokeWidth={1.75} />
                  </div>
                </div>
              )}
            </Link>

            {product.stock <= 5 && product.stock > 0 && (
              <span className="absolute top-3 left-3 z-[4] px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-lg shadow-md">
                {tr('onlyLeft')} {product.stock} {tr('left')}
              </span>
            )}
            {product.stock === 0 && (
              <span className="absolute top-3 left-3 z-[4] px-2.5 py-1 bg-red-500 text-white text-[10px] font-bold rounded-lg shadow-md">
                {tr('soldOut')}
              </span>
            )}

            <button
              type="button"
              onClick={handleAddToCart}
              aria-label={tr('add')}
              className="absolute bottom-3 right-3 z-[4] p-3 rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/40 opacity-0 translate-y-2 scale-90 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 transition-all duration-400 hover:scale-110 active:scale-95"
              style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            >
              <ShoppingBag className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-3 sm:p-4 flex flex-col flex-1 min-h-0">
            <Link href={`/product/${product.id}`} className="block min-w-0">
              <div className="flex items-center gap-1.5 mb-1.5 min-w-0 h-5">
                <div className={`w-5 h-5 rounded-md bg-gradient-to-br ${style.color} flex items-center justify-center shrink-0 shadow-sm`}>
                  <IconComponent className="w-3 h-3 text-white" strokeWidth={2} />
                </div>
                <p className="text-[10px] sm:text-xs font-bold text-emerald-700 uppercase tracking-wider truncate">
                  {product.category}
                </p>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-emerald-700 transition-colors duration-300 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem] leading-snug">
                {product.name}
              </h3>
            </Link>

            <div className="hidden sm:flex sm:flex-col mt-1.5 min-h-[3.75rem]">
              {description ? (
                <>
                  <p
                    className={`text-sm text-gray-500 leading-snug ${
                      descExpanded ? '' : 'line-clamp-2 max-h-[2.625rem] overflow-hidden'
                    }`}
                  >
                    {description}
                  </p>
                  {canToggleDescription && (
                    <button
                      type="button"
                      onClick={toggleDescription}
                      className="mt-1 text-xs font-semibold text-emerald-600 hover:text-emerald-800 text-left w-fit underline-offset-2 hover:underline"
                    >
                      {descExpanded ? tr('showLess') : tr('showMore')}
                    </button>
                  )}
                </>
              ) : (
                <span className="invisible text-sm line-clamp-2 select-none" aria-hidden>
                  &nbsp;
                </span>
              )}
            </div>

            <div className="flex items-end justify-between mt-auto pt-2 sm:pt-3 gap-2 shrink-0">
              <div className="min-w-0">
                <span className="text-base sm:text-lg font-bold text-gray-900">{formatPrice(gross)}</span>
                <span className="text-[10px] text-gray-400 block leading-none mt-0.5">{tr('inclVat')}</span>
              </div>
              <button
                type="button"
                onClick={handleAddToCart}
                className="shrink-0 px-3 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">{tr('add')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export { cardVariants }
