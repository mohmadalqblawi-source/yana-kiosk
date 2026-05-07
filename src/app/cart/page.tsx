'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { useLanguageStore } from '@/store/language'
import { formatPrice, calculateVAT } from '@/lib/utils'
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, AlertCircle } from 'lucide-react'

const inlineTranslations = {
  continueShopping: { de: 'Weiter einkaufen', en: 'Continue Shopping', fa: 'ادامه خرید', ar: 'مواصلة التسوق' },
  title: { de: 'Warenkorb', en: 'Cart', fa: 'سبد خرید', ar: 'سلة التسوق' },
  items: { de: 'Artikel', en: 'items', fa: 'مورد', ar: 'عناصر' },
  clearBtn: { de: 'Leeren', en: 'Clear', fa: 'خالی کردن', ar: 'إفراغ' },
  emptyTitle: { de: 'Warenkorb ist leer', en: 'Cart is empty', fa: 'سبد خرید خالی است', ar: 'سلة التسوق فارغة' },
  emptyDesc: { de: 'Fügen Sie Produkte hinzu, um fortzufahren', en: 'Add products to continue', fa: 'برای ادامه محصولات را اضافه کنید', ar: 'أضف منتجات للمتابعة' },
  browseBtn: { de: 'Produkte entdecken', en: 'Browse Products', fa: 'مشاهده محصولات', ar: 'تصفح المنتجات' },
  perUnit: { de: '/ Stück', en: '/ piece', fa: '/ عدد', ar: '/ قطعة' },
  vatLabel: { de: 'MwSt.', en: 'VAT', fa: 'مالیات', ar: 'ضريبة' },
  orderSummary: { de: 'Bestellübersicht', en: 'Order Summary', fa: 'خلاصه سفارش', ar: 'ملخص الطلب' },
  netTotal: { de: 'Nettosumme', en: 'Net Total', fa: 'مجموع خالص', ar: 'المجموع الصافي' },
  vat7: { de: 'MwSt. 7%', en: 'VAT 7%', fa: 'مالیات ۷٪', ar: 'ضريبة ٧٪' },
  vat19: { de: 'MwSt. 19%', en: 'VAT 19%', fa: 'مالیات ۱۹٪', ar: 'ضريبة ١٩٪' },
  vatTotal: { de: 'MwSt. gesamt', en: 'Total VAT', fa: 'مجموع مالیات', ar: 'إجمالي الضريبة' },
  total: { de: 'Gesamtsumme', en: 'Total', fa: 'مجموع', ar: 'المجموع الكلي' },
  inclVat: { de: 'inkl. gesetzlicher MwSt.', en: 'incl. statutory VAT', fa: 'شامل مالیات قانونی', ar: 'شامل ضريبة القيمة المضافة القانونية' },
  checkout: { de: 'Zur Kasse', en: 'Checkout', fa: 'تسویه حساب', ar: 'الدفع' },
  note: { de: 'Sie können Ihre Bestellung nach dem Absenden persönlich im Kiosk abholen oder kontaktieren Sie uns für Lieferoptionen.', en: 'You can pick up your order in person at the kiosk after submitting, or contact us for delivery options.', fa: 'می‌توانید پس از ثبت سفارش، آن را شخصاً از کیوسک تحویل بگیرید یا برای گزینه‌های تحویل با ما تماس بگیرید.', ar: 'يمكنك استلام طلبك شخصياً من الكشك بعد التقديم، أو اتصل بنا لخيارات التوصيل.' },
}

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalGross,
    getTotalNet,
    getTotalVat,
    getVatBreakdown,
    getItemCount,
  } = useCartStore()
  const { lang } = useLanguageStore()

  const tr = (key: keyof typeof inlineTranslations) => inlineTranslations[key][lang] || inlineTranslations[key]['de']

  const totalNet = getTotalNet()
  const totalVat = getTotalVat()
  const totalGross = getTotalGross()
  const { vat7, vat19 } = getVatBreakdown()
  const count = getItemCount()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> {tr('continueShopping')}
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{tr('title')}</h1>
          <p className="text-gray-500 mt-1">{count} {tr('items')}</p>
        </div>
        {items.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={clearCart}
            className="px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> {tr('clearBtn')}
          </motion.button>
        )}
      </motion.div>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-100 to-yellow-100 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{tr('emptyTitle')}</h2>
          <p className="text-gray-500 mb-8">{tr('emptyDesc')}</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl font-semibold text-sm hover:shadow-lg transition-shadow"
          >
            {tr('browseBtn')}
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => {
                const { gross } = calculateVAT(item.priceNet, item.vatRate)
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="flex gap-4 sm:gap-6 p-4 sm:p-6 bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 transition-all group"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gradient-to-br from-emerald-50 to-yellow-50 overflow-hidden shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link
                            href={`/product/${item.productId}`}
                            className="font-semibold text-gray-900 hover:text-emerald-600 transition-colors line-clamp-1"
                          >
                            {item.name}
                          </Link>
                          <p className="text-sm text-gray-500 mt-0.5">
                            {formatPrice(gross)} {tr('perUnit')} | {tr('vatLabel')} {item.vatRate}%
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="p-2 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center bg-gray-100 rounded-xl p-0.5">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="p-2 rounded-lg hover:bg-white transition-colors"
                          >
                            <Minus className="w-4 h-4 text-gray-600" />
                          </motion.button>
                          <span className="w-10 text-center font-semibold text-gray-900">
                            {item.quantity}
                          </span>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="p-2 rounded-lg hover:bg-white transition-colors"
                          >
                            <Plus className="w-4 h-4 text-gray-600" />
                          </motion.button>
                        </div>
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(gross * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-6">{tr('orderSummary')}</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>{tr('netTotal')}</span>
                  <span>{formatPrice(totalNet)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{tr('vat7')}</span>
                  <span>{formatPrice(vat7)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{tr('vat19')}</span>
                  <span>{formatPrice(vat19)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{tr('vatTotal')}</span>
                  <span>{formatPrice(totalVat)}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>{tr('total')}</span>
                    <span>{formatPrice(totalGross)}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{tr('inclVat')}</p>
                </div>
              </div>

              <Link href="/checkout">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-6 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl font-semibold text-sm hover:shadow-lg hover:shadow-emerald-600/20 transition-all"
                >
                  {tr('checkout')}
                </motion.button>
              </Link>

              <div className="mt-4 flex items-start gap-2 p-3 bg-blue-50 rounded-xl">
                <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                <p className="text-xs text-blue-700">
                  {tr('note')}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  )
}
