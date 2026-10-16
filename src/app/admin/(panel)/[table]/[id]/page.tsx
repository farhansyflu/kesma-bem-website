import { notFound } from "next/navigation";
import { ItemForm } from "@/components/admin/ItemForm";
import { requireAdmin } from "@/lib/auth";
import { publicImageUrl } from "@/lib/config";
import { getTable } from "@/lib/tables";
import { uuidSchema } from "@/lib/validation";

export default async function EditPage({ params }: { params: Promise<{ table: string; id: string }> }) {
  const { table, id } = await params;
  const cfg = getTable(table);
  if (!cfg || !uuidSchema.safeParse(id).success) notFound();

  const { supabase } = await requireAdmin();
  const { data: row } = await supabase.from(cfg.table).select("*").eq("id", id).maybeSingle();
  if (!row) notFound();

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-4 text-4xl font-bold">Ubah {cfg.label}</h1>
      <ItemForm
        slug={table}
        id={id}
        fields={cfg.fields}
        values={row}
        hasActive={cfg.hasActive}
        photoRequired={cfg.photoRequired}
        currentPhotoUrl={row.foto_path ? publicImageUrl(row.foto_path, "") || null : null}
      />
    </div>
  );
}
