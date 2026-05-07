'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem } from '@/types'
import { calculateVAT, roundTo } from '@/lib/utils'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  setOpen: (open: boolean) => void
  getItemCount: () => number
  getTotalNet: () => number
  getTotalVat: () => number
  getTotalGross: () => number
  getVatBreakdown: () => { vat7: number; vat19: number }
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            }
          }
          return {
            items: [
              ...state.items,
              { ...item, id: `${item.productId}-${Date.now()}` },
            ],
          }
        })
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }))
      },

      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items
            .map((i) =>
              i.productId === productId ? { ...i, quantity: Math.max(1, quantity) } : i
            )
            .filter((i) => i.quantity > 0),
        }))
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      setOpen: (open) => set({ isOpen: open }),

      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      
      getTotalNet: () => roundTo(get().items.reduce((sum, i) => sum + i.priceNet * i.quantity, 0)),
      
      getTotalVat: () => roundTo(
        get().items.reduce((sum, i) => {
          const { vat } = calculateVAT(i.priceNet, i.vatRate)
          return sum + vat * i.quantity
        }, 0)
      ),

      getTotalGross: () => roundTo(
        get().items.reduce((sum, i) => {
          const { gross } = calculateVAT(i.priceNet, i.vatRate)
          return sum + gross * i.quantity
        }, 0)
      ),

      getVatBreakdown: () => {
        const items = get().items
        const vat7 = roundTo(
          items
            .filter((i) => i.vatRate === 7)
            .reduce((sum, i) => {
              const { vat } = calculateVAT(i.priceNet, 7)
              return sum + vat * i.quantity
            }, 0)
        )
        const vat19 = roundTo(
          items
            .filter((i) => i.vatRate === 19)
            .reduce((sum, i) => {
              const { vat } = calculateVAT(i.priceNet, 19)
              return sum + vat * i.quantity
            }, 0)
        )
        return { vat7, vat19 }
      },
    }),
    {
      name: 'yana-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
)
