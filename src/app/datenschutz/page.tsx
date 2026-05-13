'use client'

import { useLanguageStore } from '@/store/language'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Download, Shield, FileText } from 'lucide-react'

const inlineTranslations = {
  backToHome: { de: 'Zurück zur Startseite', en: 'Back to Home', fa: 'بازگشت به خانه', ar: 'العودة إلى الرئيسية' },
}

export default function DatenschutzPage() {
  const { lang } = useLanguageStore()
  const dir = lang === 'ar' || lang === 'fa' ? 'rtl' : 'ltr'

  const t = (key: keyof typeof inlineTranslations) => {
    const entry = inlineTranslations[key]
    return entry[lang] || entry['de']
  }

  const tr = (key: string) => {
    const keys = key.split('.')
    let obj: any = {
      title: { de: 'Datenschutzerklärung', en: 'Privacy Policy', fa: 'حریم خصوصی', ar: 'سياسة الخصوصية' },
      subtitle: { de: 'Informationen zum Datenschutz gemäß DSGVO', en: 'Privacy information according to GDPR', fa: 'اطلاعات حریم خصوصی طبق GDPR', ar: 'معلومات الخصوصية وفقاً للـ GDPR' },
      downloadPdf: { de: 'Datenschutzerklärung als PDF (PDF)', en: 'Download Privacy Policy as PDF', fa: 'دانلود حریم خصوصی (PDF)', ar: 'تحميل سياسة الخصوصية (PDF)' },
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
              <Shield className="w-6 h-6 text-white" />
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

          {/* Download PDF */}
          <motion.a
            href="/datenschutz.pdf"
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

          {/* Full Text */}
          <div className="mt-10 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm text-sm text-gray-700 leading-relaxed space-y-6">
            <p className="text-xs text-gray-400 italic">
              Quelle: IT-Recht-Kanzlei GmbH &amp; Co. KG · Alter Messeplatz 2 · 80339 München
            </p>

            <section>
              <h3 className="text-base font-bold text-gray-900 mb-2">1) Einleitung und Kontaktdaten des Verantwortlichen</h3>
              <p>1.1 Wir freuen uns, dass Sie unsere Website besuchen, und bedanken uns f&uuml;r Ihr Interesse. Im Folgenden informieren wir Sie &uuml;ber den Umgang mit Ihren personenbezogenen Daten bei der Nutzung unserer Website. Personenbezogene Daten sind hierbei alle Daten, mit denen Sie pers&ouml;nlich identifiziert werden k&ouml;nnen.</p>
              <p className="mt-2">1.2 Verantwortlicher f&uuml;r die Datenverarbeitung auf dieser Website im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:</p>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mt-2">
                <p className="font-semibold text-gray-900">Maryam Rezaie</p>
                <p>YaNa Kiosk</p>
                <p>Barsb&uuml;tteler Hof 2c</p>
                <p>22885 Barsb&uuml;ttel</p>
                <p>Deutschland</p>
                <p className="mt-2">Tel.: 01604873902</p>
                <p>E-Mail: yana-kiosk@web.de</p>
              </div>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-900 mb-2">2) Datenerfassung beim Besuch unserer Website</h3>
              <p>2.1 Bei der blo&szlig; informatorischen Nutzung unserer Website erheben wir nur solche Daten, die Ihr Browser an den Seitenserver &uuml;bermittelt (sog. &bdquo;Server-Logfiles&ldquo;). Wenn Sie unsere Website aufrufen, erheben wir die folgenden Daten, die f&uuml;r uns technisch erforderlich sind, um Ihnen die Website anzuzeigen:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Unsere besuchte Website</li>
                <li>Datum und Uhrzeit zum Zeitpunkt des Zugriffes</li>
                <li>Menge der gesendeten Daten in Byte</li>
                <li>Quelle/Verweis, von welchem Sie auf die Seite gelangten</li>
                <li>Verwendeter Browser</li>
                <li>Verwendetes Betriebssystem</li>
                <li>Verwendete IP-Adresse (ggf.: in anonymisierter Form)</li>
              </ul>
              <p className="mt-2">Die Verarbeitung erfolgt gem&auml;&szlig; Art. 6 Abs. 1 lit. f DSGVO auf Basis unseres berechtigten Interesses an der Verbesserung der Stabilit&auml;t und Funktionalit&auml;t unserer Website.</p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-900 mb-2">3) Hosting &amp; Content-Delivery-Network</h3>
              <p>F&uuml;r das Hosting unserer Website und die Darstellung der Seiteninhalte nutzen wir das System des folgenden Anbieters:</p>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mt-2">
                <p className="font-semibold text-gray-900">Vercel Inc.</p>
                <p>340 S Lemon Ave #4133, Walnut, CA 91789, USA</p>
              </div>
              <p className="mt-2">S&auml;mtliche auf unserer Website erhobenen Daten werden auf den Servern des Anbieters verarbeitet. Wir haben mit dem Anbieter einen Auftragsverarbeitungsvertrag geschlossen. F&uuml;r Daten&uuml;bermittlungen in die USA hat sich der Anbieter dem EU-US-Datenschutzrahmen (EU-US Data Privacy Framework) angeschlossen.</p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-900 mb-2">4) Kontaktaufnahme</h3>
              <p>Im Rahmen der Kontaktaufnahme mit uns (z.B. per Kontaktformular oder E-Mail) werden &ndash; ausschlie&szlig;lich zum Zweck der Bearbeitung und Beantwortung Ihres Anliegens und nur im daf&uuml;r erforderlichen Umfang &ndash; personenbezogene Daten verarbeitet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO bzw. lit. b DSGVO.</p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-900 mb-2">5) Datenverarbeitung zur Bestellabwicklung</h3>
              <p>5.1 Soweit f&uuml;r die Vertragsabwicklung zu Liefer- und Zahlungszwecken erforderlich, werden die von uns erhobenen personenbezogenen Daten gem&auml;&szlig; Art. 6 Abs. 1 lit. b DSGVO an das beauftragte Transportunternehmen und das beauftragte Kreditinstitut weitergegeben.</p>
              <p className="mt-2">5.2 Verwendung von Paymentdienstleistern (Zahlungsdiensten):</p>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mt-2 space-y-3">
                <div>
                  <p className="font-semibold text-gray-900">- Apple Pay</p>
                  <p className="text-xs text-gray-400">Apple Distribution International, Hollyhill Industrial Estate, Hollyhill, Cork, Irland</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">- PayPal</p>
                  <p className="text-xs text-gray-400">PayPal (Europe) S.&agrave; r.l. et Cie, S.C.A., 22-24 Boulevard Royal, L-2449 Luxemburg</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-900 mb-2">6) Rechte des Betroffenen</h3>
              <p>Das geltende Datenschutzrecht gew&auml;hrt Ihnen gegen&uuml;ber dem Verantwortlichen hinsichtlich der Verarbeitung Ihrer personenbezogenen Daten die folgenden Betroffenenrechte:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Auskunftsrecht gem&auml;&szlig; Art. 15 DSGVO</li>
                <li>Recht auf Berichtigung gem&auml;&szlig; Art. 16 DSGVO</li>
                <li>Recht auf L&ouml;schung gem&auml;&szlig; Art. 17 DSGVO</li>
                <li>Recht auf Einschr&auml;nkung der Verarbeitung gem&auml;&szlig; Art. 18 DSGVO</li>
                <li>Recht auf Daten&uuml;bertragbarkeit gem&auml;&szlig; Art. 20 DSGVO</li>
                <li>Recht auf Widerruf erteilter Einwilligungen gem&auml;&szlig; Art. 7 Abs. 3 DSGVO</li>
                <li>Recht auf Beschwerde gem&auml;&szlig; Art. 77 DSGVO</li>
              </ul>
              <div className="mt-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-xs">
                <p className="font-bold text-gray-900 mb-1">WIDERSPRUCHSRECHT</p>
                <p>Wenn wir Ihre personenbezogenen Daten auf Grundlage unseres berechtigten Interesses verarbeiten, haben Sie das jederzeitige Recht, aus Gr&uuml;nden, die sich aus Ihrer besonderen Situation ergeben, gegen diese Verarbeitung Widerspruch einzulegen.</p>
              </div>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-900 mb-2">7) Dauer der Speicherung personenbezogener Daten</h3>
              <p>Die Dauer der Speicherung von personenbezogenen Daten bemisst sich anhand der jeweiligen Rechtsgrundlage, am Verarbeitungszweck und &ndash; sofern einschl&auml;gig &ndash; zus&auml;tzlich anhand der jeweiligen gesetzlichen Aufbewahrungsfrist (z.B. handels- und steuerrechtliche Aufbewahrungsfristen).</p>
            </section>

            {/* Source */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-400">
                <a href="https://www.it-recht-kanzlei.de" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                  IT-Recht-Kanzlei GmbH &amp; Co. KG
                </a>
                &nbsp;&middot; Alter Messeplatz 2 &middot; 80339 M&uuml;nchen
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
