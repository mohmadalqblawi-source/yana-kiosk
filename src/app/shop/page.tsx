'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Product } from '@/types'
import ProductGrid from '@/components/ProductGrid'
import { ProductCardSkeleton } from '@/components/SkeletonLoader'
import { useLanguageStore } from '@/store/language'
import { isAgeRestrictedCategory } from '@/lib/categories'
import { Search, X, Store, ShieldAlert, Tag } from 'lucide-react'

interface ShopCategory {
  id: string
  name: string
}

const inlineTranslations = {
  title: { de: 'Shop', en: 'Shop', fa: 'فروشگاه', ar: 'المتجر' },
  productsFound: { de: 'Produkte gefunden', en: 'products found', fa: 'محصول یافت شد', ar: 'منتج موجود' },
  searchPlaceholder: { de: 'Produkte suchen...', en: 'Search products...', fa: 'جستجوی محصولات...', ar: 'بحث عن المنتجات...' },
  products: { de: 'Produkte', en: 'products', fa: 'محصول', ar: 'منتج' },
  alle: { de: 'Alle', en: 'All', fa: 'همه', ar: 'الكل' },
  categories: { de: 'Kategorien', en: 'Categories', fa: 'دسته‌بندی‌ها', ar: 'الفئات' },
  search: { de: 'Suche:', en: 'Search:', fa: 'جستجو:', ar: 'بحث:' },
  emptyTitle: { de: 'Keine Produkte gefunden', en: 'No products found', fa: 'محصولی یافت نشد', ar: 'لم يتم العثور على منتجات' },
  emptyDesc: { de: 'Versuchen Sie Ihre Suche oder Filter anzupassen', en: 'Try adjusting your search or filter criteria', fa: 'معیارهای جستجو یا فیلتر خود را تنظیم کنید', ar: 'حاول تعديل معايير البحث أو التصفية' },
  emptyShopTitle: { de: 'Der Shop wird bald eröffnet!', en: 'The shop will open soon!', fa: 'فروشگاه به زودی افتتاح می‌شود!', ar: 'المتجر سيفتتح قريباً!' },
  emptyShopDesc: { de: 'Unser Sortiment ist in Kürze verfügbar. Schau bald wieder vorbei!', en: 'Our range will be available soon. Check back soon!', fa: 'مجموعه ما به زودی در دسترس خواهد بود. به زودی دوباره سر بزنید!', ar: 'مجموعتنا ستكون متاحة قريباً. تفضل بزيارتنا قريباً!' },
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
      de: 'Mit „Ja“ bestätigen Sie für diese Browsersitzung, dass Sie volljährig sind.',
      en: 'By choosing “Yes” you confirm for this browser session that you are of legal age.',
      fa: 'با انتخاب «بله» برای این جلسه مرورگر تأیید می‌کنید که بالای ۱۸ سال هستید.',
      ar: 'باختيار «نعم» تؤكد لجلسة المتصفح هذه أنك بالغ.',
    },
  },
}

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

function ShopContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { lang } = useLanguageStore()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<ShopCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [ageGateOpen, setAgeGateOpen] = useState(false)
  const [pendingCategory, setPendingCategory] = useState<string | null>(null)

  const tr = (key: string) => {
    const keys = key.split('.')
    let obj: Record<string, unknown> = inlineTranslations
    for (const k of keys) {
      if (obj && typeof obj === 'object' && k in obj) obj = obj[k] as Record<string, unknown>
      else return key
    }
    if (obj && typeof obj === 'object' && lang in obj) return obj[lang] as string
    return key
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories'),
        ])
        if (prodRes.ok) {
          const data = await prodRes.json()
          setProducts(Array.isArray(data) ? data : [])
        }
        if (catRes.ok) {
          const data = await catRes.json()
          setCategories(Array.isArray(data) ? data : [])
        }
      } catch (error) {
        console.error('Error fetching shop data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // URL ?category= / ?search=
  useEffect(() => {
    const search = searchParams.get('search') || ''
    const cat = searchParams.get('category') || ''
    setSearchQuery(search)
    if (!cat) return

    if (isAgeRestrictedCategory(cat) && !readAgeConsentSession()) {
      setPendingCategory(cat)
      setAgeGateOpen(true)
      setSelectedCategory('')
      const qp = new URLSearchParams()
      if (search) qp.set('search', search)
      router.replace(qp.toString() ? `/shop?${qp}` : '/shop', { scroll: false })
      return
    }
    setSelectedCategory(cat)
  }, [searchParams, router])

  const categoryProductCount = (name: string) =>
    products.filter((p) => p.category === name).length

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = !selectedCategory || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [products, searchQuery, selectedCategory])

  const selectCategory = (name: string) => {
    if (!name) {
      setSelectedCategory('')
      return
    }
    if (selectedCategory === name) {
      setSelectedCategory('')
      return
    }
    if (isAgeRestrictedCategory(name) && !readAgeConsentSession()) {
      setPendingCategory(name)
      setAgeGateOpen(true)
      return
    }
    setSelectedCategory(name)
  }

  const confirmAgeGate = () => {
    writeAgeConsentSession()
    setAgeGateOpen(false)
    if (pendingCategory) {
      setSelectedCategory(pendingCategory)
      setPendingCategory(null)
    }
  }

  const rejectAgeGate = () => {
    setAgeGateOpen(false)
    const wasUrl = !!pendingCategory
    setPendingCategory(null)
    if (wasUrl) {
      const s = searchParams.get('search')
      const qp = new URLSearchParams()
      if (s) qp.set('search', s)
      router.replace(qp.toString() ? `/shop?${qp}` : '/shop', { scroll: false })
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
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
              className="fixed left-3 right-3 top-[15%] sm:top-[20%] z-[101] mx-auto max-w-md rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xl"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-red-50 flex items-center justify-center shrink-0 border border-red-100">
                  <ShieldAlert className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h2 id="age-gate-title" className="text-base sm:text-lg font-bold text-gray-900">
                    {tr('ageGate.title')}
                  </h2>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">{tr('ageGate.body')}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-4">{tr('ageGate.hint')}</p>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={confirmAgeGate}
                  className="w-full py-3.5 rounded-2xl font-semibold text-sm text-white bg-gradient-to-r from-red-600 to-red-700"
                >
                  {tr('ageGate.yes')}
                </button>
                <button
                  type="button"
                  onClick={rejectAgeGate}
                  className="w-full py-3.5 rounded-2xl font-semibold text-sm text-gray-700 bg-gray-100"
                >
                  {tr('ageGate.no')}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-5 sm:mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">{tr('title')}</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">
          {filteredProducts.length} {tr('productsFound')}
        </p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-4 sm:mb-6"
      >
        <div className="relative">
          <Search className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <input
            type="search"
            placeholder={tr('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 sm:pl-12 pr-10 py-3 sm:py-3.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Dynamic categories — horizontal scroll on mobile */}
      {!loading && categories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mb-5 sm:mb-6"
        >
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" />
            {tr('categories')}
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-3 px-3 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-hide">
            <button
              type="button"
              onClick={() => selectCategory('')}
              className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                !selectedCategory
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-emerald-200'
              }`}
            >
              {tr('alle')}
            </button>
            {categories.map((cat) => {
              const count = categoryProductCount(cat.name)
              const active = selectedCategory === cat.name
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => selectCategory(cat.name)}
                  className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-emerald-200'
                  }`}
                >
                  {cat.name}
                  <span className={`ml-1.5 text-xs font-normal ${active ? 'text-white/80' : 'text-gray-400'}`}>
                    ({count})
                  </span>
                </button>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Active filters */}
      {(searchQuery || selectedCategory) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200">
              {tr('search')} {searchQuery}
              <button type="button" onClick={() => setSearchQuery('')}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedCategory && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200">
              {selectedCategory}
              <button type="button" onClick={() => setSelectedCategory('')}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Products */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredProducts.length === 0 && products.length > 0 ? (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16 sm:py-20">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Search className="w-7 h-7 text-gray-300" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">{tr('emptyTitle')}</h3>
          <p className="text-sm text-gray-500 px-4">{tr('emptyDesc')}</p>
        </motion.div>
      ) : products.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16 sm:py-20">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-100 to-yellow-100 flex items-center justify-center mx-auto mb-5">
            <Store className="w-10 h-10 text-emerald-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{tr('emptyShopTitle')}</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto px-4">{tr('emptyShopDesc')}</p>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <ProductGrid products={filteredProducts} />
        </motion.div>
      )}
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-3 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  )
}
