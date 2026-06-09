'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
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

const inlineTranslations = {
  addedToast: { de: 'wurde hinzugefügt', en: 'was added', fa: 'اضافه شد', ar: 'تمت الإضافة' },
  onlyLeft: { de: 'Nur', en: 'Only', fa: 'فقط', ar: 'تبقى فقط' },
  left: { de: 'übrig', en: 'left', fa: 'مانده', ar: 'متبقي' },
  soldOut: { de: 'Ausverkauft', en: 'Sold out', fa: 'تمام شد', ar: 'نفد' },
  add: { de: 'Hinzufügen', en: 'Add', fa: 'افزودن', ar: 'إضافة' },
  inclVat: { de: 'inkl. MwSt.', en: 'incl. VAT', fa: 'شامل مالیات', ar: 'شامل الضريبة' },
}

export default function ProductCard({ product, index = 0, categoryLookup }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const addToast = useUIStore((s) => s.addToast)
  const { lang } = useLanguageStore()
  const [imageError, setImageError] = useState(false)
  const { gross } = calculateVAT(product.priceNet, product.vatRate)
  const style = resolveProductCategoryStyle(product.category, categoryLookup)
  const IconComponent = style.icon
  const showPlaceholder = !product.image || imageError

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="h-full"
    >
      <Link href={`/product/${product.id}`} className="group block h-full">
        <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100 transition-all duration-300 flex flex-col h-full">
          {/* Image / category placeholder */}
          <div className="aspect-square overflow-hidden relative shrink-0">
            {!showPlaceholder ? (
              <motion.img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.5 }}
                loading="lazy"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${style.color}`}>
                <div className="w-[4.5rem] h-[4.5rem] sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
                  <IconComponent className="w-9 h-9 sm:w-10 sm:h-10 text-white" strokeWidth={1.75} />
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                className="p-2.5 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow text-gray-700 hover:text-emerald-600"
              >
                <ShoppingBag className="w-4 h-4" />
              </motion.button>
            </div>

            {product.stock <= 5 && product.stock > 0 && (
              <span className="absolute top-3 left-3 px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-semibold rounded-lg">
                {tr('onlyLeft')} {product.stock} {tr('left')}
              </span>
            )}
            {product.stock === 0 && (
              <span className="absolute top-3 left-3 px-2.5 py-1 bg-red-500 text-white text-[10px] font-semibold rounded-lg">
                {tr('soldOut')}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="p-3 sm:p-4 flex flex-col flex-1">
            <div className="flex items-center gap-1.5 mb-1.5 min-w-0">
              <div className={`w-5 h-5 rounded-md bg-gradient-to-br ${style.color} flex items-center justify-center shrink-0`}>
                <IconComponent className="w-3 h-3 text-white" strokeWidth={2} />
              </div>
              <p className="text-[10px] sm:text-xs font-semibold text-emerald-700 uppercase tracking-wider truncate">
                {product.category}
              </p>
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mt-1 leading-relaxed hidden sm:block">
                {product.description}
              </p>
            )}
            <div className="flex items-end justify-between mt-auto pt-2 sm:pt-3 gap-2">
              <div className="min-w-0">
                <span className="text-base sm:text-lg font-bold text-gray-900">{formatPrice(gross)}</span>
                <span className="text-[10px] text-gray-400 ml-1 block leading-none">{tr('inclVat')}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="shrink-0 px-2.5 sm:px-3 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-emerald-600/20 transition-all flex items-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tr('add')}</span>
              </motion.button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
