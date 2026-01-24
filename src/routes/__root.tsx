import { createRootRoute, Outlet, Link } from "@tanstack/react-router";
import { Drawer } from "@/components/Drawer";
import { DrawerMenu } from "@/components/DrawerMenu";
import { Suspense, useState } from "react";

const LazyFallback = () => (
  <div className="flex min-h-[40vh] w-full items-center justify-center">
    <div className="text-center text-sm text-slate-400">
      <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
        Loading
      </p>
      <p className="mt-3 text-base font-semibold text-white">
        Syncing content...
      </p>
    </div>
  </div>
);

function RootComponent() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="relative isolate flex min-h-screen flex-col overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-16 top-0 h-72 w-72 rounded-full bg-blue-500/25 blur-[140px] sm:-left-32 sm:h-[28rem] sm:w-[28rem]" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-[160px] sm:h-[32rem] sm:w-[32rem]" />
        </div>

        <header className="sticky top-0 z-20 border-b border-white/5 bg-slate-950/80 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-4">
            <Link
              to="/"
              className="inline-flex items-center gap-3 text-lg font-semibold tracking-tight text-white transition hover:text-blue-200"
              activeProps={{ className: "text-blue-200" }}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/20 text-sm font-bold uppercase text-blue-100">
                Z69
              </span>
              <span className="flex flex-col text-left leading-tight">
                <span>Zone69</span>
                <span className="text-xs font-normal text-slate-400">
                  Progressive Web App
                </span>
              </span>
            </Link>

            <div className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-slate-400">
              <span className="rounded-full border border-white/10 px-3 py-1">
                Tailwind
              </span>
              <button
                onClick={() => setDrawerOpen(true)}
                className="ml-2 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 hover:border-white/30 transition text-white hover:text-blue-200 sm:hidden"
                aria-label="Open menu"
              >
                ☰
              </button>
              <span className="hidden rounded-full border border-white/10 px-3 py-1 sm:inline-flex">Offline</span>
            </div>
          </div>
        </header>

        {/* Drawer */}
        <Drawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title="Menu"
        >
          <DrawerMenu onClose={() => setDrawerOpen(false)} />
        </Drawer>

        <main className="flex-1">
          <Suspense fallback={<LazyFallback />}>
            <div className="mx-auto w-full max-w-6xl px-3 py-6 sm:px-4 sm:py-8 md:px-6">
              <Outlet />
            </div>
          </Suspense>
        </main>

        <footer className="border-t border-white/5 bg-slate-950/80 py-6 text-center text-sm text-slate-400">
          &copy; {new Date().getFullYear()} Zone69 - Built for PWA surfaces
        </footer>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
