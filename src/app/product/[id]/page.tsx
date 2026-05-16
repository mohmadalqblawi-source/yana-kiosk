'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Product } from '@/types'
import { formatPrice, calculateVAT } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import { useUIStore } from '@/store/ui'
import { useLanguageStore } from '@/store/language'
import { ProductDetailSkeleton } from '@/components/SkeletonLoader'
import { ShoppingBag, ArrowLeft, Minus, Plus, Package, Tag } from 'lucide-react'

const inlineTranslations = {
  backToShop: { de: 'Zurück zum Shop', en: 'Back to Shop', fa: 'بازگشت به فروشگاه', ar: 'العودة إلى المتجر' },
  notFound: { de: 'Produkt nicht gefunden', en: 'Product not found', fa: 'محصول یافت نشد', ar: 'المنتج غير موجود' },
  onlyLeft: { de: 'Nur noch', en: 'Only', fa: 'فقط', ar: 'تبقى فقط' },
  soldOut: { de: 'Ausverkauft', en: 'Sold out', fa: 'تمام شد', ar: 'نفد من المخزون' },
  featured: { de: 'Empfohlen', en: 'Featured', fa: 'پیشنهاد ویژه', ar: 'مميز' },
  inclVat: { de: 'inkl. MwSt.', en: 'incl. VAT', fa: 'شامل مالیات', ar: 'شامل الضريبة' },
  inStock: { de: 'Auf Lager', en: 'In Stock', fa: 'موجود', ar: 'متوفر' },
  qtyLeft: { de: 'auf Lager', en: 'in stock', fa: 'موجود در انبار', ar: 'متبقي في المخزون' },
  notAvailable: { de: 'Derzeit nicht verfügbar', en: 'Currently unavailable', fa: 'در حال حاضر موجود نیست', ar: 'غير متاح حالياً' },
  addToCart: { de: 'In den Warenkorb', en: 'Add to Cart', fa: 'افزودن به سبد خرید', ar: 'أضف إلى السلة' },
  addedToast: { de: 'zum Warenkorb hinzugefügt', en: 'added to cart', fa: 'به سبد خرید اضافه شد', ar: 'تمت الإضافة إلى السلة' },
}

export default function ProductDetailPage() {
  const params = useParams()
  const { lang } = useLanguageStore()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((s) => s.addItem)
  const addToast = useUIStore((s) => s.addToast)

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

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${params.id}`)
        if (!res.ok) throw new Error('Product not found')
        const data = await res.json()
        setProduct(data)
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [params.id])

  const handleAddToCart = () => {
    if (!product) return
    addItem({
      productId: product.id,
      name: product.name,
      image: product.image,
      priceNet: product.priceNet,
      vatRate: product.vatRate,
      quantity,
    })
    addToast(`${product.name} (${quantity}x) ${tr('addedToast')}`, 'success')
  }

  if (loading) return <ProductDetailSkeleton />
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900">{tr('notFound')}</h2>
        <Link href="/shop" className="mt-4 inline-flex items-center gap-2 text-emerald-600 font-medium">
          <ArrowLeft className="w-4 h-4" /> {tr('backToShop')}
        </Link>
      </div>
    )
  }

  const { gross } = calculateVAT(product.priceNet, product.vatRate)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {tr('backToShop')}
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-50 to-yellow-50 border border-gray-100 group">
            <motion.img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.stock <= 5 && product.stock > 0 && (
                <span className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-semibold rounded-lg">
                  {tr('onlyLeft')} {product.stock}
                </span>
              )}
              {product.stock === 0 && (
                <span className="px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-lg">
                  {tr('soldOut')}
                </span>
              )}
              {product.featured && (
                <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-xs font-semibold rounded-lg">
                  {tr('featured')}
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col"
        >
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-emerald-50 text-yellow-700 text-xs font-semibold rounded-lg mb-3">
              {product.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{product.name}</h1>
          </div>

          {/* Price Section */}
          <div className="bg-gradient-to-br from-emerald-50 to-yellow-50 rounded-2xl p-6 mb-6 border border-emerald-100">
            <span className="text-4xl font-bold text-gray-900">{formatPrice(gross)}</span>
            <p className="text-sm text-gray-500 mt-1">{tr('inclVat')}</p>
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          {/* Stock info */}
          <div className="flex items-center gap-2 mb-6">
            <Package className="w-4 h-4 text-gray-400" />
            <span className={`text-sm font-medium ${
              product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {product.stock > 10
                ? tr('inStock')
                : product.stock > 0
                ? `${tr('onlyLeft')} ${product.stock} ${tr('qtyLeft')}`
                : tr('notAvailable')}
            </span>
          </div>

          {/* Quantity + Add to Cart */}
          <div className="flex items-center gap-4 mt-auto">
            <div className="flex items-center bg-gray-100 rounded-2xl p-1">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2.5 rounded-xl hover:bg-white transition-colors"
                disabled={product.stock === 0}
              >
                <Minus className="w-5 h-5 text-gray-600" />
              </motion.button>
              <span className="w-12 text-center font-semibold text-gray-900">{quantity}</span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="p-2.5 rounded-xl hover:bg-white transition-colors"
                disabled={product.stock === 0}
              >
                <Plus className="w-5 h-5 text-gray-600" />
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl font-semibold text-sm hover:shadow-lg hover:shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag className="w-5 h-5" />
              {tr('addToCart')}
            </motion.button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-6">
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
              <Tag className="w-3 h-3" />
              {product.category}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
