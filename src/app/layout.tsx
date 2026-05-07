import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import ClientLayout from '@/components/ClientLayout'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'YaNa Kiosk - Ihr Kiosk in Barsbüttel',
  description: 'Premium Kiosk in Barsbüttel. Qualitätsprodukte, faire Preise, schneller Service. Schokoladenriegel, Getränke, Snacks und mehr.',
  keywords: 'kiosk, barsbüttel, snacks, getränke, schokolade, einkaufen, nahversorger, yana',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
