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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Block multi-touch on capture phase
              const blockZoom = function(e) {
                if (e.touches && e.touches.length > 1) {
                  e.preventDefault();
                }
              };
              document.addEventListener('touchstart', blockZoom, { passive: false, capture: true });
              document.addEventListener('touchmove', blockZoom, { passive: false, capture: true });
              
              // Block Safari gestures
              document.addEventListener('gesturestart', function(e) { e.preventDefault(); }, { passive: false, capture: true });
              document.addEventListener('gesturechange', function(e) { e.preventDefault(); }, { passive: false, capture: true });
              
              // Block double-tap zoom
              let lastTouchEnd = 0;
              document.addEventListener('touchend', function(e) {
                const now = (new Date()).getTime();
                if (now - lastTouchEnd <= 300) {
                  e.preventDefault();
                }
                lastTouchEnd = now;
              }, { passive: false, capture: true });
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeInitializer />
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
