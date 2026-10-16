import type { ZodTypeAny } from "zod";
import { beasiswaSchema, hilangSchema, temuanSchema } from "./validation";

export type Field = {
  name: string;
  label: string;
  type: "text" | "textarea" | "date" | "url";
};

export type TableConfig = {
  table: "barang_temuan" | "barang_hilang" | "beasiswa";
  label: string;
  hasActive: boolean;
  photoRequired: boolean;
  schema: ZodTypeAny;
  fields: Field[];
  /** ringkasan untuk kartu di dashboard admin */
  summary: (row: Record<string, any>) => { title: string; desc: string; meta: string };
};

export const TABLES: Record<string, TableConfig> = {
  "barang-temuan": {
    table: "barang_temuan",
    label: "Barang Temuan",
    hasActive: true,
    photoRequired: true,
    schema: temuanSchema,
    fields: [
      { name: "nama", label: "Nama barang", type: "text" },
      { name: "ciri_ciri", label: "Ciri-ciri barang", type: "textarea" },
      { name: "lokasi_ditemukan", label: "Lokasi ditemukan", type: "text" },
      { name: "tanggal_ditemukan", label: "Tanggal ditemukan", type: "date" },
    ],
    summary: (r) => ({
      title: r.nama,
      desc: r.ciri_ciri,
      meta: `${r.lokasi_ditemukan} • ${r.tanggal_ditemukan}`,
    }),
  },
  "barang-hilang": {
    table: "barang_hilang",
    label: "Barang Hilang",
    hasActive: true,
    photoRequired: false,
    schema: hilangSchema,
    fields: [
      { name: "nama", label: "Nama barang", type: "text" },
      { name: "ciri_ciri", label: "Ciri-ciri barang", type: "textarea" },
      { name: "lokasi_terakhir", label: "Kemungkinan lokasi terakhir", type: "text" },
      { name: "tanggal_hilang", label: "Kemungkinan tanggal hilang", type: "date" },
    ],
    summary: (r) => ({
      title: r.nama,
      desc: r.ciri_ciri,
      meta: `${r.lokasi_terakhir} • ${r.tanggal_hilang}`,
    }),
  },
  beasiswa: {
    table: "beasiswa",
    label: "Beasiswa",
    hasActive: false,
    photoRequired: false,
    schema: beasiswaSchema,
    fields: [
      { name: "judul", label: "Judul", type: "text" },
      { name: "deskripsi", label: "Deskripsi", type: "textarea" },
      { name: "tanggal_awal", label: "Tanggal awal", type: "date" },
      { name: "tanggal_berakhir", label: "Tanggal berakhir", type: "date" },
      { name: "url_postingan", label: "URL postingan", type: "url" },
    ],
    summary: (r) => ({
      title: r.judul,
      desc: r.deskripsi,
      meta: `${r.tanggal_awal} s/d ${r.tanggal_berakhir}`,
    }),
  },
};

export function getTable(slug: string): TableConfig | null {
  return Object.prototype.hasOwnProperty.call(TABLES, slug) ? TABLES[slug] : null;
}
