"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { LogoMark } from "@/components/Logo";
import { browserStore, logoutDemoUser } from "@/lib/demo-auth";
import { useSession } from "@/lib/use-session";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/courses", label: "Course Modules" },
  { href: "/materials", label: "Learning Materials" },
  { href: "/quizzes", label: "Quizzes" },
  { href: "/progress", label: "Progress" },
  { href: "/notes", label: "Notes" },
  { href: "/certificates", label: "Certificates" },
] as const;

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <ul className="space-y-1">
      {NAV_ITEMS.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`block rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-white/10 text-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { status, session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (status === "signed-out") router.replace("/");
  }, [status, router]);

  useEffect(() => setMenuOpen(false), [pathname]);

  function signOut() {
    logoutDemoUser(browserStore());
    router.replace("/");
  }

  if (status !== "signed-in" || !session) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-surface text-sm text-muted"
        role="status"
      >
        Loading your workspace…
      </div>
    );
  }

  const initials = session.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-surface">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-navy-900 px-4 py-6 lg:flex">
        <Link href="/dashboard" className="mb-8 flex items-center gap-2.5 px-2">
          <LogoMark />
          <span className="font-semibold tracking-tight text-white">
            Learning Sphere
          </span>
        </Link>
        <nav aria-label="Main navigation" className="flex-1">
          <NavLinks pathname={pathname} />
        </nav>
        <div className="mt-6 rounded-xl bg-white/5 p-3">
          <p className="truncate text-sm font-medium text-white">
            {session.name}
          </p>
          <button
            onClick={signOut}
            className="mt-2 text-xs font-semibold text-purple-500 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <LogoMark className="h-8 w-8" />
          <span className="font-semibold text-navy-900">Learning Sphere</span>
        </Link>
        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
          className="rounded-lg border border-line px-3 py-2 text-sm font-semibold text-navy-900"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </header>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 top-[57px] bottom-0 z-20 overflow-y-auto bg-navy-900 p-4 lg:hidden"
        >
          <nav aria-label="Mobile navigation">
            <NavLinks
              pathname={pathname}
              onNavigate={() => setMenuOpen(false)}
            />
          </nav>
          <button
            onClick={signOut}
            className="mt-6 text-sm font-semibold text-purple-500"
          >
            Sign out ({initials})
          </button>
        </div>
      )}

      <main className="px-4 py-6 sm:px-6 lg:ml-64 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
