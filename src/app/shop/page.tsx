'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Product } from '@/types'
import ProductGrid from '@/components/ProductGrid'
import { ProductCardSkeleton } from '@/components/SkeletonLoader'
import { useLanguageStore } from '@/store/language'
import { Search, X, UtensilsCrossed, Wine, Cigarette, Pill, Store, Snowflake, ShieldAlert } from 'lucide-react'

const inlineTranslations = {
  title: { de: 'Shop', en: 'Shop', fa: 'فروشگاه', ar: 'المتجر' },
  productsFound: { de: 'Produkte gefunden', en: 'products found', fa: 'محصول یافت شد', ar: 'منتج موجود' },
  searchPlaceholder: { de: 'Produkte suchen...', en: 'Search products...', fa: 'جستجوی محصولات...', ar: 'بحث عن المنتجات...' },
  products: { de: 'Produkte', en: 'products', fa: 'محصول', ar: 'منتج' },
  alle: { de: 'Alle', en: 'All', fa: 'همه', ar: 'الكل' },
  search: { de: 'Suche:', en: 'Search:', fa: 'جستجو:', ar: 'بحث:' },
  emptyTitle: { de: 'Keine Produkte gefunden', en: 'No products found', fa: 'محصولی یافت نشد', ar: 'لم يتم العثور على منتجات' },
  emptyDesc: { de: 'Versuchen Sie Ihre Suche oder Filter anzupassen', en: 'Try adjusting your search or filter criteria', fa: 'معیارهای جستجو یا فیلتر خود را تنظیم کنید', ar: 'حاول تعديل معايير البحث أو التصفية' },
  emptyShopTitle: { de: 'Der Shop wird bald er\u00f6ffnet!', en: 'The shop will open soon!', fa: 'فروشگاه به زودی افتتاح می\u200cشود!', ar: 'المتجر سيفتتح قريباً!' },
  emptyShopDesc: { de: 'Unser Sortiment ist in K\u00fcrze verf\u00fcgbar. Schau bald wieder vorbei!', en: 'Our range will be available soon. Check back soon!', fa: 'مجموعه ما به زودی در دسترس خواهد بود. به زودی دوباره سر بزنید!', ar: 'مجموعتنا ستكون متاحة قريباً. تفضل بزيارتنا قريباً!' },
  mainLabels: {
    lebensmittel: { de: 'Lebensmittel', en: 'Food', fa: 'مواد غذایی', ar: 'مواد غذائية' },
    getraenke: { de: 'Getränke', en: 'Drinks', fa: 'نوشیدنی', ar: 'مشروبات' },
    rauchen: { de: 'Rauchen', en: 'Smoking', fa: 'سیگار', ar: 'تدخين' },
    drogerie: { de: 'Drogerie', en: 'Drugstore', fa: 'دراگ\u200cاستور', ar: 'عناية شخصية' },
    shisha: { de: 'Shisha', en: 'Shisha', fa: 'قلیان', ar: 'شيشة' },
    vape: { de: 'Vape', en: 'Vape', fa: 'ویپ', ar: 'فيب' },
    eis: { de: 'Eis', en: 'Ice Cream', fa: 'بستنی', ar: 'آيس كريم' },
  },
  ageGate: {
    title: { de: 'Altersnachweis', en: 'Age verification', fa: 'تأیید سن', ar: 'التحقق من العمر' },
    body: {
      de: 'In diesem Bereich werden Produkte angezeigt, die nur an Personen ab 18 Jahren abgegeben werden dürfen (z. B. Tabak, Shisha, E-Zigaretten). Bitte bestätigen Sie Ihr Alter.',
      en: 'This section shows products that may only be sold to adults aged 18 or over (e.g. tobacco, shisha, e-cigarettes). Please confirm your age.',
      fa: 'این بخش شامل کالاهایی است که فقط به افراد ۱۸ سال به بالا فروخته می‌شود. لطفاً سن خود را تأیید کنید.',
      ar: 'يعرض هذا القسم منتجات لا يجوز بيعها إلا لمن بلغ ١٨ عاماً فأكثر. يرجى تأكيد عمرك.',
    },
    yes: { de: 'Ja, ich bin mindestens 18 Jahre alt', en: 'Yes, I am 18 or older', fa: 'بله، ۱۸ سال یا بیشتر دارم', ar: 'نعم، عمري ١٨ عاماً أو أكثر' },
    no: { de: 'Nein, ich bin unter 18', en: 'No, I am under 18', fa: 'خیر، زیر ۱۸ سال هستم', ar: 'لا، عمري أقل من ١٨' },
    hint: {
      de: 'Mit „Ja“ bestätigen Sie für diese Browsersitzung, dass Sie volljährig sind. Sie können den Bereich danach normal nutzen.',
      en: 'By choosing “Yes” you confirm for this browser session that you are of legal age. You can then browse this section as usual.',
      fa: 'با انتخاب «بله» برای این جلسه مرورگر تأیید می‌کنید که بالای ۱۸ سال هستید.',
      ar: 'باختيار «نعم» تؤكد لجلسة المتصفح هذه أنك بالغ. يمكنك بعدها تصفح القسم بشكل طبيعي.',
    },
  },
}

const mainCategories = [
  {
    id: 'lebensmittel',
    icon: UtensilsCrossed,
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    subCategories: [
      'Schokoladenriegel', 'Sweets & Snacks', 'Chips', 'Fruchtgummi & Lakritz',
      'Lebensmittel', 'Kaugummi', 'Kinderartikel'
    ],
  },
  {
    id: 'getraenke',
    icon: Wine,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    subCategories: [
      'Softdrinks', 'Energy Drinks', 'Eistee', 'Saft', 'Milch', 'Wasser',
      'Bier', 'Sekt', 'Wein', 'Spirituosen', 'Getränkekisten'
    ],
  },
  {
    id: 'rauchen',
    icon: Cigarette,
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    subCategories: [
      'Zigaretten', 'Vape / E-Zigaretten', 'Drehtabak & Zubehör',
      'Feuerzeuge & Zubehör', 'Papers & Tips', 'Rauchbedarf'
    ],
  },
  {
    id: 'drogerie',
    icon: Pill,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    subCategories: ['Drogerie'],
  },
  {
    id: 'shisha',
    icon: Cigarette,
    color: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    subCategories: ['Shisha / Wasserpfeife'],
  },
  {
    id: 'vape',
    icon: Cigarette,
    color: 'from-cyan-500 to-cyan-600',
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-700',
    subCategories: ['Vape / E-Zigaretten'],
  },
  {
    id: 'eis',
    icon: Snowflake,
    color: 'from-sky-400 to-sky-600',
    bgColor: 'bg-sky-50',
    textColor: 'text-sky-700',
    subCategories: ['Eis / Speiseeis', 'Eiscreme'],
  },
]

function getProductMainCategory(category: string): string {
  for (const mc of mainCategories) {
    if (mc.subCategories.includes(category)) return mc.id
  }
  return 'sonstiges'
}

/** Main shop tabs that require 18+ confirmation (Jugendschutz / nicotine & tobacco). */
const AGE_RESTRICTED_MAIN_IDS = new Set(['rauchen', 'shisha', 'vape'])
const AGE_CONSENT_SESSION_KEY = 'yanakiosk_over18_smoking'

function readAgeConsentSession(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return sessionStorage.getItem(AGE_CONSENT_SESSION_KEY) === '1'
  } catch {
    return false
  }
}

function writeAgeConsentSession() {
  try {
    sessionStorage.setItem(AGE_CONSENT_SESSION_KEY, '1')
  } catch {
    /* ignore */
  }
}

type PendingAgeGate =
  | { kind: 'main'; mainId: string }
  | { kind: 'category'; mainId: string; subCategory: string }

function ShopContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { lang } = useLanguageStore()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedMainCat, setSelectedMainCat] = useState('')
  const [ageGateOpen, setAgeGateOpen] = useState(false)
  const [pendingAgeGate, setPendingAgeGate] = useState<PendingAgeGate | null>(null)

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

  // Sync URL ?search= / ?category= (age-restricted categories need confirmation first).
  useEffect(() => {
    const search = searchParams.get('search') || ''
    const cat = searchParams.get('category') || ''
    setSearchQuery(search)

    if (!cat) return

    const mainId = getProductMainCategory(cat)
    if (!AGE_RESTRICTED_MAIN_IDS.has(mainId)) {
      setSelectedCategory(cat)
      setSelectedMainCat(mainId !== 'sonstiges' ? mainId : '')
      return
    }

    if (readAgeConsentSession()) {
      setSelectedCategory(cat)
      setSelectedMainCat(mainId)
      return
    }

    setPendingAgeGate({ kind: 'category', mainId, subCategory: cat })
    setAgeGateOpen(true)
    setSelectedCategory('')
    setSelectedMainCat('')

    const qp = new URLSearchParams()
    if (search) qp.set('search', search)
    const next = qp.toString() ? `/shop?${qp}` : '/shop'
    router.replace(next, { scroll: false })
  }, [searchParams, router])

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/products')
        if (!res.ok) throw new Error('Failed to fetch products')
        const data = await res.json()
        setProducts(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Error fetching data:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const subCategories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))]
    return cats.sort()
  }, [products])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = !selectedCategory || product.category === selectedCategory
      const matchesMainCat = !selectedMainCat || getProductMainCategory(product.category) === selectedMainCat

      return matchesSearch && matchesCategory && matchesMainCat
    })
  }, [products, searchQuery, selectedCategory, selectedMainCat])

  const activeFilters = [searchQuery, selectedCategory, selectedMainCat].filter(Boolean).length

  const handleMainCatClick = (id: string) => {
    if (selectedMainCat === id) {
      setSelectedMainCat('')
      setSelectedCategory('')
      return
    }
    if (AGE_RESTRICTED_MAIN_IDS.has(id) && !readAgeConsentSession()) {
      setPendingAgeGate({ kind: 'main', mainId: id })
      setAgeGateOpen(true)
      return
    }
    setSelectedMainCat(id)
    setSelectedCategory('')
  }

  const confirmAgeGate = () => {
    writeAgeConsentSession()
    setAgeGateOpen(false)
    const p = pendingAgeGate
    setPendingAgeGate(null)
    if (!p) return
    if (p.kind === 'main') {
      setSelectedMainCat(p.mainId)
      setSelectedCategory('')
    } else {
      setSelectedMainCat(p.mainId)
      setSelectedCategory(p.subCategory)
    }
  }

  const rejectAgeGate = () => {
    setAgeGateOpen(false)
    const wasUrl = pendingAgeGate?.kind === 'category'
    setPendingAgeGate(null)
    if (wasUrl) {
      const s = searchParams.get('search')
      const qp = new URLSearchParams()
      if (s) qp.set('search', s)
      router.replace(qp.toString() ? `/shop?${qp}` : '/shop', { scroll: false })
    }
  }

  const currentMainCat = mainCategories.find(mc => mc.id === selectedMainCat)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AnimatePresence>
        {ageGateOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
              onClick={rejectAgeGate}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="age-gate-title"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              className="fixed left-4 right-4 top-[20%] sm:top-[25%] z-[101] mx-auto max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl shadow-gray-900/20"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center shrink-0 border border-red-100">
                  <ShieldAlert className="w-6 h-6 text-red-600" aria-hidden />
                </div>
                <div>
                  <h2 id="age-gate-title" className="text-lg font-bold text-gray-900">
                    {tr('ageGate.title')}
                  </h2>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">{tr('ageGate.body')}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-5 leading-relaxed">{tr('ageGate.hint')}</p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={confirmAgeGate}
                  className="flex-1 py-3.5 rounded-2xl font-semibold text-sm text-white bg-gradient-to-r from-red-600 to-red-700 hover:shadow-lg hover:shadow-red-600/25 transition-all"
                >
                  {tr('ageGate.yes')}
                </button>
                <button
                  type="button"
                  onClick={rejectAgeGate}
                  className="flex-1 py-3.5 rounded-2xl font-semibold text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  {tr('ageGate.no')}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{tr('title')}</h1>
        <p className="text-gray-500 mt-2">
          {filteredProducts.length} {tr('productsFound')}
        </p>
      </motion.div>

      {/* Main Category Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-6"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {mainCategories.map((mc) => {
            const Icon = mc.icon
            const isActive = selectedMainCat === mc.id
            return (
              <button
                key={mc.id}
                onClick={() => handleMainCatClick(mc.id)}
                className={`relative flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all border-2 ${
                  isActive
                    ? `bg-gradient-to-br ${mc.color} text-white border-transparent shadow-lg`
                    : `bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-sm`
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  isActive ? 'bg-white/20' : `bg-gradient-to-br ${mc.color} bg-opacity-10`
                }`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-white'}`} />
                </div>
                <div className="text-left">
                  <p className={`text-sm font-bold ${isActive ? 'text-white' : 'text-gray-900'}`}>
                    {tr(`mainLabels.${mc.id}`)}
                  </p>
                  <p className={`text-[10px] ${isActive ? 'text-white/70' : 'text-gray-400'}`}>
                    {products.filter(p => getProductMainCategory(p.category) === mc.id).length} {tr('products')}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={tr('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Sub-category chips */}
        <AnimatePresence>
          {selectedMainCat && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                    !selectedCategory
                      ? `bg-gradient-to-r ${currentMainCat?.color || 'from-gray-500 to-gray-600'} text-white shadow-sm`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tr('alle')} {tr(`mainLabels.${selectedMainCat}`)}
                </button>
                {subCategories
                  .filter(cat => getProductMainCategory(cat) === selectedMainCat)
                  .map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat === selectedCategory ? '' : cat)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                        selectedCategory === cat
                          ? `bg-gradient-to-r ${currentMainCat?.color || 'from-gray-500 to-gray-600'} text-white shadow-sm`
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active filter badges */}
        {activeFilters > 0 && !selectedMainCat && (
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200">
                {tr('search')} {searchQuery}
                <button onClick={() => setSearchQuery('')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200">
                {selectedCategory}
                <button onClick={() => setSelectedCategory('')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </motion.div>

      {/* Products */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredProducts.length === 0 && products.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{tr('emptyTitle')}</h3>
          <p className="text-sm text-gray-500">{tr('emptyDesc')}</p>
        </motion.div>
      ) : products.length === 0 && !loading ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-100 to-yellow-100 flex items-center justify-center mx-auto mb-6">
            <Store className="w-12 h-12 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{tr('emptyShopTitle')}</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            {tr('emptyShopDesc')}
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <ProductGrid products={filteredProducts} />
        </motion.div>
      )}
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  )
}
