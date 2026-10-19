"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const MIN_MS = 400; // tampil minimal agar animasi terlihat
const MAX_MS = 4000; // batas aman jika event load tidak kunjung datang

export function Preloader() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const [hiding, setHiding] = useState(false);
  const [gone, setGone] = useState(false);
  const done = useRef(false);

  useEffect(() => {
    if (isAdmin) {
      document.documentElement.dataset.ready = "1";
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const min = reduced ? 150 : MIN_MS;
    const start = performance.now();
    const timers: number[] = [];

    const finish = () => {
      if (done.current) return;
      done.current = true;
      const wait = Math.max(0, min - (performance.now() - start));
      timers.push(
        window.setTimeout(() => {
          document.documentElement.dataset.ready = "1";
          setHiding(true);
          timers.push(window.setTimeout(() => setGone(true), 550));
        }, wait)
      );
    };

    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });
    timers.push(window.setTimeout(finish, MAX_MS));

    return () => {
      window.removeEventListener("load", finish);
      timers.forEach(clearTimeout);
    };
  }, [isAdmin]);

  if (isAdmin || gone) return null;

  return (
    <div
      id="preloader"
      role="status"
      aria-live="polite"
      aria-label="Memuat halaman"
      className={`surface-hero fixed inset-0 z-[100] flex flex-col items-center justify-center transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.7,0,0.2,1)] ${
        hiding ? "-translate-y-full opacity-0.001" : "translate-y-0 opacity-100"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/hero-satin.svg" alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full object-cover object-bottom" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative flex h-36 w-36 items-center justify-center">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-accent/20 border-t-accent" />
          <Image src="/logo.png" alt="" width={96} height={96} priority className="animate-logo-pulse h-24 w-24 rounded-full" />
        </div>
        <p className="mt-6 font-display text-4xl font-bold">KESMA</p>
        <p className="mt-1 text-sm opacity-70">BEM STDIIS Jember</p>
        <div className="mt-6 h-1 w-40 overflow-hidden rounded-full bg-on-surface/15">
          <div className="animate-load-bar h-full w-2/5 rounded-full bg-accent" />
        </div>
      </div>
    </div>
  );
}
