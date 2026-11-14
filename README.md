# Learning Sphere

A Product Management learning platform built from five course presentations.

**Status: Phase 4 complete.** Welcome and sign-in, the responsive app shell, and all section pages exist. Course content, study materials, quizzes, progress, notes, and certificate logic are built in Phases 5–7. Pages for those features show a clearly labelled "Built in Phase N" status and have no working controls yet.

## Run locally (demo mode, no credentials needed)

```bash
npm install
cp .env.example .env.local   # DATA_MODE=demo is the default
npm run dev                  # open http://localhost:3000
```

## Tests

```bash
npm test          # unit tests: validation and demo authentication
npm run lint      # TypeScript type check
npx playwright install chromium   # first time only
npm run test:e2e  # end-to-end tests on desktop and mobile viewports
```

## Demo mode limitations

Accounts and sessions are stored in the browser's localStorage. They are not secure and are for demonstration only. Passwords are hashed in the browser, but anyone with access to the browser can read the stored data. Supabase Auth replaces this in Phase 9 without changing the pages.

## Content attribution

Content Source: Based on the five course presentations provided for Learning Sphere.
