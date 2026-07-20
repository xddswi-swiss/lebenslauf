export type Language = "de" | "tr" | "en";

export interface ExperienceItem {
  type?: "work" | "education";
  period: string;
  role: string;
  company: string;
  city: string;
  tasks: string[];
  pdfReport?: string;
  imageUrl?: string;
}

export interface ReportItem {
  term: string;
  date: string;
  file: string;
}

export interface LanguageItem {
  code: string;
  name: string;
  note: string;
  level: number;
}

export interface ReferenceItem {
  name: string;
  title: string;
  email: string;
  phone?: string;
}

export interface TranslationSchema {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    about: string;
    documents: string;
    experience: string;
    skills: string;
    details: string;
    contact: string;
  };
  hero: {
    greeting: string;
    role: string;
    subtitle: string;
    downloadCv: string;
    emailMe: string;
    statusBadge: string;
  };
  about: {
    title: string;
    intro: string;
    description: string;
    quickFactsTitle: string;
    statsSchnupperLabel: string;
    statsSchnupperDesc: string;
    statsBewerbungLabel: string;
    statsBewerbungDesc: string;
    statsLastUpdate: string;
  };
  documents: {
    title: string;
    subtitle: string;
    download: string;
    complete: string;
  };
  experience: {
    title: string;
    workTitle: string;
    educationTitle: string;
    educationText: string;
  };
  skills: {
    title: string;
    subtitle: string;
    scanner: {
      pause: string;
      play: string;
      reset: string;
      direction: string;
    };
    categories: {
      personal: string;
      school: string;
      digital: string;
      hobbies: string;
    };
    items: {
      personal: { id: string; name: string; level: number }[];
      school: { id: string; name: string; level: number }[];
      digital: { id: string; name: string; level: number }[];
      hobbies: { id: string; name: string; level: number }[];
    };
  };
  details: {
    title: string;
    languagesTitle: string;
    referencesTitle: string;
    interestsTitle: string;
    interests: {
      cook: string;
      "kung-fu": string;
      swim: string;
      music: string;
      nature: string;
      photography: string;
      walk: string;
      word: string;
      excel: string;
      code: string;
    };
  };
  contact: {
    title: string;
    subtitle: string;
    name: string;
    email: string;
    message: string;
    send: string;
    sending: string;
    success: string;
    error: string;
    captchaTitle: string;
    captchaPlaceholder: string;
    captchaInstruction: string;
    captchaError: string;
  };
  footer: {
    description: string;
    quickAccess: string;
    resume: string;
    technologiesTitle: string;
    technologiesDesc: string;
    contactTitle: string;
    rightsReserved: string;
  };
  notFound: {
    title: string;
    description: string;
    btnHome: string;
    btnBack: string;
    sitemapTitle: string;
  };
  errorPage: {
    title: string;
    description: string;
    btnRetry: string;
    btnHome: string;
  };
  recruiter: {
    floatingBtn: string;
    modalTitle: string;
    modalSubtitle: string;
    fieldName: string;
    fieldCompany: string;
    fieldPosition: string;
    fieldPhone: string;
    fieldEmail: string;
    fieldMessage: string;
    posKaufmann: string;
    posElektro: string;
    posOther: string;
    btnSubmit: string;
    successMessage: string;
  };
  matcher: {
    title: string;
    kaufmann: string;
    elektro: string;
    reset: string;
  };
}

import experiencesData from "./experiences.json";

export const experienceItems: Record<Language, ExperienceItem[]> =
  experiencesData as Record<Language, ExperienceItem[]>;

export const reportItems: Record<Language, ReportItem[]> = {
  de: [
    {
      term: "Zeugnisse 1. Sek",
      date: "2024",
      file: "/assets/pdfs/SekundarSchuleZeugnisse1sek.pdf",
    },
    {
      term: "Zeugnisse 2. Sek",
      date: "2025",
      file: "/assets/pdfs/SekundarSchuleZeugnisse2sek.pdf",
    },
    {
      term: "Zeugnisse 3. Sek",
      date: "2026",
      file: "/assets/pdfs/SekundarSchuleZeugnisse3sek.pdf",
    },
    {
      term: "Stellwerk 8 Testbericht",
      date: "2025",
      file: "/assets/pdfs/Stellwerk.pdf",
    },
    {
      term: "Multicheck Zertifikat",
      date: "2026",
      file: "/assets/pdfs/Multicheck.pdf",
    },
    {
      term: "Berufswahlanalyse Zertifikat",
      date: "2025",
      file: "/assets/pdfs/Berufswahlanalyse_Zertifikat.pdf",
    },
  ],
  tr: [
    {
      term: "1. Sek Okul Karneleri",
      date: "2024",
      file: "/assets/pdfs/SekundarSchuleZeugnisse1sek.pdf",
    },
    {
      term: "2. Sek Okul Karneleri",
      date: "2025",
      file: "/assets/pdfs/SekundarSchuleZeugnisse2sek.pdf",
    },
    {
      term: "3. Sek Okul Karneleri",
      date: "2026",
      file: "/assets/pdfs/SekundarSchuleZeugnisse3sek.pdf",
    },
    {
      term: "Stellwerk 8 Sınav Sonucu",
      date: "2025",
      file: "/assets/pdfs/Stellwerk.pdf",
    },
    {
      term: "Multicheck Sınav Sonucu",
      date: "2026",
      file: "/assets/pdfs/Multicheck.pdf",
    },
    {
      term: "Meslek Seçim Analizi Sertifikası",
      date: "2025",
      file: "/assets/pdfs/Berufswahlanalyse_Zertifikat.pdf",
    },
  ],
  en: [
    {
      term: "School Reports 1. Sek",
      date: "2024",
      file: "/assets/pdfs/SekundarSchuleZeugnisse1sek.pdf",
    },
    {
      term: "School Reports 2. Sek",
      date: "2025",
      file: "/assets/pdfs/SekundarSchuleZeugnisse2sek.pdf",
    },
    {
      term: "School Reports 3. Sek",
      date: "2026",
      file: "/assets/pdfs/SekundarSchuleZeugnisse3sek.pdf",
    },
    {
      term: "Stellwerk 8 Test Report",
      date: "2025",
      file: "/assets/pdfs/Stellwerk.pdf",
    },
    {
      term: "Multicheck Certificate",
      date: "2026",
      file: "/assets/pdfs/Multicheck.pdf",
    },
    {
      term: "Career Choice Analysis Certificate",
      date: "2025",
      file: "/assets/pdfs/Berufswahlanalyse_Zertifikat.pdf",
    },
  ],
};

export const languagesData: Record<Language, LanguageItem[]> = {
  de: [
    { code: "DE", name: "Deutsch", note: "Muttersprache", level: 100 },
    { code: "TR", name: "Türkisch", note: "Muttersprache", level: 100 },
    {
      code: "GB",
      name: "Englisch",
      note: "Schulkenntnisse (7. Jahr)",
      level: 70,
    },
    {
      code: "FR",
      name: "Französisch",
      note: "Schulkenntnisse (4. Jahr)",
      level: 55,
    },
  ],
  tr: [
    { code: "DE", name: "Almanca", note: "Ana Dil", level: 100 },
    { code: "TR", name: "Türkçe", note: "Ana Dil", level: 100 },
    { code: "GB", name: "İngilizce", note: "Okul Bilgisi (7. Yıl)", level: 70 },
    { code: "FR", name: "Fransızca", note: "Okul Bilgisi (4. Yıl)", level: 55 },
  ],
  en: [
    { code: "DE", name: "German", note: "Native Language", level: 100 },
    { code: "TR", name: "Turkish", note: "Native Language", level: 100 },
    {
      code: "GB",
      name: "English",
      note: "School Knowledge (7th Year)",
      level: 70,
    },
    {
      code: "FR",
      name: "French",
      note: "School Knowledge (4th Year)",
      level: 55,
    },
  ],
};

export const referencesData: Record<Language, ReferenceItem[]> = {
  de: [
    {
      name: "Thomas Seinige",
      title: "Klassenlehrer",
      email: "thomas.seinige@schulen.zuerich.ch",
      phone: "Auf Anfrage",
    },
    {
      name: "Cyrill Lam",
      title: "Kung‑Fu Lehrer (SKEMA)",
      email: "zuerich@skema.ch",
      phone: "044 401 40 42",
    },
  ],
  tr: [
    {
      name: "Thomas Seinige",
      title: "Sınıf Öğretmeni",
      email: "thomas.seinige@schulen.zuerich.ch",
      phone: "Talep üzerine",
    },
    {
      name: "Cyrill Lam",
      title: "Kung‑Fu Eğitmeni (SKEMA)",
      email: "zuerich@skema.ch",
      phone: "044 401 40 42",
    },
  ],
  en: [
    {
      name: "Thomas Seinige",
      title: "Class Teacher",
      email: "thomas.seinige@schulen.zuerich.ch",
      phone: "On request",
    },
    {
      name: "Cyrill Lam",
      title: "Kung‑Fu Instructor (SKEMA)",
      email: "zuerich@skema.ch",
      phone: "044 401 40 42",
    },
  ],
};

export const interestsData = [
  "Kochen",
  "Kung‑Fu",
  "Schwimmen",
  "Musik hören",
  "Natur",
  "Fotografieren",
  "Spazieren",
  "Word",
  "Excel",
  "Programmieren",
];

export const translations: Record<Language, TranslationSchema> = {
  de: {
    meta: {
      title: "Eren Aydin | Schüler Portfolio",
      description:
        "Persönliches Profil, schulische Unterlagen, Erfahrungen, Sprachkenntnisse und Projekte von Eren Aydin aus Zürich.",
    },
    nav: {
      about: "Über mich",
      documents: "Unterlagen",
      experience: "Schnupperlehren",
      skills: "Fähigkeiten",
      details: "Kompetenzen",
      contact: "Kontakt",
    },
    hero: {
      greeting: "Hallo, ich bin Eren",
      role: "Zukünftiger Elektroinstallateur EFZ",
      subtitle:
        "Gute Nachrichten! Die Suche hat ein Ende: Ab August 2026 bringe ich als angehender Elektroinstallateur EFZ bei der Firma Elektro Götz Spannung in die Leitungen. Stromkreis geschlossen! ⚡🔌",
      downloadCv: "Lebenslauf herunterladen",
      emailMe: "Kontakt aufnehmen",
      statusBadge: "LEHRSTELLE GEFUNDEN! 🎉",
    },
    about: {
      title: "Persönliches Profil",
      intro: "Wer bin ich & was mach ich? 🤔",
      description:
        'Ich heisse <span class="text-user-orange-dark dark:text-orange-400 font-bold">Eren</span>, bin <span class="text-user-yellow-dark dark:text-navy-300 font-semibold">16 Jahre alt</span>. Ich habe meine absolute Wunschlehrstelle gefunden! Ab August 2026 starte ich meine Ausbildung als <span class="text-user-orange-dark dark:text-orange-400 font-bold">Elektroinstallateur EFZ</span> bei der Firma <span class="text-user-green dark:text-green-400 font-semibold">Elektro Götz</span>. Ich freue mich riesig auf diese handwerkliche und technische Herausforderung, bei der ich mein technisches Verständnis und meine praktischen Fähigkeiten täglich unter Beweis stellen kann. Vielen Dank an alle, die mich auf diesem Weg unterstützt haben!',
      quickFactsTitle: "Meine Bewerbungsstatistiken",
      statsSchnupperLabel: "Schnupperlehren",
      statsSchnupperDesc: "so viele Schnupperlehren habe ich bisher besucht.",
      statsBewerbungLabel: "Lehrstellenbewerbungen",
      statsBewerbungDesc: "für eine Lehrstelle habe ich bisher abgeschickt.",
      statsLastUpdate: "Letzte Aktualisierung",
    },
    documents: {
      title: "Bewerbungsunterlagen",
      subtitle:
        "Hier finden Sie meine aktuellen Zeugnisse, Stellwerk- und Multicheck-Testergebnisse zum Download.",
      download: "PDF Herunterladen",
      complete: "Abgeschlossen",
    },
    experience: {
      title: "Schnupperlehren & Erfahrungen",
      workTitle: "Erfahrungen",
      educationTitle: "Ausbildung",
      educationText:
        "Aktuell: Dritte Sekundarstufe (Sek A) an der Sekundarschule Zürich Rebhügel (Abschluss 2026/2027).",
    },
    skills: {
      title: "Kompetenzen",
      subtitle:
        "Fähigkeiten, die ich in der Schule und bei Schnupperlehren erlernt habe",
      scanner: {
        pause: "Pause",
        play: "Play",
        reset: "Reset",
        direction: "Richtung",
      },
      categories: {
        personal: "Persönliche Stärken",
        school: "Schulische Stärken",
        digital: "IT & Digitale Medien",
        hobbies: "Interessen & Hobbys",
      },
      items: {
        personal: [
          {
            id: "reliability",
            name: "Zuverlässigkeit & Pünktlichkeit",
            level: 98,
          },
          { id: "teamwork", name: "Teamfähigkeit", level: 95 },
          { id: "helpfulness", name: "Hilfsbereitschaft", level: 95 },
          { id: "learning", name: "Lernbereitschaft & Fleiss", level: 90 },
          {
            id: "responsibility",
            name: "Verantwortungsbewusstsein",
            level: 85,
          },
        ],
        school: [
          { id: "geometry", name: "Geometrie & Zeichnen", level: 90 },
          { id: "math", name: "Mathematik & Rechnen", level: 85 },
          { id: "german", name: "Deutsch (Muttersprache)", level: 100 },
          { id: "turkish", name: "Türkisch (Muttersprache)", level: 100 },
          { id: "english", name: "Englisch (7. Schuljahr)", level: 70 },
        ],
        digital: [
          { id: "word", name: "Microsoft Word & Dokumente", level: 90 },
          { id: "excel", name: "Microsoft Excel & Tabellen", level: 85 },
          { id: "powerpoint", name: "Microsoft PowerPoint", level: 85 },
          { id: "web", name: "HTML5 & CSS3 (Grundlagen)", level: 65 },
          { id: "hardware", name: "PC & Hardware Verständnis", level: 80 },
        ],
        hobbies: [
          { id: "kung-fu", name: "Kung-Fu Sport (Disziplin)", level: 95 },
          { id: "swim", name: "Schwimmsport (Ausdauer)", level: 90 },
          { id: "cook", name: "Kochen & Rezepte", level: 80 },
          { id: "photography", name: "Fotografie & Natur", level: 75 },
          { id: "media", name: "Medien & Kommunikation", level: 80 },
        ],
      },
    },
    details: {
      title: "Fähigkeiten & Referenzen",
      languagesTitle: "Sprachkenntnisse",
      referencesTitle: "Referenzen",
      interestsTitle: "Interessen & Freizeit",
      interests: {
        cook: "Kochen",
        "kung-fu": "Kung‑Fu",
        swim: "Schwimmen",
        music: "Musik hören",
        nature: "Natur",
        photography: "Fotografieren",
        walk: "Spazieren",
        word: "Word",
        excel: "Excel",
        code: "Programmieren",
      },
    },
    contact: {
      title: "Kontakt",
      subtitle:
        "Haben Sie eine offene Lehrstelle oder Fragen? Schreiben Sie mir eine Nachricht.",
      name: "Name",
      email: "E-Mail",
      message: "Nachricht",
      send: "Nachricht senden",
      sending: "Wird gesendet...",
      success: "Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.",
      error: "Hoppla! Es gab ein Problem beim Senden Ihrer Nachricht.",
      captchaTitle: "Sicherheitsfrage",
      captchaPlaceholder: "Ihre Antwort",
      captchaInstruction:
        "Bitte lösen Sie diese einfache Rechenaufgabe, um Spam zu verhindern.",
      captchaError: "Falsche Sicherheitsantwort",
    },
    footer: {
      description:
        "Schüler mit Interesse an KV-Berufen und Bankwesen. Motiviert und bereit für neue Herausforderungen.",
      quickAccess: "Schnellzugriff",
      resume: "Lebenslauf",
      technologiesTitle: "Verwendete Technologien",
      technologiesDesc:
        "Diese Portfolio-Website wurde mit modernen Technologien entwickelt. Insgesamt wurden 12 verschiedene Technologien verwendet.",
      contactTitle: "Kontakt",
      rightsReserved: "Alle Rechte vorbehalten.",
    },
    notFound: {
      title: "Seite nicht gefunden",
      description: "Die gesuchte Seite existiert nicht oder wurde verschoben.",
      btnHome: "Zur Startseite",
      btnBack: "Zurückgehen",
      sitemapTitle: "Direkt dorthin springen:",
    },
    errorPage: {
      title: "Etwas ist schiefgelaufen",
      description:
        "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut oder gehen Sie zurück zur Startseite.",
      btnRetry: "Erneut versuchen",
      btnHome: "Zur Startseite",
    },
    recruiter: {
      floatingBtn: "Schnell-Einladung",
      modalTitle: "Schnelle Einladung erhalten",
      modalSubtitle:
        "Laden Sie mich unkompliziert zu einem Vorstellungsgespräch oder einer Schnupperlehre ein.",
      fieldName: "Ihr Name",
      fieldCompany: "Firma / Lehrbetrieb",
      fieldPosition: "Gewünschter Beruf",
      fieldPhone: "Telefonnummer (für Rückruf)",
      fieldEmail: "E-Mail-Adresse",
      fieldMessage: "Kurze Nachricht (optional)",
      posKaufmann: "Kaufmann/Kauffrau EFZ",
      posElektro: "Elektroinstallateur EFZ",
      posOther: "Schnupperlehre / Anderes",
      btnSubmit: "Senden, damit ich mich melde",
      successMessage:
        "Erfolgreich gesendet! Ich werde mich so schnell wie möglich bei Ihnen melden. Vielen Dank!",
    },
    matcher: {
      title: "Passen Sie Erens Profil an Ihren gesuchten Lehrberuf an:",
      kaufmann: "Kaufmann EFZ (KV)",
      elektro: "Elektroinstallateur EFZ",
      reset: "Zurücksetzen / Alle anzeigen",
    },
  },
  tr: {
    meta: {
      title: "Eren Aydın | Öğrenci Portfolyosu",
      description:
        "Zürih'ten Eren Aydın'ın kişisel profili, okul belgeleri, staj deneyimleri ve dil becerileri.",
    },
    nav: {
      about: "Hakkımda",
      documents: "Belgeler",
      experience: "Stajlar",
      skills: "Beceriler",
      details: "Yetkinlikler",
      contact: "İletişim",
    },
    hero: {
      greeting: "Merhaba, ben Eren",
      role: "Geleceğin Elektroinstallateur EFZ Adayı",
      subtitle:
        "Harika haber! Arama sona erdi: Ağustos 2026'dan itibaren Elektro Götz firmasında Elektroinstallateur EFZ (Elektrik Tesisatçısı) olarak kablolara gerilim katmaya başlıyorum. Devre tamamlandı! ⚡🔌",
      downloadCv: "Özgeçmişi İndir",
      emailMe: "İletişime Geç",
      statusBadge: "ÇIRAKLIK YERİ BULUNDU! 🎉",
    },
    about: {
      title: "Kişisel Profil",
      intro: "Ben kimim ve ne yapıyorum? 🤔",
      description:
        'Adım <span class="text-user-orange-dark dark:text-orange-400 font-bold">Eren</span>, <span class="text-user-yellow-dark dark:text-navy-300 font-semibold">16 yaşındayım</span>. Hayalimdeki çıraklık yerini buldum! Ağustos 2026\'dan itibaren <span class="text-user-green dark:text-green-400 font-semibold">Elektro Götz</span> firmasında <span class="text-user-orange-dark dark:text-orange-400 font-bold">Elektroinstallateur EFZ (Elektrik Tesisatçısı)</span> olarak eğitimime başlıyorum. Teknik anlayışımı ve pratik becerilerimi her gün sergileyebileceğim bu teknik ve el becerisi gerektiren yolculuk için çok heyecanlıyım. Bu süreçte beni destekleyen herkese çok teşekkür ederim!',
      quickFactsTitle: "Başvuru İstatistiklerim",
      statsSchnupperLabel: "Staj Deneyimleri",
      statsSchnupperDesc: "şimdiye kadar katıldığım staj sayısı.",
      statsBewerbungLabel: "Çıraklık Başvuruları",
      statsBewerbungDesc:
        "şimdiye kadar gönderdiğim çıraklık başvurusu sayısı.",
      statsLastUpdate: "Son Güncelleme",
    },
    documents: {
      title: "Başvuru Belgeleri",
      subtitle:
        "Güncel karne, Stellwerk ve Multicheck sınav sonuçlarımı buradan indirebilirsiniz.",
      download: "PDF İndir",
      complete: "Tamamlandı",
    },
    experience: {
      title: "Stajlar ve Deneyimler",
      workTitle: "Stajlar",
      educationTitle: "Eğitim",
      educationText:
        "Mevcut: Zürih Rebhügel Ortaokulu'nda 3. Sekundarstufe eğitimi (Mezuniyet 2026/2027).",
    },
    skills: {
      title: "Beceriler & Yetkinlikler",
      subtitle: "Okulda ve stajlarımda edindiğim kişisel ve pratik yetenekler",
      scanner: {
        pause: "Durdur",
        play: "Oynat",
        reset: "Sıfırla",
        direction: "Yön",
      },
      categories: {
        personal: "Kişisel Güçlü Yönler",
        school: "Okul Başarıları",
        digital: "BT ve Dijital Medya",
        hobbies: "İlgi Alanları & Hobiler",
      },
      items: {
        personal: [
          { id: "reliability", name: "Güvenilirlik & Dakiklik", level: 98 },
          { id: "teamwork", name: "Ekip Çalışması", level: 95 },
          { id: "helpfulness", name: "Yardımseverlik", level: 95 },
          { id: "learning", name: "Öğrenme İsteği & Çalışkanlık", level: 90 },
          { id: "responsibility", name: "Sorumluluk Bilinci", level: 85 },
        ],
        school: [
          { id: "geometry", name: "Geometri & Çizim", level: 90 },
          { id: "math", name: "Matematik & Hesaplama", level: 85 },
          { id: "german", name: "Almanca (Ana Dil)", level: 100 },
          { id: "turkish", name: "Türkçe (Ana Dil)", level: 100 },
          { id: "english", name: "İngilizce (7. Okul Yılı)", level: 70 },
        ],
        digital: [
          { id: "word", name: "Microsoft Word & Belgeler", level: 90 },
          { id: "excel", name: "Microsoft Excel & Tablolar", level: 85 },
          { id: "powerpoint", name: "Microsoft PowerPoint", level: 85 },
          { id: "web", name: "HTML5 & CSS3 (Temel Düzey)", level: 65 },
          { id: "hardware", name: "Bilgisayar & Donanım Bilgisi", level: 80 },
        ],
        hobbies: [
          { id: "kung-fu", name: "Kung-Fu Sporu (Disiplin)", level: 95 },
          { id: "swim", name: "Yüzme Sporu (Dayanıklılık)", level: 90 },
          { id: "cook", name: "Yemek Pişirme & Tarifler", level: 80 },
          { id: "photography", name: "Fotoğrafçılık & Doğa", level: 75 },
          { id: "media", name: "Medya & İletişim", level: 80 },
        ],
      },
    },
    details: {
      title: "Beceriler & Referanslar",
      languagesTitle: "Dil Becerileri",
      referencesTitle: "Referanslar",
      interestsTitle: "İlgi Alanları & Hobiler",
      interests: {
        cook: "Yemek Pişirme",
        "kung-fu": "Kung‑Fu",
        swim: "Yüzme",
        music: "Müzik dinlemek",
        nature: "Doğa",
        photography: "Fotoğrafçılık",
        walk: "Yürüyüş yapmak",
        word: "Word",
        excel: "Excel",
        code: "Programlama",
      },
    },
    contact: {
      title: "İletişim",
      subtitle:
        "Açık çıraklık pozisyonunuz mu var veya bir sorunuz mu var? Bana mesaj gönderin.",
      name: "İsim",
      email: "E-posta",
      message: "Mesajınız",
      send: "Mesajı Gönder",
      sending: "Gönderiliyor...",
      success: "Teşekkürler! Mesajınız başarıyla gönderildi.",
      error: "Hata! Mesajınız gönderilirken bir sorun oluştu.",
      captchaTitle: "Güvenlik Sorusu",
      captchaPlaceholder: "Yanıtınız",
      captchaInstruction:
        "Spamı önlemek için lütfen bu basit matematik işlemini çözün.",
      captchaError: "Yanlış güvenlik yanıtı",
    },
    footer: {
      description:
        "KV (Ticari) meslekleri ve bankacılık sektörü ile ilgilenen öğrenci. Yeni zorluklara hazır ve motive.",
      quickAccess: "Hızlı Erişim",
      resume: "Özgeçmiş",
      technologiesTitle: "Kullanılan Teknolojiler",
      technologiesDesc:
        "Bu portfolyo web sitesi modern teknolojilerle geliştirilmiştir. Toplamda 12 farklı teknoloji kullanılmıştır.",
      contactTitle: "İletişim",
      rightsReserved: "Tüm hakları saklıdır.",
    },
    notFound: {
      title: "Sayfa Bulunamadı",
      description:
        "Aradığınız sayfa mevcut değil veya başka bir yere taşınmış.",
      btnHome: "Ana Sayfaya Dön",
      btnBack: "Geri Dön",
      sitemapTitle: "Hızlıca şuralara göz atabilirsiniz:",
    },
    errorPage: {
      title: "Bir şeyler yanlış gitti",
      description:
        "Beklenmedik bir hata oluştu. Lütfen tekrar deneyin veya ana sayfaya dönün.",
      btnRetry: "Tekrar Dene",
      btnHome: "Ana Sayfaya Dön",
    },
    recruiter: {
      floatingBtn: "Mülakat Daveti",
      modalTitle: "Hızlı Mülakat Daveti",
      modalSubtitle:
        "Bana kolayca bir çıraklık yeri veya mülakat teklif edin. En kısa sürede size geri dönüş yapacağım!",
      fieldName: "Adınız Soyadınız",
      fieldCompany: "Şirket / Kurum",
      fieldPosition: "İlgili Pozisyon",
      fieldPhone: "Telefon Numaranız",
      fieldEmail: "E-posta Adresiniz",
      fieldMessage: "Kısa Mesaj (İsteğe bağlı)",
      posKaufmann: "Kaufmann EFZ (Ticari)",
      posElektro: "Elektroinstallateur EFZ (Elektrik)",
      posOther: "Staj / Diğer",
      btnSubmit: "Gönder ki Sana Dönüş Yapayım",
      successMessage:
        "Başarıyla gönderildi! En kısa sürede sizinle iletişime geçeceğim. Teşekkürler!",
    },
    matcher: {
      title:
        "Eren'in profilini aradığınız çıraklık mesleğine göre özelleştirin:",
      kaufmann: "Kaufmann EFZ (Ticari)",
      elektro: "Elektroinstallateur EFZ (Elektrik)",
      reset: "Filtreyi Sıfırla / Hepsini Göster",
    },
  },
  en: {
    meta: {
      title: "Eren Aydin | Student Portfolio",
      description:
        "Personal profile, school documents, trial apprenticeships, and language skills of Eren Aydin from Zurich.",
    },
    nav: {
      about: "About Me",
      documents: "Documents",
      experience: "Apprenticeships",
      skills: "Skills",
      details: "Competences",
      contact: "Contact",
    },
    hero: {
      greeting: "Hi, I'm Eren",
      role: "Future Electrical Installer EFZ",
      subtitle:
        "Great news! The search is officially over: Starting August 2026, I'll be bringing positive energy and wiring skills to Elektro Götz as a future Electrical Installer EFZ. Circuit complete! ⚡🔌",
      downloadCv: "Download Resume",
      emailMe: "Get in Touch",
      statusBadge: "APPRENTICESHIP FOUND! 🎉",
    },
    about: {
      title: "Personal Profile",
      intro: "Who am I & what do I do? 🤔",
      description:
        'My name is <span class="text-user-orange-dark dark:text-orange-400 font-bold">Eren</span>, I am <span class="text-user-yellow-dark dark:text-navy-300 font-semibold">16 years old</span>. I have officially found my dream apprenticeship! Starting August 2026, I will begin my training as an <span class="text-user-orange-dark dark:text-orange-400 font-bold">Electrical Installer EFZ</span> at <span class="text-user-green dark:text-green-400 font-semibold">Elektro Götz</span>. I am incredibly excited about this technical and hands-on challenge where I can apply my technical understanding and practical skills daily. Huge thanks to everyone who supported me along the way!',
      quickFactsTitle: "Application Statistics",
      statsSchnupperLabel: "Trial Apprenticeships",
      statsSchnupperDesc: "trial apprenticeships I have completed so far.",
      statsBewerbungLabel: "Apprenticeship Applications",
      statsBewerbungDesc: "applications I have sent out for an apprenticeship.",
      statsLastUpdate: "Last Updated",
    },
    documents: {
      title: "Application Documents",
      subtitle:
        "Here you can download my current school reports, Stellwerk, and Multicheck test results.",
      download: "Download PDF",
      complete: "Complete",
    },
    experience: {
      title: "Trial Apprenticeships & Experiences",
      workTitle: "Apprenticeships",
      educationTitle: "Education",
      educationText:
        "Current: Third secondary stage (Sek A) at Sekundarschule Zurich Rebhügel (Graduating 2026/2027).",
    },
    skills: {
      title: "Competencies",
      subtitle: "Skills acquired in school and during trial apprenticeships",
      scanner: {
        pause: "Pause",
        play: "Play",
        reset: "Reset",
        direction: "Direction",
      },
      categories: {
        personal: "Personal Strengths",
        school: "Academic Strengths",
        digital: "IT & Digital Media",
        hobbies: "Interests & Hobbies",
      },
      items: {
        personal: [
          { id: "reliability", name: "Reliability & Punctuality", level: 98 },
          { id: "teamwork", name: "Teamwork & Collaboration", level: 95 },
          { id: "helpfulness", name: "Helpfulness", level: 95 },
          {
            id: "learning",
            name: "Willingness to Learn & Diligence",
            level: 90,
          },
          { id: "responsibility", name: "Sense of Responsibility", level: 85 },
        ],
        school: [
          { id: "geometry", name: "Geometry & Drawing", level: 90 },
          { id: "math", name: "Mathematics & Arithmetic", level: 85 },
          { id: "german", name: "German (Native)", level: 100 },
          { id: "turkish", name: "Turkish (Native)", level: 100 },
          { id: "english", name: "English (7th School Year)", level: 70 },
        ],
        digital: [
          { id: "word", name: "Microsoft Word & Documents", level: 90 },
          { id: "excel", name: "Microsoft Excel & Spreadsheets", level: 85 },
          { id: "powerpoint", name: "Microsoft PowerPoint", level: 85 },
          { id: "web", name: "HTML5 & CSS3 (Basics)", level: 65 },
          { id: "hardware", name: "PC & Hardware Understanding", level: 80 },
        ],
        hobbies: [
          { id: "kung-fu", name: "Kung-Fu Sport (Discipline)", level: 95 },
          { id: "swim", name: "Swimming (Endurance)", level: 90 },
          { id: "cook", name: "Cooking & Recipes", level: 80 },
          { id: "photography", name: "Photography & Nature", level: 75 },
          { id: "media", name: "Media & Communication", level: 80 },
        ],
      },
    },
    details: {
      title: "Skills & References",
      languagesTitle: "Language Skills",
      referencesTitle: "References",
      interestsTitle: "Interests & Hobbies",
      interests: {
        cook: "Cooking",
        "kung-fu": "Kung‑Fu",
        swim: "Swimming",
        music: "Listening to music",
        nature: "Nature",
        photography: "Photography",
        walk: "Walking",
        word: "Word",
        excel: "Excel",
        code: "Programming",
      },
    },
    contact: {
      title: "Contact",
      subtitle:
        "Do you have an open apprenticeship position or any questions? Send me a message.",
      name: "Name",
      email: "Email",
      message: "Message",
      send: "Send Message",
      sending: "Sending...",
      success: "Thank you! Your message has been sent successfully.",
      error: "Oops! Something went wrong while sending your message.",
      captchaTitle: "Security Question",
      captchaPlaceholder: "Your Answer",
      captchaInstruction:
        "Please solve this simple math problem to prevent spam.",
      captchaError: "Incorrect security answer",
    },
    footer: {
      description:
        "Student interested in commercial (KV) professions and banking. Motivated and ready for new challenges.",
      quickAccess: "Quick Links",
      resume: "Resume",
      technologiesTitle: "Technologies Used",
      technologiesDesc:
        "This portfolio website was developed using modern technologies. A total of 12 different technologies were used.",
      contactTitle: "Contact",
      rightsReserved: "All rights reserved.",
    },
    notFound: {
      title: "Page Not Found",
      description:
        "The page you are looking for does not exist or has been moved.",
      btnHome: "Go to Homepage",
      btnBack: "Go Back",
      sitemapTitle: "Jump directly to:",
    },
    errorPage: {
      title: "Something went wrong",
      description:
        "An unexpected error occurred. Please try again or return to the homepage.",
      btnRetry: "Try Again",
      btnHome: "Go to Homepage",
    },
    recruiter: {
      floatingBtn: "Quick Invite",
      modalTitle: "Recruiter Quick Invite",
      modalSubtitle:
        "Offer me an apprenticeship or interview. I will get back to you as soon as possible!",
      fieldName: "Your Name",
      fieldCompany: "Company Name",
      fieldPosition: "Desired Position",
      fieldPhone: "Phone Number",
      fieldEmail: "Email Address",
      fieldMessage: "Short Message (optional)",
      posKaufmann: "Kaufmann EFZ (Commercial)",
      posElektro: "Elektroinstallateur EFZ (Electrical)",
      posOther: "Trial Apprenticeship / Other",
      btnSubmit: "Send so I can get back to you",
      successMessage:
        "Sent successfully! I will get back to you as soon as possible. Thank you!",
    },
    matcher: {
      title: "Customize Eren's profile based on your apprenticeship role:",
      kaufmann: "Commercial (Kaufmann)",
      elektro: "Electrical Installer",
      reset: "Reset Filter / Show All",
    },
  },
};
