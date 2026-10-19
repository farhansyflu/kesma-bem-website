import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Preloader } from "@/components/Preloader";
import { Geist } from "next/font/google";
import { ScrollProgress } from "@/components/ScrollProgress";
import "./globals.css";


const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KESMA BEM STDIIS Jember",
  description:
    "Pusat Pelayanan Kesejahteraan Mahasiswa STDIIS Jember: info beasiswa, barang temuan, dan laporan kehilangan barang.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${geist.variable}`}>
      <body className="flex min-h-screen flex-col">
        <noscript>
          <style>{`#preloader{display:none}.hero-anim,.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <Preloader />
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
