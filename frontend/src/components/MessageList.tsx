"use client";

import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { Message } from "@/lib/types";

type Props = {
  messages: Message[];
  loading: boolean;
};

export default function MessageList({ messages, loading }: Props) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Optimized smooth scroll
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, loading]);

  return (
    <div className="relative flex-1 overflow-y-auto scroll-smooth px-4 py-6 md:px-6 lg:py-10 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
      {/* Top Gradient Blur - Creates a high-end "fade-out" effect for scrolled messages */}
      <div className="pointer-events-none sticky top-0 z-10 h-10 w-full bg-gradient-to-b from-white via-white/80 to-transparent" />

      <div className="mx-auto max-w-3xl space-y-8 pb-12">
        {messages.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center py-20">
            <div className="relative mb-6">
              <div className="absolute inset-0 animate-pulse rounded-full bg-blue-50 blur-xl"></div>
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-slate-100 shadow-sm text-slate-300">
                <svg
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-sm font-bold tracking-tight text-slate-900">
              No messages yet
            </h3>
            <p className="mt-1 text-xs font-medium text-slate-400">
              Ask a question to start the conversation.
            </p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isLast = i === messages.length - 1;
            const showCursor = loading && isLast && msg.role === "assistant";

            return (
              <div
                key={i}
                className="animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out"
                style={{
                  animationFillMode: "backwards",
                  animationDelay: `${Math.min(i * 50, 300)}ms`,
                }}
              >
                <MessageBubble
                  role={msg.role}
                  content={msg.content}
                  showCursor={showCursor}
                />
              </div>
            );
          })
        )}

        {/* Loading Indicator for when AI is about to start streaming */}
        {loading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex items-center gap-3 animate-pulse">
            <div className="h-6 w-6 rounded-md bg-slate-100 flex items-center justify-center">
              <div className="h-1 w-1 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]"></div>
              <div className="h-1 w-1 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s] mx-0.5"></div>
              <div className="h-1 w-1 rounded-full bg-slate-400 animate-bounce"></div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Max is thinking...
            </span>
          </div>
        )}

        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
}
