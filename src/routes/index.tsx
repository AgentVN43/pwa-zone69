import { ActressCard } from "@/components/ActressCard";
import { useActresses } from "@/hooks/useActresses";
import { createFileRoute } from "@tanstack/react-router";
import {
  sortByUpdateDate,
  getUpdateLabel,
  formatDateVNFormat,
} from "@/utils/date";

function Home() {
  const {
    data: actresses = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useActresses();

  const skeletonItems = Array.from({ length: 12 }, (_, index) => index);
  const syncLabel = isLoading || isRefetching ? "Syncing data" : "Up to date";

  // Sort actresses by update date (newest first)
  const sortedActresses = sortByUpdateDate(actresses);

  // Group by update label (Today, Yesterday, This week, etc.)
  const groupedActresses = sortedActresses.reduce(
    (acc, actress) => {
      const label = getUpdateLabel(actress.updatedAt);
      if (!acc[label]) acc[label] = [];
      acc[label].push(actress);
      return acc;
    },
    {} as Record<string, typeof actresses>
  );

  const updateOrder = ["Today", "Yesterday", "This week", "This month", "Earlier"];
  const orderedGroups = updateOrder.filter((key) => groupedActresses[key]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="rounded-3xl border border-white/5 bg-slate-900/60 p-6 sm:p-8 shadow-2xl shadow-blue-500/5">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex-1">
            <p className="text-xs uppercase tracking-[0.35em] text-blue-200/70">
              Zone69 PWA
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              Discover the actress catalog instantly
            </h1>
            <p className="mt-4 text-sm text-slate-300 sm:text-base">
              A Tailwind-powered, installable experience that keeps your
              favorite performers ready even when you are offline.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isLoading || isRefetching}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-blue-400/40 bg-blue-500/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-blue-300 hover:bg-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="inline-flex h-2 w-2 rounded-full bg-current" />
              {isRefetching ? "Refreshing..." : "Sync now"}
            </button>
            <a
              href="mailto:zone69@support.fake"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30"
            >
              Request update
            </a>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-4 text-sm text-red-100 sm:text-base">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>Unable to reach the catalog right now.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center justify-center rounded-full border border-red-300/50 px-4 py-2 text-xs font-semibold uppercase tracking-wide"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      <section className="rounded-3xl border border-white/5 bg-slate-900/60 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
              Actresses online
            </p>
            <p className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
              {actresses.length}
            </p>
          </div>
          <div className="hidden h-16 w-px bg-white/10 sm:block" />
          <p className="max-w-2xl text-sm text-slate-400 sm:text-base">
            {syncLabel} - optimized with Tailwind CSS for a clean PWA footprint
            across desktop and mobile shells.
          </p>
        </div>
      </section>

      {/* Display by update date */}
      {isLoading ? (
        <section>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5 xl:grid-cols-6">
            {skeletonItems.map((item) => (
              <div
                key={`skeleton-${item}`}
                className="flex h-full flex-col rounded-2xl border border-white/5 bg-slate-900/40 p-3"
              >
                <div className="aspect-[3/4] w-full rounded-xl bg-slate-800/80" />
                <div className="mt-4 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-slate-800/80" />
                  <div className="h-3 w-2/4 rounded bg-slate-800/60" />
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : actresses.length > 0 ? (
        <div className="space-y-8">
          {orderedGroups.map((label) => (
            <section key={label}>
              <div className="mb-4 flex items-center gap-3 sticky top-16 z-10 bg-slate-950/80 backdrop-blur rounded-lg p-3">
                <h2 className="text-lg font-semibold text-white">{label}</h2>
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {groupedActresses[label].length}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5 xl:grid-cols-6">
                {groupedActresses[label].map((actress, idx) => (
                  <div key={actress._id} className="group relative">
                    <ActressCard actress={actress} index={idx + 1} />
                    {/* Update date tooltip on hover */}
                    {actress.updatedAt && (
                      <div className="absolute -bottom-8 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-white/10 px-2 py-1 rounded text-[0.65rem] text-slate-300 text-center whitespace-nowrap pointer-events-none">
                        Updated: {formatDateVNFormat(actress.updatedAt)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <section className="rounded-2xl border border-dashed border-white/10 px-6 py-12 text-center">
          <p className="text-slate-400">No actresses found</p>
        </section>
      )}
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: Home,
});
