export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-sky-50 px-6 py-16">
      <section className="w-full max-w-3xl rounded-3xl border border-sky-100 bg-white p-8 shadow-sm sm:p-12">
        <p className="mb-4 text-sm font-semibold tracking-[0.2em] text-sky-700 uppercase">
          AquaLoop
        </p>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
          A cleaner way to refill and reuse.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
          The frontend foundation is ready for customer, operator, and admin
          experiences.
        </p>
        <div className="mt-10 flex flex-wrap gap-3 text-sm font-medium text-slate-700">
          {[
            "Next.js App Router",
            "TypeScript",
            "Tailwind CSS",
            "TanStack Query",
            "Netlify",
          ].map((item) => (
            <span
              key={item}
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2"
            >
              {item}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
