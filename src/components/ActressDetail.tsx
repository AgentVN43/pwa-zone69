import { useActressDetail } from "@/hooks/useActressDetail";
import { useVoteActress } from "@/hooks/useVoteActress";
import { MovieCard } from "@/components/MovieCard";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

interface Props {
  actressId: string;
}

export function ActressDetail({ actressId }: Props) {
  const { data: actress, isLoading, error } = useActressDetail(actressId);
  const { mutate: vote, isPending: isVoting } = useVoteActress(actressId);
  const [imgError, setImgError] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center text-sm text-slate-400">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
            Loading
          </p>
          <p className="mt-3 text-base font-semibold text-white">
            Preparing profile...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-base text-red-300">
            We could not load this profile.
          </p>
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

  if (!actress) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-base text-slate-300">
            No actress found for this link.
          </p>
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

  const hasMovies = Boolean(actress.movies && actress.movies.length > 0);

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:border-white/40"
        >
          ← Back
        </button>
        <span className="rounded-full border border-white/10 px-3 py-1 text-[0.65rem] uppercase tracking-[0.35em]">
          Profile
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px,1fr] lg:items-start">
        <div className="space-y-4">
          {/* <div className="rounded-3xl border border-white/5 bg-slate-900/60 p-4">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-slate-800/60">
              {imgError ? (
                <div className="flex h-full items-center justify-center text-5xl font-semibold text-slate-600">
                  ?
                </div>
              ) : (
                <img
                  src={actress.avatar}
                  alt={actress.name}
                  loading="lazy"
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover"
                />
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
            </div>
          </div> */}

          {/* Avatar container — responsive & bounded */}
          <div className="flex justify-center">
            <div className="w-full max-w-md aspect-square bg-slate-700 rounded-xl overflow-hidden shadow-lg">
              {imgError ? (
                <div className="w-full h-full flex items-center justify-center text-slate-500 text-6xl">
                  🎭
                </div>
              ) : (
                <img
                  src={actress.avatar}
                  alt={actress.name}
                  loading="lazy"
                  onError={() => setImgError(true)}
                  // 👇 Tối ưu: giữ tỷ lệ, không kéo dãn, căn giữa
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => vote()}
            disabled={isVoting}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-blue-400/40 bg-blue-600/80 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70 min-h-[48px]"
          >
            <span>{isVoting ? "⏳" : "👍"}</span>
            <span>{isVoting ? "Voting..." : `Vote (${actress.votes ?? 0})`}</span>
          </button>

          <div className="space-y-3">
            <div className="rounded-3xl border border-white/5 bg-slate-900/60 p-4 text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                Movies tracked
              </p>
              <p className="mt-3 text-3xl font-semibold text-white">
                {actress.movieCount ?? actress.movies?.length ?? 0}
              </p>
            </div>

            <div className="rounded-3xl border border-white/5 bg-slate-900/60 p-4 text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                Total votes
              </p>
              <p className="mt-3 text-3xl font-semibold text-blue-300">
                {actress.votes ?? 0}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-white/5 bg-slate-900/60 p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-blue-100/70">
              Featured actress
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              {actress.name}
            </h1>
            {typeof actress.movieCount === "number" && (
              <p className="mt-3 text-sm text-slate-300">
                {actress.movieCount} releases currently available in the Zone69
                API.
              </p>
            )}
            <p className="mt-4 text-sm text-slate-400">
              Install the PWA to keep this profile a tap away. Artwork and
              metadata stay on device for a fast offline revisit.
            </p>
          </div>

          <div className="rounded-3xl border border-white/5 bg-slate-900/60 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Movies</h2>
              <span className="text-xs uppercase tracking-[0.35em] text-slate-400">
                {actress.movies?.length ?? 0}
              </span>
            </div>

            {hasMovies ? (
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                {actress.movies!.map((movie, index) => (
                  <MovieCard
                    key={movie._id ?? movie.id ?? index}
                    movie={movie}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-white/10 px-6 py-10 text-center text-sm text-slate-400">
                No movies listed yet. Check back as the PWA syncs new data.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
