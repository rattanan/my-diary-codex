# Google Cloud Postgres Prisma Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace JSON file storage with a fresh Prisma-backed Google Cloud Postgres database while keeping the diary app behavior the same.

**Architecture:** The app will keep its current route handlers and validation flow, but the persistence layer in `lib/diary.ts` will switch from filesystem reads and writes to Prisma queries against a single `DiaryEntry` table. A Prisma client module will centralize database access, and the API handlers will trigger cache revalidation after mutations so the UI reflects database changes immediately.

**Tech Stack:** Next.js App Router route handlers, Prisma ORM, Google Cloud Postgres via `DATABASE_URL`, TypeScript, Zod.

---

### Task 1: Add Prisma to the project

**Files:**
- Modify: `package.json`
- Create: `prisma/schema.prisma`
- Create: `lib/prisma.ts`

- [ ] **Step 1: Add the Prisma dependencies and scripts**

```json
{
  "dependencies": {
    "@prisma/client": "^6.0.0",
    "lucide-react": "^1.22.0",
    "next": "16.2.9",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "zod": "^4.4.3"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.9",
    "prisma": "^6.0.0",
    "tailwindcss": "^4",
    "typescript": "^5"
  },
  "prisma": {
    "schema": "prisma/schema.prisma"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "prisma:generate": "prisma generate"
  }
}
```

- [ ] **Step 2: Define the Prisma schema for diary entries**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model DiaryEntry {
  id        String   @id @default(uuid())
  title     String
  content   String
  mood      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("diary_entries")
}
```

- [ ] **Step 3: Add a shared Prisma client helper**

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

- [ ] **Step 4: Verify Prisma installs cleanly**

Run: `npm install`
Expected: `@prisma/client` and `prisma` are added to the lockfile without errors.

### Task 2: Move diary persistence from the filesystem to Prisma

**Files:**
- Modify: `lib/diary.ts`
- Modify: `lib/types.ts`
- Modify: `app/api/diary/route.ts`
- Modify: `app/api/diary/[id]/route.ts`

- [ ] **Step 1: Update diary types to match database values**

```ts
export const moods = ["Happy", "Normal", "Sad"] as const;

export type Mood = (typeof moods)[number];

export type DiaryEntry = {
  id: string;
  title: string;
  content: string;
  mood: Mood;
  createdAt: string;
  updatedAt: string;
};

export type DiaryReadResult = {
  entries: DiaryEntry[];
  error?: string;
};
```

- [ ] **Step 2: Replace file I/O with Prisma queries**

```ts
import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { moods, type DiaryEntry, type DiaryReadResult } from "./types";
import type { DiaryEntryInput } from "./validation";

function toDiaryEntry(row: {
  id: string;
  title: string;
  content: string;
  mood: string;
  createdAt: Date;
  updatedAt: Date;
}): DiaryEntry {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    mood: row.mood as (typeof moods)[number],
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function readDiaryEntries(): Promise<DiaryReadResult> {
  try {
    const entries = await prisma.diaryEntry.findMany({
      orderBy: { createdAt: "desc" },
    });

    return { entries: entries.map(toDiaryEntry) };
  } catch {
    return {
      entries: [],
      error: "Something went wrong while loading your diary entries.",
    };
  }
}

async function readEntriesForMutation() {
  const { entries, error } = await readDiaryEntries();

  if (error) {
    throw new Error(error);
  }

  return entries;
}

export async function createDiaryEntry(input: DiaryEntryInput) {
  const row = await prisma.diaryEntry.create({
    data: input,
  });

  return toDiaryEntry(row);
}

export async function updateDiaryEntry(id: string, input: DiaryEntryInput) {
  try {
    const row = await prisma.diaryEntry.update({
      where: { id },
      data: input,
    });

    return toDiaryEntry(row);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new Error("That diary entry could not be found.");
    }

    throw error;
  }
}

export async function deleteDiaryEntry(id: string) {
  try {
    await prisma.diaryEntry.delete({
      where: { id },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new Error("That diary entry could not be found.");
    }

    throw error;
  }
}
```

- [ ] **Step 3: Revalidate the diary page after writes**

```ts
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const payload = createDiaryEntrySchema.parse(await request.json());
    const entry = await createDiaryEntry(payload);

    revalidatePath("/");
    return Response.json({ entry }, { status: 201 });
  } catch (error) {
    return Response.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "We could not create that diary entry.",
      },
      { status: 400 },
    );
  }
}
```

```ts
import { revalidatePath } from "next/cache";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const payload = updateDiaryEntrySchema.parse(await request.json());
    const entry = await updateDiaryEntry(id, payload);

    revalidatePath("/");
    return Response.json({ entry });
  } catch (error) {
    return Response.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "We could not update that diary entry.",
      },
      { status: 400 },
    );
  }
}
```

```ts
import { revalidatePath } from "next/cache";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    await deleteDiaryEntry(id);

    revalidatePath("/");
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "We could not delete that diary entry.",
      },
      { status: 400 },
    );
  }
}
```

### Task 3: Remove the old JSON storage path from the app

**Files:**
- Delete: `data/diary.json`
- Modify: any file that still references `data/diary.json`

- [ ] **Step 1: Remove filesystem persistence assumptions**

```ts
// No filesystem diary storage should remain.
```

- [ ] **Step 2: Search for lingering JSON storage references**

Run: `rg -n "data/diary\\.json|writeDiaryEntries|readDiaryEntries|mkdir\\(|readFile\\(|writeFile\\(" .`
Expected: only the Prisma-backed implementation remains, and no app code reads or writes `data/diary.json`.

### Task 4: Verify the migration end to end

**Files:**
- Modify: none

- [ ] **Step 1: Generate Prisma client**

Run: `npm run prisma:generate`
Expected: Prisma client generation completes successfully.

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: ESLint passes with no new errors.

- [ ] **Step 3: Build the app**

Run: `npm run build`
Expected: Next.js build succeeds against the new Prisma-backed data layer.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json prisma/schema.prisma lib/prisma.ts lib/diary.ts lib/types.ts app/api/diary/route.ts app/api/diary/[id]/route.ts docs/superpowers/plans/2026-07-02-google-cloud-postgres-prisma.md
git commit -m "feat: migrate diary storage to prisma"
```
