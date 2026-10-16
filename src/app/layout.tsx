import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Preloader } from "@/components/Preloader";
import { ScrollProgress } from "@/components/ScrollProgress";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
// Font serif hanya untuk judul (h1-h3). Hapus baris ini + aturan h1,h2,h3 di globals.css
// jika ingin seluruh situs memakai Inter saja.
const display = Fraunces({ subsets: ["latin"], variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  title: "KESMA BEM STDIIS Jember",
  description:
    "Pusat Pelayanan Kesejahteraan Mahasiswa STDIIS Jember: info beasiswa, barang temuan, dan laporan kehilangan barang.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} ${display.variable}`}>
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
