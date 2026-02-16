import { useState } from "react";
import type { Actress, Movie } from "@/types";

interface Props {
  mode: "add-actress" | "add-movie" | "assign-actresses" | "search-actress" | "search-movie";
  onSubmit: (value: string | string[]) => void;
  isLoading: boolean;
  onClose?: () => void;
  recentActresses?: { id: string; name: string }[];
  selectedActresses?: string[];
  onSelectActress?: (id: string) => void;
  searchResults?: (Actress | Movie)[];
  onSearch?: (query: string) => void;
  onSelectSearchResult?: (item: Actress | Movie) => void;
  allMovies?: Movie[];
}

export function ChatDialog({
  mode,
  onSubmit,
  isLoading,
  onClose,
  recentActresses = [],
  selectedActresses = [],
  onSelectActress,
  searchResults = [],
  onSearch,
  onSelectSearchResult,
  allMovies = [],
}: Props) {
  const [value, setValue] = useState("");
  const [localSearchResults, setLocalSearchResults] = useState<Movie[]>([]);

  const isActress = mode === "add-actress";
  const isAssign = mode === "assign-actresses";
  const isSearchMovie = mode === "search-movie";
  const isSearchActress = mode === "search-actress";

  const displayResults = searchResults;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAssign) {
      onSubmit(selectedActresses);
    } else if (value.trim()) {
      onSubmit(value);
      setValue("");
    }
  };

  if (isAssign) {
    return (
      <div className="my-4 rounded-2xl border border-white/10 bg-slate-900/40 p-4 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-semibold text-slate-300">
            👥 Select Actresses (Optional)
          </label>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>
        
        {/* Search input */}
        <div className="mb-4">
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              onSearch?.(e.target.value);
            }}
            placeholder="Search actress name..."
            disabled={isLoading}
            autoFocus
            className="w-full rounded-lg bg-slate-800 border border-white/10 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-400/50 focus:outline-none disabled:opacity-50"
          />
        </div>

        {/* Actresses list */}
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {displayResults.length > 0 ? (
            displayResults.map((actress) => (
              <label
                key={(actress as Actress)._id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedActresses.includes((actress as Actress)._id)}
                  onChange={() => onSelectActress?.((actress as Actress)._id)}
                  disabled={isLoading}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-sm text-white">{(actress as Actress).name}</span>
              </label>
            ))
          ) : value.trim() ? (
            <p className="text-xs text-slate-400">No actresses found</p>
          ) : recentActresses.length > 0 ? (
            <>
              <p className="text-xs text-slate-400 mb-2">Recently added:</p>
              {recentActresses.map((actress) => (
                <label
                  key={actress.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedActresses.includes(actress.id)}
                    onChange={() => onSelectActress?.(actress.id)}
                    disabled={isLoading}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="text-sm text-white">{actress.name}</span>
                </label>
              ))}
            </>
          ) : (
            <p className="text-xs text-slate-400">Start typing to search actresses</p>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed px-4 py-2 text-sm font-semibold text-white transition min-h-11 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Adding...
              </>
            ) : (
              <>
                <span className="mr-2">🎬</span>
                {selectedActresses.length > 0
                  ? `Add Movie (${selectedActresses.length} actresses)`
                  : "Add Movie"}
              </>
            )}
          </button>
        </form>
      </div>
    );
  }

  if (isSearchMovie) {
    return (
      <div className="my-4 rounded-2xl border border-white/10 bg-slate-900/40 p-4 w-full max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-semibold text-slate-300">
            🎬 Search Movie
          </label>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>
        <div className="mb-4">
          <input
             type="text"
             value={value}
             onChange={(e) => {
               setValue(e.target.value);
               onSearch?.(e.target.value);
             }}
            placeholder="Search movie title..."
            disabled={isLoading}
            autoFocus
            className="w-full rounded-xl bg-slate-800 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-400/50 focus:outline-none disabled:opacity-50 min-h-11"
          />

          {/* Movie List */}
           {isLoading && value.trim() && (
             <div className="mt-3 text-xs text-slate-400">Searching...</div>
           )}
           {!isLoading && value.trim() && displayResults.length > 0 && (
             <div className="mt-3 space-y-2 max-h-96 overflow-y-auto">
               {(displayResults as Movie[]).map((movie) => (
                   <button
                     key={movie._id || movie.id}
                     type="button"
                     onClick={() => {
                       onSelectSearchResult?.(movie);
                       setValue("");
                     }}
                     className="w-full text-left flex items-center gap-2 p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600 transition text-white"
                   >
                     <span>🎬</span>
                     <span className="text-sm">{movie.title}</span>
                   </button>
                 ))}
             </div>
           )}
           {!isLoading && value.trim() &&
             displayResults.length === 0 && (
               <p className="mt-3 text-xs text-slate-400">No movies found</p>
             )}
        </div>
      </div>
    );
  }

  if (isSearchActress) {
    return (
      <div className="my-4 rounded-2xl border border-white/10 bg-slate-900/40 p-4 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-semibold text-slate-300">
            🔍 Search Actress
          </label>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>
        <div className="mb-4">
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              onSearch?.(e.target.value);
            }}
            placeholder="Search actress name..."
            disabled={isLoading}
            autoFocus
            className="w-full rounded-xl bg-slate-800 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-400/50 focus:outline-none disabled:opacity-50 min-h-11"
          />

          {/* Search Results */}
          {isLoading && value.trim() && (
            <div className="mt-3 text-xs text-slate-400">Searching...</div>
          )}
          {!isLoading && displayResults.length > 0 && (
            <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
              {displayResults.map((item) => {
                const itemName = 'name' in item ? item.name : item.title;
                const icon = 'name' in item ? "👤" : "🎬";
                return (
                  <button
                    key={item._id || item.id}
                    type="button"
                    onClick={() => {
                      onSelectSearchResult?.(item);
                      setValue("");
                    }}
                    className="w-full text-left flex items-center gap-2 p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600 transition text-white"
                  >
                    <span>{icon}</span>
                    <span className="text-sm">{itemName}</span>
                  </button>
                );
              })}
            </div>
          )}
          {!isLoading && value.trim() && displayResults.length === 0 && (
            <p className="mt-3 text-xs text-slate-400">No results found</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="my-4 rounded-2xl border border-white/10 bg-slate-900/40 p-4 w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-semibold text-slate-300">
            {isActress ? "📝 Actress Name" : "🎬 Movie Title"}
          </label>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={
            isActress ? "Enter actress name..." : "Enter movie title..."
          }
          disabled={isLoading}
          autoFocus
          className="w-full rounded-xl bg-slate-800 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-400/50 focus:outline-none disabled:opacity-50 min-h-11"
        />
        <button
          type="submit"
          disabled={isLoading || !value.trim()}
          className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed px-4 py-2 text-sm font-semibold text-white transition min-h-11 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Adding...
            </>
          ) : (
            <>
              <span className="mr-2">{isActress ? "📝" : "🎬"}</span>
              Add {isActress ? "Actress" : "Movie"}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
