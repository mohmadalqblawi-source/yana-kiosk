'use client'

import { useLanguageStore } from '@/store/language'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Download, FileText, Scale } from 'lucide-react'

const inlineTranslations = {
  backToHome: { de: 'Zurück zur Startseite', en: 'Back to Home', fa: 'بازگشت به خانه', ar: 'العودة إلى الرئيسية' },
}

export default function WiderrufPage() {
  const { lang } = useLanguageStore()
  const dir = lang === 'ar' || lang === 'fa' ? 'rtl' : 'ltr'

  const t = (key: keyof typeof inlineTranslations) => {
    const entry = inlineTranslations[key]
    return entry[lang] || entry['de']
  }

  const tr = (key: string) => {
    const keys = key.split('.')
    let obj: any = {
      title: { de: 'Widerrufsbelehrung & Widerrufsformular', en: 'Right of Withdrawal & Cancellation Form', fa: 'حق انصراف و فرم انصراف', ar: 'حق الإلغاء ونموذج الإلغاء' },
      subtitle: { de: 'Belehrung für Verbraucher', en: 'Information for Consumers', fa: 'اطلاعات برای مصرف‌کنندگان', ar: 'معلومات للمستهلكين' },
      downloadPdf: { de: 'Widerrufsbelehrung als PDF (PDF)', en: 'Download Withdrawal Policy as PDF', fa: 'دانلود حق انصراف (PDF)', ar: 'تحميل سياسة الإلغاء (PDF)' },
    }
    for (const k of keys) {
      if (obj && typeof obj === 'object' && k in obj) obj = obj[k]
      else return key
    }
    if (obj && typeof obj === 'object' && lang in obj) return obj[lang]
    return key
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
          {/* Header */}
          <div className="flex items-start gap-4 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0 mt-1">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                {tr('title')}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {tr('subtitle')}
              </p>
            </div>
          </div>

          {/* Download PDF Button */}
          <motion.a
            href="/widerruf.pdf"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-2 mt-6 px-5 py-3 bg-white border-2 border-emerald-200 text-emerald-700 rounded-2xl font-medium text-sm hover:bg-emerald-50 hover:border-emerald-300 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            {tr('downloadPdf')}
          </motion.a>

          {/* A. Widerrufsbelehrung */}
          <div className="mt-10 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              A. Widerrufsbelehrung
            </h2>

            <div className="text-sm text-gray-700 leading-relaxed space-y-4">
              <p className="text-xs text-gray-400 italic">
                Quelle: IT-Recht-Kanzlei GmbH &amp; Co. KG · Alter Messeplatz 2 · 80339 München
              </p>

              <h3 className="text-base font-bold text-gray-900">Widerrufsrecht</h3>
              <p>Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gr&uuml;nden diesen Vertrag zu widerrufen.</p>
              <p>Die Widerrufsfrist betr&auml;gt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Bef&ouml;rderer ist, die letzte Ware in Besitz genommen haben bzw. hat.</p>
              <p>Um Ihr Widerrufsrecht auszu&uuml;ben, m&uuml;ssen Sie uns</p>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="font-semibold text-gray-900">Maryam Rezaie</p>
                <p>YaNa Kiosk</p>
                <p>Barsb&uuml;tteler Hof 2c</p>
                <p>22885 Barsb&uuml;ttel</p>
                <p>Deutschland</p>
                <p className="mt-2">Tel.: 040 6704066</p>
                <p>E-Mail: yana-kiosk@web.de</p>
              </div>
              <p>mittels einer eindeutigen Erkl&auml;rung (z. B. ein mit der Post versandter Brief oder E-Mail) &uuml;ber Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie k&ouml;nnen daf&uuml;r das beigef&uuml;gte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.</p>
              <p>Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung &uuml;ber die Aus&uuml;bung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.</p>

              <h3 className="text-base font-bold text-gray-900 pt-4">Folgen des Widerrufs</h3>
              <p>Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, einschlie&szlig;lich der Lieferkosten (mit Ausnahme der zus&auml;tzlichen Kosten, die sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von uns angebotene, g&uuml;nstigste Standardlieferung gew&auml;hlt haben), unverz&uuml;glich und sp&auml;testens binnen vierzehn Tagen ab dem Tag zur&uuml;ckzuzahlen, an dem die Mitteilung &uuml;ber Ihren Widerruf dieses Vertrags bei uns eingegangen ist.</p>
              <p>Sie haben die Waren unverz&uuml;glich und in jedem Fall sp&auml;testens binnen vierzehn Tagen ab dem Tag, an dem Sie uns &uuml;ber den Widerruf dieses Vertrags unterrichten, an uns zur&uuml;ckzusenden oder zu &uuml;bergeben.</p>
              <p>Sie tragen die unmittelbaren Kosten der R&uuml;cksendung der Waren.</p>

              <h3 className="text-base font-bold text-gray-900 pt-4">Allgemeine Hinweise</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Bitte vermeiden Sie Besch&auml;digungen und Verunreinigungen der Ware. Senden Sie die Ware bitte in Originalverpackung mit s&auml;mtlichem Zubeh&ouml;r und mit allen Verpackungsbestandteilen an uns zur&uuml;ck.</li>
                <li>Senden Sie die Ware bitte nicht unfrei an uns zur&uuml;ck.</li>
                <li>Bitte beachten Sie, dass die vorgenannten Ziffern 1-2 nicht Voraussetzung f&uuml;r die wirksame Aus&uuml;bung des Widerrufsrechts sind.</li>
              </ol>
            </div>
          </div>

          {/* B. Widerrufsformular */}
          <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              B. Widerrufsformular
            </h2>

            <div className="text-sm text-gray-700 leading-relaxed space-y-4">
              <p>Wenn Sie den Vertrag widerrufen wollen, dann f&uuml;llen Sie bitte dieses Formular aus und senden es zur&uuml;ck.</p>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="font-semibold">An</p>
                <p>Maryam Rezaie</p>
                <p>YaNa Kiosk</p>
                <p>Barsb&uuml;tteler Hof 2c</p>
                <p>22885 Barsb&uuml;ttel</p>
                <p>Deutschland</p>
                <p className="mt-1">E-Mail: yana-kiosk@web.de</p>
              </div>

              <div className="border border-gray-200 rounded-xl p-5 space-y-4 bg-white">
                <p className="text-gray-500 italic">Hiermit widerrufe(n) ich/wir den von mir/uns abgeschlossenen Vertrag &uuml;ber den Kauf der folgenden Waren:</p>
                
                <div className="h-20 border-b border-dashed border-gray-300" />
                <div className="h-10 border-b border-dashed border-gray-300" />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Bestellt am:</p>
                    <div className="h-8 border-b border-dashed border-gray-300" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Erhalten am:</p>
                    <div className="h-8 border-b border-dashed border-gray-300" />
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-gray-400 mb-1">Name des/der Verbraucher(s):</p>
                  <div className="h-8 border-b border-dashed border-gray-300" />
                </div>
                
                <div>
                  <p className="text-xs text-gray-400 mb-1">Anschrift des/der Verbraucher(s):</p>
                  <div className="h-8 border-b border-dashed border-gray-300" />
                </div>
                
                <div>
                  <p className="text-xs text-gray-400 mb-1">Datum:</p>
                  <div className="h-8 border-b border-dashed border-gray-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Source */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              <a href="https://www.it-recht-kanzlei.de" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                IT-Recht-Kanzlei GmbH &amp; Co. KG
              </a>
              &nbsp;&middot; Alter Messeplatz 2 &middot; 80339 M&uuml;nchen
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
