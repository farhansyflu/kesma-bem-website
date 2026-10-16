import Link from "next/link";
import type { TickerItem } from "@/lib/data";

export function InfoTicker({ items }: { items: TickerItem[] }) {
  // ulangi agar selalu lebih lebar dari layar, lalu gandakan untuk loop mulus (-50%)
  const row = [...items, ...items, ...items];
  const render = (hidden: boolean) =>
    row.map((it, i) => (
      <Link
        key={`${hidden ? "b" : "a"}${i}`}
        href={it.href}
        tabIndex={hidden ? -1 : undefined}
        aria-hidden={hidden || undefined}
        className="mx-6 inline-flex items-center gap-3 whitespace-nowrap text-sm font-medium hover:underline"
      >
        <span className="rounded-full bg-navy px-3 py-0.5 text-[11px] font-bold uppercase text-paper">{it.label}</span>
        {it.text}
        <span className="ml-6 h-1.5 w-1.5 rounded-full bg-navy/40" />
      </Link>
    ));

  return (
    <div className="flex bg-gold text-navy" role="region" aria-label="Info terbaru">
      <div className="flex shrink-0 items-center gap-2 bg-navy px-4 py-3 text-sm font-semibold text-gold sm:px-6">
        <span className="h-2 w-2 rounded-full bg-gold" /> Info terbaru
      </div>
      <div className="marquee min-w-0 flex-1 overflow-hidden py-3">
        <div className="marquee-track">
          <div className="flex">{render(false)}</div>
          <div className="flex" aria-hidden>{render(true)}</div>
        </div>
      </div>
    </div>
  );
}
