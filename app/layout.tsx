import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "Antoine Capital Analyzer",
  applicationName: "Antoine Capital Analyzer",
  description: "Analyse long terme claire, rapide et fiable.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.svg",
    apple: "/apple-touch-icon.png"
  },
  appleWebApp: {
    capable: true,
    title: "Capital Analyzer",
    statusBarStyle: "default"
  }
};

export const viewport: Viewport = {
  themeColor: "#121417",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={inter.variable} data-scroll-behavior="smooth">
      <body className="font-sans antialiased">
        <ServiceWorkerRegistration />
        <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-4 pb-28 pt-5 sm:px-6">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
