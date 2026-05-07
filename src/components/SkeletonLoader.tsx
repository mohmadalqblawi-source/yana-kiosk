'use client'

import { motion } from 'framer-motion'

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 overflow-hidden">
      <div className="aspect-square bg-gradient-to-br from-emerald-50 to-yellow-50 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
        <div className="h-5 w-3/4 bg-gray-100 rounded animate-pulse" />
        <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
        <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 w-20 bg-gray-100 rounded animate-pulse" />
          <div className="h-9 w-20 bg-gray-100 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="aspect-square rounded-2xl bg-gradient-to-br from-emerald-50 to-yellow-50 animate-pulse" />
        <div className="space-y-6">
          <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
          <div className="h-8 w-3/4 bg-gray-100 rounded animate-pulse" />
          <div className="h-6 w-24 bg-gray-100 rounded animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
          </div>
          <div className="h-12 w-40 bg-gray-100 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="space-y-8 p-8">
      <div className="h-10 w-64 bg-gray-100 rounded animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
