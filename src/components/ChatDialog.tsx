import { useState } from "react";

interface Props {
  mode: "add-actress" | "add-movie" | "assign-actresses";
  onSubmit: (value: string | string[]) => void;
  isLoading: boolean;
  recentActresses?: { id: string; name: string }[];
  selectedActresses?: string[];
  onSelectActress?: (id: string) => void;
}

export function ChatDialog({
  mode,
  onSubmit,
  isLoading,
  recentActresses = [],
  selectedActresses = [],
  onSelectActress,
}: Props) {
  const [value, setValue] = useState("");

  const isActress = mode === "add-actress";
  const isAssign = mode === "assign-actresses";

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
        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-300 mb-3">
            👥 Assign to Actresses (Optional)
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {recentActresses.length > 0 ? (
              recentActresses.map((actress) => (
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
              ))
            ) : (
              <p className="text-xs text-slate-400">No actresses added yet</p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed px-4 py-2 text-sm font-semibold text-white transition min-h-[44px] flex items-center justify-center"
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

  return (
    <div className="my-4 rounded-2xl border border-white/10 bg-slate-900/40 p-4 w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block text-sm font-semibold text-slate-300">
          {isActress ? "📝 Actress Name" : "🎬 Movie Title"}
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={
            isActress ? "Enter actress name..." : "Enter movie title..."
          }
          disabled={isLoading}
          autoFocus
          className="w-full rounded-xl bg-slate-800 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-400/50 focus:outline-none disabled:opacity-50 min-h-[44px]"
        />
        <button
          type="submit"
          disabled={isLoading || !value.trim()}
          className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed px-4 py-2 text-sm font-semibold text-white transition min-h-[44px] flex items-center justify-center"
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
