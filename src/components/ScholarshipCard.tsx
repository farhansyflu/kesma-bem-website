import Image from "next/image";
import { ArrowRight, CalendarDays } from "lucide-react";
import { formatRange } from "@/lib/format";
import { publicImageUrl } from "@/lib/config";

export type Scholarship = {
  id: string;
  judul: string;
  deskripsi: string;
  tanggal_awal: string;
  tanggal_berakhir: string;
  url_postingan: string;
  foto_path: string | null;
};

export function ScholarshipCard({ s }: { s: Scholarship }) {
  const src = publicImageUrl(s.foto_path, "/placeholder-poster.svg");
  return (
    <a
      href={s.url_postingan}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col overflow-hidden rounded-3xl border-t-4 border-gold bg-paper shadow-card transition hover:-translate-y-1"
    >
      <div className="relative aspect-[4/5] w-full bg-gold-soft/40">
        <Image
          src={src}
          alt={`Poster ${s.judul}`}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 22vw"
          unoptimized={src.endsWith(".svg")}
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-gold bg-gold-soft px-3 py-1 text-[11px] font-bold uppercase">
          <CalendarDays size={12} /> {formatRange(s.tanggal_awal, s.tanggal_berakhir)}
        </span>
        <h3 className="mt-3 line-clamp-2 text-xl font-bold leading-tight">{s.judul}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-ink">{s.deskripsi}</p>
        <span className="mt-auto flex items-center gap-1 pt-5 text-sm font-semibold text-teal">
          Lihat postingan
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </a>
  );
}
