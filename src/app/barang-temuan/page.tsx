import type { Metadata } from "next";
import { ItemListPage } from "@/components/ItemListPage";
import { parseParams } from "@/lib/data";

export const metadata: Metadata = { title: "Barang Temuan | KESMA BEM STDIIS Jember" };

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = parseParams(await searchParams);
  return (
    <ItemListPage
      table="barang_temuan"
      basePath="/barang-temuan"
      params={params}
      title="Daftar Barang Temuan"
      subtitle="Kehilangan barang di area kampus STDIIS Jember? Cek daftar laporan temuan barang di bawah ini dan hubungi KESMA BEM STDIIS Jember untuk konfirmasi."
    />
  );
}
