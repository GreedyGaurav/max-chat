"use client";

type Props = {
  role: "user" | "assistant";
  content: string;
  showCursor?: boolean;
  user?: { name?: string; avatar?: string };
};

export default function MessageBubble({
  role,
  content,
  showCursor = false,
  user,
}: Props) {
  const isUser = role === "user";
  const firstName = user?.name?.trim().split(/\s+/)[0] ?? "You";

  return (
    <div
      className={`group flex w-full flex-col gap-1.5 py-2 ${isUser ? "items-end" : "items-start"}`}
    >
      {/* Role label */}
      <span className="px-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
        {isUser ? firstName : "Max Chat"}
      </span>

      {/* Bubble */}
      <div
        className={`max-w-[85%] md:max-w-[75%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap wrap-break-word ${
          isUser
            ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm shadow-sm"
            : "bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-sm shadow-sm shadow-slate-100/80 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:shadow-slate-900"
        }`}
      >
        {content ||
          (showCursor && (
            <span className="text-slate-400 italic text-xs dark:text-slate-500">
              Thinking...
            </span>
          ))}
        {showCursor && (
          <span className="ml-0.5 inline-block h-3.5 w-1 animate-pulse bg-current align-middle rounded-full opacity-70" />
        )}
      </div>

      {/* Action buttons — inline below bubble, no absolute positioning */}
      {!showCursor && content && (
        <div
          className={`flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ${
            isUser ? "flex-row-reverse pr-1" : "pl-1"
          }`}
        >
          <button
            className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-300"
            title="Copy"
          >
            <svg
              className="h-3 w-3"
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
          {!isUser && (
            <button
              className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-300"
              title="Regenerate"
            >
              <svg
                className="h-3 w-3"
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
          )}
        </div>
      )}
    </div>
  );
}
