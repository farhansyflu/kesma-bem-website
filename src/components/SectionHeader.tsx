import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";

export function SectionHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <Reveal>
      <div className="grid gap-3 md:grid-cols-[1fr_minmax(0,26rem)] md:items-end md:gap-12">
        <h2 className="text-4xl font-bold leading-tight sm:text-5xl">{title}</h2>
        <p className="text-ink">{desc}</p>
      </div>
    </Reveal>
  );
}

export function SeeAll({ href }: { href: string }) {
  return (
    <div className="mt-8 flex justify-end">
      <Link
        href={href}
        className="group inline-flex items-center gap-2 font-semibold text-teal hover:text-navy"
      >
        Lihat semua <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
