'use client'

import { useCallback, useState } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion'
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

export default function ProductCard({ product, index = 0, categoryLookup }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const addToast = useUIStore((s) => s.addToast)
  const { lang } = useLanguageStore()
  const reducedMotion = useReducedMotion()
  const [imageError, setImageError] = useState(false)
  const [descExpanded, setDescExpanded] = useState(false)
  const [hovered, setHovered] = useState(false)

  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const springConfig = { stiffness: 260, damping: 22 }
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [7, -7]), springConfig)
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-7, 7]), springConfig)

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

  const onCardMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (reducedMotion) return
      const rect = e.currentTarget.getBoundingClientRect()
      pointerX.set((e.clientX - rect.left) / rect.width - 0.5)
      pointerY.set((e.clientY - rect.top) / rect.height - 0.5)
    },
    [pointerX, pointerY, reducedMotion]
  )

  const onCardMouseLeave = useCallback(() => {
    pointerX.set(0)
    pointerY.set(0)
    setHovered(false)
  }, [pointerX, pointerY])

  return (
    <motion.article
      variants={cardVariants}
      className="group/card relative flex flex-col h-full"
      style={
        reducedMotion
          ? undefined
          : {
              perspective: 1000,
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
            }
      }
      onMouseMove={onCardMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onCardMouseLeave}
      whileHover={reducedMotion ? undefined : { y: -8 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
    >
      <div
        className={`relative flex flex-col h-full overflow-hidden rounded-2xl bg-white border transition-colors duration-300 ${
          hovered
            ? 'border-emerald-300 shadow-xl shadow-emerald-500/15'
            : 'border-gray-200 shadow-sm'
        }`}
      >
        {/* Image area — not wrapped in Link so overlay buttons work */}
        <div className="relative aspect-square overflow-hidden shrink-0 bg-gray-50">
          <Link href={`/product/${product.id}`} className="block w-full h-full">
            <div className="relative w-full h-full overflow-hidden">
              {!showPlaceholder ? (
                <motion.img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={() => setImageError(true)}
                  animate={
                    reducedMotion
                      ? { scale: 1 }
                      : { scale: hovered ? 1.12 : 1, rotate: hovered ? 1.5 : 0 }
                  }
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                />
              ) : (
                <motion.div
                  className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${style.color}`}
                  animate={reducedMotion ? undefined : { scale: hovered ? 1.03 : 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    animate={reducedMotion ? undefined : { scale: hovered ? 1.08 : 1, y: hovered ? -4 : 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="w-20 h-20 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center shadow-lg"
                  >
                    <IconComponent className="w-10 h-10 text-white" strokeWidth={1.75} />
                  </motion.div>
                </motion.div>
              )}

              {/* Gradient overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent pointer-events-none"
                animate={{ opacity: hovered ? 1 : 0 }}
                transition={{ duration: 0.35 }}
              />

              {/* Shine sweep */}
              {!reducedMotion && (
                <motion.div
                  className="absolute inset-0 pointer-events-none z-[2]"
                  style={{
                    background:
                      'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.35) 50%, transparent 65%)',
                  }}
                  initial={{ x: '-120%', skewX: -15 }}
                  animate={{ x: hovered ? '120%' : '-120%' }}
                  transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
            </div>
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

          {/* Quick add — outside Link */}
          <motion.button
            type="button"
            onClick={handleAddToCart}
            aria-label={tr('add')}
            initial={false}
            animate={
              hovered
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0, y: 12, scale: 0.85 }
            }
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            className="absolute bottom-3 right-3 z-[4] p-3 rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/40"
          >
            <ShoppingBag className="w-5 h-5" />
          </motion.button>
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
            <h3
              className={`text-sm sm:text-base font-bold line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem] leading-snug transition-colors duration-300 ${
                hovered ? 'text-emerald-700' : 'text-gray-900'
              }`}
            >
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

          <div className="flex items-end justify-between mt-auto pt-2 sm:pt-3 gap-2 shrink-0 border-t border-gray-100 sm:border-0 sm:pt-3">
            <div className="min-w-0">
              <span className="text-base sm:text-lg font-bold text-gray-900">{formatPrice(gross)}</span>
              <span className="text-[10px] text-gray-400 block leading-none mt-0.5">{tr('inclVat')}</span>
            </div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="shrink-0 px-3 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">{tr('add')}</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export { cardVariants }
