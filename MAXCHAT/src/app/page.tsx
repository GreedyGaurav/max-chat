"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

const features = [
  {
    title: "Streaming",
    desc: "Experience zero-latency response generation.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    iconClass: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    title: "Memory",
    desc: "Context is preserved across every session.",
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    iconClass: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
  },
  {
    title: "Clean UI",
    desc: "Focused on readability and user experience.",
    icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z",
    iconClass: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  },
  {
    title: "Security",
    desc: "OAuth 2.0 and JWT protected architecture.",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    iconClass: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => setIsAuthenticated(res.ok))
      .catch(() => setIsAuthenticated(false));
  }, []);

  const handleCTAClick = () => {
    if (isAuthenticated) {
      router.push("/chat");
    } else {
      router.push("/login");
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafafa] dark:bg-slate-950">
        <div className="relative h-10 w-10 sm:h-12 sm:w-12">
          <div className="absolute inset-0 rounded-full border-2 border-slate-200 dark:border-slate-700" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#fafafa] selection:bg-blue-100 selection:text-blue-900 dark:bg-slate-950 dark:selection:bg-blue-900/40 dark:selection:text-blue-200">
      {/* Background Ornaments */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[5%] -left-[10%] h-[30%] w-[50%] rounded-full bg-blue-100/40 blur-[80px] sm:blur-[120px] dark:bg-blue-900/20" />
        <div className="absolute top-[10%] -right-[10%] h-[30%] w-[50%] rounded-full bg-indigo-100/30 blur-[80px] sm:blur-[120px] dark:bg-indigo-900/15" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 brightness-100 contrast-150 dark:opacity-5" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[32px_32px] sm:bg-size-[44px_44px]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-slate-200/50 bg-white/70 backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 items-center justify-between">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20">
                <span className="text-lg sm:text-xl font-bold text-white">M</span>
              </div>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Max Chat
              </span>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link
                href={isAuthenticated ? "/chat" : "/login"}
                className="inline-flex h-9 sm:h-11 items-center justify-center rounded-full bg-slate-900 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-white transition-all hover:bg-slate-800 active:scale-95 dark:bg-slate-700 dark:hover:bg-slate-600"
              >
                {isAuthenticated ? "Dashboard" : "Sign In"}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 pt-24 sm:pt-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center">
          <div className="mb-6 sm:mb-10 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/50 px-3 py-1 sm:px-4 sm:py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-blue-700 backdrop-blur-sm dark:border-blue-800/50 dark:bg-blue-900/20 dark:text-blue-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600 dark:bg-blue-500" />
            </span>
            Gemini 2.5 Flash Integrated
          </div>

          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-8xl px-2 dark:text-white">
            AI workspace, <br className="hidden sm:block" />
            <span className="relative inline-block text-blue-600 dark:text-blue-400">
              reimagined.
              <svg
                className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-2 sm:h-3"
                viewBox="0 0 338 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M1 9.5C54.5 3.5 178.5 -5.5 337 9.5"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-base sm:text-lg lg:text-xl leading-relaxed text-slate-500 font-medium px-4 dark:text-slate-400">
            The ultimate interface for intelligent conversations. Persistent
            memory and real-time streaming, designed for the modern web.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <button
              onClick={handleCTAClick}
              className="group relative w-full sm:w-auto h-12 sm:h-14 overflow-hidden rounded-xl sm:rounded-2xl bg-blue-600 px-8 sm:px-10 text-base sm:text-lg font-bold text-white transition-all hover:bg-blue-700 active:scale-95"
            >
              <span className="flex items-center justify-center gap-2">
                Start Chatting
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </button>
            <a
              href="#features"
              className="h-12 sm:h-14 px-8 flex items-center justify-center text-sm sm:text-lg font-semibold text-slate-600 hover:text-slate-900 transition-colors dark:text-slate-400 dark:hover:text-slate-100"
            >
              Explore features
            </a>
          </div>
        </div>

        {/* Features Section */}
        <div
          id="features"
          className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20 sm:py-32"
        >
          <div className="mb-12 sm:mb-20 text-center">
            <h2 className="text-[10px] sm:text-sm font-bold uppercase tracking-[0.2em] text-blue-600 mb-3 sm:mb-4 dark:text-blue-400">
              Capabilities
            </h2>
            <h3 className="text-3xl font-bold text-slate-900 sm:text-5xl dark:text-white">
              Engineered for speed.
            </h3>
          </div>

          <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 transition-all hover:border-blue-200 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-700/50"
              >
                <div className={`mb-4 sm:mb-6 flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl ${feature.iconClass}`}>
                  <svg
                    className="h-5 w-5 sm:h-7 sm:w-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={feature.icon}
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-500 leading-relaxed dark:text-slate-400">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20 sm:pb-32">
          <div className="relative overflow-hidden rounded-4xl sm:rounded-[3rem] bg-slate-900 px-6 py-16 sm:px-8 sm:py-20 text-center shadow-2xl dark:bg-slate-800">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[20px_20px]" />
            <div className="relative z-10">
              <h2 className="mb-4 sm:mb-6 text-3xl font-bold text-white sm:text-5xl">
                Build your ideas today.
              </h2>
              <p className="mx-auto mb-8 sm:mb-10 max-w-xl text-sm sm:text-lg text-slate-400 font-medium px-4">
                The cleanest Gemini client ever built. Free to use, forever secure.
              </p>
              <button
                onClick={handleCTAClick}
                className="w-full sm:w-auto rounded-xl sm:rounded-2xl bg-white px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-bold text-slate-900 transition-all hover:bg-blue-50 active:scale-95"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-10 sm:py-12 dark:border-slate-700 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-[10px] font-bold text-white dark:bg-slate-700">
                M
              </div>
              <span className="font-bold text-slate-900 text-sm dark:text-white">Max Chat</span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-400 text-center dark:text-slate-500">
              © 2025 Max Chat. Built with Next.js.
            </p>
            <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm font-semibold text-slate-400 dark:text-slate-500">
              <span className="hover:text-blue-600 cursor-pointer dark:hover:text-blue-400">Twitter</span>
              <span className="hover:text-blue-600 cursor-pointer dark:hover:text-blue-400">GitHub</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
