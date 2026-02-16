import { useState, useCallback } from "react";
import {
  postActress,
  postMovie,
  searchActresses,
  searchMovies,
  getMovies,
} from "@/services/api";
import type { Actress, Movie } from "@/types";

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface PendingItem {
  id: string;
  type: "actress" | "movie";
  data: { name?: string; title?: string };
  timestamp: Date;
  status: "pending" | "synced";
}

export interface RecentActress {
  id: string;
  name: string;
  addedAt: Date;
}

export type DialogMode =
  | null
  | "add-actress"
  | "add-movie"
  | "assign-actresses"
  | "search-actress"
  | "search-movie";

// Helper to get error message safely
function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      text: "👋 Hello! I'm Zone69 Assistant. I can help you add actresses and movies to the catalog.\n\n📝 /add-actress - Add a new actress\n🎬 /add-movie - Add a new movie\n\nType a command or click the buttons below!",
      isUser: false,
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState("");
  const [pending, setPending] = useState<PendingItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [recentActresses, setRecentActresses] = useState<RecentActress[]>([]);
  const [selectedActresses, setSelectedActresses] = useState<string[]>([]);
  const [pendingMovieTitle, setPendingMovieTitle] = useState("");
  const [searchResults, setSearchResults] = useState<Actress[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedActressForMovie, setSelectedActressForMovie] =
    useState<Actress | null>(null);
  const [pendingMovieForLink, setPendingMovieForLink] = useState<Movie | null>(
    null,
  );
  const [allMovies, setAllMovies] = useState<Movie[]>([]);

  const addMessage = useCallback((text: string, isUser: boolean = true) => {
    const message: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      text,
      isUser,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, message]);
  }, []);

  const saveForLater = useCallback(
    (item: Omit<PendingItem, "id" | "timestamp" | "status">) => {
      const pendingItem: PendingItem = {
        id: `pending-${Date.now()}`,
        ...item,
        timestamp: new Date(),
        status: "pending",
      };
      setPending((prev) => [...prev, pendingItem]);

      // Save to localStorage
      const existing = JSON.parse(
        localStorage.getItem("pending-items") || "[]",
      );
      localStorage.setItem(
        "pending-items",
        JSON.stringify([...existing, pendingItem]),
      );
    },
    [],
  );

  const syncPending = useCallback(async () => {
    const items = pending.filter((p) => p.status === "pending");
    if (items.length === 0) return;

    setIsLoading(true);
    for (const item of items) {
      try {
        if (item.type === "actress" && item.data.name) {
          await postActress(item.data.name);
        } else if (item.type === "movie" && item.data.title) {
          await postMovie(item.data.title);
        }

        // Update status
        setPending((prev) =>
          prev.map((p) => (p.id === item.id ? { ...p, status: "synced" } : p)),
        );
      } catch (err) {
        console.error("Sync failed:", err);
      }
    }
    setIsLoading(false);
  }, [pending]);

  const handleAddActress = useCallback(
    async (name: string) => {
      if (!name.trim()) return;

      addMessage(`Adding actress: ${name}...`, true);
      setIsLoading(true);
      setDialogMode(null);

      try {
        const actress = await postActress(name.trim());
        addMessage(`✅ Successfully added actress: ${name}`, false);

        // Track recent actress
        setRecentActresses((prev) => [
          ...prev,
          {
            id: actress._id || `temp-${Date.now()}`,
            name: actress.name,
            addedAt: new Date(),
          },
        ]);
      } catch (err: unknown) {
        // Check if it's a network error (offline) or server error
        const isNetworkError =
          !navigator.onLine ||
          getErrorMessage(err).includes("Failed to fetch") ||
          getErrorMessage(err).includes("Network");

        if (isNetworkError) {
          // Network/offline error → save for later
          addMessage(
            `⚠️ Saved for later (offline)\n${name} will be added when you go online`,
            false,
          );
          saveForLater({ type: "actress", data: { name: name.trim() } });
        } else {
          // Server error → show actual error message
          const errorMsg = getErrorMessage(err) || "Failed to add actress";
          addMessage(`❌ ${errorMsg}`, false);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [addMessage, saveForLater],
  );

  // Replace old handleAddMovie - always ask for actresses
  const handleAddMovieNew = useCallback(
    (title: string) => {
      if (!title.trim()) return;

      // Always show actress selection dialog first
      addMessage(`Movie title: ${title}`, true);
      setPendingMovieTitle(title);
      setSelectedActresses([]);
      setDialogMode("assign-actresses");
      addMessage("Select actresses for this movie (optional):", false);
    },
    [addMessage],
  );

  const handleAssignMovie = useCallback(
    async (actressIds: string[]) => {
      if (!pendingMovieTitle.trim()) return;

      const castCount = actressIds.length;
      addMessage(
        `Adding movie: ${pendingMovieTitle}${castCount > 0 ? ` with ${castCount} actress(es)` : ""}...`,
        true,
      );
      setIsLoading(true);
      setDialogMode(null);

      try {
        // POST /movies with title and cast
        await postMovie(pendingMovieTitle.trim(), actressIds);

        const castMsg =
          castCount > 0
            ? `✅ Added movie: ${pendingMovieTitle}\nWith ${castCount} actress(es)`
            : `✅ Added movie: ${pendingMovieTitle}`;
        addMessage(castMsg, false);

        setPendingMovieTitle("");
        setSelectedActresses([]);
      } catch (err: unknown) {
        // Check if it's a network error (offline) or server error
        const isNetworkError =
          !navigator.onLine ||
          getErrorMessage(err).includes("Failed to fetch") ||
          getErrorMessage(err).includes("Network");

        if (isNetworkError) {
          // Network/offline error → save for later
          addMessage(
            `⚠️ Saved for later (offline)\n${pendingMovieTitle} will be added when you go online`,
            false,
          );
          saveForLater({
            type: "movie",
            data: { title: pendingMovieTitle.trim() },
          });
        } else {
          // Server error → show actual error message
          const errorMsg = getErrorMessage(err) || "Failed to add movie";
          addMessage(`❌ ${errorMsg}`, false);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [pendingMovieTitle, addMessage, saveForLater],
  );

  const handleSearchActress = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await searchActresses(query);
      setSearchResults(results);
    } catch (err) {
      console.error("Search failed:", err);
      setSearchResults([]);
    }
  }, [setSearchQuery, setSearchResults]);

  const handleSearchMovies = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await searchMovies(query);
      setSearchResults(results);
    } catch (err) {
      console.error("Search movies failed:", err);
      setSearchResults([]);
    }
  }, [setSearchQuery, setSearchResults]);

  const handleSelectMovie = useCallback(
    (movie: Movie) => {
      setPendingMovieForLink(movie);
      addMessage(`Movie: ${movie.title}`, true);
      addMessage("Now search for an actress to link", false);
      setDialogMode("search-actress");
      setSearchResults([]);
      setSearchQuery("");
    },
    [addMessage],
  );

  const handleLinkMovie = useCallback(
    async (movieId: string, actressId: string) => {
      if (!movieId || !actressId) return;

      const movieTitle = pendingMovieForLink?.title || "Movie";
      addMessage(`Linking ${movieTitle} to actress...`, true);
      setIsLoading(true);
      setDialogMode(null);

      try {
        // Link movie to actress: POST /actresses/:id/movies
        await fetch(`/api/actresses/${actressId}/movies`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ movieId }),
        });

        const actress = selectedActressForMovie?.name || "actress";
        addMessage(`✅ Linked ${movieTitle} to ${actress}`, false);
        setPendingMovieForLink(null);
        setSelectedActressForMovie(null);
        setSearchQuery("");
        setSearchResults([]);
      } catch (err: unknown) {
        const isNetworkError =
          !navigator.onLine ||
          getErrorMessage(err).includes("Failed to fetch") ||
          getErrorMessage(err).includes("Network");

        if (isNetworkError) {
          addMessage(
            `⚠️ Saved for later (offline)\nWill link when you go online`,
            false,
          );
        } else {
          const errorMsg = getErrorMessage(err);
          addMessage(`❌ ${errorMsg}`, false);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [pendingMovieForLink, selectedActressForMovie, addMessage],
  );

  const handleSend = useCallback(async () => {
    if (!input.trim()) return;

    addMessage(input);
    const command = input.trim().toLowerCase();
    setInput("");

    if (command === "/add-actress") {
      addMessage("What's the actress name?", false);
      setDialogMode("add-actress");
    } else if (command === "/add-movie") {
      addMessage("What's the movie title?", false);
      setDialogMode("add-movie");
    } else if (command === "/link-movie") {
      addMessage("Loading movies...", false);
      try {
        const movies = await getMovies();
        setAllMovies(movies);
        addMessage("Which movie to link? (Type to search)", false);
        setDialogMode("search-movie");
      } catch {
        addMessage("❌ Failed to load movies", false);
      }
    } else {
      addMessage(
        "❓ Supported commands:\n📝 /add-actress\n🎬 /add-movie\n🔗 /link-movie",
        false,
      );
    }
  }, [input, addMessage]);

  return {
    messages,
    input,
    setInput,
    addMessage,
    handleSend,
    handleAddActress,
    handleAddMovie: handleAddMovieNew,
    handleAssignMovie,
    handleSearchActress,
    handleSearchMovies,
    handleSelectMovie,
    handleLinkMovie,
    isLoading,
    pending,
    syncPending,
    dialogMode,
    setDialogMode,
    recentActresses,
    selectedActresses,
    setSelectedActresses,
    pendingMovieTitle,
    searchResults,
    setSearchResults,
    searchQuery,
    setSearchQuery,
    selectedActressForMovie,
    setSelectedActressForMovie,
    allMovies,
    pendingMovieForLink,
    setPendingMovieForLink,
  };
}
