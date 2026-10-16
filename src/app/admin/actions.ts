"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getTable } from "@/lib/tables";
import type { FormState } from "@/lib/types";
import { MAX_IMAGE_BYTES, detectImage, loginSchema, uuidSchema } from "@/lib/validation";

const BUCKET = "images";

function refreshPublicPages() {
  revalidatePath("/", "layout");
}

/* ------------------------------ Auth ------------------------------ */

export async function signIn(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  // Pesan sengaja generik agar tidak membocorkan apakah email terdaftar
  const generic: FormState = { error: "Email atau password salah." };
  if (!parsed.success) return generic;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error || !data.user) return generic;

  const { data: admin } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();
  if (!admin) {
    await supabase.auth.signOut();
    return generic;
  }
  redirect("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/* --------------------------- Toggle aktif --------------------------- */

export async function toggleActive(slug: string, id: string, value: boolean): Promise<{ ok: boolean }> {
  const { supabase } = await requireAdmin();
  const cfg = getTable(slug);
  if (!cfg || !cfg.hasActive || !uuidSchema.safeParse(id).success || typeof value !== "boolean") {
    return { ok: false };
  }
  const { error } = await supabase.from(cfg.table).update({ is_active: value }).eq("id", id);
  if (error) return { ok: false };
  refreshPublicPages();
  revalidatePath("/admin");
  return { ok: true };
}

/* ------------------------------ Hapus ------------------------------ */

export async function deleteItem(slug: string, id: string): Promise<{ ok: boolean }> {
  const { supabase } = await requireAdmin();
  const cfg = getTable(slug);
  if (!cfg || !uuidSchema.safeParse(id).success) return { ok: false };

  const { data: row } = await supabase.from(cfg.table).select("foto_path").eq("id", id).maybeSingle();
  const { error } = await supabase.from(cfg.table).delete().eq("id", id);
  if (error) return { ok: false };
  if (row?.foto_path) await supabase.storage.from(BUCKET).remove([row.foto_path]);

  refreshPublicPages();
  revalidatePath("/admin");
  return { ok: true };
}

/* ------------------------- Tambah / ubah data ------------------------- */

export async function saveItem(
  slug: string,
  id: string | null,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const cfg = getTable(slug);
  if (!cfg) return { error: "Tabel tidak valid." };
  if (id !== null && !uuidSchema.safeParse(id).success) return { error: "ID tidak valid." };

  // 1) Validasi teks (zod membuang field yang tidak dikenal)
  const raw = Object.fromEntries(
    cfg.fields.map((f) => [f.name, formData.get(f.name)])
  );
  const parsed = cfg.schema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "");
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { fieldErrors };
  }
  const payload: Record<string, unknown> = { ...(parsed.data as Record<string, unknown>) };
  if (cfg.hasActive) payload.is_active = formData.get("is_active") === "on";

  // 2) Validasi & upload foto
  const file = formData.get("foto");
  let newPath: string | null = null;
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_IMAGE_BYTES) return { fieldErrors: { foto: "Ukuran foto maksimal 2 MB." } };
    const buf = new Uint8Array(await file.arrayBuffer());
    const kind = detectImage(buf);
    if (!kind) return { fieldErrors: { foto: "Format foto harus JPG, PNG, atau WebP." } };

    newPath = `${cfg.table}/${randomUUID()}.${kind.ext}`;
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(newPath, buf, { contentType: kind.mime, upsert: false });
    if (upErr) return { error: "Gagal mengunggah foto. Coba lagi." };
    payload.foto_path = newPath;
  } else if (id === null && cfg.photoRequired) {
    return { fieldErrors: { foto: "Foto wajib diunggah." } };
  }

  // 3) Simpan
  let oldPath: string | null = null;
  let dbError = false;
  if (id === null) {
    const { error } = await supabase.from(cfg.table).insert(payload);
    dbError = !!error;
  } else {
    if (newPath) {
      const { data: old } = await supabase.from(cfg.table).select("foto_path").eq("id", id).maybeSingle();
      oldPath = old?.foto_path ?? null;
    }
    const { error } = await supabase.from(cfg.table).update(payload).eq("id", id);
    dbError = !!error;
  }

  if (dbError) {
    if (newPath) await supabase.storage.from(BUCKET).remove([newPath]); // rollback upload
    return { error: "Gagal menyimpan data. Coba lagi." };
  }
  if (oldPath) await supabase.storage.from(BUCKET).remove([oldPath]);

  refreshPublicPages();
  redirect(`/admin?tab=${slug}`);
}
