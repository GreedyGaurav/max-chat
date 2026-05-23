"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import MessageBubble from "./MessageBubble";
import { Message } from "@/lib/types";

type Props = {
  messages: Message[];
  loading: boolean;
  user?: { name?: string; avatar?: string } | null;
};

export default function MessageList({ messages, loading, user }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Ref so updates are immediately visible — no stale-closure race condition
  const shouldAutoScrollRef = useRef(true);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = useCallback(() => {
    if (!containerRef.current || !shouldAutoScrollRef.current) return;
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, []);

  const forceScrollToBottom = useCallback(() => {
    if (!containerRef.current) return;
    shouldAutoScrollRef.current = true;
    setShowScrollButton(false);
    containerRef.current.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  // onScroll only re-enables auto-scroll when the user reaches the bottom.
  // It does NOT disable it — that job belongs to wheel/touch handlers below,
  // which are guaranteed to be user-initiated (never fired by scrollTop=).
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const atBottom = scrollHeight - scrollTop - clientHeight < 80;
    if (atBottom) {
      shouldAutoScrollRef.current = true;
      setShowScrollButton(false);
    } else {
      setShowScrollButton(true);
    }
  }, []);

  // wheel / touch events fire ONLY from real user input, never from programmatic
  // scrollTop changes — so disabling auto-scroll here is race-condition-free.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY < 0) {
        // User scrolling up
        shouldAutoScrollRef.current = false;
        setShowScrollButton(true);
      }
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      const delta = touchStartY - (e.touches[0]?.clientY ?? 0);
      if (delta < 0) {
        // Finger moving down = scrolling up
        shouldAutoScrollRef.current = false;
        setShowScrollButton(true);
      }
    };

    container.addEventListener("wheel", onWheel, { passive: true });
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  // Reset when chat switches (messages cleared)
  useEffect(() => {
    if (messages.length === 0) {
      shouldAutoScrollRef.current = true;
      setShowScrollButton(false);
    }
  }, [messages.length]);

  // Auto-scroll on every message update (streaming or new message)
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  return (
    <div className="absolute inset-0">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="absolute inset-0 overflow-y-auto px-4 py-6 md:px-8"
      >
        <div className="mx-auto max-w-3xl pb-6">
          {messages.length === 0 ? (
            <div className="flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 animate-pulse rounded-full bg-blue-50 blur-xl dark:bg-blue-900/30" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-slate-100 shadow-sm text-slate-300 dark:bg-slate-800 dark:border-slate-700/50 dark:text-slate-600">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
                No messages yet
              </h3>
              <p className="mt-1 text-xs font-medium text-slate-400 dark:text-slate-500">
                Ask a question to start the conversation.
              </p>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => {
                const isLast = i === messages.length - 1;
                const showCursor = loading && isLast && msg.role === "assistant";
                return (
                  <MessageBubble
                    key={i}
                    role={msg.role}
                    content={msg.content}
                    showCursor={showCursor}
                    user={user ?? undefined}
                  />
                );
              })}

              {loading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex items-center gap-3 py-4 pl-9">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-slate-300 animate-bounce [animation-delay:-0.3s] dark:bg-slate-600" />
                    <span className="h-2 w-2 rounded-full bg-slate-300 animate-bounce [animation-delay:-0.15s] dark:bg-slate-600" />
                    <span className="h-2 w-2 rounded-full bg-slate-300 animate-bounce dark:bg-slate-600" />
                  </div>
                  <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                    Max is thinking…
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showScrollButton && (
        <button
          onClick={forceScrollToBottom}
          className="absolute bottom-6 right-6 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white border border-slate-200 shadow-md text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:shadow-lg transition-all active:scale-95 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:border-slate-600"
          aria-label="Scroll to bottom"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}
    </div>
  );
}
