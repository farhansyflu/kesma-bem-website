import type { Metadata } from "next";
import { ItemListPage } from "@/components/ItemListPage";
import { parseParams } from "@/lib/data";

export const metadata: Metadata = { title: "Barang Hilang | KESMA BEM STDIIS Jember" };

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = parseParams(await searchParams);
  return (
    <ItemListPage
      table="barang_hilang"
      basePath="/barang-hilang"
      params={params}
      title="Daftar Laporan Kehilangan Barang"
      subtitle="Daftar barang yang dilaporkan hilang dan belum ditemukan di sekitar lingkungan kampus STDIIS Jember. Laporkan ke KESMA BEM STDIIS Jember jika barang anda hilang melalui web ini."
    />
  );
}
