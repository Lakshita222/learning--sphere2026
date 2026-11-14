import Link from "next/link";

export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="16" fill="#5a7cf0" />
      <ellipse
        cx="32"
        cy="32"
        rx="26"
        ry="9"
        fill="none"
        stroke="#9db8ff"
        strokeWidth="2.5"
        transform="rotate(-20 32 32)"
      />
      <circle cx="51" cy="20" r="3.5" fill="#ffffff" />
    </svg>
  );
}

export function Logo({
  href = "/dashboard",
  light = false,
}: {
  href?: string;
  light?: boolean;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2.5"
      aria-label="Learning Sphere home"
    >
      <LogoMark />
      <span
        className={`text-lg font-semibold tracking-tight ${light ? "text-white" : "text-navy-900"}`}
      >
        Learning Sphere
      </span>
    </Link>
  );
}
