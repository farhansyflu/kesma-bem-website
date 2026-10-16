import { EmptyState } from "@/components/EmptyState";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Reveal } from "@/components/Reveal";
import { ItemCard } from "@/components/ItemCard";
import { toCard } from "@/components/ItemListPage";
import { Navbar } from "@/components/Navbar";
import { ScholarshipCard, type Scholarship } from "@/components/ScholarshipCard";
import { SectionHeader, SeeAll } from "@/components/SectionHeader";
import { DEFAULT_PARAMS, listRows } from "@/lib/data";
import Image from "next/image";

export const revalidate = 60;

export default async function HomePage() {
  const [beasiswa, temuan, hilang] = await Promise.all([
    listRows<Scholarship>("beasiswa", DEFAULT_PARAMS, 4),
    listRows("barang_temuan", DEFAULT_PARAMS, 4),
    listRows("barang_hilang", DEFAULT_PARAMS, 4),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <Hero />

        <section className="px-5 py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader
              title="Beasiswa Terbaru"
              desc="Peluang bantuan pendanaan dan program beasiswa terbaru untuk mendukung studi mahasiswa STDIIS Jember."
            />
            {beasiswa.rows.length === 0 ? (
              <EmptyState message="Belum ada info beasiswa." />
            ) : (
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {beasiswa.rows.map((s, i) => (
                  <Reveal key={s.id} delay={i * 90} className="h-full">
                    <ScholarshipCard s={s} />
                  </Reveal>
                ))}
              </div>
            )}
            <SeeAll href="/beasiswa" />
          </div>
        </section>

        <section className="px-5 pb-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader
              title="Barang Temuan"
              desc="Barang yang ditemukan di lingkungan kampus. Kenali barangmu dan konfirmasi ke admin KESMA."
            />
            {temuan.rows.length === 0 ? (
              <EmptyState message="Belum ada barang temuan." />
            ) : (
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {temuan.rows.map((r, i) => (
                  <Reveal key={r.id} delay={i * 90} className="h-full">
                    <ItemCard item={toCard("barang_temuan", r)} />
                  </Reveal>
                ))}
              </div>
            )}
            <SeeAll href="/barang-temuan" />
          </div>
        </section>

        <section className="px-5 pb-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeader
              title="Laporan Kehilangan Barang"
              desc="Barang yang dilaporkan hilang dan belum ditemukan. Pernah melihatnya? Hubungi admin KESMA."
            />
            {hilang.rows.length === 0 ? (
              <EmptyState message="Belum ada laporan kehilangan barang." />
            ) : (
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {hilang.rows.map((r, i) => (
                  <Reveal key={r.id} delay={i * 90} className="h-full">
                    <ItemCard item={toCard("barang_hilang", r)} />
                  </Reveal>
                ))}
              </div>
            )}
            <SeeAll href="/barang-hilang" />
          </div>
        </section>

        <section className="px-5 pb-24 relative overflow-hidden">
          <div className="relative z-10">
          <Reveal>
            <h2 className="mb-8 text-center text-4xl font-bold sm:text-5xl">FAQ</h2>
          </Reveal>
          <Faq />
          </div>

            <Image
              src="/faq-wave.svg"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover object-bottom"
              fill
            />
        </section>
      </main>
      <Footer />
    </>
  );
}
