import { notFound } from "next/navigation";
import { ItemForm } from "@/components/admin/ItemForm";
import { getTable } from "@/lib/tables";

export default async function NewPage({ params }: { params: Promise<{ table: string }> }) {
  const { table } = await params;
  const cfg = getTable(table);
  if (!cfg) notFound();
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-4 text-4xl font-bold">Tambah {cfg.label}</h1>
      <ItemForm
        slug={table}
        id={null}
        fields={cfg.fields}
        values={{}}
        hasActive={cfg.hasActive}
        photoRequired={cfg.photoRequired}
        currentPhotoUrl={null}
      />
    </div>
  );
}
