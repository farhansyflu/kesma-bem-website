import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Wajib dipanggil di setiap halaman & server action admin.
 * Memverifikasi token ke server Supabase (getUser) lalu memastikan user ada di tabel `admins`.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: admin } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!admin) redirect("/admin/login");

  return { supabase, user };
}
