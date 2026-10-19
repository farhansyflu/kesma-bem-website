import type { ReactNode } from "react";

import { EmptyState } from "@/components/EmptyState";
import { Reveal } from "@/components/Reveal";
import { SeeAll, SectionHeader } from "@/components/SectionHeader";

type HomeSectionProps = {
  title: string;
  desc: string;
  href: string;
  emptyMessage: string;
  rows: unknown[];
  renderCards: (rows: unknown[]) => ReactNode;
  topPadding?: boolean;
};

export function HomeSection({
  title,
  desc,
  href,
  emptyMessage,
  rows,
  renderCards,
  topPadding = false,
}: HomeSectionProps) {
  return (
    <section className={topPadding ? "px-5 py-20" : "px-5 pb-20"}>
      <Reveal>
        <div className="mx-auto max-w-6xl">
          <SectionHeader title={title} desc={desc} reveal={false} />

          {rows.length === 0 ? (
            <EmptyState message={emptyMessage} reveal={false} />
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{renderCards(rows)}</div>
          )}

          <SeeAll href={href} />
        </div>
      </Reveal>
    </section>
  );
}
