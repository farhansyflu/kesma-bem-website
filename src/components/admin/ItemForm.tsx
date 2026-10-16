"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveItem } from "@/app/admin/actions";
import type { Field } from "@/lib/tables";
import type { FormState } from "@/lib/types";

const input =
  "mt-1 w-full rounded-xl border border-navy/20 bg-white px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold";

export function ItemForm({
  slug,
  id,
  fields,
  values,
  hasActive,
  photoRequired,
  currentPhotoUrl,
}: {
  slug: string;
  id: string | null;
  fields: Field[];
  values: Record<string, any>;
  hasActive: boolean;
  photoRequired: boolean;
  currentPhotoUrl: string | null;
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveItem.bind(null, slug, id), {});
  const err = (n: string) =>
    state.fieldErrors?.[n] ? (
      <p role="alert" className="mt-1 text-sm text-red-700">{state.fieldErrors[n]}</p>
    ) : null;

  return (
    <form action={action} className="space-y-5 rounded-3xl border-t-4 border-gold bg-paper p-6 shadow-card">
      {fields.map((f) => (
        <div key={f.name}>
          <label htmlFor={f.name} className="font-bold">{f.label}</label>
          {f.type === "textarea" ? (
            <textarea id={f.name} name={f.name} required rows={4} maxLength={500} defaultValue={values[f.name] ?? ""} className={input} />
          ) : (
            <input
              id={f.name}
              name={f.name}
              type={f.type}
              required
              maxLength={f.type === "url" ? 500 : 150}
              defaultValue={values[f.name] ?? ""}
              className={input}
            />
          )}
          {err(f.name)}
        </div>
      ))}

      <div>
        <label htmlFor="foto" className="font-bold">
          Foto {photoRequired ? "" : "(opsional)"}
        </label>
        {currentPhotoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={currentPhotoUrl} alt="Foto saat ini" className="mt-2 h-28 rounded-xl ring-2 ring-gold object-cover" />
        )}
        <input
          id="foto"
          name="foto"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required={photoRequired && id === null}
          className={`${input} file:mr-3 file:rounded-full file:border-0 file:bg-navy file:px-4 file:py-1 file:text-paper`}
        />
        <p className="mt-1 text-xs text-mute">
          JPG, PNG, atau WebP, maksimal 2 MB.{id ? " Kosongkan jika tidak ingin mengganti foto." : ""}
          {!photoRequired && " Jika kosong, gambar alternatif akan ditampilkan."}
        </p>
        {err("foto")}
      </div>

      {hasActive && (
        <label className="flex items-center gap-2 font-medium">
          <input type="checkbox" name="is_active" defaultChecked={values.is_active ?? true} className="h-4 w-4 accent-teal" />
          Laporan aktif (tampil ke pengguna)
        </label>
      )}

      {state.error && <p role="alert" className="font-medium text-red-700">{state.error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={pending} className="rounded-full bg-gold px-6 py-2.5 font-semibold hover:bg-gold-light disabled:opacity-60">
          {pending ? "Menyimpan..." : "Simpan"}
        </button>
        <Link href={`/admin?tab=${slug}`} className="rounded-full border border-navy/30 px-6 py-2.5 font-medium hover:border-navy">
          Batal
        </Link>
      </div>
    </form>
  );
}
