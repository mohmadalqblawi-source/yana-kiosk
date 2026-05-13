'use client'

import { useLanguageStore } from '@/store/language'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Phone, Mail, MapPin, Scale, ShieldCheck } from 'lucide-react'

const inlineTranslations = {
  backToHome: { de: 'Zurück zur Startseite', en: 'Back to Home', fa: 'بازگشت به خانه', ar: 'العودة إلى الرئيسية' },
  disputeResolution: { de: 'Streitbeilegung', en: 'Dispute Resolution', fa: 'حل اختلاف', ar: 'حل النزاعات' },
  disputeText: { de: 'Wir sind zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle weder verpflichtet noch bereit.', en: 'We are neither obliged nor willing to participate in dispute resolution proceedings before a consumer arbitration board.', fa: 'ما نه ملزم هستیم و نه مایل به شرکت در فرآیند حل اختلاف در برابر هیئت داوری مصرف‌کنندگان.', ar: 'نحن لسنا ملزمين ولا راغبين في المشاركة في إجراءات تسوية المنازعات أمام هيئة التحكيم الاستهلاكية.' },
  statusLabel: { de: 'Stand:', en: 'As of:', fa: 'تاریخ:', ar: 'تاريخ:' },
}

export default function ImpressumPage() {
  const { lang } = useLanguageStore()
  const dir = lang === 'ar' || lang === 'fa' ? 'rtl' : 'ltr'

  const t = (key: keyof typeof inlineTranslations) => {
    const entry = inlineTranslations[key]
    return entry[lang] || entry['de']
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
                    href="tel:01604873902"
                    className="text-green-600 hover:text-green-700 hover:underline transition-colors"
                  >
                    01604873902
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

            {/* Dispute Resolution */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                {t('disputeResolution')}
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t('disputeText')}
              </p>
              <p className="mt-4 text-xs text-gray-400">
                {t('statusLabel')} 13.05.2026
              </p>
            </div>

            {/* Source */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Quelle</h2>
              <p className="text-sm text-gray-500">
                <a
                  href="https://www.e-recht24.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 hover:underline"
                >
                  eRecht24
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
