import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { signOut } from "../actions";

export const metadata: Metadata = { title: "Admin | KESMA BEM STDIIS Jember", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-navy/10 bg-paper/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5">
          <Link href="/admin" className="flex items-center gap-3">
            <Image src="/logo.png" alt="" width={44} height={44} className="h-11 w-11 rounded-full" />
            <span>
              <span className="block text-lg font-bold leading-tight">Panel Admin</span>
              <span className="block text-sm leading-tight text-mute">KESMA BEM STDIIS Jember</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="hidden rounded-full px-4 py-2 text-sm font-medium text-ink hover:bg-gold/30 sm:block">
              Lihat situs
            </Link>
            <form action={signOut}>
              <button className="flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-sm font-medium text-paper hover:bg-navy-light">
                <LogOut size={16} className="text-gold" /> Keluar
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10">{children}</main>
    </>
  );
}
