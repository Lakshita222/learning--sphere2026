"use client";

import { useEffect, useState } from "react";
import { browserStore, currentSession, type Session } from "@/lib/demo-auth";

export type SessionState =
  | { status: "loading"; session: null }
  | { status: "signed-out"; session: null }
  | { status: "signed-in"; session: Session };

/** Reads the demo session after mount (localStorage is not available on the server). */
export function useSession(): SessionState {
  const [state, setState] = useState<SessionState>({
    status: "loading",
    session: null,
  });

  useEffect(() => {
    const session = currentSession(browserStore());
    setState(
      session
        ? { status: "signed-in", session }
        : { status: "signed-out", session: null },
    );
  }, []);

  return state;
}
