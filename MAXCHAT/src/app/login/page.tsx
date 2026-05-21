"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import GoogleLoginButton from "@/components/GoogleLoginButton";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSuccess = async (googleToken: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: googleToken }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message ?? "Authentication failed. Please try again.");
        return;
      }

      router.push("/chat");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google sign-in was cancelled or failed.");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fafafa] p-4 sm:p-6 selection:bg-blue-100 selection:text-blue-900">
      {/* Background Ornaments */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[10%] h-[40%] w-[40%] rounded-full bg-blue-100/50 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] h-[40%] w-[40%] rounded-full bg-indigo-100/40 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[44px_44px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-105">
        {/* Logo and Branding */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block group">
            <div className="mb-4 flex justify-center transition-transform group-hover:scale-110">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 text-2xl font-bold text-white shadow-xl shadow-blue-500/20">
                M
              </div>
            </div>
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Welcome back
          </h1>
          <p className="mt-2 text-slate-500 font-medium">
            Continue your journey with Max Chat
          </p>
        </div>

        {/* Login Card */}
        <div className="overflow-hidden rounded-[2.5rem] border border-white bg-white/70 p-8 shadow-2xl shadow-slate-200/50 backdrop-blur-2xl sm:p-10">
          <div className="mb-8">
            <h2 className="text-lg font-bold text-slate-900">Secure Sign In</h2>
            <p className="text-sm text-slate-500">
              Please use your Google account to access your workspace.
            </p>
          </div>

          <div className="space-y-6">
            <div className="relative transition-transform active:scale-[0.98]">
              <GoogleLoginButton
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              />
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">
                {error}
              </p>
            )}

            {isLoading && (
              <div className="flex justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
              </div>
            )}

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest">
                <span className="bg-transparent px-2 text-slate-400 font-bold">
                  Trusted Security
                </span>
              </div>
            </div>

            <p className="text-center text-[11px] leading-relaxed text-slate-400">
              By signing in, you agree to our
              <span className="text-blue-600 hover:underline cursor-pointer px-1">Terms</span>
              &
              <span className="text-blue-600 hover:underline cursor-pointer px-1">Privacy Policy</span>
              .
            </p>
          </div>
        </div>

        {/* Back to Home & Footer */}
        <div className="mt-10 flex flex-col items-center gap-6">
          <Link
            href="/"
            className="group flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-blue-600"
          >
            <svg
              className="h-4 w-4 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to home
          </Link>

          <p className="text-xs font-medium text-slate-400">
            © 2025 Max Chat. Enterprise Grade AI.
          </p>
        </div>
      </div>
    </div>
  );
}
