'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useCartStore } from '@/store/cart'
import { useUIStore } from '@/store/ui'
import { useLanguageStore } from '@/store/language'
import { formatPrice, calculateVAT } from '@/lib/utils'
import { ArrowLeft, Check, CreditCard, ShoppingBag, Loader2, Truck, Lock, AlertCircle, Car } from 'lucide-react'

const inlineTranslations = {
  backToCart: { de: 'Zurück zum Warenkorb', en: 'Back to Cart', fa: 'بازگشت به سبد خرید', ar: 'العودة إلى سلة التسوق' },
  title: { de: 'Kasse', en: 'Checkout', fa: 'تسویه حساب', ar: 'الدفع' },
  yourData: { de: 'Ihre Daten', en: 'Your Data', fa: 'اطلاعات شما', ar: 'بياناتك' },
  name: { de: 'Name', en: 'Name', fa: 'نام', ar: 'الاسم' },
  namePlaceholder: { de: 'Max Mustermann', en: 'John Doe', fa: 'نام و نام خانوادگی', ar: 'الاسم الكامل' },
  email: { de: 'E-Mail', en: 'Email', fa: 'ایمیل', ar: 'البريد الإلكتروني' },
  emailPlaceholder: { de: 'max@example.de', en: 'john@example.com', fa: 'info@example.com', ar: 'example@email.com' },
  phone: { de: 'Telefon (optional)', en: 'Phone (optional)', fa: 'تلفن (اختیاری)', ar: 'الهاتف (اختياري)' },
  phonePlaceholder: { de: '+49 30 123456789', en: '+49 30 123456789', fa: '+۴۹ ۳۰ ۱۲۳۴۵۶۷۸۹', ar: '+٤٩ ٣٠ ١٢٣٤٥٦٧٨٩' },
  shippingTitle: { de: 'Versandart wählen', en: 'Choose Shipping Method', fa: 'انتخاب روش ارسال', ar: 'اختر طريقة الشحن' },
  pickup: { de: 'Abholung', en: 'Pickup', fa: 'تحویل حضوری', ar: 'استلام شخصي' },
  free: { de: 'Kostenlos', en: 'Free', fa: 'رایگان', ar: 'مجاني' },
  deliverySelf: { de: 'Lieferung', en: 'Delivery', fa: 'تحویل', ar: 'توصيل' },
  deliverySelfDesc: { de: 'Lieferung durch uns', en: 'Delivery by us', fa: 'تحویل توسط ما', ar: 'توصيل بواسطتنا' },
  ordering: { de: 'Bestellung wird aufgegeben...', en: 'Placing order...', fa: 'در حال ثبت سفارش...', ar: 'جار تقديم الطلب...' },
  placeOrder: { de: 'Bestellung aufgeben', en: 'Place Order', fa: 'ثبت سفارش', ar: 'تقديم الطلب' },
  orderSummary: { de: 'Bestellübersicht', en: 'Order Summary', fa: 'خلاصه سفارش', ar: 'ملخص الطلب' },
  netTotal: { de: 'Nettosumme', en: 'Net Total', fa: 'مجموع خالص', ar: 'المجموع الصافي' },
  vat7: { de: 'MwSt. 7%', en: 'VAT 7%', fa: 'مالیات ۷٪', ar: 'ضريبة ٧٪' },
  vat19: { de: 'MwSt. 19%', en: 'VAT 19%', fa: 'مالیات ۱۹٪', ar: 'ضريبة ١٩٪' },
  shipping: { de: 'Versand', en: 'Shipping', fa: 'حمل و نقل', ar: 'الشحن' },
  total: { de: 'Gesamt', en: 'Total', fa: 'مجموع', ar: 'المجموع الكلي' },
  inclVat: { de: 'inkl. gesetzlicher MwSt.', en: 'incl. statutory VAT', fa: 'شامل مالیات قانونی', ar: 'شامل ضريبة القيمة المضافة القانونية' },
  successTitle: { de: 'Vielen Dank!', en: 'Thank you!', fa: 'متشکریم!', ar: 'شكراً جزيلاً!' },
  successDesc: { de: 'Ihre Bestellung wurde erfolgreich aufgegeben.', en: 'Your order has been placed successfully.', fa: 'سفارش شما با موفقیت ثبت شد.', ar: 'تم تقديم طلبك بنجاح.' },
  successEmail: { de: 'Bitte kommen Sie zur Abholung in den Kiosk oder warten Sie auf eine Rückmeldung.', en: 'Please come to the kiosk for pickup or wait for our response.', fa: 'لطفاً برای تحویل به کیوسک بیایید یا منتظر پاسخ ما باشید.', ar: 'يرجى الحضور إلى الكشك للاستلام أو انتظر ردنا.' },
  continueShopping: { de: 'Weiter einkaufen', en: 'Continue Shopping', fa: 'ادامه خرید', ar: 'مواصلة التسوق' },
  emptyCartTitle: { de: 'Warenkorb ist leer', en: 'Cart is empty', fa: 'سبد خرید خالی است', ar: 'سلة التسوق فارغة' },
  emptyCartDesc: { de: 'Fügen Sie Produkte hinzu, um zur Kasse zu gehen', en: 'Add products to proceed to checkout', fa: 'برای رفتن به تسویه حساب محصولات را اضافه کنید', ar: 'أضف منتجات للمتابعة إلى الدفع' },
  successToast: { de: 'Bestellung erfolgreich aufgegeben!', en: 'Order placed successfully!', fa: 'سفارش با موفقیت ثبت شد!', ar: 'تم تقديم الطلب بنجاح!' },
  errorToast: { de: 'Fehler bei der Bestellung. Bitte versuchen Sie es erneut.', en: 'Error placing order. Please try again.', fa: 'خطا در ثبت سفارش. لطفاً دوباره تلاش کنید.', ar: 'خطأ في تقديم الطلب. حاول مرة أخرى.' },
  dhl: { de: 'DHL', en: 'DHL', fa: 'DHL', ar: 'DHL' },
  hermes: { de: 'Hermes', en: 'Hermes', fa: 'Hermes', ar: 'Hermes' },
  cardPayment: { de: 'Kartenzahlung (Stripe)', en: 'Card Payment (Stripe)', fa: 'پرداخت کارتی (Stripe)', ar: 'الدفع بالبطاقة (Stripe)' },
  payNow: { de: 'Jetzt bezahlen', en: 'Pay Now', fa: 'پرداخت کن', ar: 'ادفع الآن' },
  securePayment: { de: 'Sichere Zahlung mit Stripe', en: 'Secure payment with Stripe', fa: 'پرداخت امن با Stripe', ar: 'دفع آمن عبر Stripe' },
  stripeNotLoaded: { de: 'Zahlungsformular wird geladen...', en: 'Loading payment form...', fa: 'در حال بارگذاری فرم پرداخت...', ar: 'جار تحميل نموذج الدفع...' },
  stripeError: { de: 'Fehler beim Laden des Zahlungsformulars', en: 'Error loading payment form', fa: 'خطا در بارگذاری فرم پرداخت', ar: 'خطأ في تحميل نموذج الدفع' },
  fillDataFirst: { de: 'Bitte füllen Sie Name und E-Mail aus', en: 'Please fill in name and email', fa: 'لطفاً نام و ایمیل را پر کنید', ar: 'يرجى ملء الاسم والبريد الإلكتروني' },
  retry: { de: 'Erneut versuchen', en: 'Retry', fa: 'تلاش مجدد', ar: 'إعادة المحاولة' },
}

export default function CheckoutPage() {
  const { items, getTotalGross, getTotalNet, getTotalVat, getVatBreakdown, clearCart, getItemCount } = useCartStore()
  const addToast = useUIStore((s) => s.addToast)
  const { lang } = useLanguageStore()
  // Load stripe client-side only
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null)
  const [stripeKeyError, setStripeKeyError] = useState(false)

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    if (!key) {
      console.error('STRIPE ERROR: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set')
      setStripeKeyError(true)
      return
    }
    setStripePromise(loadStripe(key))
  }, [])

  const tr = (key: string) => {
    const keys = key.split('.')
    let obj: any = inlineTranslations
    for (const k of keys) {
      if (obj && typeof obj === 'object' && k in obj) obj = obj[k]
      else return key
    }
    if (obj && typeof obj === 'object' && lang in obj) return obj[lang]
    return key
  }

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    shippingMethod: 'pickup' as 'pickup' | 'dhl' | 'hermes' | 'delivery',
  })

  const shippingCost = formData.shippingMethod === 'pickup' ? 0 : formData.shippingMethod === 'delivery' ? 3.00 : 4.90
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [loadingPayment, setLoadingPayment] = useState(false)

  const { vat7, vat19 } = getVatBreakdown()
  const totalNet = getTotalNet()
  const totalVat = getTotalVat()
  const totalGross = getTotalGross()

  const createPaymentIntent = useCallback(async () => {
    if (!formData.customerName || !formData.customerEmail || items.length === 0) return
    setLoadingPayment(true)
    setPaymentError(null)
    try {
      const total = totalGross + shippingCost
      console.log('Creating payment intent for amount:', total)
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`)
      }
      console.log('Payment intent created:', data.paymentIntentId)
      setClientSecret(data.clientSecret)
    } catch (err: any) {
      console.error('Payment intent error:', err)
      setPaymentError(err.message || 'Failed to create payment')
      addToast(tr('errorToast'), 'error')
    } finally {
      setLoadingPayment(false)
    }
  }, [formData.customerName, formData.customerEmail, totalGross, shippingCost, items.length, addToast])

  // Auto-create payment intent when customer data is complete
  const prevFormKey = useRef('')
  const formKey = `${formData.customerName}|${formData.customerEmail}|${formData.shippingMethod}|${items.length}|${totalGross}`
  
  useEffect(() => {
    if (formData.customerName && formData.customerEmail && items.length > 0 && !clientSecret && formKey !== prevFormKey.current) {
      prevFormKey.current = formKey
      createPaymentIntent()
    }
  }, [formKey, formData.customerName, formData.customerEmail, items.length, clientSecret, createPaymentIntent])

  const handleOrderSuccess = () => {
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-28 pb-16">
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-24 h-24 rounded-3xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-500/20"
          >
            <Check className="w-12 h-12 text-white" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{tr('successTitle')}</h1>
            <p className="text-gray-500 mb-2">{tr('successDesc')}</p>
            <p className="text-gray-500 mb-8">{tr('successEmail')}</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl font-semibold text-sm hover:shadow-lg transition-shadow"
            >
              {tr('continueShopping')}
            </Link>
          </motion.div>
        </div>
      </main>
    )
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-28 pb-16">
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-100 to-yellow-100 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{tr('emptyCartTitle')}</h2>
            <p className="text-gray-500 mb-8">{tr('emptyCartDesc')}</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl font-semibold text-sm hover:shadow-lg transition-shadow"
            >
              {tr('continueShopping')}
            </Link>
          </motion.div>
        </div>
      </main>
    )
  }

  const totalWithShipping = totalGross + shippingCost
  const customerDataReady = formData.customerName && formData.customerEmail

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> {tr('backToCart')}
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{tr('title')}</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Customer Form + Payment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Customer Data Form */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                {tr('yourData')}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {tr('name')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => { setFormData({ ...formData, customerName: e.target.value }); setClientSecret(null) }}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
                    placeholder={tr('namePlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {tr('email')} *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.customerEmail}
                    onChange={(e) => { setFormData({ ...formData, customerEmail: e.target.value }); setClientSecret(null) }}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
                    placeholder={tr('emailPlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {tr('phone')}
                  </label>
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
                    placeholder={tr('phonePlaceholder')}
                  />
                </div>
              </div>

              {/* Shipping Method */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-emerald-600" />
                  {tr('shippingTitle')}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Pickup */}
                  <button
                    type="button"
                    onClick={() => { setFormData({ ...formData, shippingMethod: 'pickup' }); setClientSecret(null) }}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                      formData.shippingMethod === 'pickup' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 bg-white hover:border-emerald-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${formData.shippingMethod === 'pickup' ? 'bg-emerald-500' : 'bg-gray-100'}`}>
                        <ShoppingBag className={`w-4 h-4 ${formData.shippingMethod === 'pickup' ? 'text-white' : 'text-gray-400'}`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{tr('pickup')}</p>
                        <p className="text-xs text-gray-500">{tr('free')}</p>
                      </div>
                    </div>
                  </button>
                  {/* Delivery by us */}
                  <button
                    type="button"
                    onClick={() => { setFormData({ ...formData, shippingMethod: 'delivery' }); setClientSecret(null) }}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                      formData.shippingMethod === 'delivery' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 bg-white hover:border-emerald-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${formData.shippingMethod === 'delivery' ? 'bg-emerald-500' : 'bg-gray-100'}`}>
                        <Car className={`w-4 h-4 ${formData.shippingMethod === 'delivery' ? 'text-white' : 'text-gray-400'}`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{tr('deliverySelf')}</p>
                        <p className="text-xs text-gray-500">{tr('deliverySelfDesc')}</p>
                        <p className="text-xs font-semibold text-emerald-600">3,00 €</p>
                      </div>
                    </div>
                  </button>
                  {/* DHL */}
                  <button
                    type="button"
                    onClick={() => { setFormData({ ...formData, shippingMethod: 'dhl' }); setClientSecret(null) }}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                      formData.shippingMethod === 'dhl' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 bg-white hover:border-emerald-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${formData.shippingMethod === 'dhl' ? 'bg-emerald-500' : 'bg-gray-100'}`}>
                        <Truck className={`w-4 h-4 ${formData.shippingMethod === 'dhl' ? 'text-white' : 'text-gray-400'}`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{tr('dhl')}</p>
                        <p className="text-xs text-gray-500">4,90 €</p>
                      </div>
                    </div>
                  </button>
                  {/* Hermes */}
                  <button
                    type="button"
                    onClick={() => { setFormData({ ...formData, shippingMethod: 'hermes' }); setClientSecret(null) }}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                      formData.shippingMethod === 'hermes' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 bg-white hover:border-emerald-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${formData.shippingMethod === 'hermes' ? 'bg-emerald-500' : 'bg-gray-100'}`}>
                        <Truck className={`w-4 h-4 ${formData.shippingMethod === 'hermes' ? 'text-white' : 'text-gray-400'}`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{tr('hermes')}</p>
                        <p className="text-xs text-gray-500">4,90 €</p>
                      </div>
                    </div>
                  </button>
                </div>
                {/* Address field for delivery */}
                {formData.shippingMethod === 'delivery' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="overflow-hidden"
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Lieferadresse * <span className="text-xs text-gray-400 font-normal">(Straße, Hausnr., PLZ, Ort)</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customerAddress || ''}
                      onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
                      placeholder="Musterstraße 123, 22885 Barsbüttel"
                    />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Stripe Payment Section */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-4">
                <Lock className="w-5 h-5 text-emerald-600" />
                {tr('cardPayment')}
              </h2>

              {stripeKeyError ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
                  <p className="text-sm text-red-600 font-medium">{tr('stripeError')}</p>
                  <p className="text-xs text-gray-400 mt-1">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY fehlt</p>
                </div>
              ) : !customerDataReady ? (
                <div className="flex items-center justify-center py-8 text-sm text-gray-500">
                  <AlertCircle className="w-5 h-5 mr-2 text-yellow-500" />
                  {tr('fillDataFirst')}
                </div>
              ) : loadingPayment ? (
                <div className="flex items-center justify-center py-8 text-sm text-gray-500">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  {tr('stripeNotLoaded')}
                </div>
              ) : paymentError ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
                  <p className="text-sm text-red-600 font-medium">{paymentError}</p>
                  <button
                    onClick={() => { setClientSecret(null); setPaymentError(null); createPaymentIntent() }}
                    className="mt-3 px-4 py-2 bg-emerald-600 text-white text-sm rounded-xl hover:bg-emerald-700 transition-colors"
                  >
                    {tr('retry')}
                  </button>
                </div>
              ) : clientSecret && stripePromise ? (
                <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe', variables: { colorPrimary: '#059669', colorBackground: '#ffffff', colorText: '#111827', borderRadius: '12px' } } }}>
                  <CheckoutFormContent
                    formData={formData}
                    onOrderSuccess={handleOrderSuccess}
                    submitting={submitting}
                    setSubmitting={setSubmitting}
                    totalWithShipping={totalWithShipping}
                    clientSecret={clientSecret}
                  />
                </Elements>
              ) : (
                <div className="flex items-center justify-center py-8 text-sm text-gray-500">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  {tr('stripeNotLoaded')}
                </div>
              )}
              <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                <Lock className="w-3 h-3" /> {tr('securePayment')}
              </p>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-6">{tr('orderSummary')}</h2>
              <div className="space-y-3 mb-6">
                {items.map((item) => {
                  const { gross } = calculateVAT(item.priceNet, item.vatRate)
                  return (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-50 to-yellow-50 overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.quantity}x {formatPrice(gross)}</p>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{formatPrice(gross * item.quantity)}</span>
                    </div>
                  )
                })}
              </div>
              <div className="space-y-3 text-sm border-t border-gray-100 pt-4">
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
                  <span>{tr('shipping')}</span>
                  <span>{shippingCost === 0 ? <span className="text-emerald-600 font-medium">{tr('free')}</span> : formatPrice(shippingCost)}</span>
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>{tr('total')}</span>
                    <span>{formatPrice(totalWithShipping)}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{tr('inclVat')}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}

function CheckoutFormContent({
  formData,
  onOrderSuccess,
  submitting,
  setSubmitting,
  totalWithShipping,
  clientSecret,
}: {
  formData: { customerName: string; customerEmail: string; customerPhone: string; customerAddress?: string; shippingMethod: string }
  onOrderSuccess: () => void
  submitting: boolean
  setSubmitting: (v: boolean) => void
  totalWithShipping: number
  clientSecret: string
}) {
  const stripe = useStripe()
  const elements = useElements()
  const addToast = useUIStore((s) => s.addToast)
  const { lang } = useLanguageStore()
  const clearCart = useCartStore((s) => s.clearCart)
  const items = useCartStore((s) => s.items)

  const tr = (key: string) => {
    const keys = key.split('.')
    let obj: any = inlineTranslations
    for (const k of keys) {
      if (obj && typeof obj === 'object' && k in obj) obj = obj[k]
      else return key
    }
    if (obj && typeof obj === 'object' && lang in obj) return obj[lang]
    return key
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setSubmitting(true)
    try {
      const { error: submitError } = await elements.submit()
      if (submitError) { addToast(submitError.message || tr('errorToast'), 'error'); setSubmitting(false); return }

      // Create order
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          customerAddress: formData.customerAddress,
          shippingMethod: formData.shippingMethod,
          items: items.map((i) => ({ productId: i.productId, productName: i.name, priceNet: i.priceNet, vatRate: i.vatRate, quantity: i.quantity })),
        }),
      })
      if (!orderRes.ok) throw new Error((await orderRes.json()).error || 'Order failed')
      await orderRes.json()

      // Confirm payment
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        redirect: 'if_required',
        confirmParams: {
          return_url: window.location.origin + '/checkout',
          payment_method_data: {
            billing_details: {
              name: formData.customerName,
              email: formData.customerEmail,
            },
          },
        },
      })
      if (confirmError) { addToast(confirmError.message || tr('errorToast'), 'error'); setSubmitting(false); return }

      clearCart()
      onOrderSuccess()
      addToast(tr('successToast'), 'success')
    } catch (error: any) {
      console.error('Order error:', error)
      addToast(error.message || tr('errorToast'), 'error')
    } finally { setSubmitting(false) }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-4">
        {stripe && elements ? (
          <PaymentElement options={{ layout: 'tabs', fields: { billingDetails: { name: 'never', email: 'never' } } }} />
        ) : (
          <div className="flex items-center justify-center py-8 text-sm text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            {tr('stripeNotLoaded')}
          </div>
        )}
      </div>
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        type="submit"
        disabled={submitting || !stripe || !elements}
        className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl font-bold text-base hover:shadow-lg hover:shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {submitting ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> {tr('ordering')}</>
        ) : (
          <><Lock className="w-5 h-5" /> {tr('payNow')} — {formatPrice(totalWithShipping)}</>
        )}
      </motion.button>
    </form>
  )
}
