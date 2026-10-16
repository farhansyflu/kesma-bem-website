import { createPublicClient } from "@/lib/supabase/public";

export type Sort = "terbaru" | "terlama";
export type ListParams = { q: string; sort: Sort; page: number };

export const DEFAULT_PARAMS: ListParams = { q: "", sort: "terbaru", page: 1 };

/** Hanya huruf, angka, spasi, dan '-' -> aman dipakai di filter PostgREST / ilike. */
export function sanitizeQuery(raw?: string) {
  return (raw ?? "")
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60);
}

type SP = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export function parseParams(sp: SP): ListParams {
  const page = Number.parseInt(first(sp.page) ?? "1", 10);
  return {
    q: sanitizeQuery(first(sp.q)),
    sort: first(sp.sort) === "terlama" ? "terlama" : "terbaru",
    page: Number.isFinite(page) && page > 0 && page < 10000 ? page : 1,
  };
}

type Source = {
  table: "barang_temuan" | "barang_hilang" | "beasiswa";
  dateCol: string;
  searchCols: string[];
  activeOnly: boolean;
};

const SOURCES: Record<Source["table"], Source> = {
  barang_temuan: {
    table: "barang_temuan",
    dateCol: "tanggal_ditemukan",
    searchCols: ["nama", "ciri_ciri", "lokasi_ditemukan"],
    activeOnly: true,
  },
  barang_hilang: {
    table: "barang_hilang",
    dateCol: "tanggal_hilang",
    searchCols: ["nama", "ciri_ciri", "lokasi_terakhir"],
    activeOnly: true,
  },
  beasiswa: {
    table: "beasiswa",
    dateCol: "tanggal_awal",
    searchCols: ["judul", "deskripsi"],
    activeOnly: false,
  },
};

export async function listRows<T = Record<string, any>>(
  table: Source["table"],
  params: ListParams,
  pageSize: number
): Promise<{ rows: T[]; total: number }> {
  const src = SOURCES[table];
  const supabase = createPublicClient();
  const from = (params.page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase.from(src.table).select("*", { count: "exact" });
  if (src.activeOnly) query = query.eq("is_active", true);
  if (params.q) {
    const term = `%${params.q}%`; // q sudah disanitasi
    query = query.or(src.searchCols.map((c) => `${c}.ilike.${term}`).join(","));
  }
  const asc = params.sort === "terlama";
  const { data, count, error } = await query
    .order(src.dateCol, { ascending: asc })
    .order("created_at", { ascending: asc })
    .range(from, to);

  if (error) {
    console.error(`[listRows:${table}]`, error.message);
    return { rows: [], total: 0 };
  }
  return { rows: (data ?? []) as T[], total: count ?? 0 };
}

export type TickerItem = { label: string; text: string; href: string };

/** Info terbaru untuk teks berjalan di bawah navbar (hanya data aktif/publik). */
export async function getTickerItems(): Promise<TickerItem[]> {
  try {
    const sb = createPublicClient();
    const [b, t, h] = await Promise.all([
      sb.from("beasiswa").select("judul").order("tanggal_awal", { ascending: false }).limit(2),
      sb.from("barang_temuan").select("nama, lokasi_ditemukan").eq("is_active", true)
        .order("tanggal_ditemukan", { ascending: false }).limit(2),
      sb.from("barang_hilang").select("nama, lokasi_terakhir").eq("is_active", true)
        .order("tanggal_hilang", { ascending: false }).limit(2),
    ]);
    return [
      ...(b.data ?? []).map((r) => ({ label: "Beasiswa", text: r.judul, href: "/beasiswa" })),
      ...(t.data ?? []).map((r) => ({ label: "Temuan", text: `${r.nama} ditemukan di ${r.lokasi_ditemukan}`, href: "/barang-temuan" })),
      ...(h.data ?? []).map((r) => ({ label: "Hilang", text: `${r.nama} dilaporkan hilang, terakhir di ${r.lokasi_terakhir}`, href: "/barang-hilang" })),
    ];
  } catch {
    return [];
  }
}
