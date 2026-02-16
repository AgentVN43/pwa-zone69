import { useMovieDetail } from "@/hooks/useMovieDetail";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

interface Props {
  movieId: string;
}

export function MovieDetail({ movieId }: Props) {
  const { data: movie, isLoading, error } = useMovieDetail(movieId);
  const [imgError, setImgError] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  console.log(movie);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center text-sm text-slate-400">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
            Loading
          </p>
          <p className="mt-3 text-base font-semibold text-white">
            Opening movie details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-base text-red-300">Could not load this movie.</p>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-2 text-sm font-semibold text-white hover:border-white/40"
          >
            Back to catalog
          </Link>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-base text-slate-300">Movie not found.</p>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-2 text-sm font-semibold text-white hover:border-white/40"
          >
            Back to catalog
          </Link>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:border-white/40"
        >
          ← Back
        </button>
        <span className="rounded-full border border-white/10 px-3 py-1 text-[0.65rem] uppercase tracking-[0.35em]">
          Movie Details
        </span>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {/* Poster - Sticky on desktop */}
        <div className="md:col-span-1 md:sticky md:top-24 h-fit">
          <div className="rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/20 border border-white/5">
            {imgError ? (
              <div className="aspect-[2/3] w-full flex items-center justify-center text-5xl text-slate-600 bg-slate-800/60">
                🎬
              </div>
            ) : (
              <img
                src={movie.poster}
                alt={movie.title}
                onError={() => setImgError(true)}
                loading="lazy"
                className="w-full h-auto"
              />
            )}
          </div>
        </div>

        {/* Info */}
        <div className="md:col-span-2">
          <div className="rounded-3xl border border-white/5 bg-slate-900/60 p-6 sm:p-8">
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {movie.title}
            </h1>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6 pb-6 border-b border-white/10">
              <a
                href={movie.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition min-h-[48px]"
              >
                <span>▶️</span>
                Watch now
              </a>
              <button
                onClick={() => setBookmarked(!bookmarked)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 hover:border-white/40 px-6 py-3 text-sm font-semibold text-white transition min-h-[48px]"
              >
                <span>{bookmarked ? "❤️" : "🤍"}</span>
                {bookmarked ? "Bookmarked" : "Bookmark"}
              </button>
              <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 hover:border-white/40 px-6 py-3 text-sm font-semibold text-white transition min-h-[48px]">
                <span>👍</span>
                Like
              </button>
            </div>

            {/* Description Section */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-white mb-3">
                  About this movie
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {movie.title}
                </p>
              </div>

              {/* Cast */}
              {/* {movie.cast && movie.cast.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-white mb-3">
                    Cast
                  </h2>
                  <p className="text-sm text-slate-400">
                    Featuring {movie.cast.length} actresses in leading
                    roles
                  </p>
                </div>
              )} */}

              {movie.cast && movie.cast.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-white mb-3">Cast</h2>
                  <div className="space-y-2">
                    {movie.cast.map((actress) => (
                      <span
                        key={actress._id}
                        className="inline-block bg-slate-700/50 border border-white/10 px-3 py-1 rounded-full text-sm text-blue-300"
                      >
                        {actress.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500 mb-1">
                    Format
                  </p>
                  <p className="text-sm text-white font-semibold">Full HD</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500 mb-1">
                    Duration
                  </p>
                  <p className="text-sm text-white font-semibold">~1 hour</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500 mb-1">
                    Year
                  </p>
                  <p className="text-sm text-white font-semibold">2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
