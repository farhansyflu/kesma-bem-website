"use client";

import Image from "next/image";
import { ArrowRight, MapPin, Star } from "lucide-react";
import { useRef, useState } from "react";
import { ADMIN_WA, waLink } from "@/lib/config";

export type ItemCardData = {
  id: string;
  nama: string;
  ciri: string;
  lokasi: string;
  tanggal: string;
  foto: string;
  kind: "temuan" | "hilang";
};

export function ItemCard({ item }: { item: ItemCardData }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [warn, setWarn] = useState(false);
  const temuan = item.kind === "temuan";
  const label = temuan ? "Lokasi ditemukan" : "Kemungkinan lokasi terakhir";

  function confirm() {
    if (!ADMIN_WA) {
      setWarn(true);
      return;
    }
    const text = temuan
      ? `Halo Admin KESMA, saya ingin mengonfirmasi barang temuan: "${item.nama}" (${item.lokasi}, ${item.tanggal}).`
      : `Halo Admin KESMA, saya menemukan barang yang hilang yaitu: "${item.nama}" (${item.lokasi}, ${item.tanggal}).`;
    window.open(waLink(ADMIN_WA, text), "_blank", "noopener,noreferrer");
    dialogRef.current?.close();
  }

  return (
    <div className="h-full">
      <button
        type="button"
        onClick={() => {
          setWarn(false);
          dialogRef.current?.showModal();
        }}
        className="group flex h-full w-full flex-col rounded-3xl border-t-4 border-gold bg-paper p-5 text-left shadow-card transition hover:-translate-y-1"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gold-soft/40 ring-2 ring-gold ring-offset-2 ring-offset-paper">
          <Image
            src={item.foto}
            alt={item.nama}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 22vw"
            unoptimized={item.foto.endsWith(".svg")}
            className="object-cover"
          />
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-gold bg-gold-soft px-3 py-1 text-[11px] font-bold uppercase">
            <Star size={11} fill="currentColor" /> {temuan ? "Temuan" : "Hilang"}
          </span>
          <span className="text-xs text-mute">{item.tanggal}</span>
        </div>

        <h3 className="mt-3 line-clamp-2 text-xl font-bold leading-tight">{item.nama}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-ink">{item.ciri}</p>

        <div className="mt-3 text-sm">
          <p className="text-xs text-mute">{label}</p>
          <p className="flex items-start gap-1 font-medium">
            <MapPin size={14} className="mt-0.5 shrink-0 text-teal" />
            <span className="line-clamp-2">{item.lokasi}</span>
          </p>
        </div>

        <span className="mt-auto flex items-center gap-1 pt-5 text-sm font-semibold text-teal">
          Konfirmasi barang
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </span>
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={`dlg-${item.id}`}
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="m-auto w-[90vw] max-w-sm rounded-3xl border-t-4 border-gold bg-paper p-7 text-navy shadow-2xl backdrop:bg-navy/70"
      >
        <h2 id={`dlg-${item.id}`} className="text-2xl font-bold leading-tight">
          {temuan ? "Apakah kamu ingin mengonfirmasi barang temuan ini?" : "Apakah kamu menemukan barang hilang ini?"}
        </h2>
        <p className="mt-3 text-sm text-ink">
          Kamu akan diarahkan ke WhatsApp admin untuk konfirmasi barang <strong className="text-navy">{item.nama}</strong>.
        </p>
        {warn && <p role="alert" className="mt-3 text-sm font-medium text-red-700">Nomor WhatsApp admin belum dikonfigurasi.</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="rounded-full border border-navy/30 px-5 py-2.5 font-medium hover:border-navy"
          >
            Tidak
          </button>
          <button
            type="button"
            onClick={confirm}
            className="rounded-full bg-gold px-6 py-2.5 font-semibold shadow-[0_8px_24px_-8px_rgba(248,210,74,0.8)] hover:bg-gold-light"
          >
            Iya
          </button>
        </div>
      </dialog>
    </div>
  );
}
