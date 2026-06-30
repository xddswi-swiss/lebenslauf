import type { Metadata, Viewport } from "next";
import { Roboto_Flex, PT_Serif } from "next/font/google";
import "./globals.css";
import "./bw-mode.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Script from "next/script";

const robotoFlex = Roboto_Flex({
  variable: "--font-sans",
  subsets: ["latin"],
});

const ptSerif = PT_Serif({
  variable: "--font-serif",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eren Aydin | Portfolio",
  description: "Persönliches Profil, schulische Unterlagen, Erfahrungen, Sprachkenntnisse und Projekte von Eren Aydin aus Zürich.",
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
      className={`${robotoFlex.variable} ${ptSerif.variable} h-full antialiased bw-mode`}
      suppressHydrationWarning
    >
      <head />
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Script
          id="theme-initializer"
          strategy="beforeInteractive"
        >
          {`
            (function() {
              var bw = localStorage.getItem('bw-mode');
              if (bw === 'false') {
                document.documentElement.classList.remove('bw-mode');
              } else {
                document.documentElement.classList.add('bw-mode');
              }
            })();

            // Prevent pinch-to-zoom on mobile devices (e.g. iOS Safari)
            document.addEventListener('gesturestart', function(e) {
              e.preventDefault();
            });
          `}
        </Script>
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

