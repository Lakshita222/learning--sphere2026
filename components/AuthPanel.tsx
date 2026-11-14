"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button, Field } from "@/components/ui";
import { browserStore, loginDemoUser, registerDemoUser } from "@/lib/demo-auth";
import { hasErrors, type RegisterErrors } from "@/lib/validation";

type Mode = "login" | "register";

export function AuthPanel() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function switchMode(next: Mode) {
    setMode(next);
    setErrors({});
    setFormError(null);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    setSubmitting(true);
    setFormError(null);

    const store = browserStore();
    if (mode === "register") {
      const result = await registerDemoUser(store, {
        name: String(form.get("name") ?? ""),
        email,
        password,
        confirmPassword: String(form.get("confirmPassword") ?? ""),
      });
      if (!result.ok) {
        setErrors(result.errors);
        setSubmitting(false);
        return;
      }
    } else {
      const result = await loginDemoUser(store, email, password);
      if (!result.ok) {
        setErrors(result.errors ?? {});
        setFormError(result.error);
        setSubmitting(false);
        return;
      }
    }
    setErrors({});
    router.push("/dashboard");
  }

  const isRegister = mode === "register";

  return (
    <div className="w-full rounded-2xl border border-line bg-white p-6 shadow-card sm:p-8">
      <div
        role="tablist"
        aria-label="Account access"
        className="mb-6 grid grid-cols-2 rounded-xl bg-royal-50 p-1"
      >
        {(["login", "register"] as const).map((m) => (
          <button
            key={m}
            role="tab"
            type="button"
            aria-selected={mode === m}
            onClick={() => switchMode(m)}
            className={`rounded-lg py-2 text-sm font-semibold transition ${
              mode === m
                ? "bg-white text-navy-900 shadow-sm"
                : "text-muted hover:text-navy-900"
            }`}
          >
            {m === "login" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      <form
        onSubmit={onSubmit}
        noValidate
        className="space-y-4"
        aria-label={isRegister ? "Create account" : "Sign in"}
      >
        {isRegister && (
          <Field
            id="name"
            name="name"
            label="Full name"
            autoComplete="name"
            error={errors.name}
          />
        )}
        <Field
          id="email"
          name="email"
          type="email"
          label="Email"
          autoComplete="email"
          error={errors.email}
        />
        <Field
          id="password"
          name="password"
          type="password"
          label="Password"
          autoComplete={isRegister ? "new-password" : "current-password"}
          error={errors.password}
        />
        {isRegister && (
          <Field
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm password"
            autoComplete="new-password"
            error={errors.confirmPassword}
          />
        )}

        {formError && (
          <p
            role="alert"
            className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
          >
            {formError}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting
            ? "Please wait…"
            : isRegister
              ? "Create account and enter"
              : "Sign in and enter dashboard"}
        </Button>
        {!hasErrors(errors) && (
          <p className="text-center text-xs text-muted">
            Demo mode: accounts are stored in this browser only and are not
            secure. Supabase sign-in is added later.
          </p>
        )}
      </form>
    </div>
  );
}
