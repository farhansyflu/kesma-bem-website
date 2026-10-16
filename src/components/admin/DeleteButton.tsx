"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { deleteItem } from "@/app/admin/actions";

export function DeleteButton({ slug, id, name }: { slug: string; id: string; name: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!window.confirm(`Hapus "${name}"? Tindakan ini tidak dapat dibatalkan.`)) return;
        start(async () => {
          const res = await deleteItem(slug, id);
          if (!res.ok) window.alert("Gagal menghapus data.");
        });
      }}
      className="flex items-center gap-1 rounded-full border border-red-800/60 px-3.5 py-1.5 text-sm font-medium text-red-800 hover:bg-red-50 disabled:opacity-50"
    >
      <Trash2 size={14} /> Hapus
    </button>
  );
}
