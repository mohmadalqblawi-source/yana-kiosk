'use client'

import { useLanguageStore } from '@/store/language'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Phone, Mail, MapPin, Scale, ShieldCheck, Receipt } from 'lucide-react'

const inlineTranslations = {
  backToHome: { de: 'Zurück zur Startseite', en: 'Back to Home', fa: 'بازگشت به خانه', ar: 'العودة إلى الرئيسية' },
  mstvTitle: { de: 'Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV', en: 'Responsible for content according to § 18 Abs. 2 MStV', fa: 'مسئول محتوا طبق § 18 Abs. 2 MStV', ar: 'المسؤول عن المحتوى وفقاً لـ § 18 Abs. 2 MStV' },
  disputeTitle: { de: 'Streitbeilegung', en: 'Dispute Resolution', fa: 'حل اختلاف', ar: 'حل النزاعات' },
  disputePre: {
    de: 'Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: ',
    en: 'The European Commission provides a platform for online dispute resolution (OS): ',
    fa: 'کمیسیون اروپا یک پلتفرم برای حل اختلاف آنلاین (OS) فراهم کرده است: ',
    ar: 'توفر المفوضية الأوروبية منصة لتسوية المنازعات عبر الإنترنت (OS): ',
  },
  disputePost: {
    de: ' — Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.',
    en: ' — We are not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board.',
    fa: ' — ما مایل یا ملزم به شرکت در فرآیندهای حل اختلاف در برابر هیئت داوری مصرف‌کنندگان نیستیم.',
    ar: ' — نحن لسنا مستعدين أو ملزمين بالمشاركة في إجراءات تسوية المنازعات أمام هيئة التحكيم الاستهلاكية.',
  },
  kleinTitle: { de: 'Hinweis gemäß § 19 UStG', en: 'Notice pursuant to § 19 UStG', fa: 'اطلاعیه طبق § 19 UStG', ar: 'إشعار وفقاً لـ § 19 UStG' },
  kleinText: {
    de: 'Als Kleinunternehmer im Sinne von § 19 Abs. 1 UStG wird keine Umsatzsteuer berechnet.',
    en: 'As a small business owner within the meaning of § 19 para. 1 UStG, no VAT is charged.',
    fa: 'به عنوان یک کسب‌وکار کوچک طبق § 19 بند ۱ UStG، هیچ مالیات بر ارزش افزوده‌ای دریافت نمی‌شود.',
    ar: 'بوصفنا شركة صغيرة بموجب § 19 فقرة 1 UStG، لا يتم تحصيل أي ضريبة مبيعات.',
  },
}

export default function ImpressumPage() {
  const { lang } = useLanguageStore()
  const dir = lang === 'ar' || lang === 'fa' ? 'rtl' : 'ltr'

  const t = (key: keyof typeof inlineTranslations) => {
    const entry = inlineTranslations[key]
    return entry[lang as keyof typeof entry] || entry['de']
  }

  return (
    <main dir={dir} className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-28 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          {t('backToHome')}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center shadow-lg shadow-green-500/20">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Impressum
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Angaben gemäß § 5 TMG
              </p>
            </div>
          </div>

          <div className="mt-10 space-y-8">
            {/* Operator */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" />
                Betreiber der Website
              </h2>
              <div className="space-y-1 text-gray-600">
                <p className="font-medium text-gray-800">Maryam Rezaie</p>
                <p>Barsbütteler Hof 2c</p>
                <p>22885 Barsbüttel</p>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-green-600" />
                Kontakt
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                  <a
                    href="tel:0406704066"
                    className="text-green-600 hover:text-green-700 hover:underline transition-colors"
                  >
                    040 6704066
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                  <a
                    href="mailto:yana-kiosk@web.de"
                    className="text-green-600 hover:text-green-700 hover:underline transition-colors"
                  >
                    yana-kiosk@web.de
                  </a>
                </div>
              </div>
            </div>

            {/* Responsible for content (§ 18 Abs. 2 MStV) */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                {t('mstvTitle')}
              </h2>
              <p className="text-gray-600">Maryam Rezaie, Barsbütteler Hof 2c, 22885 Barsbüttel</p>
            </div>

            {/* Dispute Resolution — TASK 1: ODR link is now a proper clickable hyperlink */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Scale className="w-5 h-5 text-green-600" />
                {t('disputeTitle')}
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t('disputePre')}
                <a
                  href="https://ec.europa.eu/consumers/odr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 underline transition-colors"
                >
                  https://ec.europa.eu/consumers/odr
                </a>
                {t('disputePost')}
              </p>
            </div>

            {/* TASK 3: §19 UStG Kleinunternehmer notice — no USt-IdNr. exists on this page */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-green-600" />
                {t('kleinTitle')}
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t('kleinText')}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
