"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import type { TickerItem } from "@/lib/data";
import { InfoTicker } from "./InfoTicker";

const links = [
  { href: "/beasiswa", label: "Info Beasiswa" },
  { href: "/barang-temuan", label: "Barang Temuan" },
  { href: "/barang-hilang", label: "Barang Hilang" },
];

export function NavbarClient({ items }: { items: TickerItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-navy/10 bg-paper/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <Image src="/logo.png" alt="Logo BEM STDIIS" width={48} height={48} className="h-11 w-11 rounded-full" />
            <span>
              <span className="block text-lg font-bold leading-tight">KESMA BEM STDIIS</span>
              <span className="block text-sm leading-tight text-mute">Kesejahteraan Mahasiswa Jember</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Navigasi utama">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full px-5 py-2.5 font-medium transition ${
                    active ? "bg-gold font-semibold text-navy" : "text-ink hover:bg-gold/30 hover:text-navy"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            className="rounded-full p-2 hover:bg-gold/30 md:hidden"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        <div
          inert={!open}
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out md:hidden ${
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <nav className="space-y-1 px-5 pb-4" aria-label="Navigasi seluler">
              {[{ href: "/", label: "Beranda" }, ...links].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-full px-5 py-3 text-lg font-medium ${
                    pathname === l.href ? "bg-gold text-navy" : "text-ink"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>
      {items.length > 0 && <InfoTicker items={items} />}
    </>
  );
}
