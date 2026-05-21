"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type Chat = {
  _id: string;
  title?: string;
};

type User = {
  name?: string;
  email: string;
  avatar?: string;
};

type Props = {
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
};

export default function Sidebar({ activeChatId, setActiveChatId }: Props) {
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const fetchChats = useCallback(async () => {
    try {
      const res = await apiFetch("/api/chats");
      if (res.status === 401) { router.push("/login"); return; }
      const data = await res.json();
      setChats(Array.isArray(data.chats) ? data.chats : []);
    } catch {
      setChats([]);
    }
  }, [router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchChats();
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => { if (data?.user) setUser(data.user); })
      .catch(() => {});
  }, [fetchChats]);

  useEffect(() => {
    window.addEventListener("refresh-chats", fetchChats);
    return () => window.removeEventListener("refresh-chats", fetchChats);
  }, [fetchChats]);

  useEffect(() => {
    if (!activeChatId && chats.length > 0) {
      setActiveChatId(chats[0]._id);
    }
  }, [chats, activeChatId, setActiveChatId]);

  const createNewChat = async () => {
    const res = await apiFetch("/api/chats", {
      method: "POST",
      body: JSON.stringify({ title: "New Chat" }),
    });
    const chat = await res.json();
    if (!chat?._id) return;
    setChats((prev) => [chat, ...prev]);
    setActiveChatId(chat._id);
  };

  const deleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await apiFetch(`/api/chats/${chatId}`, { method: "DELETE" });
    setChats((prev) => prev.filter((c) => c._id !== chatId));
    if (activeChatId === chatId) setActiveChatId(null);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <aside className="flex h-full w-full flex-col bg-white">
      {/* Brand Header */}
      <div className="px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-200">
            <span className="text-xl font-bold text-white">M</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-slate-900">Max Chat</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600/60">
              Pro Workspace
            </span>
          </div>
        </div>

        <button
          onClick={createNewChat}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-200 active:scale-95"
        >
          <svg
            className="h-4 w-4 transition-transform group-hover:rotate-90"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          New Conversation
        </button>
      </div>

      {/* Navigation Label */}
      <div className="px-6 pb-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
          Recent Chats
        </span>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-3 scrollbar-hide">
        <div className="space-y-1">
          {chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="mb-3 rounded-full bg-slate-50 p-3 text-slate-300">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p className="text-xs font-medium text-slate-400 leading-relaxed">
                No history yet. Start a new chat to begin.
              </p>
            </div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => setActiveChatId(chat._id)}
                className={`group relative flex cursor-pointer items-center rounded-xl px-4 py-3 transition-all duration-200 ${
                  activeChatId === chat._id
                    ? "bg-blue-50 text-blue-700 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {activeChatId === chat._id && (
                  <div className="absolute left-1 h-5 w-1 rounded-full bg-blue-600" />
                )}

                <svg
                  className={`mr-3 h-4 w-4 shrink-0 transition-colors ${
                    activeChatId === chat._id ? "text-blue-600" : "text-slate-400"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>

                <span className="flex-1 truncate text-sm font-semibold tracking-tight">
                  {chat.title || "Untitled Chat"}
                </span>

                <button
                  onClick={(e) => deleteChat(chat._id, e)}
                  className="ml-2 flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* User & Settings Footer */}
      <div className="border-t border-slate-100 p-4">
        <div className="mb-4 flex items-center gap-3 px-2 py-2">
          {user?.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatar}
              alt={user.name ?? "User"}
              className="h-8 w-8 rounded-full border border-slate-200 object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-linear-to-tr from-blue-100 to-indigo-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-blue-600 uppercase">
              {initials}
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="truncate text-xs font-bold text-slate-900">
              {user?.name ?? user?.email ?? "Loading…"}
            </span>
            <span className="text-[10px] font-medium text-green-500 flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-green-500 animate-pulse" />
              Connected
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-500 transition-all hover:bg-red-50 hover:text-red-600"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
