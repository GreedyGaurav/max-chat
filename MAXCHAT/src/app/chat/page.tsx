"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";

export default function ChatPage() {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-white">

      {/* SIDEBAR - Fixed width on desktop, Drawer on mobile */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-70 transform border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar
          activeChatId={activeChatId}
          setActiveChatId={(id) => {
            setActiveChatId(id);
            setIsSidebarOpen(false);
          }}
        />
      </aside>

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTENT AREA */}
      <main className="relative flex flex-1 flex-col min-w-0 h-screen bg-[#fafafa]">

        {/* MOBILE NAV BAR */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md lg:hidden">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 active:scale-95"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          <span className="text-sm font-bold tracking-tight text-slate-900">Max Chat</span>
          <div className="w-9" />
        </header>

        {/* CHAT WINDOW CONTAINER */}
        <div className="relative flex-1 overflow-hidden">
          <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[40px_40px]"></div>
          <div className="relative z-10 h-full w-full">
            <ChatWindow activeChatId={activeChatId} />
          </div>
        </div>

      </main>
    </div>
  );
}
