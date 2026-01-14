import type { Actress } from "@/types";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

interface Props {
  actress: Actress;
  index?: number;
}

export function ActressCard({ actress, index }: Props) {
  const [imgError, setImgError] = useState(false);
  const movieCountLabel =
    typeof actress.movieCount === "number" ? `${actress.movieCount} films` : "Trending";

  return (
    <Link
      to="/actresses/$actressId"
      params={{ actressId: actress._id }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/5 bg-slate-900/50 p-3 shadow-lg shadow-blue-500/5 transition duration-200 hover:-translate-y-1 hover:border-blue-400/40 hover:shadow-blue-500/10"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-slate-800/60">
        {imgError ? (
          <div className="flex h-full items-center justify-center text-4xl font-semibold text-slate-600">
            ?
          </div>
        ) : (
          <img
            src={actress.avatar}
            alt={actress.name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03] group-hover:brightness-110"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-80 transition duration-300 group-hover:opacity-90" />

        <div className="absolute left-3 top-3 flex flex-col gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-200">
          {typeof index === "number" && (
            <span className="inline-flex items-center rounded-full bg-slate-950/70 px-2 py-1 text-[0.6rem] tracking-[0.25em] text-blue-100">
              #{index.toString().padStart(2, "0")}
            </span>
          )}
          <span className="inline-flex items-center rounded-full bg-slate-950/70 px-2 py-1 text-[0.55rem] tracking-[0.25em] text-slate-100">
            {movieCountLabel}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-1 pt-4">
        <h3 className="text-base font-semibold text-white transition duration-200 group-hover:text-blue-200 sm:text-lg">
          {actress.name}
        </h3>
        <p className="mt-2 text-xs text-slate-400 sm:text-sm">
          Tap to open the full profile, offline friendly.
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-xs text-slate-400">
        <span>Open details</span>
        <span className="inline-flex items-center gap-1 text-blue-300">
          <span className="text-base leading-none transition duration-200 group-hover:translate-x-1">
            -&gt;
          </span>
        </span>
      </div>
    </Link>
  );
}
