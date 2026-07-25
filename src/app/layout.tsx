import type { Metadata, Viewport } from "next";
import { Roboto_Flex, PT_Serif, Syne } from "next/font/google";
import "./globals.css";
import "./theme-yellow.css";
import "./theme-dark.css";
import "./bw-mode.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeInitializer } from "@/components/ThemeInitializer";
import CookieConsent from "@/components/CookieConsent";

const robotoFlex = Roboto_Flex({
  variable: "--font-sans",
  subsets: ["latin"],
});

const ptSerif = PT_Serif({
  variable: "--font-serif",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-logo",
  weight: ["800"],
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://erenaydin.ch";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Eren Aydin | Portfolio & Lebenslauf",
    template: "%s | Eren Aydin",
  },
  description:
    "Persönliches Profil, schulische Unterlagen, Erfahrungen, Sprachkenntnisse und Lehrstellen-Bewerbungen von Eren Aydin aus Zürich.",
  keywords: [
    "Eren Aydin",
    "Lebenslauf",
    "Portfolio",
    "Zürich",
    "Schweiz",
    "Kaufmann EFZ",
    "Elektroinstallateur EFZ",
    "Schnupperlehre",
    "Bewerbung",
    "Schulunterlagen",
  ],
  authors: [{ name: "Eren Aydin" }],
  creator: "Eren Aydin",
  publisher: "Eren Aydin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "de_CH",
    url: siteUrl,
    title: "Eren Aydin | Portfolio & Lebenslauf",
    description:
      "Persönliches Profil, schulische Unterlagen, Erfahrungen und Lehrstellen-Bewerbungen von Eren Aydin aus Zürich.",
    siteName: "Eren Aydin Portfolio",
    images: [
      {
        url: "/assets/bilder/eren-photo.png",
        width: 1200,
        height: 630,
        alt: "Eren Aydin Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eren Aydin | Portfolio & Lebenslauf",
    description:
      "Persönliches Profil, schulische Unterlagen, Erfahrungen und Lehrstellen-Bewerbungen von Eren Aydin aus Zürich.",
    images: ["/assets/bilder/eren-photo.png"],
  },
  alternates: {
    canonical: siteUrl,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Eren Aydin",
    url: siteUrl,
    image: `${siteUrl}/assets/bilder/eren-photo.png`,
    jobTitle: "Schüler & Lehrstellensuchender",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Zürich",
      addressCountry: "CH",
    },
    sameAs: [
      "https://github.com/yigiterenaydin",
      "https://www.instagram.com/eren_zhhh/",
    ],
    knowsLanguage: ["de", "tr", "en"],
  };

  return (
    <html
      lang="de"
      className={`${robotoFlex.variable} ${ptSerif.variable} ${syne.variable} h-full antialiased bw-mode`}
      suppressHydrationWarning
    >
      <head>
        <ThemeInitializer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider>
            {children}
            <CookieConsent />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
