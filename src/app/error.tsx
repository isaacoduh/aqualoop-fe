"use client";

import { AlertTriangle, RefreshCcw } from "lucide-react";
import { useEffect } from "react";

export default function ErrorPage({error,reset}:{error:Error & {digest?:string};reset:()=>void}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-[70dvh] place-items-center px-5 py-12">
      <section role="alert" className="w-full max-w-xl rounded-panel border border-danger/20 bg-surface p-8 text-center shadow-card sm:p-10">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-danger-soft text-danger">
          <AlertTriangle aria-hidden="true" className="size-7" />
        </span>
        <p className="mt-6 text-sm font-semibold text-danger">Unable to load this page</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Something interrupted the loop</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">Your demo data is safe. Retry the page, or return to the previous screen.</p>
        <button type="button" onClick={reset} className="mt-7 inline-flex min-h-control items-center gap-2 rounded-control bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
          <RefreshCcw aria-hidden="true" className="size-4" /> Try again
        </button>
      </section>
    </main>
  );
}
