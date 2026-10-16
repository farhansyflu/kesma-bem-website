import { z } from "zod";

const text = (label: string, max: number) =>
  z
    .string({ required_error: `${label} wajib diisi` })
    .trim()
    .min(1, `${label} wajib diisi`)
    .max(max, `${label} maksimal ${max} karakter`);

const date = (label: string) =>
  z
    .string({ required_error: `${label} wajib diisi` })
    .regex(/^\d{4}-\d{2}-\d{2}$/, `${label} tidak valid`)
    .refine((v) => !Number.isNaN(Date.parse(v)), `${label} tidak valid`);

const httpUrl = z
  .string({ required_error: "URL wajib diisi" })
  .trim()
  .max(500, "URL terlalu panjang")
  .refine((v) => {
    try {
      const u = new URL(v);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  }, "URL harus diawali http:// atau https://");

export const temuanSchema = z.object({
  nama: text("Nama barang", 100),
  ciri_ciri: text("Ciri-ciri", 500),
  lokasi_ditemukan: text("Lokasi ditemukan", 150),
  tanggal_ditemukan: date("Tanggal ditemukan"),
});

export const hilangSchema = z.object({
  nama: text("Nama barang", 100),
  ciri_ciri: text("Ciri-ciri", 500),
  lokasi_terakhir: text("Lokasi terakhir", 150),
  tanggal_hilang: date("Tanggal hilang"),
});

export const beasiswaSchema = z
  .object({
    judul: text("Judul", 120),
    deskripsi: text("Deskripsi", 500),
    tanggal_awal: date("Tanggal awal"),
    tanggal_berakhir: date("Tanggal berakhir"),
    url_postingan: httpUrl,
  })
  .refine((d) => d.tanggal_berakhir >= d.tanggal_awal, {
    path: ["tanggal_berakhir"],
    message: "Tanggal berakhir tidak boleh sebelum tanggal awal",
  });

export const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(200),
});

export const uuidSchema = z.string().uuid();

// ---- Upload gambar ----
export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

/** Cek tipe file dari isi (magic bytes), bukan dari nama/Content-Type kiriman user. */
export function detectImage(b: Uint8Array): { ext: string; mime: string } | null {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { ext: "jpg", mime: "image/jpeg" };
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47)
    return { ext: "png", mime: "image/png" };
  if (
    b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
    b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50
  )
    return { ext: "webp", mime: "image/webp" };
  return null;
}
