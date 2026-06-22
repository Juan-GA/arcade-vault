import type { Metadata } from "next";
import { Press_Start_2P, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/app/context/session";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";

const pressStart2P = Press_Start_2P({
  weight: "400",
  variable: "--font-pixel",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arcade Vault",
  description: "The classic arcade game library",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${pressStart2P.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <div className="av-bg" />
        <div className="av-noise" />
        <SessionProvider>
          <Nav />
          <main className="av-main flex-1">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
