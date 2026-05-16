export interface Product {
  id: string
  name: string
  description: string
  priceNet: number
  vatRate: number
  category: string
  image: string
  stock: number
  featured: boolean
  createdAt: string
  updatedAt: string
}

export interface CartItem {
  id: string
  productId: string
  name: string
  image: string
  priceNet: number
  vatRate: number
  quantity: number
}

export interface Category {
  id: string
  name: string
}

export interface StoreSettings {
  name: string
  address: string
  phone: string
  email: string
  isOpen: boolean
}

export interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string | null
  customerAddress: string | null
  shippingMethod: string
  shippingCost: number
  items: OrderItem[]
  totalNet: number
  totalVat: number
  totalGross: number
  status: string
  createdAt: string
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  priceNet: number
  vatRate: number
  quantity: number
}

export interface AdminUser {
  id: string
  email: string
  name: string
}
