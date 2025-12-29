"use client";

type Props = {
  role: "user" | "assistant";
  content: string;
  showCursor?: boolean;
};

export default function MessageBubble({
  role,
  content,
  showCursor = false,
}: Props) {
  const isUser = role === "user";

  return (
    <div
      className={`group flex w-full flex-col gap-2 py-4 ${
        isUser ? "items-end" : "items-start"
      }`}
    >
      {/* Role Label & Avatar Row */}
      <div
        className={`flex items-center gap-2 px-1 ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold shadow-sm ${
            isUser ? "bg-blue-600 text-white" : "bg-slate-900 text-white"
          }`}
        >
          {isUser ? "U" : "AI"}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {isUser ? "You" : "Max Chat"}
        </span>
      </div>

      {/* Message Bubble */}
      <div
        className={`relative max-w-[85%] md:max-w-[75%] px-5 py-3.5 text-sm md:text-base leading-relaxed whitespace-pre-wrap transition-all shadow-sm ${
          isUser
            ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm"
            : "bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-sm shadow-slate-200/50"
        }`}
      >
        {content ||
          (showCursor && (
            <span className="text-slate-400 italic text-xs">Thinking...</span>
          ))}

        {showCursor && (
          <span className="ml-1 inline-block h-4 w-1.5 animate-pulse bg-current align-middle rounded-full opacity-70" />
        )}

        {/* Action Buttons (Visible on Hover - Recruiters love this!) */}
        {!showCursor && (
          <div
            className={`absolute -bottom-8 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100 ${
              isUser ? "right-0" : "left-0"
            }`}
          >
            <button className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
            </button>
            <button className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
