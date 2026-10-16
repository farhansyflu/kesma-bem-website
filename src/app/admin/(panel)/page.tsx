import Image from "next/image";
import Link from "next/link";
import { MapPin, Pencil, Plus } from "lucide-react";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { ToggleSwitch } from "@/components/admin/ToggleSwitch";
import { publicImageUrl } from "@/lib/config";
import { getTable, TABLES } from "@/lib/tables";
import { requireAdmin } from "@/lib/auth";

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  const slug = tab && getTable(tab) ? tab : "barang-temuan";
  const cfg = getTable(slug)!;

  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from(cfg.table)
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  const rows = data ?? [];

  return (
    <>
      <h1 className="text-4xl font-bold sm:text-5xl">Dashboard</h1>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <nav className="flex flex-wrap gap-2" aria-label="Tabel data">
          {Object.entries(TABLES).map(([s, t]) => (
            <Link
              key={s}
              href={`/admin?tab=${s}`}
              aria-current={s === slug ? "page" : undefined}
              className={`rounded-full px-5 py-2 text-sm font-medium transition sm:text-base ${
                s === slug ? "bg-gold font-semibold" : "border border-navy/20 text-ink hover:bg-gold/30"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </nav>
        <Link href={`/admin/${slug}/new`} className="flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 font-medium text-paper hover:bg-navy-light">
          <Plus size={18} className="text-gold" /> Tambah {cfg.label}
        </Link>
      </div>

      {error && <p role="alert" className="mt-6 font-medium text-red-700">Gagal memuat data.</p>}
      {!error && rows.length === 0 && (
        <div className="mt-8 flex min-h-[240px] items-center justify-center rounded-3xl border-2 border-dashed border-gold bg-paper/70 p-8 text-center font-medium text-ink">
          Belum ada data.
        </div>
      )}

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {rows.map((r) => {
          const s = cfg.summary(r);
          const photo = publicImageUrl(r.foto_path, "/placeholder-item.svg");
          return (
            <article
              key={r.id}
              className={`rounded-3xl border-t-4 border-gold bg-paper p-5 shadow-card transition ${
                cfg.hasActive && !r.is_active ? "opacity-70" : ""
              }`}
            >
              <div className="grid grid-cols-[96px_1fr] gap-4">
                <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-gold-soft/40 ring-2 ring-gold ring-offset-2 ring-offset-paper">
                  <Image src={photo} alt="" fill sizes="96px" unoptimized={photo.endsWith(".svg")} className="object-cover" />
                </div>
                <div className="min-w-0">
                  <h2 className="line-clamp-1 text-xl font-bold">{s.title}</h2>
                  <p className="mt-1 line-clamp-2 text-sm text-ink">{s.desc}</p>
                  <p className="mt-2 flex items-center gap-1 text-xs font-medium">
                    <MapPin size={12} className="shrink-0 text-teal" /> <span className="line-clamp-1">{s.meta}</span>
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-navy/10 pt-4">
                {cfg.hasActive ? <ToggleSwitch slug={slug} id={r.id} initial={!!r.is_active} /> : <span />}
                <div className="flex gap-2">
                  <Link href={`/admin/${slug}/${r.id}`} className="flex items-center gap-1 rounded-full border border-navy/30 px-3.5 py-1.5 text-sm font-medium hover:border-navy hover:bg-gold/30">
                    <Pencil size={14} /> Ubah
                  </Link>
                  <DeleteButton slug={slug} id={r.id} name={s.title} />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
