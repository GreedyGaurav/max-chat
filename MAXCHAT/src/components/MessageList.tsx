"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import MessageBubble from "./MessageBubble";
import { Message } from "@/lib/types";

type Props = {
  messages: Message[];
  loading: boolean;
};

export default function MessageList({ messages, loading }: Props) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastMessageCountRef = useRef(0);
  const lastContentLengthRef = useRef(0);
  const lastScrollTopRef = useRef(0);
  const isScrollingRef = useRef(false);

  // Check if user is near the bottom of the scroll container
  const isNearBottom = useCallback(() => {
    if (!containerRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const threshold = 150; // pixels from bottom
    return scrollHeight - scrollTop - clientHeight < threshold;
  }, []);

  // Scroll to bottom function
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth", force: boolean = false) => {
    if (containerRef.current && (shouldAutoScroll || force)) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior,
      });
    }
  }, [shouldAutoScroll]);

  // Handle user scroll - detect if user manually scrolled up
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 150;
    
    // Initialize lastScrollTop if not set
    if (lastScrollTopRef.current === 0 && scrollTop > 0) {
      lastScrollTopRef.current = scrollTop;
    }
    
    // Detect if user scrolled up (scrollTop decreased) - but only if we have a previous value
    if (lastScrollTopRef.current > 0 && scrollTop < lastScrollTopRef.current && !isAtBottom) {
      // User scrolled up and is not at bottom - disable auto-scroll
      setShouldAutoScroll(false);
      isScrollingRef.current = true;
    } else if (isAtBottom) {
      // User is at bottom - re-enable auto-scroll
      setShouldAutoScroll(true);
      isScrollingRef.current = false;
    }

    lastScrollTopRef.current = scrollTop;

    // Clear scrolling flag after user stops scrolling
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
      // If user stopped scrolling and is at bottom, enable auto-scroll
      if (isNearBottom()) {
        setShouldAutoScroll(true);
      }
    }, 200);
  }, [isNearBottom]);

  // Auto-scroll when messages change or during streaming - only if user hasn't scrolled up
  useEffect(() => {
    if (shouldAutoScroll && messages.length > 0 && !isScrollingRef.current) {
      // Use immediate scroll for streaming updates, smooth for new messages
      const isStreaming = loading && messages[messages.length - 1]?.role === "assistant";
      const behavior = isStreaming ? "auto" : "smooth";
      
      // Small delay to ensure DOM is updated
      const timeoutId = setTimeout(() => {
        if (containerRef.current && shouldAutoScroll) {
          scrollToBottom(behavior);
        }
      }, isStreaming ? 10 : 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [messages, loading, shouldAutoScroll, scrollToBottom]);

  // Detect content changes during streaming (for continuous scrolling)
  useEffect(() => {
    if (loading && messages.length > 0 && shouldAutoScroll && !isScrollingRef.current) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.role === "assistant") {
        const currentContentLength = lastMessage.content.length;
        
        // If content is being streamed and user is at bottom, auto-scroll
        if (currentContentLength > lastContentLengthRef.current && isNearBottom()) {
          // Use requestAnimationFrame for smooth scrolling during streaming
          requestAnimationFrame(() => {
            if (containerRef.current && shouldAutoScroll) {
              scrollToBottom("auto");
            }
          });
        }
        
        lastContentLengthRef.current = currentContentLength;
      }
    } else {
      lastContentLengthRef.current = 0;
    }
  }, [messages, loading, isNearBottom, shouldAutoScroll, scrollToBottom]);

  // Reset scroll state when messages are cleared or chat changes
  useEffect(() => {
    if (messages.length < lastMessageCountRef.current) {
      setShouldAutoScroll(true);
      isScrollingRef.current = false;
      scrollToBottom("auto", true);
    }
    lastMessageCountRef.current = messages.length;
  }, [messages.length, scrollToBottom]);

  // Initial scroll when messages are first loaded
  useEffect(() => {
    if (messages.length > 0 && containerRef.current && lastMessageCountRef.current === 0) {
      setShouldAutoScroll(true);
      // Small delay to ensure layout is complete
      const timeoutId = setTimeout(() => {
        scrollToBottom("auto", true);
      }, 150);
      return () => clearTimeout(timeoutId);
    }
  }, [messages.length, scrollToBottom]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      onScroll={handleScroll}
      className="absolute inset-0 overflow-y-auto scroll-smooth px-4 py-6 md:px-6 lg:py-10 pb-32 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent"
    >
      {/* Top Gradient Blur - Only shows when scrolled down (removed to prevent overlap) */}

      <div className="mx-auto max-w-3xl space-y-8 pb-32">
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
