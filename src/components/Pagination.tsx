import Link from "next/link";

export function Pagination({
  page,
  totalPages,
  basePath,
  q,
  sort,
}: {
  page: number;
  totalPages: number;
  basePath: string;
  q: string;
  sort: string;
}) {
  const href = (p: number) => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (sort === "terlama") sp.set("sort", "terlama");
    if (p > 1) sp.set("page", String(p));
    const s = sp.toString();
    return s ? `${basePath}?${s}` : basePath;
  };
  const btn = "rounded-full border border-navy/30 px-4 py-2 font-medium";
  const prev = [
    { label: "<<", to: 1, disabled: page <= 1 },
    { label: "<", to: page - 1, disabled: page <= 1 },
  ];
  const next = [
    { label: ">", to: page + 1, disabled: page >= totalPages },
    { label: ">>", to: totalPages, disabled: page >= totalPages },
  ];
  const render = (b: { label: string; to: number; disabled: boolean }) =>
    b.disabled ? (
      <span key={b.label} aria-disabled className={`${btn} opacity-40`}>{b.label}</span>
    ) : (
      <Link key={b.label} href={href(b.to)} className={`${btn} hover:border-navy hover:bg-gold/30`}>{b.label}</Link>
    );

  return (
    <nav aria-label="Halaman" className="mt-12 flex items-center justify-center gap-2 sm:gap-3">
      {prev.map(render)}
      <span aria-current="page" className="flex h-10 min-w-10 items-center justify-center rounded-full bg-gold px-3 font-bold">
        {String(page).padStart(2, "0")}
      </span>
      {next.map(render)}
    </nav>
  );
}
