import type { Movie } from "@/types";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

interface Props {
  movie: Movie;
}

export function MovieCard({ movie }: Props) {
  const [imgError, setImgError] = useState(false);
  const movieId = movie._id ?? movie.id;

  const cardClasses =
    "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-slate-900/50 transition duration-200 hover:-translate-y-1 hover:border-blue-400/40 hover:shadow-lg hover:shadow-blue-500/10";

  const content = (
    <>
      <div className="relative aspect-video w-full overflow-hidden bg-slate-800/60">
        {imgError ? (
          <div className="flex h-full items-center justify-center text-3xl text-slate-600">
            🎬
          </div>
        ) : (
          <img
            src={movie.poster}
            alt={movie.title}
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.05] group-hover:brightness-110"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60 transition duration-300 group-hover:opacity-70" />
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-2 text-sm font-semibold text-white transition duration-200 group-hover:text-blue-200 sm:text-base">
          {movie.title}
        </h3>
        <p className="mt-2 text-xs text-slate-400">Tap to view details</p>
      </div>

      <div className="flex items-center justify-between border-t border-white/5 px-3 py-2 text-xs text-slate-400">
        <span>Open</span>
        <span className="text-blue-300 transition duration-200 group-hover:translate-x-1">
          →
        </span>
      </div>
    </>
  );

  if (!movieId) {
    return (
      <div className={`${cardClasses} opacity-80`}>
        {content}
        <div className="px-3 pb-3 text-xs text-amber-300">
          Thiếu movieId trong dữ liệu
        </div>
      </div>
    );
  }

  return (
    <Link
      to="/movies/$movieId"
      params={{ movieId }}
      className={cardClasses}
    >
      {content}
    </Link>
  );
}
