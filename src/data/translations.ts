export type Language = 'de' | 'tr' | 'en';

export interface ExperienceItem {
  type?: 'work' | 'education';
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
    categories: {
      personal: string;
      school: string;
      digital: string;
      hobbies: string;
    };
  };
  details: {
    title: string;
    languagesTitle: string;
    referencesTitle: string;
    interestsTitle: string;
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

import experiencesData from './experiences.json';

export const experienceItems: Record<Language, ExperienceItem[]> = experiencesData as Record<Language, ExperienceItem[]>;

export const reportItems: ReportItem[] = [
  { term: 'Zeugnisse 1. Sek (Gesamt)', date: '2024', file: '/assets/pdfs/SekundarSchuleZeugnisse1sek.pdf' },
  { term: 'Zeugnisse 2. Sek (Gesamt)', date: '2025', file: '/assets/pdfs/SekundarSchuleZeugnisse2sek.pdf' },
  { term: 'Semesterzeugnis 3. Sek – 1. Semester', date: '2026', file: '/assets/pdfs/SekundarSchuleZeugnisse3sek.pdf' }
];

export const languagesData: LanguageItem[] = [
  { code: 'DE', name: 'Deutsch', note: 'Muttersprache', level: 100 },
  { code: 'TR', name: 'Türkisch', note: 'Muttersprache', level: 100 },
  { code: 'GB', name: 'Englisch', note: 'Schulkenntnisse (7. Jahr)', level: 70 },
  { code: 'FR', name: 'Französisch', note: 'Schulkenntnisse (4. Jahr)', level: 55 }
];

export const referencesData: ReferenceItem[] = [
  { name: 'Thomas Seinige', title: 'Klassenlehrer', email: 'thomas.seinige@schulen.zuerich.ch', phone: 'Auf Anfrage' },
  { name: 'Cyrill Lam', title: 'Kung‑Fu Lehrer (SKEMA)', email: 'zuerich@skema.ch', phone: '044 401 40 42' }
];

export const interestsData = [
  'Kochen', 'Kung‑Fu', 'Schwimmen', 'Musik hören', 'Natur', 'Fotografieren', 'Spazieren', 'Word', 'Excel', 'Programmieren'
];

export const translations: Record<Language, TranslationSchema> = {
  de: {
    meta: {
      title: "Eren Aydin | Schüler Portfolio",
      description: "Persönliches Profil, schulische Unterlagen, Erfahrungen, Sprachkenntnisse und Projekte von Eren Aydin aus Zürich."
    },
    nav: {
      about: "Über mich",
      documents: "Unterlagen",
      experience: "Schnupperlehren",
      skills: "Fähigkeiten",
      details: "Kompetenzen",
      contact: "Kontakt"
    },
    hero: {
      greeting: "Hallo, ich bin Eren",
      role: "Schüler & Lehrstellensuchender",
      subtitle: "Ich besuche die 3. Sekundarstufe an der Sekundarschule Zürich Rebhügel und suche eine Lehrstelle als Kaufmann EFZ oder Elektroinstallateur EFZ.",
      downloadCv: "Lebenslauf herunterladen",
      emailMe: "Kontakt aufnehmen",
      statusBadge: "SUCHE EINE LEHRSTELLE"
    },
    about: {
      title: "Persönliches Profil",
      intro: "Wer bin ich & was mach ich? 🤔",
      description: "Ich heisse <span class=\"text-user-orange-dark dark:text-orange-400 font-bold\">Eren</span>, bin <span class=\"text-user-yellow-dark dark:text-navy-300 font-semibold\">16 Jahre alt</span> und besuche die dritte Sekundarstufe an der <span class=\"text-user-yellow-dark dark:text-navy-300 font-semibold\">Sekundarschule Zürich Rebhügel</span>. Meine Freunde und Lehrer beschreiben mich als <span class=\"text-user-green dark:text-green-400 font-semibold\">hilfsbereit</span>, <span class=\"text-user-green dark:text-green-400 font-semibold\">zuverlässig</span> und <span class=\"text-user-green dark:text-green-400 font-semibold\">offen für Neues</span>. Besonders im <span class=\"text-user-yellow-dark dark:text-navy-300 font-semibold\">Team</span> arbeite ich gerne, aber ich kann auch <span class=\"text-user-green dark:text-green-400 font-semibold\">eigenständig</span> Aufgaben gut organisieren und <span class=\"text-user-green dark:text-green-400 font-semibold\">Verantwortung</span> übernehmen. Zurzeit absolviere ich <span class=\"text-user-yellow-dark dark:text-navy-300 font-semibold\">Schnupperlehren</span>, um verschiedene <span class=\"text-user-yellow-dark dark:text-navy-300 font-semibold\">Berufe</span> und <span class=\"text-user-green dark:text-green-400 font-semibold\">Arbeitsumfelder</span> kennenzulernen. Besonders interessieren mich die <span class=\"text-user-yellow-dark dark:text-navy-300 font-semibold\">KV-Branche</span> sowie eine <span class=\"text-user-orange-dark dark:text-orange-400 font-bold\">Lehrstelle als Kaufmann EFZ</span>. Alternativ interessiert mich auch eine <span class=\"text-user-orange-dark dark:text-orange-400 font-bold\">Lehrstelle als Elektroinstallateur EFZ</span>, ein handwerklicher Beruf, der <span class=\"text-user-green dark:text-green-400 font-semibold\">technisches Verständnis</span> und <span class=\"text-user-green dark:text-green-400 font-semibold\">praktische Fähigkeiten</span> erfordert.",
      quickFactsTitle: "Meine Bewerbungsstatistiken",
      statsSchnupperLabel: "Schnupperlehren",
      statsSchnupperDesc: "so viele Schnupperlehren habe ich bisher besucht.",
      statsBewerbungLabel: "Lehrstellenbewerbungen",
      statsBewerbungDesc: "für eine Lehrstelle habe ich bisher abgeschickt.",
      statsLastUpdate: "Letzte Aktualisierung"
    },
    documents: {
      title: "Schulische Unterlagen",
      subtitle: "Hier finden Sie meine aktuellen Zeugnisse und Nachweise zum Download.",
      download: "PDF Herunterladen"
    },
    experience: {
      title: "Schnupperlehren & Erfahrungen",
      workTitle: "Erfahrungen",
      educationTitle: "Ausbildung",
      educationText: "Aktuell: Dritte Sekundarstufe (Sek A) an der Sekundarschule Zürich Rebhügel (Abschluss 2026/2027)."
    },
    skills: {
      title: "Kompetenzen",
      subtitle: "Fähigkeiten, die ich in der Schule und bei Schnupperlehren erlernt habe",
      categories: {
        personal: "Persönliche Stärken",
        school: "Schulische Stärken",
        digital: "IT & Digitale Medien",
        hobbies: "Interessen & Hobbys"
      }
    },
    details: {
      title: "Fähigkeiten & Referenzen",
      languagesTitle: "Sprachkenntnisse",
      referencesTitle: "Referenzen",
      interestsTitle: "Interessen & Freizeit"
    },
    contact: {
      title: "Kontakt",
      subtitle: "Haben Sie eine offene Lehrstelle oder Fragen? Schreiben Sie mir eine Nachricht.",
      name: "Name",
      email: "E-Mail",
      message: "Nachricht",
      send: "Nachricht senden",
      sending: "Wird gesendet...",
      success: "Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.",
      error: "Hoppla! Es gab ein Problem beim Senden Ihrer Nachricht.",
      captchaTitle: "Sicherheitsfrage",
      captchaPlaceholder: "Ihre Antwort",
      captchaInstruction: "Bitte lösen Sie diese einfache Rechenaufgabe, um Spam zu verhindern.",
      captchaError: "Falsche Sicherheitsantwort"
    },
    footer: {
      description: "Schüler mit Interesse an KV-Berufen und Bankwesen. Motiviert und bereit für neue Herausforderungen.",
      quickAccess: "Schnellzugriff",
      resume: "Lebenslauf",
      technologiesTitle: "Verwendete Technologien",
      technologiesDesc: "Diese Portfolio-Website wurde mit modernen Technologien entwickelt. Insgesamt wurden 12 verschiedene Technologien verwendet.",
      contactTitle: "Kontakt",
      rightsReserved: "Alle Rechte vorbehalten."
    },
    notFound: {
      title: "Seite nicht gefunden",
      description: "Die gesuchte Seite existiert nicht oder wurde verschoben.",
      btnHome: "Zur Startseite",
      btnBack: "Zurückgehen",
      sitemapTitle: "Direkt dorthin springen:"
    },
    errorPage: {
      title: "Etwas ist schiefgelaufen",
      description: "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut oder gehen Sie zurück zur Startseite.",
      btnRetry: "Erneut versuchen",
      btnHome: "Zur Startseite"
    },
    recruiter: {
      floatingBtn: "Schnell-Einladung",
      modalTitle: "Schnelle Einladung erhalten",
      modalSubtitle: "Laden Sie mich unkompliziert zu einem Vorstellungsgespräch oder einer Schnupperlehre ein.",
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
      successMessage: "Erfolgreich gesendet! Ich werde mich so schnell wie möglich bei Ihnen melden. Vielen Dank!"
    },
    matcher: {
      title: "Passen Sie Erens Profil an Ihren gesuchten Lehrberuf an:",
      kaufmann: "Kaufmann EFZ (KV)",
      elektro: "Elektroinstallateur EFZ",
      reset: "Zurücksetzen / Alle anzeigen"
    }
  },
  tr: {
    meta: {
      title: "Eren Aydın | Öğrenci Portfolyosu",
      description: "Zürih'ten Eren Aydın'ın kişisel profili, okul belgeleri, staj deneyimleri ve dil becerileri."
    },
    nav: {
      about: "Hakkımda",
      documents: "Belgeler",
      experience: "Stajlar",
      skills: "Beceriler",
      details: "Yetkinlikler",
      contact: "İletişim"
    },
    hero: {
      greeting: "Merhaba, ben Eren",
      role: "Öğrenci & Stajyer Adayı",
      subtitle: "Zürih Rebhügel Ortaokulu'nda 3. sınıf öğrencisiyim. Ticaret (Kaufmann EFZ) veya Elektrik Tesisatçılığı (Elektroinstallateur EFZ) alanında çıraklık eğitimi (Lehrstelle) arıyorum.",
      downloadCv: "Özgeçmişi İndir",
      emailMe: "İletişime Geç",
      statusBadge: "ÇIRAKLIK YERİ ARIYORUM"
    },
    about: {
      title: "Kişisel Profil",
      intro: "Ben kimim ve ne yapıyorum? 🤔",
      description: "Adım <span class=\"text-user-orange-dark dark:text-orange-400 font-bold\">Eren</span>, <span class=\"text-user-yellow-dark dark:text-navy-300 font-semibold\">16 yaşındayım</span> ve <span class=\"text-user-yellow-dark dark:text-navy-300 font-semibold\">Zürih Rebhügel Ortaokulu</span>'nda üçüncü sınıf öğrencisiyim. Arkadaşlarım ve öğretmenlerim beni <span class=\"text-user-green dark:text-green-400 font-semibold\">yardımsever</span>, <span class=\"text-user-green dark:text-green-400 font-semibold\">güvenilir</span> ve <span class=\"text-user-green dark:text-green-400 font-semibold\">yeniliklere açık</span> biri olarak tanımlar. Özellikle <span class=\"text-user-yellow-dark dark:text-navy-300 font-semibold\">ekip</span> halinde çalışmayı severim ancak görevleri <span class=\"text-user-green dark:text-green-400 font-semibold\">bağımsız</span> olarak organize edip <span class=\"text-user-green dark:text-green-400 font-semibold\">sorumluluk</span> da üstlenebilirim. Şu anda farklı meslekleri ve çalışma ortamlarını tanımak için <span class=\"text-user-yellow-dark dark:text-navy-300 font-semibold\">stajlar (Schnupperlehren)</span> yapıyorum. Özellikle ticaret sektörü ve <span class=\"text-user-orange-dark dark:text-orange-400 font-bold\">ticari çıraklık eğitimi (Kaufmann EFZ)</span> ile ilgileniyorum. Alternatif olarak, teknik anlayış ve pratik beceriler gerektiren bir el sanatı mesleği olan <span class=\"text-user-orange-dark dark:text-orange-400 font-bold\">elektrik tesisatçılığı (Elektroinstallateur EFZ)</span> çıraklık eğitimi de ilgimi çekiyor.",
      quickFactsTitle: "Başvuru İstatistiklerim",
      statsSchnupperLabel: "Staj Deneyimleri",
      statsSchnupperDesc: "şimdiye kadar katıldığım staj sayısı.",
      statsBewerbungLabel: "Çıraklık Başvuruları",
      statsBewerbungDesc: "şimdiye kadar gönderdiğim çıraklık başvurusu sayısı.",
      statsLastUpdate: "Son Güncelleme"
    },
    documents: {
      title: "Okul Belgeleri",
      subtitle: "Güncel karne ve staj belgelerimi buradan indirebilirsiniz.",
      download: "PDF İndir"
    },
    experience: {
      title: "Stajlar ve Deneyimler",
      workTitle: "Stajlar",
      educationTitle: "Eğitim",
      educationText: "Mevcut: Zürih Rebhügel Ortaokulu'nda 3. Sekundarstufe eğitimi (Mezuniyet 2026/2027)."
    },
    skills: {
      title: "Beceriler & Yetkinlikler",
      subtitle: "Okulda ve stajlarımda edindiğim kişisel ve pratik yetenekler",
      categories: {
        personal: "Kişisel Güçlü Yönler",
        school: "Okul Başarıları",
        digital: "BT ve Dijital Medya",
        hobbies: "İlgi Alanları & Hobiler"
      }
    },
    details: {
      title: "Beceriler & Referanslar",
      languagesTitle: "Dil Becerileri",
      referencesTitle: "Referanslar",
      interestsTitle: "İlgi Alanları & Hobiler"
    },
    contact: {
      title: "İletişim",
      subtitle: "Açık çıraklık pozisyonunuz mu var veya bir sorunuz mu var? Bana mesaj gönderin.",
      name: "İsim",
      email: "E-posta",
      message: "Mesajınız",
      send: "Mesajı Gönder",
      sending: "Gönderiliyor...",
      success: "Teşekkürler! Mesajınız başarıyla gönderildi.",
      error: "Hata! Mesajınız gönderilirken bir sorun oluştu.",
      captchaTitle: "Güvenlik Sorusu",
      captchaPlaceholder: "Yanıtınız",
      captchaInstruction: "Spamı önlemek için lütfen bu basit matematik işlemini çözün.",
      captchaError: "Yanlış güvenlik yanıtı"
    },
    footer: {
      description: "KV (Ticari) meslekleri ve bankacılık sektörü ile ilgilenen öğrenci. Yeni zorluklara hazır ve motive.",
      quickAccess: "Hızlı Erişim",
      resume: "Özgeçmiş",
      technologiesTitle: "Kullanılan Teknolojiler",
      technologiesDesc: "Bu portfolyo web sitesi modern teknolojilerle geliştirilmiştir. Toplamda 12 farklı teknoloji kullanılmıştır.",
      contactTitle: "İletişim",
      rightsReserved: "Tüm hakları saklıdır."
    },
    notFound: {
      title: "Sayfa Bulunamadı",
      description: "Aradığınız sayfa mevcut değil veya başka bir yere taşınmış.",
      btnHome: "Ana Sayfaya Dön",
      btnBack: "Geri Dön",
      sitemapTitle: "Hızlıca şuralara göz atabilirsiniz:"
    },
    errorPage: {
      title: "Bir şeyler yanlış gitti",
      description: "Beklenmedik bir hata oluştu. Lütfen tekrar deneyin veya ana sayfaya dönün.",
      btnRetry: "Tekrar Dene",
      btnHome: "Ana Sayfaya Dön"
    },
    recruiter: {
      floatingBtn: "Mülakat Daveti",
      modalTitle: "Hızlı Mülakat Daveti",
      modalSubtitle: "Bana kolayca bir çıraklık yeri veya mülakat teklif edin. En kısa sürede size geri dönüş yapacağım!",
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
      successMessage: "Başarıyla gönderildi! En kısa sürede sizinle iletişime geçeceğim. Teşekkürler!"
    },
    matcher: {
      title: "Eren'in profilini aradığınız çıraklık mesleğine göre özelleştirin:",
      kaufmann: "Kaufmann EFZ (Ticari)",
      elektro: "Elektroinstallateur EFZ (Elektrik)",
      reset: "Filtreyi Sıfırla / Hepsini Göster"
    }
  },
  en: {
    meta: {
      title: "Eren Aydin | Student Portfolio",
      description: "Personal profile, school documents, trial apprenticeships, and language skills of Eren Aydin from Zurich."
    },
    nav: {
      about: "About Me",
      documents: "Documents",
      experience: "Apprenticeships",
      skills: "Skills",
      details: "Competences",
      contact: "Contact"
    },
    hero: {
      greeting: "Hi, I'm Eren",
      role: "Student & Apprenticeship Seeker",
      subtitle: "I attend the 3rd secondary level at Sekundarschule Zurich Rebhügel and am looking for an apprenticeship as Kaufmann EFZ (Commercial) or Elektroinstallateur EFZ (Electrical Installer).",
      downloadCv: "Download Resume",
      emailMe: "Get in Touch",
      statusBadge: "APPRENTICESHIP SEEKER"
    },
    about: {
      title: "Personal Profile",
      intro: "Who am I & what do I do? 🤔",
      description: "My name is <span class=\"text-user-orange-dark dark:text-orange-400 font-bold\">Eren</span>, I am <span class=\"text-user-yellow-dark dark:text-navy-300 font-semibold\">16 years old</span> and attend the third secondary stage at <span class=\"text-user-yellow-dark dark:text-navy-300 font-semibold\">Sekundarschule Zurich Rebhügel</span>. My friends and teachers describe me as <span class=\"text-user-green dark:text-green-400 font-semibold\">helpful</span>, <span class=\"text-user-green dark:text-green-400 font-semibold\">reliable</span>, and <span class=\"text-user-green dark:text-green-400 font-semibold\">open to new things</span>. I especially enjoy working in a <span class=\"text-user-yellow-dark dark:text-navy-300 font-semibold\">team</span>, but I can also organize tasks well <span class=\"text-user-green dark:text-green-400 font-semibold\">independently</span> and take <span class=\"text-user-green dark:text-green-400 font-semibold\">responsibility</span>. Currently, I am doing <span class=\"text-user-yellow-dark dark:text-navy-300 font-semibold\">trial apprenticeships</span> to explore different professions and working environments. I am particularly interested in the commercial sector (<span class=\"text-user-orange-dark dark:text-orange-400 font-bold\">Kaufmann EFZ</span>). Alternatively, I am interested in an apprenticeship as an electrical installer (<span class=\"text-user-orange-dark dark:text-orange-400 font-bold\">Elektroinstallateur EFZ</span>), a handcraft profession requiring <span class=\"text-user-green dark:text-green-400 font-semibold\">technical understanding</span> and <span class=\"text-user-green dark:text-green-400 font-semibold\">practical skills</span>.",
      quickFactsTitle: "Application Statistics",
      statsSchnupperLabel: "Trial Apprenticeships",
      statsSchnupperDesc: "trial apprenticeships I have completed so far.",
      statsBewerbungLabel: "Apprenticeship Applications",
      statsBewerbungDesc: "applications I have sent out for an apprenticeship.",
      statsLastUpdate: "Last Updated"
    },
    documents: {
      title: "School Documents",
      subtitle: "Here you can download my current school reports and reference letters.",
      download: "Download PDF"
    },
    experience: {
      title: "Trial Apprenticeships & Experiences",
      workTitle: "Apprenticeships",
      educationTitle: "Education",
      educationText: "Current: Third secondary stage (Sek A) at Sekundarschule Zurich Rebhügel (Graduating 2026/2027)."
    },
    skills: {
      title: "Competencies",
      subtitle: "Skills acquired in school and during trial apprenticeships",
      categories: {
        personal: "Personal Strengths",
        school: "Academic Strengths",
        digital: "IT & Digital Media",
        hobbies: "Interests & Hobbies"
      }
    },
    details: {
      title: "Skills & References",
      languagesTitle: "Language Skills",
      referencesTitle: "References",
      interestsTitle: "Interests & Hobbies"
    },
    contact: {
      title: "Contact",
      subtitle: "Do you have an open apprenticeship position or any questions? Send me a message.",
      name: "Name",
      email: "Email",
      message: "Message",
      send: "Send Message",
      sending: "Sending...",
      success: "Thank you! Your message has been sent successfully.",
      error: "Oops! Something went wrong while sending your message.",
      captchaTitle: "Security Question",
      captchaPlaceholder: "Your Answer",
      captchaInstruction: "Please solve this simple math problem to prevent spam.",
      captchaError: "Incorrect security answer"
    },
    footer: {
      description: "Student interested in commercial (KV) professions and banking. Motivated and ready for new challenges.",
      quickAccess: "Quick Links",
      resume: "Resume",
      technologiesTitle: "Technologies Used",
      technologiesDesc: "This portfolio website was developed using modern technologies. A total of 12 different technologies were used.",
      contactTitle: "Contact",
      rightsReserved: "All rights reserved."
    },
    notFound: {
      title: "Page Not Found",
      description: "The page you are looking for does not exist or has been moved.",
      btnHome: "Go to Homepage",
      btnBack: "Go Back",
      sitemapTitle: "Jump directly to:"
    },
    errorPage: {
      title: "Something went wrong",
      description: "An unexpected error occurred. Please try again or return to the homepage.",
      btnRetry: "Try Again",
      btnHome: "Go to Homepage"
    },
    recruiter: {
      floatingBtn: "Quick Invite",
      modalTitle: "Recruiter Quick Invite",
      modalSubtitle: "Offer me an apprenticeship or interview. I will get back to you as soon as possible!",
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
      successMessage: "Sent successfully! I will get back to you as soon as possible. Thank you!"
    },
    matcher: {
      title: "Customize Eren's profile based on your apprenticeship role:",
      kaufmann: "Commercial (Kaufmann)",
      elektro: "Electrical Installer",
      reset: "Reset Filter / Show All"
    }
  }
};
