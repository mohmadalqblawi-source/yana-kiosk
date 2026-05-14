'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Product } from '@/types'
import { formatPrice, calculateVAT } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import { useUIStore } from '@/store/ui'
import { useLanguageStore } from '@/store/language'
import {
  ShoppingBag,
  Candy,
  Cookie,
  Beer,
  Wine,
  Cigarette,
  Sparkles,
  Pill,
  Milk,
  Droplets,
  Utensils,
  Snowflake,
} from 'lucide-react'

interface ProductCardProps {
  product: Product
  index?: number
}

function getCategoryIcon(category: string) {
  const cat = category.toLowerCase()
  if (cat.includes('schokolade') || cat.includes('sweets') || cat.includes('snack') || cat.includes('fruchtgummi') || cat.includes('lakritz') || cat.includes('kaugummi') || cat.includes('kinder')) return { icon: Candy, color: 'from-pink-400 to-rose-500', bg: 'bg-pink-50' }
  if (cat.includes('chip')) return { icon: Cookie, color: 'from-orange-400 to-amber-500', bg: 'bg-orange-50' }
  if (cat.includes('bier')) return { icon: Beer, color: 'from-yellow-400 to-yellow-600', bg: 'bg-yellow-50' }
  if (cat.includes('wein') || cat.includes('sekt') || cat.includes('spirituosen')) return { icon: Wine, color: 'from-red-400 to-red-600', bg: 'bg-red-50' }
  if (cat.includes('softdrink') || cat.includes('energy') || cat.includes('eistee')) return { icon: Sparkles, color: 'from-blue-400 to-cyan-500', bg: 'bg-blue-50' }
  if (cat.includes('saft') || cat.includes('wasser')) return { icon: Droplets, color: 'from-blue-400 to-blue-600', bg: 'bg-blue-50' }
  if (cat.includes('milch')) return { icon: Milk, color: 'from-sky-300 to-sky-500', bg: 'bg-sky-50' }
  if (cat.includes('zigaretten') || cat.includes('vape') || cat.includes('e-zigarette')) return { icon: Cigarette, color: 'from-red-500 to-red-700', bg: 'bg-red-50' }
  if (cat.includes('shisha') || cat.includes('drehtabak') || cat.includes('papers') || cat.includes('feuerzeug') || cat.includes('rauch')) return { icon: Cigarette, color: 'from-gray-500 to-gray-700', bg: 'bg-gray-50' }
  if (cat.includes('drogerie')) return { icon: Pill, color: 'from-purple-400 to-purple-600', bg: 'bg-purple-50' }
  if (cat.includes('lebensmittel') || cat.includes('essen')) return { icon: Utensils, color: 'from-green-400 to-green-600', bg: 'bg-green-50' }
  if (cat.includes('eis') || cat.includes('speiseeis') || cat.includes('eiscreme')) return { icon: Snowflake, color: 'from-sky-300 to-sky-500', bg: 'bg-sky-50' }
  if (cat.includes('getränkekiste') || cat.includes('kasten')) return { icon: Beer, color: 'from-green-400 to-emerald-600', bg: 'bg-emerald-50' }
  return { icon: ShoppingBag, color: 'from-emerald-400 to-emerald-600', bg: 'bg-emerald-50' }
}

function getCategoryEmoji(category: string) {
  const cat = category.toLowerCase()
  if (cat.includes('schokolade')) return '🍫'
  if (cat.includes('sweets') || cat.includes('snack')) return '🍬'
  if (cat.includes('chip')) return '🥨'
  if (cat.includes('fruchtgummi') || cat.includes('lakritz')) return '🍭'
  if (cat.includes('kaugummi')) return '🫧'
  if (cat.includes('kinder')) return '🧸'
  if (cat.includes('bier')) return '🍺'
  if (cat.includes('wein')) return '🍷'
  if (cat.includes('sekt')) return '🥂'
  if (cat.includes('spirituosen')) return '🥃'
  if (cat.includes('softdrink') || cat.includes('cola')) return '🥤'
  if (cat.includes('energy')) return '⚡'
  if (cat.includes('eistee')) return '🧋'
  if (cat.includes('saft')) return '🧃'
  if (cat.includes('milch')) return '🥛'
  if (cat.includes('wasser')) return '💧'
  if (cat.includes('zigaretten') || cat.includes('vape')) return '🚬'
  if (cat.includes('shisha')) return '🪬'
  if (cat.includes('feuerzeug')) return '🔥'
  if (cat.includes('papers')) return '📄'
  if (cat.includes('drogerie')) return '🧴'
  if (cat.includes('lebensmittel') || cat.includes('essen')) return '🥫'
  if (cat.includes('eis') || cat.includes('speiseeis') || cat.includes('eiscreme')) return '🍦'
  if (cat.includes('getränkekiste') || cat.includes('kasten')) return '📦'
  return '📦'
}

const inlineTranslations = {
  addedToast: { de: 'wurde hinzugefügt', en: 'was added', fa: 'اضافه شد', ar: 'تمت الإضافة' },
  onlyLeft: { de: 'Nur', en: 'Only', fa: 'فقط', ar: 'تبقى فقط' },
  left: { de: 'übrig', en: 'left', fa: 'مانده', ar: 'متبقي' },
  soldOut: { de: 'Ausverkauft', en: 'Sold out', fa: 'تمام شد', ar: 'نفد' },
  add: { de: 'Hinzufügen', en: 'Add', fa: 'افزودن', ar: 'إضافة' },
  gross: { de: 'brutto', en: 'gross', fa: 'ناخالص', ar: 'إجمالي' },
  vat: { de: 'MwSt.', en: 'VAT', fa: 'مالیات', ar: 'ضريبة' },
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const addToast = useUIStore((s) => s.addToast)
  const { lang } = useLanguageStore()
  const { gross } = calculateVAT(product.priceNet, product.vatRate)
  const catIcon = getCategoryIcon(product.category)
  const IconComponent = catIcon.icon
  const emoji = getCategoryEmoji(product.category)

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
    >
      <Link href={`/product/${product.id}`} className="group block">
        <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 hover:border-green-200 hover:shadow-lg hover:shadow-green-100 transition-all duration-300">
          {/* Image / Icon container */}
          <div className="aspect-square overflow-hidden relative">
            {product.image ? (
              <motion.img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.5 }}
                loading="lazy"
              />
            ) : (
              <div className={`w-full h-full ${catIcon.bg} flex flex-col items-center justify-center`}>
                <span className="text-5xl mb-2">{emoji}</span>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${catIcon.color} flex items-center justify-center shadow-sm`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Quick actions */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                className="p-2.5 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow text-gray-700 hover:text-green-600"
              >
                <ShoppingBag className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Stock badge */}
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

            {/* VAT badge */}
            <span className="absolute bottom-3 left-3 px-2 py-0.5 bg-white/80 backdrop-blur-sm text-[10px] font-medium text-gray-500 rounded-md">
              {tr('vat')} {product.vatRate}%
            </span>
          </div>

          {/* Info */}
          <div className="p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xs">{emoji}</span>
              <p className="text-xs font-medium text-green-600 uppercase tracking-wider">
                {product.category}
              </p>
            </div>
            <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-1">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-sm text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                {product.description}
              </p>
            )}
            <div className="flex items-center justify-between mt-3">
              <div>
                <span className="text-lg font-bold text-gray-900">{formatPrice(gross)}</span>
                <span className="text-xs text-gray-400 ml-1">{tr('gross')}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="px-3 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-green-500/20 transition-all flex items-center gap-1.5"
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
