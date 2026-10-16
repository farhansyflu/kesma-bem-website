"use client";

import { useState, useTransition } from "react";
import { toggleActive } from "@/app/admin/actions";

export function ToggleSwitch({ slug, id, initial }: { slug: string; id: string; initial: boolean }) {
  const [on, setOn] = useState(initial);
  const [failed, setFailed] = useState(false);
  const [pending, start] = useTransition();

  function flip() {
    const next = !on;
    setOn(next);
    setFailed(false);
    start(async () => {
      const res = await toggleActive(slug, id, next);
      if (!res.ok) {
        setOn(!next);
        setFailed(true);
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={on ? "Nonaktifkan laporan" : "Aktifkan laporan"}
        disabled={pending}
        onClick={flip}
        className={`relative h-7 w-12 rounded-full border transition-colors duration-300 ${
          on ? "border-teal bg-teal" : "border-navy/30 bg-cream"
        } disabled:opacity-60`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full shadow transition-all duration-300 ${
            on ? "left-[24px] bg-gold" : "left-0.5 bg-navy/60"
          }`}
        />
      </button>
      <span className="text-xs font-semibold">{on ? "Aktif" : "Nonaktif"}</span>
      {failed && <span role="alert" className="text-xs text-red-700">Gagal</span>}
    </div>
  );
}
