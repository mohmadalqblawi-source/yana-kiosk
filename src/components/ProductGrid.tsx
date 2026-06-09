'use client'

import { useMemo } from 'react'
import { Product } from '@/types'
import ProductCard from './ProductCard'
import { useLanguageStore } from '@/store/language'
import { buildCategoryLookup } from '@/lib/category-styles'
import { PackageOpen } from 'lucide-react'

const inlineTranslations = {
  noProducts: { de: 'Keine Produkte gefunden', en: 'No products found', fa: 'محصولی یافت نشد', ar: 'لم يتم العثور على منتجات' },
  tryAdjusting: { de: 'Versuchen Sie Ihre Suche oder Filter anzupassen', en: 'Try adjusting your search or filter criteria', fa: 'معیارهای جستجو یا فیلتر خود را تنظیم کنید', ar: 'حاول تعديل معايير البحث أو التصفية' },
}

interface ProductGridProps {
  products: Product[]
  categories?: { name: string; icon?: string | null; color?: string | null }[]
}

export default function ProductGrid({ products, categories = [] }: ProductGridProps) {
  const { lang } = useLanguageStore()
  const categoryLookup = useMemo(() => buildCategoryLookup(categories), [categories])

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

  if (products.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-100 to-yellow-100 flex items-center justify-center mb-4">
          <PackageOpen className="w-8 h-8 text-emerald-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{tr('noProducts')}</h3>
        <p className="text-sm text-gray-500">{tr('tryAdjusting')}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          categoryLookup={categoryLookup}
        />
      ))}
    </div>
  )
}
