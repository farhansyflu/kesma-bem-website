import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, GraduationCap, HandHeart, SearchCheck, ShieldAlert } from "lucide-react";
import { FORM_LINKS } from "@/lib/config";


const services = [
  {
    title: "Laporkan Kehilangan",
    desc: "Barangmu hilang di area kampus? Isi formulir laporannya.",
    icon: ShieldAlert,
    href: FORM_LINKS.kehilangan,
    external: true,
  },
  {
    title: "Laporkan Penemuan",
    desc: "Menemukan barang milik orang lain? Laporkan ke KESMA.",
    icon: SearchCheck,
    href: FORM_LINKS.penemuan,
    external: true,
  },
  {
    title: "Info Beasiswa",
    desc: "Pantau peluang beasiswa terbaru untuk mahasiswa STDIIS.",
    icon: GraduationCap,
    href: "/beasiswa",
    external: false,
  },
  {
    title: "Kesma Peduli",
    desc: "Sampaikan kebutuhan dan aspirasimu kepada KESMA.",
    icon: HandHeart,
    href: FORM_LINKS.kesmaPeduli,
    external: true,
  },
];

const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

export function Hero() {
  return (
    <>
      <section className="surface-hero relative overflow-hidden">
        {/* Kain satin emas: gambar dekoratif menempel absolut */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <Image
          src="/hero-satin.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover object-bottom"
          fill
          sizes="100vw"
          priority
          fetchPriority="high"
        />

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-5 pb-40 pt-14 text-center md:pb-48 md:pt-20">
          <div style={d(0.05)} className="hero-anim">
            <Image
              src="/logo.png"
              alt="Logo BEM STDIIS"
              width={112}
              height={112}
              priority
              className="h-24 w-24 rounded-full ring-2 ring-accent/60 ring-offset-4 ring-offset-transparent shadow-[0_0_60px_-8px_rgb(var(--accent)/0.65)] md:h-28 md:w-28"
            />
          </div>

          <p
            style={d(0.15)}
            className="hero-anim mt-6 inline-flex items-center gap-2 rounded-full border border-on-surface/30 px-4 py-1.5 text-sm font-medium"
          >
            <span className="h-2 w-2 rounded-full bg-accent" /> Kesejahteraan Mahasiswa BEM STDIIS Jember
          </p>

          <h1 style={d(0.28)} className="hero-anim hero-title mt-6 text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">
            Pusat Pelayanan Kesejahteraan Mahasiswa STDIIS Jember
          </h1>

          <p style={d(0.42)} className="hero-anim mt-6 max-w-2xl text-base leading-relaxed text-on-surface/80 sm:text-lg">
            Komitmen BEM STDIIS Jember dalam mengawal hak, fasilitas, serta kenyamanan lingkungan kampus demi tercapainya mahasiswa yang produktif dan berprestasi
          </p>
        </div>
      </section>

      {/* Dock layanan: menumpuk di tepi bawah hero */}
      <div className="relative z-20 mx-auto -mt-28 w-full max-w-6xl px-5 md:-mt-32">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => {
            const Icon = s.icon;
            const cls =
              "group flex h-full flex-col rounded-3xl border-t-4 border-gold bg-paper p-6 text-navy shadow-card transition duration-300 hover:-translate-y-1.5";
            const inner = (
              <>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-soft">
                  <Icon className="h-6 w-6" />
                </span>
                <h2 className="mt-4 text-xl font-bold leading-tight">{s.title}</h2>
                <p className="mt-2 text-sm text-ink">{s.desc}</p>
                <span className="mt-auto flex items-center gap-1 pt-5 text-sm font-semibold text-teal">
                  {s.external ? "Buka formulir" : "Lihat info"}
                  {s.external ? (
                    <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  ) : (
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  )}
                </span>
              </>
            );
            return (
              <div key={s.title} style={d(0.55 + i * 0.1)} className="hero-anim h-full">
                {s.external ? (
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className={cls}>
                    {inner}
                  </a>
                ) : (
                  <Link href={s.href} className={cls}>
                    {inner}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
