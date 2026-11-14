import { beforeEach, describe, expect, it } from "vitest";
import {
  currentSession,
  loginDemoUser,
  logoutDemoUser,
  memoryStore,
  registerDemoUser,
  SESSION_KEY,
  USERS_KEY,
  type KeyValueStore,
} from "@/lib/demo-auth";

const person = {
  name: "Asha Rao",
  email: "Asha@Example.com",
  password: "secret123",
  confirmPassword: "secret123",
};

let store: KeyValueStore;
beforeEach(() => {
  store = memoryStore();
});

describe("registerDemoUser", () => {
  it("creates an account, starts a session and normalises the email", async () => {
    const result = await registerDemoUser(store, person);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.session.email).toBe("asha@example.com");
    expect(currentSession(store)?.name).toBe("Asha Rao");
  });

  it("never stores the plain-text password", async () => {
    await registerDemoUser(store, person);
    expect(store.get(USERS_KEY)).not.toContain("secret123");
  });

  it("rejects a duplicate email", async () => {
    await registerDemoUser(store, person);
    const again = await registerDemoUser(store, person);
    expect(again.ok).toBe(false);
    if (!again.ok) expect(again.errors.email).toMatch(/already exists/);
  });

  it("returns validation errors without writing anything", async () => {
    const result = await registerDemoUser(store, { ...person, password: "x" });
    expect(result.ok).toBe(false);
    expect(store.get(USERS_KEY)).toBeNull();
  });
});

describe("loginDemoUser", () => {
  beforeEach(async () => {
    await registerDemoUser(store, person);
    logoutDemoUser(store);
  });

  it("signs in with the right password, case-insensitive email", async () => {
    const result = await loginDemoUser(store, "ASHA@example.com", "secret123");
    expect(result.ok).toBe(true);
    expect(currentSession(store)?.userId).toBeTruthy();
  });

  it("rejects a wrong password with a generic message", async () => {
    const result = await loginDemoUser(store, "asha@example.com", "wrong999");
    expect(result).toEqual({
      ok: false,
      error: "Incorrect email or password.",
    });
    expect(currentSession(store)).toBeNull();
  });

  it("rejects an unknown email with the same generic message", async () => {
    const result = await loginDemoUser(
      store,
      "nobody@example.com",
      "secret123",
    );
    expect(result).toEqual({
      ok: false,
      error: "Incorrect email or password.",
    });
  });
});

describe("session handling", () => {
  it("logout clears the session", async () => {
    await registerDemoUser(store, person);
    logoutDemoUser(store);
    expect(store.get(SESSION_KEY)).toBeNull();
    expect(currentSession(store)).toBeNull();
  });

  it("ignores corrupted session data", () => {
    store.set(SESSION_KEY, "{not json");
    expect(currentSession(store)).toBeNull();
  });
});
