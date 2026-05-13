'use client'

import { useLanguageStore } from '@/store/language'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, FileText, Download, Scale } from 'lucide-react'

const inlineTranslations = {
  backToHome: { de: 'Zurück zur Startseite', en: 'Back to Home', fa: 'بازگشت به خانه', ar: 'العودة إلى الرئيسية' },
}

export default function AgbPage() {
  const { lang } = useLanguageStore()
  const dir = lang === 'ar' || lang === 'fa' ? 'rtl' : 'ltr'

  const t = (key: keyof typeof inlineTranslations) => {
    const entry = inlineTranslations[key]
    return entry[lang] || entry['de']
  }

  const tr = (key: string) => {
    const keys = key.split('.')
    let obj: any = {
      title: { de: 'Allgemeine Geschäftsbedingungen (AGB)', en: 'Terms & Conditions', fa: 'شرایط و ضوابط', ar: 'الشروط والأحكام' },
      subtitle: { de: 'Rechtliche Informationen für Kunden', en: 'Legal information for customers', fa: 'اطلاعات حقوقی برای مشتریان', ar: 'معلومات قانونية للعملاء' },
      downloadPdf: { de: 'AGB als PDF herunterladen (PDF)', en: 'Download T&C as PDF', fa: 'دانلود شرایط و ضوابط (PDF)', ar: 'تحميل الشروط والأحكام (PDF)' },
    }
    for (const k of keys) {
      if (obj && typeof obj === 'object' && k in obj) obj = obj[k]
      else return key
    }
    if (obj && typeof obj === 'object' && lang in obj) return obj[lang]
    return key
  }

  const sections = [
    { id: 'scope', title: '1. Geltungsbereich' },
    { id: 'contract', title: '2. Vertragsschluss' },
    { id: 'revocation', title: '3. Widerrufsrecht' },
    { id: 'prices', title: '4. Preise und Zahlungsbedingungen' },
    { id: 'shipping', title: '5. Liefer- und Versandbedingungen' },
    { id: 'retention', title: '6. Eigentumsvorbehalt' },
    { id: 'warranty', title: '7. Mängelhaftung (Gewährleistung)' },
    { id: 'liability', title: '8. Haftung' },
    { id: 'law', title: '9. Anwendbares Recht' },
    { id: 'dispute', title: '10. Alternative Streitbeilegung' },
  ]

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
            href="/agb.pdf"
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

          {/* Sections Overview */}
          <div className="mt-10 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              Inhaltsverzeichnis
            </h2>
            <div className="space-y-2">
              {sections.map((section) => (
                <div key={section.id} className="flex items-center gap-3 py-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span className="text-sm text-gray-700">{section.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Full AGB Text */}
          <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm text-sm text-gray-700 leading-relaxed space-y-6">
            <p className="text-xs text-gray-400 italic">
              Quelle: IT-Recht-Kanzlei GmbH &amp; Co. KG · Alter Messeplatz 2 · 80339 München
            </p>

            <section>
              <h3 className="text-base font-bold text-gray-900 mb-2">1) Geltungsbereich</h3>
              <p>1.1 Diese Allgemeinen Geschäftsbedingungen (nachfolgend &bdquo;AGB&ldquo;) der Maryam Rezaie, handelnd unter &bdquo;YaNa Kiosk&ldquo; (nachfolgend &bdquo;Verkäufer&ldquo;), gelten f&uuml;r alle Vertr&auml;ge zur Lieferung von Waren, die ein Verbraucher oder Unternehmer (nachfolgend &bdquo;Kunde&ldquo;) mit dem Verk&auml;ufer hinsichtlich der vom Verk&auml;ufer in seinem Online-Shop dargestellten Waren abschlie&szlig;t. Hiermit wird der Einbeziehung von eigenen Bedingungen des Kunden widersprochen, es sei denn, es ist etwas anderes vereinbart.</p>
              <p className="mt-2">1.2 Verbraucher im Sinne dieser AGB ist jede nat&uuml;rliche Person, die ein Rechtsgesch&auml;ft zu Zwecken abschlie&szlig;t, die &uuml;berwiegend weder ihrer gewerblichen noch ihrer selbst&auml;ndigen beruflichen T&auml;tigkeit zugerechnet werden k&ouml;nnen.</p>
              <p className="mt-2">1.3 Unternehmer im Sinne dieser AGB ist eine nat&uuml;rliche oder juristische Person oder eine rechtsf&auml;hige Personengesellschaft, die bei Abschluss eines Rechtsgesch&auml;fts in Aus&uuml;bung ihrer gewerblichen oder selbst&auml;ndigen beruflichen T&auml;tigkeit handelt.</p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-900 mb-2">2) Vertragsschluss</h3>
              <p>2.1 Die im Online-Shop des Verk&auml;ufers enthaltenen Produktbeschreibungen stellen keine verbindlichen Angebote seitens des Verk&auml;ufers dar, sondern dienen zur Abgabe eines verbindlichen Angebots durch den Kunden.</p>
              <p className="mt-2">2.2 Der Kunde kann das Angebot &uuml;ber das in den Online-Shop des Verk&auml;ufers integrierte Online-Bestellformular abgeben. Dabei gibt der Kunde, nachdem er die ausgew&auml;hlten Waren in den virtuellen Warenkorb gelegt und den elektronischen Bestellprozess durchlaufen hat, durch Klicken des den Bestellvorgang abschlie&szlig;enden Buttons ein rechtlich verbindliches Vertragsangebot in Bezug auf die im Warenkorb enthaltenen Waren ab.</p>
              <p className="mt-2">2.3 Der Verk&auml;ufer kann das Angebot des Kunden innerhalb von f&uuml;nf Tagen annehmen, indem er dem Kunden eine schriftliche Auftragsbest&auml;tigung oder eine Auftragsbest&auml;tigung in Textform (Fax oder E-Mail) &uuml;bermittelt, oder indem er dem Kunden die bestellte Ware liefert, oder indem er den Kunden nach Abgabe von dessen Bestellung zur Zahlung auffordert.</p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-900 mb-2">3) Widerrufsrecht</h3>
              <p>3.1 Verbrauchern steht grunds&auml;tzlich ein Widerrufsrecht zu.</p>
              <p className="mt-2">3.2 N&auml;here Informationen zum Widerrufsrecht ergeben sich aus der Widerrufsbelehrung des Verk&auml;ufers.</p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-900 mb-2">4) Preise und Zahlungsbedingungen</h3>
              <p>4.1 Sofern sich aus der Produktbeschreibung des Verk&auml;ufers nichts anderes ergibt, handelt es sich bei den angegebenen Preisen um Gesamtpreise, die die gesetzliche Umsatzsteuer enthalten.</p>
              <p className="mt-2">4.2 Die Zahlungsm&ouml;glichkeiten werden dem Kunden im Online-Shop des Verk&auml;ufers mitgeteilt.</p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-900 mb-2">5) Liefer- und Versandbedingungen</h3>
              <p>5.1 Die Lieferung erfolgt innerhalb des vom Verk&auml;ufer angegebenen Liefergebietes an die vom Kunden angegebene Lieferanschrift.</p>
              <p className="mt-2">5.5 Bietet der Verk&auml;ufer die Ware zur Abholung an, so kann der Kunde die bestellte Ware innerhalb der vom Verk&auml;ufer angegebenen Gesch&auml;ftszeiten unter der vom Verk&auml;ufer angegebenen Adresse abholen.</p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-900 mb-2">6) Eigentumsvorbehalt</h3>
              <p>Tritt der Verk&auml;ufer in Vorleistung, beh&auml;lt er sich bis zur vollst&auml;ndigen Bezahlung des geschuldeten Kaufpreises das Eigentum an der gelieferten Ware vor.</p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-900 mb-2">7) M&auml;ngelhaftung (Gew&auml;hrleistung)</h3>
              <p>Soweit sich aus den nachfolgenden Regelungen nichts anderes ergibt, gelten die Vorschriften der gesetzlichen M&auml;ngelhaftung.</p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-900 mb-2">8) Haftung</h3>
              <p>Der Verk&auml;ufer haftet dem Kunden aus allen vertraglichen, vertrags&auml;hnlichen und gesetzlichen Anspr&uuml;chen auf Schadens- und Aufwendungsersatz wie folgt: bei Vorsatz oder grober Fahrl&auml;ssigkeit uneingeschr&auml;nkt, bei fahrl&auml;ssiger Verletzung einer wesentlichen Vertragspflicht beschr&auml;nkt auf den vertragstypischen Schaden. Im &Uuml;brigen ist die Haftung ausgeschlossen.</p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-900 mb-2">9) Anwendbares Recht</h3>
              <p>F&uuml;r s&auml;mtliche Rechtsbeziehungen der Parteien gilt das Recht der Bundesrepublik Deutschland unter Ausschluss der Gesetze &uuml;ber den internationalen Kauf beweglicher Waren.</p>
            </section>

            <section>
              <h3 className="text-base font-bold text-gray-900 mb-2">10) Alternative Streitbeilegung</h3>
              <p>Der Verk&auml;ufer ist zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle weder verpflichtet noch bereit.</p>
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
