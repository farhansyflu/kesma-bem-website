import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HomeSection } from "@/components/HomeSection";
import { ItemCard } from "@/components/ItemCard";
import { toCard } from "@/components/ItemListPage";
import { Navbar } from "@/components/Navbar";
import { Reveal } from "@/components/Reveal";
import { ScholarshipCard, type Scholarship } from "@/components/ScholarshipCard";
import { DEFAULT_PARAMS, listRows } from "@/lib/data";
import Image from "next/image";

export const revalidate = 60;

export default async function HomePage() {
  const [beasiswa, temuan, hilang] = await Promise.all([
    listRows<Scholarship>("beasiswa", DEFAULT_PARAMS, 4),
    listRows("barang_temuan", DEFAULT_PARAMS, 4),
    listRows("barang_hilang", DEFAULT_PARAMS, 4),
  ]);

  const sections = [
    {
      key: "beasiswa",
      title: "Beasiswa Terbaru",
      desc: "Peluang bantuan pendanaan dan program beasiswa terbaru untuk mendukung studi mahasiswa STDIIS Jember.",
      emptyMessage: "Belum ada info beasiswa.",
      href: "/beasiswa",
      rows: beasiswa.rows,
      renderCards: (rows: unknown[]) =>
        rows.map((s) => <ScholarshipCard key={(s as Scholarship).id} s={s as Scholarship} />),
      topPadding: true,
    },
    {
      key: "temuan",
      title: "Barang Temuan",
      desc: "Barang yang ditemukan di lingkungan kampus. Kenali barangmu dan konfirmasi ke admin KESMA.",
      emptyMessage: "Belum ada barang temuan.",
      href: "/barang-temuan",
      rows: temuan.rows,
      renderCards: (rows: unknown[]) =>
        rows.map((r) => <ItemCard key={(r as Record<string, any>).id} item={toCard("barang_temuan", r as Record<string, any>)} />),
    },
    {
      key: "hilang",
      title: "Laporan Kehilangan Barang",
      desc: "Barang yang dilaporkan hilang dan belum ditemukan. Pernah melihatnya? Hubungi admin KESMA.",
      emptyMessage: "Belum ada laporan kehilangan barang.",
      href: "/barang-hilang",
      rows: hilang.rows,
      renderCards: (rows: unknown[]) =>
        rows.map((r) => <ItemCard key={(r as Record<string, any>).id} item={toCard("barang_hilang", r as Record<string, any>)} />),
    },
  ];

  return (
    <>
      <Navbar />
      <main>
        <Hero />

        {sections.map(({ key, title, desc, emptyMessage, href, rows, renderCards, topPadding }) => (
          <HomeSection
            key={key}
            title={title}
            desc={desc}
            href={href}
            emptyMessage={emptyMessage}
            rows={rows}
            renderCards={renderCards}
            topPadding={topPadding}
          />
        ))}

        <section className="relative overflow-hidden px-5 pb-[9vw]">
          <Image
            src="/faq-wave.svg"
            alt=""
            aria-hidden="true"
            width={1440}
            height={400}
            sizes="100vw"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-auto w-full select-none"
          />
          <div className="relative z-10">
            <Reveal>
              <h2 className="mb-8 text-center text-4xl font-bold sm:text-5xl">FAQ</h2>
              <Faq />
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
