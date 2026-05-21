"use client";

import { useCallback, useEffect, useState } from "react";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { Message } from "@/lib/types";
import { apiFetch } from "@/lib/api";

type Props = {
  activeChatId: string | null;
};

export default function ChatWindow({ activeChatId }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [chatTitle, setChatTitle] = useState<string>("");

  const fetchChatTitle = useCallback(async () => {
    if (!activeChatId) return;
    try {
      const res = await apiFetch("/api/chats");
      const data = await res.json();
      const chats = Array.isArray(data.chats) ? data.chats : [];
      const chat = chats.find(
        (c: { _id: string; title?: string }) => c._id === activeChatId
      );
      setChatTitle(chat?.title || "Untitled Chat");
    } catch {
      setChatTitle("Untitled Chat");
    }
  }, [activeChatId]);

  useEffect(() => {
    if (!activeChatId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMessages([]);
      setChatTitle("");
      return;
    }

    apiFetch(`/api/messages/${activeChatId}`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(Array.isArray(data) ? data : []);
      })
      .catch(() => setMessages([]));

    fetchChatTitle();
  }, [activeChatId, fetchChatTitle]);

  useEffect(() => {
    window.addEventListener("refresh-chats", fetchChatTitle);
    return () => window.removeEventListener("refresh-chats", fetchChatTitle);
  }, [fetchChatTitle]);

  if (!activeChatId) {
    return (
      <div className="flex h-full w-full flex-1 flex-col items-center justify-center bg-[#fafafa] px-6 text-center">
        <div className="absolute inset-0 z-0 opacity-40 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-size-[24px_24px]"></div>

        <div className="relative z-10 max-w-sm">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-2xl bg-blue-400/20 opacity-75"></div>
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 text-3xl font-bold text-white shadow-2xl shadow-blue-500/30">
                M
              </div>
            </div>
          </div>
          <h2 className="mb-3 text-2xl font-extrabold tracking-tight text-slate-900">
            Start a new conversation
          </h2>
          <p className="mb-8 text-sm font-medium leading-relaxed text-slate-500">
            Select an existing chat from the sidebar or click &ldquo;New
            Conversation&rdquo; to begin your journey with Gemini AI.
          </p>
          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="rounded-xl border border-slate-200 bg-white p-3 text-[11px] text-slate-400">
              &ldquo;Explain quantum physics to me like I&apos;m five...&rdquo;
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3 text-[11px] text-slate-400">
              &ldquo;Write a clean Next.js component for a...&rdquo;
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="relative flex h-full flex-1 flex-col overflow-hidden bg-transparent">
      <header className="z-20 flex h-16 shrink-0 items-center justify-between border-b border-slate-200/60 bg-white/80 px-6 backdrop-blur-xl">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
          <h1 className="truncate text-sm font-bold tracking-tight text-slate-900">
            {chatTitle || "New Conversation"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-green-700">
              Gemini Online
            </span>
          </div>
        </div>
      </header>

      <div className="relative flex-1 overflow-hidden">
        <MessageList messages={messages} loading={loading} />
      </div>

      <div className="relative z-20 shrink-0 bg-white border-t border-slate-100/50">
        <ChatInput
          chatId={activeChatId}
          onSend={setMessages}
          loading={loading}
          setLoading={setLoading}
        />
      </div>
    </section>
  );
}
