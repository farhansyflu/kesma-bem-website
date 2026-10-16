import type { Metadata } from "next";
import { EmptyState } from "@/components/EmptyState";
import { Footer } from "@/components/Footer";
import { ListControls } from "@/components/ListControls";
import { Navbar } from "@/components/Navbar";
import { Pagination } from "@/components/Pagination";
import { Reveal } from "@/components/Reveal";
import { ScholarshipCard, type Scholarship } from "@/components/ScholarshipCard";
import { SectionHeader } from "@/components/SectionHeader";
import { listRows, parseParams } from "@/lib/data";

export const metadata: Metadata = { title: "Info Beasiswa | KESMA BEM STDIIS Jember" };
const PAGE_SIZE = 12;

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = parseParams(await searchParams);
  const { rows, total } = await listRows<Scholarship>("beasiswa", params, PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <Navbar />
      <main className="flex-1 px-5 pb-20 pt-14">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            title="Informasi Beasiswa"
            desc="Temukan berbagai peluang bantuan pendanaan dan program beasiswa terbaru untuk mendukung kelancaran studi serta pengembangan diri Anda di STDIIS Jember."
          />

          <div className="mt-10">
            <ListControls
              key={`${params.q}|${params.sort}`}
              label="Cari Beasiswa"
              placeholder="Ketik beasiswa yang anda cari..."
              initialQ={params.q}
              initialSort={params.sort}
            />
          </div>

          {rows.length === 0 ? (
            <EmptyState message="Belum ada beasiswa yang cocok." />
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {rows.map((s, i) => (
                <Reveal key={s.id} delay={(i % 4) * 90} className="h-full">
                  <ScholarshipCard s={s} />
                </Reveal>
              ))}
            </div>
          )}
          <Pagination page={Math.min(params.page, totalPages)} totalPages={totalPages} basePath="/beasiswa" q={params.q} sort={params.sort} />
        </div>
      </main>
      <Footer />
    </>
  );
}
