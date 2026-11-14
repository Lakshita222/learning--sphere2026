/**
 * DEMO AUTHENTICATION (Version 1 only).
 *
 * Accounts and sessions live in the browser's localStorage. This is for
 * demonstrating the interface without any credentials. It is NOT secure:
 * anyone with access to the browser can read the stored data. Supabase Auth
 * replaces this module in Phase 9 without changing the pages that call it.
 */
import {
  validateLogin,
  validateRegister,
  hasErrors,
  type RegisterErrors,
  type RegisterInput,
} from "./validation";

export interface KeyValueStore {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

export type DemoUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

export type Session = {
  userId: string;
  name: string;
  email: string;
};

export const USERS_KEY = "ls.demo.users";
export const SESSION_KEY = "ls.demo.session";

export function memoryStore(): KeyValueStore {
  const data = new Map<string, string>();
  return {
    get: (k) => (data.has(k) ? (data.get(k) as string) : null),
    set: (k, v) => void data.set(k, v),
    remove: (k) => void data.delete(k),
  };
}

export function browserStore(): KeyValueStore {
  return {
    get: (k) => window.localStorage.getItem(k),
    set: (k, v) => window.localStorage.setItem(k, v),
    remove: (k) => window.localStorage.removeItem(k),
  };
}

export async function hashPassword(password: string): Promise<string> {
  const bytes = new TextEncoder().encode(`learning-sphere-demo:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}

function readUsers(store: KeyValueStore): DemoUser[] {
  const raw = store.get(USERS_KEY);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as DemoUser[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(store: KeyValueStore, users: DemoUser[]): void {
  store.set(USERS_KEY, JSON.stringify(users));
}

function toSession(user: DemoUser): Session {
  return { userId: user.id, name: user.name, email: user.email };
}

export function currentSession(store: KeyValueStore): Session | null {
  const raw = store.get(SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Session;
    return parsed && typeof parsed.userId === "string" ? parsed : null;
  } catch {
    return null;
  }
}

export type RegisterResult =
  { ok: true; session: Session } | { ok: false; errors: RegisterErrors };

export async function registerDemoUser(
  store: KeyValueStore,
  input: RegisterInput,
): Promise<RegisterResult> {
  const errors = validateRegister(input);
  if (hasErrors(errors)) return { ok: false, errors };

  const email = input.email.trim().toLowerCase();
  const users = readUsers(store);
  if (users.some((u) => u.email === email)) {
    return {
      ok: false,
      errors: {
        email: "An account with this email already exists. Try signing in.",
      },
    };
  }

  const user: DemoUser = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    email,
    passwordHash: await hashPassword(input.password),
    createdAt: new Date().toISOString(),
  };
  writeUsers(store, [...users, user]);
  const session = toSession(user);
  store.set(SESSION_KEY, JSON.stringify(session));
  return { ok: true, session };
}

export type LoginResult =
  | { ok: true; session: Session }
  | { ok: false; error: string; errors?: RegisterErrors };

export async function loginDemoUser(
  store: KeyValueStore,
  email: string,
  password: string,
): Promise<LoginResult> {
  const errors = validateLogin(email, password);
  if (hasErrors(errors))
    return {
      ok: false,
      error: "Please correct the highlighted fields.",
      errors,
    };

  const normalized = email.trim().toLowerCase();
  const user = readUsers(store).find((u) => u.email === normalized);
  if (!user || (await hashPassword(password)) !== user.passwordHash) {
    return { ok: false, error: "Incorrect email or password." };
  }
  const session = toSession(user);
  store.set(SESSION_KEY, JSON.stringify(session));
  return { ok: true, session };
}

export function logoutDemoUser(store: KeyValueStore): void {
  store.remove(SESSION_KEY);
}
