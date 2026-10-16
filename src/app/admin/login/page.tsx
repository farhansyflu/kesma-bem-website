"use client";

import Image from "next/image";
import { useActionState } from "react";
import { signIn } from "../actions";
import type { FormState } from "@/lib/types";

const input =
  "mt-1 w-full rounded-xl border border-navy/20 bg-white px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold";

export default function LoginPage() {
  const [state, action, pending] = useActionState<FormState, FormData>(signIn, {});
  return (
    <main className="surface-hero relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/hero-satin.svg" alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full object-cover object-bottom" />
      <form action={action} className="relative z-10 w-full max-w-sm space-y-4 rounded-3xl border-t-4 border-gold bg-paper p-7 shadow-2xl">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="" width={48} height={48} className="rounded-full" />
          <h1 className="text-2xl font-bold">Login Admin KESMA</h1>
        </div>
        <div>
          <label htmlFor="email" className="font-semibold">Email</label>
          <input id="email" name="email" type="email" required autoComplete="username" maxLength={254} className={input} />
        </div>
        <div>
          <label htmlFor="password" className="font-semibold">Password</label>
          <input id="password" name="password" type="password" required autoComplete="current-password" maxLength={200} className={input} />
        </div>
        {state.error && <p role="alert" className="text-sm font-medium text-red-700">{state.error}</p>}
        <button type="submit" disabled={pending} className="w-full rounded-full bg-gold py-3 font-semibold hover:bg-gold-light disabled:opacity-60">
          {pending ? "Masuk..." : "Masuk"}
        </button>
      </form>
    </main>
  );
}
