"use client";

import { ButtonLink } from "@/components/ui";
import { AuthPanel } from "@/components/AuthPanel";
import { LogoMark } from "@/components/Logo";
import { useSession } from "@/lib/use-session";

export default function WelcomePage() {
  const { status, session } = useSession();

  return (
    <main className="relative min-h-screen overflow-hidden bg-navy-900 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-40 h-[32rem] w-[32rem] rounded-full bg-royal-600/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-32 h-[28rem] w-[28rem] rounded-full bg-purple-500/20 blur-3xl"
      />

      <div className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-5 py-12 lg:grid-cols-2 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <LogoMark className="h-11 w-11" />
            <span className="text-xl font-semibold tracking-tight">
              Learning Sphere
            </span>
          </div>

          <h1 className="mt-10 text-4xl font-bold tracking-tight sm:text-5xl">
            Welcome to Learning Sphere
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
            A structured place to learn Product Management: five courses built
            from your official presentations, with lessons, study materials,
            quizzes, progress tracking, notes, and completion certificates.
          </p>

          <ul className="mt-8 grid max-w-xl gap-3 text-sm text-white/80 sm:grid-cols-2">
            {[
              "Course modules and lessons",
              "PPT and PDF study library",
              "Quizzes with instant feedback",
              "Progress tracking",
              "Personal notes",
              "Completion certificates",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-purple-500"
                />
                {item}
              </li>
            ))}
          </ul>

          <p className="mt-10 text-xs text-white/50">
            Content Source: Based on the five course presentations provided for
            Learning Sphere.
          </p>
        </div>

        <div className="space-y-4">
          {status === "signed-in" && session && (
            <div className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur">
              <p className="text-sm text-white/70">You are signed in as</p>
              <p className="mt-1 text-lg font-semibold">{session.name}</p>
              <ButtonLink href="/dashboard" className="mt-5 w-full">
                Enter Learning Dashboard
              </ButtonLink>
            </div>
          )}
          {status !== "signed-in" && (
            <div className="mb-2 text-sm text-white/70">
              Sign in or create an account to enter the dashboard.
            </div>
          )}
          {status === "signed-out" && <AuthPanel />}
          {status === "loading" && (
            <div
              className="h-80 animate-pulse rounded-2xl bg-white/5"
              aria-label="Loading"
            />
          )}
        </div>
      </div>
    </main>
  );
}
