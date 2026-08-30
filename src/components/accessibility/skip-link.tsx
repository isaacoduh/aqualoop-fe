"use client";

export function SkipLink({targetId}:{targetId:string}) {
  return (
    <a
      href={`#${targetId}`}
      className="fixed top-3 left-3 z-50 -translate-y-20 rounded-control bg-foreground px-4 py-2 text-sm font-semibold text-background transition-transform focus:translate-y-0"
      onClick={() => {
        requestAnimationFrame(() => document.getElementById(targetId)?.focus());
      }}
    >
      Skip to main content
    </a>
  );
}
