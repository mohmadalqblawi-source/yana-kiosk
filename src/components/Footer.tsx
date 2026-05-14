'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLanguageStore } from '@/store/language'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'

const inlineTranslations = {
  tagline: { de: 'Ihr Kiosk in Barsbüttel. Qualitätsprodukte, faire Preise, schneller Service.', en: 'Your neighborhood kiosk in Barsbüttel. Quality products, fair prices, fast service.', fa: 'کیوسک شما در بارسبوتل. محصولات با کیفیت، قیمت‌های منصفانه، خدمات سریع.', ar: 'كشكك في بارسبوتل. منتجات عالية الجودة، أسعار عادلة، خدمة سريعة.' },
  shop: { de: 'Shop', en: 'Shop', fa: 'فروشگاه', ar: 'المتجر' },
  allProducts: { de: 'Alle Produkte', en: 'All Products', fa: 'همه محصولات', ar: 'جميع المنتجات' },
  food: { de: 'Lebensmittel', en: 'Food', fa: 'غذا', ar: 'طعام' },
  drinks: { de: 'Getränke', en: 'Drinks', fa: 'نوشیدنی', ar: 'مشروبات' },
  legal: { de: 'Rechtliches', en: 'Legal', fa: 'حقوقی', ar: 'قانوني' },
  impressum: { de: 'Impressum', en: 'Impressum', fa: 'اطلاعات حقوقی', ar: 'الإفادة القانونية' },
  agb: { de: 'AGB', en: 'Terms & Conditions', fa: 'شرایط و ضوابط', ar: 'الشروط والأحكام' },
  widerruf: { de: 'Widerrufsbelehrung', en: 'Right of Withdrawal', fa: 'حق انصراف', ar: 'حق الإلغاء' },
  datenschutz: { de: 'Datenschutz', en: 'Privacy Policy', fa: 'حریم خصوصی', ar: 'سياسة الخصوصية' },
  contact: { de: 'Kontakt', en: 'Contact', fa: 'تماس', ar: 'اتصل بنا' },
  hours: { de: 'Öffnungszeiten', en: 'Hours', fa: 'ساعات کار', ar: 'ساعات العمل' },
  hoursWeek: { de: 'Mo - Sa: 7:00 - 22:00', en: 'Mon - Sat: 7:00 - 22:00', fa: 'شنبه - پنج‌شنبه: ۷:۰۰ - ۲۲:۰۰', ar: 'السبت - الخميس: ٧:٠٠ - ٢٢:٠٠' },
  hoursSun: { de: 'So: 9:00 - 18:00', en: 'Sun: 9:00 - 18:00', fa: 'جمعه: ۹:۰۰ - ۱۸:۰۰', ar: 'الجمعة: ٩:٠٠ - ١٨:٠٠' },
  copyright: { de: 'Alle Rechte vorbehalten.', en: 'All rights reserved.', fa: 'تمامی حقوق محفوظ است.', ar: 'جميع الحقوق محفوظة.' },
  vatNote: { de: 'Alle Preise inkl. gesetzlicher MwSt.', en: 'All prices incl. statutory VAT.', fa: 'تمام قیمت‌ها شامل مالیات قانونی.', ar: 'جميع الأسعار شاملة ضريبة القيمة المضافة القانونية.' },
}

export default function Footer() {
  const { lang } = useLanguageStore()

  const t = (key: keyof typeof inlineTranslations) => {
    const entry = inlineTranslations[key]
    return entry[lang] || entry['de']
  }

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
                <Image
                  src="/logo-new.png"
                  alt="YaNa Kiosk"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-lg font-bold text-white">YaNa Kiosk</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t('tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{t('shop')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="text-sm text-gray-400 hover:text-yellow-500 transition-colors">
                  {t('allProducts')}
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-sm text-gray-400 hover:text-yellow-500 transition-colors">
                  {t('food')}
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-sm text-gray-400 hover:text-yellow-500 transition-colors">
                  {t('drinks')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{t('legal')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/impressum" className="text-sm text-gray-400 hover:text-yellow-500 transition-colors">
                  {t('impressum')}
                </Link>
              </li>
              <li>
                <Link href="/agb" className="text-sm text-gray-400 hover:text-yellow-500 transition-colors">
                  {t('agb')}
                </Link>
              </li>
              <li>
                <Link href="/widerruf" className="text-sm text-gray-400 hover:text-yellow-500 transition-colors">
                  {t('widerruf')}
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="text-sm text-gray-400 hover:text-yellow-500 transition-colors">
                  {t('datenschutz')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{t('contact')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-yellow-500" />
                <span className="text-sm text-gray-400">Barsbütteler Hof 2c<br />22885 Barsbüttel</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-yellow-500" />
                <span className="text-sm text-gray-400">040 6704066</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-yellow-500" />
                <span className="text-sm text-gray-400">yana-kiosk@web.de</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{t('hours')}</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 shrink-0 text-yellow-500" />
                <span className="text-sm text-gray-400">{t('hoursWeek')}</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 shrink-0 text-yellow-500" />
                <span className="text-sm text-gray-400">{t('hoursSun')}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} YaNa Kiosk. {t('copyright')}
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-gray-600">
              {t('vatNote')}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
