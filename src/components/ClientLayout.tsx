'use client'

import { ReactNode, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useLanguageStore } from '@/store/language'
import Navbar from './Navbar'
import Footer from './Footer'
import CartSidebar from './CartSidebar'
import ToastContainer from './ToastContainer'
import StoreClosedBanner from './StoreClosedBanner'

export default function ClientLayout({ children }: { children: ReactNode }) {
  const { lang } = useLanguageStore()
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')

  useEffect(() => {
    document.documentElement.lang = lang === 'fa' ? 'fa' : lang === 'ar' ? 'ar' : lang
    document.documentElement.dir = lang === 'fa' || lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])

  if (isAdminRoute) {
    return (
      <>
        {children}
        <ToastContainer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <StoreClosedBanner />
      <main className="min-h-screen pt-[4.6rem] md:pt-[5.35rem]">
        {children}
      </main>
      <Footer />
      <CartSidebar />
      <ToastContainer />
    </>
  )
}
