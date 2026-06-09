'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Product } from '@/types'
import { formatPrice, calculateVAT } from '@/lib/utils'
import { resolveProductCategoryStyle } from '@/lib/category-styles'
import { useCardTilt } from '@/hooks/useCardTilt'
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
  const { ref: cardRef, onMouseMove, onMouseLeave } = useCardTilt()
  const [imageError, setImageError] = useState(false)
  const [descExpanded, setDescExpanded] = useState(false)
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="h-full"
    >
      <article
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="product-card group relative flex flex-col h-full overflow-hidden rounded-2xl bg-white border border-gray-100 hover:border-emerald-200"
      >
        {/* Image */}
        <Link href={`/product/${product.id}`} className="block shrink-0">
          <div className="aspect-square overflow-hidden relative">
            <div className="product-card-img-wrap w-full h-full">
              {!showPlaceholder ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${style.color}`}>
                  <div className="product-card-placeholder-icon w-[4.5rem] h-[4.5rem] sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
                    <IconComponent className="w-9 h-9 sm:w-10 sm:h-10 text-white" strokeWidth={1.75} />
                  </div>
                </div>
              )}
            </div>

            <div className="product-card-shine" aria-hidden />
            <div className="product-card-img-overlay absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

            {product.stock <= 5 && product.stock > 0 && (
              <span className="absolute top-3 left-3 z-[3] px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-semibold rounded-lg shadow-sm">
                {tr('onlyLeft')} {product.stock} {tr('left')}
              </span>
            )}
            {product.stock === 0 && (
              <span className="absolute top-3 left-3 z-[3] px-2.5 py-1 bg-red-500 text-white text-[10px] font-semibold rounded-lg shadow-sm">
                {tr('soldOut')}
              </span>
            )}

            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              onClick={handleAddToCart}
              className="product-card-quick-add absolute bottom-3 right-3 z-[3] p-3 rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 hover:scale-110 transition-shadow"
              aria-label={tr('add')}
            >
              <ShoppingBag className="w-5 h-5" />
            </motion.button>
          </div>
        </Link>

        {/* Info — fixed blocks on desktop for aligned footers */}
        <div className="p-3 sm:p-4 flex flex-col flex-1 min-h-0">
          <Link href={`/product/${product.id}`} className="block min-w-0">
            <div className="flex items-center gap-1.5 mb-1.5 min-w-0 h-5">
              <div className={`w-5 h-5 rounded-md bg-gradient-to-br ${style.color} flex items-center justify-center shrink-0`}>
                <IconComponent className="w-3 h-3 text-white" strokeWidth={2} />
              </div>
              <p className="text-[10px] sm:text-xs font-semibold text-emerald-700 uppercase tracking-wider truncate">
                {product.category}
              </p>
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors duration-300 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem] leading-snug">
              {product.name}
            </h3>
          </Link>

          <div className="hidden sm:flex sm:flex-col mt-1.5 min-h-[3.75rem]">
            {description ? (
              <>
                <p
                  className={`text-sm text-gray-500 leading-snug ${
                    descExpanded
                      ? ''
                      : 'line-clamp-2 max-h-[2.625rem] overflow-hidden'
                  }`}
                >
                  {description}
                </p>
                {canToggleDescription && (
                  <button
                    type="button"
                    onClick={toggleDescription}
                    className="mt-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 text-left w-fit"
                  >
                    {descExpanded ? tr('showLess') : tr('showMore')}
                  </button>
                )}
              </>
            ) : (
              <span className="invisible text-sm leading-snug line-clamp-2 select-none" aria-hidden>
                &nbsp;
              </span>
            )}
          </div>

          <div className="flex items-end justify-between mt-auto pt-2 sm:pt-3 gap-2 shrink-0">
            <div className="min-w-0">
              <span className="text-base sm:text-lg font-bold text-gray-900">{formatPrice(gross)}</span>
              <span className="text-[10px] text-gray-400 ml-1 block leading-none">{tr('inclVat')}</span>
            </div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="shrink-0 px-2.5 sm:px-3 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-emerald-600/25 transition-all flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tr('add')}</span>
            </motion.button>
          </div>
        </div>
      </article>
    </motion.div>
  )
}
