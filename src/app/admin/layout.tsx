'use client'

import { useEffect, useState, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useAdminStore } from '@/store/admin'
import {
  Package,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  ListOrdered,
  Store,
  ChevronDown,
  Settings,
  Bell,
  Search,
  Users,
} from 'lucide-react'

const adminLinks = [
  { href: '/admin', label: 'Übersicht', icon: LayoutDashboard, desc: 'Dashboard & Statistiken' },
  { href: '/admin?tab=products', label: 'Produkte', icon: Package, desc: 'Produkte verwalten' },
  { href: '/admin/orders', label: 'Bestellungen', icon: ListOrdered, desc: 'Eingehende Bestellungen' },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, setUser, logout, isLoading } = useAdminStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (isLoginPage) {
      useAdminStore.getState().setLoading(false)
      return
    }
    const savedToken = localStorage.getItem('admin-token')
    if (savedToken) {
      setUser(
        { id: '', email: '', name: 'Admin' },
        savedToken
      )
    } else {
      const { setLoading } = useAdminStore.getState()
      setLoading(false)
      router.replace('/admin/login')
    }
  }, [router, setUser, isLoginPage])

  if (isLoginPage) {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-yellow-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
            <Store className="w-5 h-5 text-white" />
          </div>
          <div className="animate-pulse text-sm text-gray-400 font-medium">Laden...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : 0 }}
        className={`fixed top-0 left-0 bottom-0 w-72 bg-white border-r border-gray-100 z-50 transform transition-all duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Logo Section */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-emerald-500/10 group-hover:shadow-emerald-500/20 transition-all">
                <Image
                  src="/logo-new.png"
                  alt="YaNa Kiosk"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-900 leading-tight">YaNa Admin</span>
                <span className="text-[10px] text-gray-400 font-medium">Kiosk Management</span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <div className="mb-4 px-3">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Navigation</p>
          </div>
          <nav className="space-y-1">
            {adminLinks.map((link) => {
              const Icon = link.icon
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className="block"
                >
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? 'bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 text-emerald-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-r-full"
                      />
                    )}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                      active
                        ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-md shadow-emerald-500/20'
                        : 'bg-gray-100 group-hover:bg-gray-200'
                    }`}>
                      <Icon className={`w-4.5 h-4.5 ${active ? 'text-white' : 'text-gray-500'}`} />
                    </div>
                    <div className="flex flex-col">
                      <span className={`font-semibold ${active ? 'text-emerald-700' : 'text-gray-700'}`}>
                        {link.label}
                      </span>
                      <span className="text-[10px] text-gray-400">{link.desc}</span>
                    </div>
                  </motion.div>
                </Link>
              )
            })}
          </nav>

          <div className="mt-6 mb-4 px-3">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Allgemein</p>
          </div>
          <div className="space-y-1 px-0">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all"
            >
              <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                <Store className="w-4.5 h-4.5 text-gray-500" />
              </div>
              <span>Zum Shop</span>
            </Link>
          </div>
        </div>

        {/* User Section */}
        <div className="border-t border-gray-100 p-4">
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-sm">
                <span className="text-sm font-bold text-white">
                  {user.email?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 0.95 }}
                    className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-20"
                  >
                    <div className="p-2 space-y-0.5">
                      <button
                        onClick={() => {
                          logout()
                          router.push('/admin/login')
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Abmelden</span>
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-gray-200/80">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
                <Store className="w-4 h-4" />
                <span>/</span>
                <span className="text-gray-600 font-medium">Admin</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-emerald-600 bg-gray-100 hover:bg-emerald-50 rounded-xl transition-all hidden sm:inline-flex items-center gap-2"
              >
                <Store className="w-4 h-4" />
                Shop ansehen
              </Link>
              <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
