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
import ZoomBlocker from "@/components/ZoomBlocker";
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

export const metadata: Metadata = {
  title: "Eren Aydin | Portfolio",
  description:
    "Persönliches Profil, schulische Unterlagen, Erfahrungen, Sprachkenntnisse und Projekte von Eren Aydin aus Zürich.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${robotoFlex.variable} ${ptSerif.variable} ${syne.variable} h-full antialiased bw-mode`}
      suppressHydrationWarning
    >
      <head />
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeInitializer />
        <ThemeProvider>
          <LanguageProvider>
            {children}
            <CookieConsent />
            <ZoomBlocker />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
