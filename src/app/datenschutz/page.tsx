"use client";

import React from "react";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { SITE_LAST_UPDATED } from "@/data/translations";

const CONTACT_EMAIL = "eren.yigit.aydin@gmail.com";

interface Section {
  heading: string;
  body: string[];
}

interface PrivacyCopy {
  back: string;
  title: string;
  intro: string;
  updated: string;
  sections: Section[];
}

/**
 * Privacy statement.
 *
 * Written from what the site actually does rather than from a template: it sets
 * no cookies at all, loads no analytics or third-party scripts, and only stores
 * three preference keys in the browser's own localStorage. The only data that
 * leaves the visitor's device is what they type into the contact form or the
 * guestbook themselves.
 */
const copy: Record<string, PrivacyCopy> = {
  de: {
    back: "Zurück zur Startseite",
    title: "Datenschutzerklärung",
    updated: "Stand",
    intro:
      "Diese Website ist das private Bewerbungsportfolio von Eren Aydın. Sie ist bewusst datensparsam gebaut. Nachfolgend steht, welche Daten erhoben werden und warum.",
    sections: [
      {
        heading: "Verantwortliche Person",
        body: [
          `Eren Aydın, Schweiz. Kontakt für alle Fragen zum Datenschutz: ${CONTACT_EMAIL}`,
        ],
      },
      {
        heading: "Keine Cookies, kein Tracking",
        body: [
          "Diese Website setzt keine Cookies. Es sind keine Analyse-Dienste, keine Werbenetzwerke und keine Social-Media-Skripte eingebunden. Es findet keine Auswertung des Besuchsverhaltens statt und es werden keine Profile gebildet.",
          "Gespeichert werden ausschliesslich drei Einstellungen im lokalen Speicher (localStorage) Ihres Browsers: die gewählte Sprache, das gewählte Farbthema und die Bestätigung des Hinweisbanners. Diese Werte verlassen Ihr Gerät nicht und können jederzeit über die Einstellungen Ihres Browsers gelöscht werden.",
        ],
      },
      {
        heading: "Kontaktformular",
        body: [
          "Wenn Sie das Kontaktformular benutzen, werden Ihr Name, Ihre E-Mail-Adresse und Ihre Nachricht übermittelt, damit ich Ihnen antworten kann. Der Versand läuft über den E-Mail-Dienst Resend.",
          "Rechtsgrundlage ist Ihre Einwilligung, die Sie mit dem Absenden erteilen. Die Nachricht wird nur zur Beantwortung Ihrer Anfrage verwendet und nicht an Dritte weitergegeben.",
        ],
      },
      {
        heading: "Gästebuch",
        body: [
          "Einträge im Gästebuch bestehen aus dem Namen und dem Text, den Sie selbst eingeben. Beides ist nach Freigabe öffentlich sichtbar — schreiben Sie dort bitte keine vertraulichen Angaben hinein.",
          "Die Einträge werden in einer Datenbank des Anbieters Supabase gespeichert. Sie können die Löschung Ihres Eintrags jederzeit formlos per E-Mail verlangen.",
        ],
      },
      {
        heading: "Hosting",
        body: [
          "Die Website wird bei Vercel gehostet. Beim Abruf einer Seite verarbeitet der Anbieter technisch notwendige Verbindungsdaten wie die IP-Adresse. Das ist für den Betrieb jeder Website unvermeidbar und dient allein der Auslieferung der Seite.",
        ],
      },
      {
        heading: "Ihre Rechte",
        body: [
          "Sie haben das Recht auf Auskunft über die zu Ihrer Person gespeicherten Daten sowie auf deren Berichtigung oder Löschung. Eine kurze E-Mail genügt.",
        ],
      },
      {
        heading: "Änderungen",
        body: [
          "Ändert sich der Funktionsumfang der Website, wird diese Erklärung angepasst. Das Datum oben zeigt den aktuellen Stand.",
        ],
      },
    ],
  },
  tr: {
    back: "Ana sayfaya dön",
    title: "Gizlilik Bildirimi",
    updated: "Son güncelleme",
    intro:
      "Bu site Eren Aydın'ın kişisel başvuru portfolyosudur. Bilinçli olarak mümkün olduğunca az veri toplayacak şekilde yapıldı. Aşağıda hangi verinin neden işlendiği yazıyor.",
    sections: [
      {
        heading: "Sorumlu kişi",
        body: [
          `Eren Aydın, İsviçre. Gizlilikle ilgili tüm sorular için: ${CONTACT_EMAIL}`,
        ],
      },
      {
        heading: "Çerez yok, izleme yok",
        body: [
          "Bu site hiç çerez kullanmıyor. Hiçbir analiz servisi, reklam ağı veya sosyal medya betiği bağlı değil. Ziyaretçi davranışı ölçülmüyor, profil çıkarılmıyor.",
          "Yalnızca üç tercih tarayıcınızın yerel deposunda (localStorage) tutuluyor: seçtiğiniz dil, seçtiğiniz tema ve bilgilendirme bandını onayladığınız bilgisi. Bu değerler cihazınızdan çıkmıyor ve tarayıcı ayarlarınızdan istediğiniz zaman silinebilir.",
        ],
      },
      {
        heading: "İletişim formu",
        body: [
          "İletişim formunu kullanırsanız adınız, e-posta adresiniz ve mesajınız size cevap verebilmem için iletilir. Gönderim Resend adlı e-posta servisi üzerinden yapılır.",
          "Hukuki dayanak, formu gönderirken verdiğiniz açık rızadır. Mesaj yalnızca sorunuzu yanıtlamak için kullanılır, üçüncü kişilerle paylaşılmaz.",
        ],
      },
      {
        heading: "Ziyaretçi defteri",
        body: [
          "Ziyaretçi defteri kayıtları yalnızca sizin girdiğiniz isim ve metinden oluşur. Onaylandıktan sonra ikisi de herkese açık görünür — lütfen oraya gizli bilgi yazmayın.",
          "Kayıtlar Supabase sağlayıcısının veritabanında saklanır. Kaydınızın silinmesini istediğiniz zaman e-posta ile talep edebilirsiniz.",
        ],
      },
      {
        heading: "Barındırma",
        body: [
          "Site Vercel üzerinde barındırılıyor. Bir sayfa açıldığında sağlayıcı, IP adresi gibi teknik olarak zorunlu bağlantı verilerini işler. Bu her web sitesinin çalışması için kaçınılmazdır ve yalnızca sayfanın size ulaştırılmasına yarar.",
        ],
      },
      {
        heading: "Haklarınız",
        body: [
          "Hakkınızda saklanan verileri öğrenme, düzelttirme ve sildirme hakkınız var. Kısa bir e-posta yeterli.",
        ],
      },
      {
        heading: "Değişiklikler",
        body: [
          "Sitenin işlevleri değişirse bu bildirim de güncellenir. Yukarıdaki tarih güncel sürümü gösterir.",
        ],
      },
    ],
  },
  en: {
    back: "Back to home",
    title: "Privacy Statement",
    updated: "Last updated",
    intro:
      "This site is the personal application portfolio of Eren Aydın. It is deliberately built to collect as little as possible. Below is what is processed and why.",
    sections: [
      {
        heading: "Who is responsible",
        body: [
          `Eren Aydın, Switzerland. For any privacy question: ${CONTACT_EMAIL}`,
        ],
      },
      {
        heading: "No cookies, no tracking",
        body: [
          "This site sets no cookies. No analytics service, advertising network or social media script is loaded. Visitor behaviour is not measured and no profiles are built.",
          "Only three preferences are kept in your browser's own localStorage: the language you chose, the colour theme you chose, and the fact that you dismissed the notice banner. These values never leave your device and can be cleared at any time from your browser settings.",
        ],
      },
      {
        heading: "Contact form",
        body: [
          "If you use the contact form, your name, email address and message are transmitted so that I can reply. Delivery runs through the email service Resend.",
          "The legal basis is the consent you give by sending the form. The message is used only to answer your enquiry and is not passed to third parties.",
        ],
      },
      {
        heading: "Guestbook",
        body: [
          "A guestbook entry consists of the name and text you type yourself. Once approved, both are publicly visible — please do not put confidential information there.",
          "Entries are stored in a database provided by Supabase. You can ask for your entry to be deleted at any time by email.",
        ],
      },
      {
        heading: "Hosting",
        body: [
          "The site is hosted by Vercel. When a page is requested, the provider processes technically necessary connection data such as the IP address. This is unavoidable for any website and serves only to deliver the page.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          "You have the right to know what data is stored about you, and to have it corrected or deleted. A short email is enough.",
        ],
      },
      {
        heading: "Changes",
        body: [
          "If the functionality of the site changes, this statement is updated. The date above shows the current version.",
        ],
      },
    ],
  },
};

export default function PrivacyPage() {
  const { language } = useLanguage();
  const c = copy[language] || copy.de;

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text-body)] px-6 py-16 md:py-24">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)] hover:text-primary transition-colors mb-10"
        >
          <FiArrowLeft />
          {c.back}
        </Link>

        <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-main)] mb-3 bg-gradient-to-r from-title-from to-title-to bg-clip-text text-transparent inline-block">
          {c.title}
        </h1>

        <p className="text-xs text-[var(--text-muted)] mb-8">
          {c.updated}: {SITE_LAST_UPDATED}
        </p>

        <p className="text-base md:text-lg leading-relaxed text-[var(--text-body)] mb-12">
          {c.intro}
        </p>

        <div className="space-y-10">
          {c.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-lg md:text-xl font-bold text-[var(--text-main)] mb-3 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-primary rounded-full flex-shrink-0" />
                {section.heading}
              </h2>
              <div className="space-y-3 pl-3.5">
                {section.body.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-sm md:text-base leading-relaxed text-[var(--text-body)]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
