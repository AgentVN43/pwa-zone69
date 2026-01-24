import { useState, useCallback } from "react";
import { postActress, postMovie } from "@/services/api";

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

export type DialogMode = null | "add-actress" | "add-movie" | "assign-actresses";

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

  const addMessage = useCallback(
    (text: string, isUser: boolean = true) => {
      const message: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random()}`,
        text,
        isUser,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, message]);
    },
    []
  );

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
        localStorage.getItem("pending-items") || "[]"
      );
      localStorage.setItem(
        "pending-items",
        JSON.stringify([...existing, pendingItem])
      );
    },
    []
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
          prev.map((p) =>
            p.id === item.id ? { ...p, status: "synced" } : p
          )
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
      } catch (err) {
        addMessage(
          `⚠️ Saved for later (offline)\n${name} will be added when you go online`,
          false
        );
        saveForLater({ type: "actress", data: { name: name.trim() } });
      } finally {
        setIsLoading(false);
      }
    },
    [addMessage, saveForLater]
  );

  const handleAddMovie = useCallback(
    async (title: string) => {
      if (!title.trim()) return;

      // If have recent actresses, show assignment dialog
      if (recentActresses.length > 0) {
        addMessage(`Movie title: ${title}`, true);
        setPendingMovieTitle(title);
        setSelectedActresses([]);
        setDialogMode("assign-actresses");
        return;
      }

      // Otherwise add movie directly
      addMessage(`Adding movie: ${title}...`, true);
      setIsLoading(true);
      setDialogMode(null);

      try {
        await postMovie(title.trim());
        addMessage(`✅ Successfully added movie: ${title}`, false);
      } catch (err) {
        addMessage(
          `⚠️ Saved for later (offline)\n${title} will be added when you go online`,
          false
        );
        saveForLater({ type: "movie", data: { title: title.trim() } });
      } finally {
        setIsLoading(false);
      }
    },
    [addMessage, saveForLater, recentActresses]
  );

  const handleAssignMovie = useCallback(
    async (actressIds: string[]) => {
      if (!pendingMovieTitle.trim()) return;

      addMessage(
        `Adding movie: ${pendingMovieTitle} → ${selectedActresses.length} actresses`,
        true
      );
      setIsLoading(true);
      setDialogMode(null);

      try {
        await postMovie(pendingMovieTitle.trim(), actressIds);
        addMessage(
          `✅ Successfully added movie: ${pendingMovieTitle}\nAssigned to ${actressIds.length} actress(es)`,
          false
        );
        setPendingMovieTitle("");
        setSelectedActresses([]);
      } catch (err) {
        addMessage(
          `⚠️ Saved for later (offline)\n${pendingMovieTitle} will be added when you go online`,
          false
        );
        saveForLater({ type: "movie", data: { title: pendingMovieTitle.trim() } });
      } finally {
        setIsLoading(false);
      }
    },
    [pendingMovieTitle, selectedActresses, addMessage, saveForLater]
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
    } else {
      addMessage(
        "❓ Supported commands:\n📝 /add-actress\n🎬 /add-movie",
        false
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
    handleAddMovie,
    handleAssignMovie,
    isLoading,
    pending,
    syncPending,
    dialogMode,
    setDialogMode,
    recentActresses,
    selectedActresses,
    setSelectedActresses,
    pendingMovieTitle,
  };
}
