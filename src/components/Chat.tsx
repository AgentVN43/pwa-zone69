import { useChat } from "@/hooks/useChat";
import { ChatDialog } from "@/components/ChatDialog";
import { useEffect, useRef } from "react";
import dayjs from "dayjs";

export function Chat() {
  const {
    messages,
    input,
    setInput,
    handleSend,
    handleAddActress,
    handleAddMovie,
    handleAssignMovie,
    isLoading,
    pending,
    syncPending,
    dialogMode,
    recentActresses,
    selectedActresses,
    setSelectedActresses,
  } = useChat();

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, dialogMode]);

  const handleSendClick = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  const pendingCount = pending.filter((p) => p.status === "pending").length;

  return (
    <div className="flex h-screen flex-col bg-slate-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-white/5 bg-slate-950/80 backdrop-blur px-4 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div>
            <h1 className="text-lg font-semibold">Zone69 Assistant</h1>
            <p className="text-xs text-slate-400 mt-1">Your catalog manager</p>
          </div>
          {pendingCount > 0 && (
            <button
              onClick={syncPending}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600/20 border border-blue-400/40 px-3 py-2 text-xs font-semibold text-blue-200 hover:bg-blue-600/30 disabled:opacity-50 transition min-h-[40px]"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400" />
              </span>
              {pendingCount} pending
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 pb-24 max-w-4xl mx-auto w-full">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs sm:max-w-md px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${
                msg.isUser
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-slate-800 text-slate-100 border border-white/10 rounded-bl-none"
              }`}
            >
              <p>{msg.text}</p>
              <p
                className={`text-[0.65rem] mt-2 ${
                  msg.isUser ? "text-blue-100/60" : "text-slate-400"
                }`}
              >
                {dayjs(msg.timestamp).format("HH:mm")}
              </p>
            </div>
          </div>
        ))}

        {/* Dialog Input */}
        {dialogMode && (
          <div className="flex justify-start w-full">
            <ChatDialog
              mode={dialogMode}
              onSubmit={
                dialogMode === "add-actress"
                  ? handleAddActress
                  : dialogMode === "assign-actresses"
                  ? handleAssignMovie
                  : handleAddMovie
              }
              isLoading={isLoading}
              recentActresses={recentActresses}
              selectedActresses={selectedActresses}
              onSelectActress={(id) => {
                setSelectedActresses((prev) =>
                  prev.includes(id)
                    ? prev.filter((aid) => aid !== id)
                    : [...prev, id]
                );
              }}
            />
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSendClick}
        className="fixed bottom-0 left-0 right-0 border-t border-white/5 bg-slate-950/95 backdrop-blur px-4 py-3 sm:relative sm:border-t sm:bg-slate-950/80"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 items-center mb-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type command... (e.g., /add-actress)"
              disabled={isLoading || !!dialogMode}
              className="flex-1 rounded-2xl bg-slate-800 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-blue-400/50 focus:outline-none disabled:opacity-50 min-h-[44px]"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim() || !!dialogMode}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition"
              aria-label="Send message"
            >
              {isLoading ? (
                <span className="text-sm animate-spin">⏳</span>
              ) : (
                <span className="text-sm">→</span>
              )}
            </button>
          </div>

          {/* Quick commands hint */}
          {!dialogMode && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setInput("/add-actress")}
                className="whitespace-nowrap rounded-full border border-white/10 bg-slate-800/50 hover:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white transition min-h-[40px]"
              >
                📝 Add Actress
              </button>
              <button
                type="button"
                onClick={() => setInput("/add-movie")}
                className="whitespace-nowrap rounded-full border border-white/10 bg-slate-800/50 hover:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white transition min-h-[40px]"
              >
                🎬 Add Movie
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
