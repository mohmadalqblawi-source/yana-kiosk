'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useCartStore } from '@/store/cart'
import { useLanguageStore } from '@/store/language'
import { ShoppingBag, Menu, X, Globe } from 'lucide-react'

const languages = [
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fa', label: 'فارسی', flag: '🇮🇷' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const { lang, setLang } = useLanguageStore()
  const pathname = usePathname()
  const { items, toggleCart } = useCartStore()

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
    setLangOpen(false)
  }, [pathname])

  const links = [
    { href: '/', label: lang === 'de' ? 'Startseite' : lang === 'fa' ? 'خانه' : lang === 'ar' ? 'الرئيسية' : 'Home' },
    { href: '/shop', label: lang === 'de' ? 'Shop' : lang === 'fa' ? 'فروشگاه' : lang === 'ar' ? 'المتجر' : 'Shop' },
  ]

  const currentLangData = languages.find((l) => l.code === lang) || languages[0]

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: -3, scale: 1.08 }}
                className="w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-lg shadow-green-500/20 relative bg-white"
              >
                <Image
                  src="/logo-new.png"
                  alt="YaNa Kiosk"
                  fill
                  className="object-contain p-0.5"
                  sizes="48px"
                />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-700 to-green-800 bg-clip-text text-transparent">
                YaNa Kiosk
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'text-green-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                  {pathname === link.href && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-green-600 to-green-700 rounded-full"
                    />
                  )}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100/80 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>{currentLangData.flag}</span>
                </button>

                <AnimatePresence>
                  {langOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-20"
                      >
                        {languages.map((langItem) => (
                          <button
                            key={langItem.code}
                            onClick={() => { setLang(langItem.code as any); setLangOpen(false) }}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                              lang === langItem.code
                                ? 'bg-emerald-50 text-emerald-700 font-semibold'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <span className="text-base">{langItem.flag}</span>
                            <span>{langItem.label}</span>
                            {lang === langItem.code && (
                              <motion.div
                                layoutId="lang-check"
                                className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500"
                              />
                            )}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleCart}
                className="relative p-2.5 rounded-full bg-gradient-to-br from-green-600 to-green-700 text-white shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-600/30 transition-shadow"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-white"
                  >
                    {itemCount > 9 ? '9+' : itemCount}
                  </motion.span>
                )}
              </motion.button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200 md:hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    pathname === link.href
                      ? 'bg-emerald-50 text-green-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {/* Mobile language picker */}
              <div className="border-t border-gray-100 pt-3 mt-3">
                <p className="px-4 pb-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {lang === 'de' ? 'Sprache' : lang === 'fa' ? 'زبان' : lang === 'ar' ? 'اللغة' : 'Language'}
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {languages.map((langItem) => (
                    <button
                      key={langItem.code}
                      onClick={() => setLang(langItem.code as any)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-colors ${
                        lang === langItem.code
                          ? 'bg-emerald-50 text-emerald-700 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{langItem.flag}</span>
                      <span>{langItem.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
