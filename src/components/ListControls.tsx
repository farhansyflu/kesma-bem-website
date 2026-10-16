"use client";

import { ChevronDown, ListFilter, Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function ListControls({
  label,
  placeholder,
  initialQ,
  initialSort,
}: {
  label: string;
  placeholder: string;
  initialQ: string;
  initialSort: "terbaru" | "terlama";
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const [q, setQ] = useState(initialQ);
  const [sort, setSort] = useState(initialSort);

  function go(nextQ: string, nextSort: string) {
    const sp = new URLSearchParams();
    if (nextQ.trim()) sp.set("q", nextQ.trim().slice(0, 60));
    if (nextSort === "terlama") sp.set("sort", "terlama");
    const s = sp.toString();
    router.push(s ? `${pathname}?${s}` : pathname);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    go(q, sort);
  }

  const field =
    "w-full rounded-xl border border-navy/20 bg-white py-2.5 focus:outline-none focus:ring-2 focus:ring-gold";

  return (
    <div>
      <div className="flex justify-end">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-3 rounded-full bg-navy px-5 py-2.5 font-medium text-paper hover:bg-navy-light"
        >
          Filter <ListFilter size={18} className="text-gold" />
        </button>
      </div>

      <div
        inert={!open}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <form
            onSubmit={onSubmit}
            role="search"
            className="mb-2 mt-4 grid gap-4 rounded-3xl border-t-4 border-gold bg-paper p-5 shadow-card md:grid-cols-[1fr_auto_auto] md:items-end"
          >
            <div>
              <label htmlFor="q" className="font-semibold">{label}</label>
              <div className="relative mt-2">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-mute" />
                <input
                  id="q"
                  value={q}
                  maxLength={60}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={placeholder}
                  className={`${field} pl-10 pr-3 placeholder:text-mute`}
                />
              </div>
            </div>
            <div>
              <label htmlFor="sort" className="font-semibold">Sortir</label>
              <div className="relative mt-2">
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) => {
                    const v = e.target.value === "terlama" ? "terlama" : "terbaru";
                    setSort(v);
                    go(q, v);
                  }}
                  className={`${field} appearance-none pl-3 pr-10 md:w-40`}
                >
                  <option value="terbaru">Terbaru</option>
                  <option value="terlama">Terlama</option>
                </select>
                <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-teal" />
              </div>
            </div>
            <button type="submit" className="rounded-full bg-gold px-6 py-2.5 font-semibold hover:bg-gold-light">
              Cari
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
