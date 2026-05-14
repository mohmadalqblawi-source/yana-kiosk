'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useCartStore } from '@/store/cart'
import { useUIStore } from '@/store/ui'
import { useLanguageStore } from '@/store/language'
import { formatPrice, calculateVAT } from '@/lib/utils'
import { ArrowLeft, Check, CreditCard, ShoppingBag, Loader2, Truck, Lock } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

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
}

function CheckoutForm({
  formData,
  onOrderSuccess,
  submitting,
  setSubmitting,
  totalWithShipping,
  clientSecret,
}: {
  formData: { customerName: string; customerEmail: string; customerPhone: string; shippingMethod: 'pickup' | 'dhl' | 'hermes' }
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
      // 1) Submit payment
      const { error: submitError } = await elements.submit()
      if (submitError) {
        addToast(submitError.message || tr('errorToast'), 'error')
        setSubmitting(false)
        return
      }

      // 2) Create order in backend
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          shippingMethod: formData.shippingMethod,
          items: items.map((item) => ({
            productId: item.productId,
            productName: item.name,
            priceNet: item.priceNet,
            vatRate: item.vatRate,
            quantity: item.quantity,
          })),
        }),
      })

      if (!orderRes.ok) {
        const errData = await orderRes.json()
        throw new Error(errData.error || 'Failed to create order')
      }

      const order = await orderRes.json()

      // 3) Confirm payment with Stripe
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
              phone: formData.customerPhone || undefined,
            },
          },
        },
      })

      if (confirmError) {
        addToast(confirmError.message || tr('errorToast'), 'error')
        setSubmitting(false)
        return
      }

      // 4) Success
      clearCart()
      onOrderSuccess()
      addToast(tr('successToast'), 'success')
    } catch (error) {
      console.error('Order error:', error)
      addToast(tr('errorToast'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 space-y-6">
      {/* Payment Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-4">
          <Lock className="w-5 h-5 text-emerald-600" />
          {tr('cardPayment')}
        </h2>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          {stripe && elements ? (
            <PaymentElement
              options={{
                layout: 'tabs',
                fields: {
                  billingDetails: {
                    name: 'never',
                    email: 'never',
                    phone: 'never',
                  },
                },
              }}
            />
          ) : (
            <div className="flex items-center justify-center py-8 text-sm text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              {tr('stripeNotLoaded')}
            </div>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
          <Lock className="w-3 h-3" /> {tr('securePayment')}
        </p>
      </div>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        type="submit"
        disabled={submitting || !stripe || !elements}
        className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl font-bold text-base hover:shadow-lg hover:shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {submitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {tr('ordering')}
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            {tr('payNow')} — {formatPrice(totalWithShipping)}
          </>
        )}
      </motion.button>
    </form>
  )
}

export default function CheckoutPage() {
  const { items, getTotalGross, getTotalNet, getTotalVat, getVatBreakdown, clearCart, getItemCount } = useCartStore()
  const addToast = useUIStore((s) => s.addToast)
  const { lang } = useLanguageStore()

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
    shippingMethod: 'pickup' as 'pickup' | 'dhl' | 'hermes',
  })

  const shippingCost = formData.shippingMethod === 'pickup' ? 0 : 4.90
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  const { vat7, vat19 } = getVatBreakdown()
  const totalNet = getTotalNet()
  const totalVat = getTotalVat()
  const totalGross = getTotalGross()
  const count = getItemCount()

  // Create payment intent when customer data + shipping is ready
  const createPaymentIntent = useCallback(async () => {
    if (!formData.customerName || !formData.customerEmail || items.length === 0) return
    try {
      const total = totalGross + shippingCost
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total }),
      })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setClientSecret(data.clientSecret)
    } catch (err) {
      console.error('Payment intent error:', err)
    }
  }, [formData.customerName, formData.customerEmail, totalGross, shippingCost, items.length])

  useEffect(() => {
    if (formData.customerName && formData.customerEmail && items.length > 0 && !clientSecret) {
      createPaymentIntent()
    }
  }, [formData.customerName, formData.customerEmail, items.length, clientSecret, createPaymentIntent])

  const handleOrderSuccess = () => {
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
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
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
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

  const stripeOptions: StripeElementsOptions = {
    clientSecret: clientSecret || '',
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#059669',
        colorBackground: '#ffffff',
        colorText: '#111827',
        colorDanger: '#dc2626',
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        borderRadius: '12px',
      },
    },
  }

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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Pickup */}
                  <button
                    type="button"
                    onClick={() => { setFormData({ ...formData, shippingMethod: 'pickup' }); setClientSecret(null) }}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                      formData.shippingMethod === 'pickup'
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 bg-white hover:border-emerald-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        formData.shippingMethod === 'pickup' ? 'bg-emerald-500' : 'bg-gray-100'
                      }`}>
                        <ShoppingBag className={`w-4 h-4 ${
                          formData.shippingMethod === 'pickup' ? 'text-white' : 'text-gray-400'
                        }`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{tr('pickup')}</p>
                        <p className="text-xs text-gray-500">{tr('free')}</p>
                      </div>
                    </div>
                  </button>

                  {/* DHL */}
                  <button
                    type="button"
                    onClick={() => { setFormData({ ...formData, shippingMethod: 'dhl' }); setClientSecret(null) }}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                      formData.shippingMethod === 'dhl'
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 bg-white hover:border-emerald-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        formData.shippingMethod === 'dhl' ? 'bg-emerald-500' : 'bg-gray-100'
                      }`}>
                        <Truck className={`w-4 h-4 ${
                          formData.shippingMethod === 'dhl' ? 'text-white' : 'text-gray-400'
                        }`} />
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
                      formData.shippingMethod === 'hermes'
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 bg-white hover:border-emerald-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        formData.shippingMethod === 'hermes' ? 'bg-emerald-500' : 'bg-gray-100'
                      }`}>
                        <Truck className={`w-4 h-4 ${
                          formData.shippingMethod === 'hermes' ? 'text-white' : 'text-gray-400'
                        }`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{tr('hermes')}</p>
                        <p className="text-xs text-gray-500">4,90 €</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Stripe Payment */}
            {clientSecret ? (
              <Elements stripe={stripePromise} options={stripeOptions}>
                <CheckoutForm
                  formData={formData}
                  onOrderSuccess={handleOrderSuccess}
                  submitting={submitting}
                  setSubmitting={setSubmitting}
                  totalWithShipping={totalWithShipping}
                  clientSecret={clientSecret}
                />
              </Elements>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
                <div className="flex items-center justify-center py-8 text-sm text-gray-500">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  {tr('stripeNotLoaded')}
                </div>
              </div>
            )}
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
                      <span className="text-sm font-semibold text-gray-900">
                        {formatPrice(gross * item.quantity)}
                      </span>
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
                  <span>{shippingCost === 0 ? (
                    <span className="text-emerald-600 font-medium">{tr('free')}</span>
                  ) : (
                    formatPrice(shippingCost)
                  )}</span>
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
