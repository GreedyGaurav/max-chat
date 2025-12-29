"use client";

import { useState, useRef, useEffect } from "react";
import { Message } from "@/lib/types";

type Props = {
  chatId: string;
  onSend: React.Dispatch<React.SetStateAction<Message[]>>;
  loading: boolean;
  setLoading: (v: boolean) => void;
};

export default function ChatInput({
  chatId,
  onSend,
  loading,
  setLoading,
}: Props) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const cancelTypingRef = useRef(false);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [text]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || loading) return;

    const userMessage = text;
    setText("");
    setLoading(true);

    onSend((prev) => [...prev, { role: "user", content: userMessage }]);
    window.dispatchEvent(new Event("refresh-chats"));

    let assistantIndex = -1;
    onSend((prev) => {
      assistantIndex = prev.length;
      return [...prev, { role: "assistant", content: "" }];
    });

    const controller = new AbortController();
    abortRef.current = controller;
    cancelTypingRef.current = false;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/ai/stream`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({ chatId, message: userMessage }),
          signal: controller.signal,
        }
      );

      if (!res.body) throw new Error("No stream");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value || new Uint8Array());
        if (!chunk) continue;

        for (const char of chunk) {
          if (cancelTypingRef.current) return;
          onSend((prev) =>
            prev.map((msg, i) =>
              i === assistantIndex
                ? { ...msg, content: msg.content + char }
                : msg
            )
          );
          await new Promise((r) => setTimeout(r, 12)); // Slightly faster for snappier feel
        }
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        onSend((prev) =>
          prev.map((msg, i) =>
            i === assistantIndex
              ? { ...msg, content: "⚠️ Error generating response" }
              : msg
          )
        );
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  const handleStop = () => {
    cancelTypingRef.current = true;
    abortRef.current?.abort();
    setLoading(false);
  };

  return (
    <div className="bg-transparent px-4 pb-6 pt-2 lg:px-8">
      <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
        <div className="relative flex flex-col w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all focus-within:border-blue-400 focus-within:shadow-[0_8px_30px_rgb(37,99,235,0.06)]">
          {/* Top Bar Decoration (Recruiters love these tiny details) */}
          <div className="flex items-center gap-1.5 px-4 pt-3">
            <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
            <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
              Gemini AI
            </span>
          </div>

          <div className="flex items-end gap-2 px-4 pb-3 pt-2">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Ask Max Chat anything..."
              rows={1}
              className="flex-1 max-h-[200px] min-h-[44px] resize-none border-0 bg-transparent py-3 text-sm font-medium leading-relaxed text-slate-900 placeholder-slate-400 outline-none focus:ring-0"
              disabled={loading}
            />

            <div className="flex h-[44px] items-center pb-1">
              {!loading ? (
                <button
                  type="submit"
                  disabled={!text.trim()}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 hover:scale-105 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none disabled:scale-100 active:scale-95"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 12h14M12 5l7 7-7 7"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStop}
                  className="group flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white transition-all hover:bg-red-500 active:scale-95"
                >
                  <div className="relative h-2 w-2 bg-white rounded-sm group-hover:scale-110" />
                </button>
              )}
            </div>
          </div>

          {/* Bottom Hint */}
          <div className="bg-slate-50/50 px-4 py-2 border-t border-slate-100/50 flex justify-between items-center">
            <span className="text-[10px] font-medium text-slate-400">
              Shift + Enter for new line
            </span>
            <div className="flex gap-3">
              <button
                type="button"
                className="text-slate-400 hover:text-blue-600 transition-colors"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <p className="mt-3 text-center text-[11px] text-slate-400">
          Max Chat can make mistakes. Check important info.
        </p>
      </form>
    </div>
  );
}
