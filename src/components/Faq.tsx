"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { FAQ } from "@/lib/faq";
import { Reveal } from "./Reveal";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {FAQ.map((item, i) => {
        const isOpen = open === i;
        return (
          <Reveal key={item.q} delay={i * 90}>
          <div className="rounded-2xl border border-gold/60 bg-paper shadow-card">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`faq-${i}`}
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold"
            >
              {item.q}
              <ChevronDown
                size={20}
                className={`shrink-0 text-teal transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            <div
              id={`faq-${i}`}
              role="region"
              inert={!isOpen}
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-ink">{item.a}</p>
              </div>
            </div>
          </div>
          </Reveal>
        );
      })}
    </div>
  );
}
