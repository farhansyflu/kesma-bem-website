import { EmptyState } from "./EmptyState";
import { Footer } from "./Footer";
import { ItemCard, type ItemCardData } from "./ItemCard";
import { ListControls } from "./ListControls";
import { Navbar } from "./Navbar";
import { Pagination } from "./Pagination";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { listRows, type ListParams } from "@/lib/data";
import { publicImageUrl } from "@/lib/config";
import { formatDate } from "@/lib/format";

export const PAGE_SIZE_ITEMS = 8;

export function toCard(table: "barang_temuan" | "barang_hilang", r: Record<string, any>): ItemCardData {
  const temuan = table === "barang_temuan";
  return {
    id: r.id,
    nama: r.nama,
    ciri: r.ciri_ciri,
    lokasi: temuan ? r.lokasi_ditemukan : r.lokasi_terakhir,
    tanggal: formatDate(temuan ? r.tanggal_ditemukan : r.tanggal_hilang),
    foto: publicImageUrl(r.foto_path, "/placeholder-item.svg"),
    kind: temuan ? "temuan" : "hilang",
  };
}

export async function ItemListPage({
  table,
  title,
  subtitle,
  basePath,
  params,
}: {
  table: "barang_temuan" | "barang_hilang";
  title: string;
  subtitle: string;
  basePath: string;
  params: ListParams;
}) {
  const { rows, total } = await listRows(table, params, PAGE_SIZE_ITEMS);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE_ITEMS));
  const items = rows.map((r) => toCard(table, r));

  return (
    <>
      <Navbar />
      <main className="flex-1 px-5 pb-20 pt-14">
        <div className="mx-auto max-w-6xl">
          <SectionHeader title={title} desc={subtitle} />

          <div className="mt-10">
            <ListControls
              key={`${params.q}|${params.sort}`}
              label="Cari Barang"
              placeholder="Ketik barang yang anda cari..."
              initialQ={params.q}
              initialSort={params.sort}
            />
          </div>

          {items.length === 0 ? (
            <EmptyState message="Belum ada data yang cocok." />
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((it, i) => (
                <Reveal key={it.id} delay={(i % 4) * 90} className="h-full">
                  <ItemCard item={it} />
                </Reveal>
              ))}
            </div>
          )}
          <Pagination page={Math.min(params.page, totalPages)} totalPages={totalPages} basePath={basePath} q={params.q} sort={params.sort} />
        </div>
      </main>
      <Footer />
    </>
  );
}
