'use client'

import { create } from 'zustand'
import { AdminUser } from '@/types'

interface AdminStore {
  user: AdminUser | null
  token: string | null
  isLoading: boolean
  setUser: (user: AdminUser | null, token: string | null) => void
  logout: () => void
  setLoading: (loading: boolean) => void
}

export const useAdminStore = create<AdminStore>()((set) => ({
  user: null,
  token: null,
  isLoading: true,

  setUser: (user, token) => {
    set({ user, token, isLoading: false })
    if (token) {
      localStorage.setItem('admin-token', token)
    } else {
      localStorage.removeItem('admin-token')
    }
  },

  logout: () => {
    set({ user: null, token: null, isLoading: false })
    localStorage.removeItem('admin-token')
  },

  setLoading: (loading) => set({ isLoading: loading }),
}))
