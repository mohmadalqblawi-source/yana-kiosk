'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { useLanguageStore } from '@/store/language'
import { formatPrice, calculateVAT } from '@/lib/utils'
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'

const inlineTranslations = {
  cartTitle: { de: 'Warenkorb ({count})', en: 'Cart ({count})', fa: 'سبد خرید ({count})', ar: 'سلة التسوق ({count})' },
  emptyTitle: { de: 'Warenkorb ist leer', en: 'Your cart is empty', fa: 'سبد خرید خالی است', ar: 'سلة التسوق فارغة' },
  emptyDesc: { de: 'Fügen Sie Produkte hinzu', en: 'Add some products to get started', fa: 'برای شروع محصولات را اضافه کنید', ar: 'أضف بعض المنتجات للبدء' },
  browseBtn: { de: 'Produkte entdecken', en: 'Browse Products', fa: 'مشاهده محصولات', ar: 'تصفح المنتجات' },
  each: { de: 'pro Stück', en: 'each', fa: 'هر عدد', ar: 'للقطعة' },
  vat7: { de: 'MwSt. 7%', en: 'VAT 7%', fa: 'مالیات ۷٪', ar: 'ضريبة ٧٪' },
  vat19: { de: 'MwSt. 19%', en: 'VAT 19%', fa: 'مالیات ۱۹٪', ar: 'ضريبة ١٩٪' },
  total: { de: 'Gesamt', en: 'Total', fa: 'مجموع', ar: 'المجموع الكلي' },
  checkout: { de: 'Zur Kasse', en: 'Checkout', fa: 'تسویه حساب', ar: 'الدفع' },
  viewCart: { de: 'Warenkorb anzeigen', en: 'View Cart Details', fa: 'مشاهده سبد خرید', ar: 'عرض تفاصيل السلة' },
}

export default function CartSidebar() {
  const {
    items,
    isOpen,
    setOpen,
    removeItem,
    updateQuantity,
    getTotalGross,
    getVatBreakdown,
    getItemCount,
  } = useCartStore()
  const { lang } = useLanguageStore()

  const tr = (key: string, vars?: Record<string, string | number>) => {
    const keys = key.split('.')
    let obj: any = inlineTranslations
    for (const k of keys) {
      if (obj && typeof obj === 'object' && k in obj) obj = obj[k]
      else return key
    }
    let text = (obj && typeof obj === 'object' && lang in obj) ? obj[lang] : key
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        text = text.replace(`{${k}}`, String(v))
      }
    }
    return text
  }

  const total = getTotalGross()
  const { vat7, vat19 } = getVatBreakdown()
  const count = getItemCount()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">{tr('cartTitle', { count })}</h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-200 mb-4" />
                  <p className="text-gray-500 font-medium">{tr('emptyTitle')}</p>
                  <p className="text-sm text-gray-400 mt-1">{tr('emptyDesc')}</p>
                  <Link
                    href="/shop"
                    onClick={() => setOpen(false)}
                    className="mt-6 px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-medium text-sm hover:shadow-lg transition-shadow"
                  >
                    {tr('browseBtn')}
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => {
                    const { gross } = calculateVAT(item.priceNet, item.vatRate)
                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex gap-4 p-3 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors group"
                      >
                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-emerald-100 to-green-100 overflow-hidden shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {item.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {formatPrice(gross)} {tr('each')}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1">
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                className="p-1 rounded-md hover:bg-gray-200 transition-colors"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </motion.button>
                              <span className="w-8 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                className="p-1 rounded-md hover:bg-gray-200 transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </motion.button>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-gray-900">
                                {formatPrice(gross * item.quantity)}
                              </span>
                              <button
                                onClick={() => removeItem(item.productId)}
                                className="p-1 rounded-md text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 px-6 py-5 space-y-3">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{tr('vat7')}</span>
                    <span>{formatPrice(vat7)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{tr('vat19')}</span>
                    <span>{formatPrice(vat19)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-100">
                    <span>{tr('total')}</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  onClick={() => setOpen(false)}
                  className="block w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold text-sm text-center hover:shadow-lg hover:shadow-green-500/20 transition-all"
                >
                  {tr('checkout')}
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setOpen(false)}
                  className="block w-full py-2.5 text-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {tr('viewCart')}
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
