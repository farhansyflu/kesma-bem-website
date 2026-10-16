const digits = (v?: string) => (v ?? "").replace(/\D/g, "");

export const ADMIN_WA = digits(process.env.NEXT_PUBLIC_ADMIN_WHATSAPP);
export const KETUA_WA = digits(process.env.NEXT_PUBLIC_KETUA_WHATSAPP) || ADMIN_WA;

export const FORM_LINKS = {
  kehilangan: process.env.NEXT_PUBLIC_FORM_KEHILANGAN_URL ?? "#",
  penemuan: process.env.NEXT_PUBLIC_FORM_PENEMUAN_URL ?? "#",
  kesmaPeduli: process.env.NEXT_PUBLIC_FORM_KESMA_PEDULI_URL ?? "#",
};

export const MAPS_LINK = process.env.NEXT_PUBLIC_MAPS ?? "#";

export function waLink(number: string, text: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function publicImageUrl(path: string | null | undefined, fallback: string) {
  if (!path) return fallback;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return fallback;
  // path hanya dibuat oleh server (uuid + ekstensi), tetap di-encode untuk aman
  const safe = path.split("/").map(encodeURIComponent).join("/");
  return `${base}/storage/v1/object/public/images/${safe}`;
}
