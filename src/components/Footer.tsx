import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { KETUA_WA, waLink, MAPS_LINK } from "@/lib/config";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 21l1.65-4.85A8.5 8.5 0 1 1 8 19.4L3 21z" />
      <path d="M9 10c0 3 2 5 5 5l1.3-1.3a.7.7 0 0 0 0-1l-1.6-.9a.7.7 0 0 0-.8.1l-.5.5a3.5 3.5 0 0 1-1.7-1.7l.5-.5a.7.7 0 0 0 .1-.8l-.9-1.6a.7.7 0 0 0-1 0L9 10z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto bg-navy text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1fr_auto_auto] md:gap-20">
        <div className="flex items-center gap-4">
          <Image src="/logo.png" alt="Logo BEM STDIIS" width={96} height={96} className="h-20 w-20 rounded-full" />
          <div>
            <p className="font-display text-2xl font-bold">KESMA</p>
            <p className="text-sm text-paper/70">BEM STDIIS Jember</p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gold">Menu</h2>
          <ul className="mt-3 space-y-2 text-sm text-paper/85">
            <li><Link href="/beasiswa" className="hover:text-gold">Info Beasiswa</Link></li>
            <li><Link href="/barang-temuan" className="hover:text-gold">Barang Temuan</Link></li>
            <li><Link href="/barang-hilang" className="hover:text-gold">Kehilangan Barang</Link></li>
          </ul>
        </div>

        <div className="max-w-xs">
          <h2 className="text-xl font-bold text-gold">Sekretariat &amp; Kontak</h2>
          <p className="mt-3 flex gap-2 text-sm text-paper/85">
            <MapPin size={18} className="mt-0.5 shrink-0 text-gold" />
            <a
              href={MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold"
            >
              Jl. MH. Thamrin Gg. Nusantara No. 5, Gladak Pakem, Kranjingan, Kec. Sumbersari, Kabupaten Jember, Jawa Timur 68124 (STDI Imam Syafi&apos;i Jember)
            </a>
          </p>
          {KETUA_WA ? (
            <a
              href={waLink(KETUA_WA, "Halo Ketua KESMA, saya ingin bertanya.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center gap-2 text-sm text-paper/85 hover:text-gold"
            >
              <WhatsAppIcon className="h-[18px] w-[18px] text-gold" /> Ketua Kesma
            </a>
          ) : (
            <p className="mt-3 flex items-center gap-2 text-sm text-paper/85">
              <WhatsAppIcon className="h-[18px] w-[18px] text-gold" /> Ketua Kesma
            </p>
          )}
        </div>
      </div>
      <div className="border-t border-paper/10 py-4 text-center text-xs text-paper/60">
        © 2026 Kesejahteraan Mahasiswa. All rights reserved. <br className="md:hidden" />
      </div>
    </footer>
  );
}
