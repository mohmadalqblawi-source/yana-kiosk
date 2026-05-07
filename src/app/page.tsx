'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Product } from '@/types'
import ProductCard from '@/components/ProductCard'
import { ProductCardSkeleton } from '@/components/SkeletonLoader'
import { useLanguageStore } from '@/store/language'
import { ArrowRight, Store, Shield, Truck, Sparkles } from 'lucide-react'

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const { lang } = useLanguageStore()

  useEffect(() => {
    async function fetchData() {
      try {
        const [featuredRes, allRes] = await Promise.all([
          fetch('/api/products?featured=true'),
          fetch('/api/products'),
        ])
        const featured = await featuredRes.json()
        const all = await allRes.json()
        setFeaturedProducts(Array.isArray(featured) ? featured : [])
        setAllProducts(Array.isArray(all) ? all : [])
      } catch (error) {
        console.error('Error fetching products:', error)
        setFeaturedProducts([])
        setAllProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const displayProducts = featuredProducts.length > 0 ? featuredProducts : allProducts.slice(0, 8)

  const t = (key: string) => {
    const keys = key.split('.')
    let obj: any = {
      home: {
        heroBadge: { de: 'Ihr Kiosk in Barsbüttel seit 2024', en: 'Your kiosk in Barsbüttel since 2024', fa: 'کیوسک شما در بارسبوتل از ۲۰۲۴', ar: 'كشكك في بارسبوتل منذ ٢٠٢٤' },
        welcome: { de: 'Willkommen bei', en: 'Welcome to', fa: 'خوش آمدید به', ar: 'مرحباً بكم في' },
        heroDesc: { de: 'Ihr zuverlässiger Nahversorger in Barsbüttel. Qualitätsprodukte, faire Preise und herzlicher Service – direkt um die Ecke.', en: 'Your reliable local supplier in Barsbüttel. Quality products, fair prices and friendly service – right around the corner.', fa: 'تأمین‌کننده محلی قابل اعتماد شما در بارسبوتل. محصولات با کیفیت، قیمت‌های منصفانه و خدمات صمیمانه - درست در نزدیکی شما.', ar: 'موردك المحلي الموثوق في بارسبوتل. منتجات عالية الجودة، أسعار عادلة وخدمة ودودة - حول الزاوية.' },
        shopBtn: { de: 'Shop entdecken', en: 'Discover Shop', fa: 'کشف فروشگاه', ar: 'اكتشف المتجر' },
        drinksBtn: { de: 'Getränke ansehen', en: 'View Drinks', fa: 'مشاهده نوشیدنی‌ها', ar: 'عرض المشروبات' },
        ourProducts: { de: 'Unsere Produkte', en: 'Our Products', fa: 'محصولات ما', ar: 'منتجاتنا' },
        ourProductsDesc: { de: 'Entdecken Sie unsere handverlesene Auswahl', en: 'Discover our hand-picked selection', fa: 'انتخاب دست‌چین شده ما را کشف کنید', ar: 'اكتشف مجموعتنا المختارة بعناية' },
        viewAll: { de: 'Alle anzeigen', en: 'View All', fa: 'مشاهده همه', ar: 'عرض الكل' },
        whyTitle: { de: 'Warum YaNa Kiosk?', en: 'Why YaNa Kiosk?', fa: 'چرا YaNa Kiosk؟', ar: 'لماذا YaNa Kiosk؟' },
        whyDesc: { de: 'Das macht uns zu Ihrem Lieblingskiosk', en: 'That makes us your favorite kiosk', fa: 'این چیزی است که ما را به کیوسک مورد علاقه شما تبدیل می‌کند', ar: 'هذا ما يجعلنا كشكك المفضل' },
        feature1Title: { de: 'Große Auswahl', en: 'Great Selection', fa: 'انتخاب عالی', ar: 'تشكيلة رائعة' },
        feature1Desc: { de: 'Über 200 Produkte von Lebensmitteln bis Haushaltswaren – alles was Sie täglich brauchen.', en: 'Over 200 products from food to household items – everything you need daily.', fa: 'بیش از ۲۰۰ محصول از مواد غذایی تا لوازم خانگی - همه چیزهایی که روزانه نیاز دارید.', ar: 'أكثر من ٢٠٠ منتج من المواد الغذائية إلى الأدوات المنزلية - كل ما تحتاجه يومياً.' },
        feature2Title: { de: 'Faire Preise', en: 'Fair Prices', fa: 'قیمت‌های منصفانه', ar: 'أسعار عادلة' },
        feature2Desc: { de: 'Transparente Preisgestaltung mit korrektem Ausweis der gesetzlichen Mehrwertsteuer.', en: 'Transparent pricing with correct VAT identification.', fa: 'قیمت‌گذاری شفاف با شناسایی صحیح مالیات بر ارزش افزوده.', ar: 'تسعير شفاف مع تحديد صحيح لضريبة القيمة المضافة.' },
        feature3Title: { de: 'Schnell & Zuverlässig', en: 'Fast & Reliable', fa: 'سریع و قابل اعتماد', ar: 'سريع وموثوق' },
        feature3Desc: { de: 'Täglich geöffnet von 7 bis 22 Uhr. Ihr Nahversorger, dem Sie vertrauen können.', en: 'Open daily from 7 AM to 10 PM. Your local supplier you can trust.', fa: 'باز روزانه از ۷ صبح تا ۱۰ شب. تأمین‌کننده محلی شما که می‌توانید به آن اعتماد کنید.', ar: 'مفتوح يومياً من ٧ صباحاً إلى ١٠ مساءً. موردك المحلي الذي يمكنك الوثوق به.' },
        ctaTitle: { de: 'Bereit zu bestellen?', en: 'Ready to order?', fa: 'آماده سفارش هستید؟', ar: 'مستعد للطلب؟' },
        ctaDesc: { de: 'Durchstöbern Sie unser Sortiment und legen Sie los. Wir freuen uns auf Sie!', en: 'Browse our range and get started. We look forward to seeing you!', fa: 'مجموعه ما را مرور کنید و شروع کنید. منتظر شما هستیم!', ar: 'تصفح مجموعتنا وابدأ. نحن نتطلع إلى رؤيتك!' },
        ctaBtn: { de: 'Jetzt shoppen', en: 'Shop Now', fa: 'همین حالا خرید کنید', ar: 'تسوق الآن' },
      },
    }
    for (const k of keys) {
      if (obj && typeof obj === 'object' && k in obj) obj = obj[k]
      else return key
    }
    if (obj && typeof obj === 'object' && lang in obj) return obj[lang]
    return key
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-yellow-50 to-white" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-200/30 rounded-full blur-3xl" />
        
        <div className="absolute top-1/4 right-1/4 w-px h-32 bg-gradient-to-b from-emerald-300 to-transparent hidden md:block" />
        <div className="absolute bottom-1/3 left-1/3 w-px h-24 bg-gradient-to-t from-yellow-300 to-transparent hidden md:block" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100/80 backdrop-blur-sm rounded-full text-yellow-700 text-sm font-medium mb-6 border border-emerald-200/50"
            >
              <Sparkles className="w-4 h-4" />
              {t('home.heroBadge')}
            </motion.div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
              <span className="text-gray-900">{t('home.welcome')}</span>
              <br />
              <span className="bg-gradient-to-r from-emerald-600 via-yellow-500 to-emerald-600 bg-clip-text text-transparent">
                YaNa Kiosk
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {t('home.heroDesc')}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/shop">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl font-semibold text-lg shadow-xl shadow-emerald-600/20 hover:shadow-2xl hover:shadow-emerald-600/30 transition-all flex items-center gap-2"
                >
                  {t('home.shopBtn')}
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link href="/shop?category=Drinks">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 rounded-2xl font-semibold text-lg hover:bg-white hover:shadow-lg transition-all"
                >
                  {t('home.drinksBtn')}
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-10"
          >
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{t('home.ourProducts')}</h2>
              <p className="text-gray-500 mt-2">{t('home.ourProductsDesc')}</p>
            </div>
            <Link
              href="/shop"
              className="hidden sm:flex items-center gap-2 text-emerald-600 hover:text-yellow-700 font-medium transition-colors"
            >
              {t('home.viewAll')} <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayProducts.slice(0, 8).map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-emerald-600 font-medium"
            >
              {t('home.viewAll')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{t('home.whyTitle')}</h2>
            <p className="text-gray-500 mt-2">{t('home.whyDesc')}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Store,
                title: t('home.feature1Title'),
                description: t('home.feature1Desc'),
                gradient: 'from-emerald-500 to-yellow-500',
              },
              {
                icon: Shield,
                title: t('home.feature2Title'),
                description: t('home.feature2Desc'),
                gradient: 'from-yellow-500 to-emerald-600',
              },
              {
                icon: Truck,
                title: t('home.feature3Title'),
                description: t('home.feature3Desc'),
                gradient: 'from-emerald-700 to-emerald-800',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 rounded-2xl bg-white border border-gray-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-yellow-500 to-emerald-600 p-10 sm:p-16 text-center"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {t('home.ctaTitle')}
              </h2>
              <p className="text-yellow-100 text-lg max-w-xl mx-auto mb-8">
                {t('home.ctaDesc')}
              </p>
              <Link href="/shop">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-10 py-4 bg-white text-emerald-600 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
                >
                  {t('home.ctaBtn')}
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
