import type { Metadata } from "next";
import { Roboto_Flex, PT_Serif } from "next/font/google";
import "./globals.css";

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
  title: "Eren Aydin | Schüler Portfolio",
  description: "Persönliches Profil, schulische Unterlagen, Erfahrungen, Sprachkenntnisse und Projekte von Eren Aydin aus Zürich.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${robotoFlex.variable} ${ptSerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}
