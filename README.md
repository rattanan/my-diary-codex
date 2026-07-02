# My Diary

A simple diary web app built with Next.js 16, TypeScript, Tailwind CSS, App Router, Supabase, and shadcn-style UI components.

The app stores entries in a Supabase Postgres table and uses Supabase client helpers for server access. It is intentionally small, readable, and easy to run locally against a Supabase project.

## Features

- View all diary entries, sorted newest first
- Create entries with a title, content, and mood
- Edit existing entries
- Delete entries
- Search entries by title
- Friendly error messages for validation and database issues
- Responsive layout for desktop and mobile

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Zod for API request validation
- Supabase client access to Postgres storage
- shadcn-style reusable UI primitives

## Database

Diary entries are stored in a Postgres table named `public.diary_entries`.

Set these environment variables before running the app:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://otqbdcpknvmvqalxjdks.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

The app reads and writes the table through `lib/supabase.ts` and `lib/diary.ts`.

If your table uses RLS, add policies that allow the intended read/write access.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the app:

```text
http://localhost:3000
```

## Useful Commands

Run linting:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

## Project Structure

```text
app/
  api/diary/          API route handlers for create, edit, and delete
  page.tsx            Home page with search and diary workspace
components/
  diary-*.tsx         Diary-specific UI
  ui/                 Reusable shadcn-style primitives
lib/
  diary.ts            Supabase-backed diary read/write helpers
  supabase.ts         Shared Supabase client
  validation.ts       Zod schemas
  types.ts            Shared TypeScript types
proxy.ts              Supabase session refresh proxy
utils/supabase/       Supabase server/client helper wrappers
```

## Diary Entry Shape

```ts
type DiaryEntry = {
  id: string;
  title: string;
  content: string;
  mood: "Happy" | "Normal" | "Sad";
  createdAt: string;
  updatedAt: string;
};
```

## Notes

This app is designed for local use and learning. Because entries are stored in Supabase Postgres, concurrent writes are handled by the database rather than the filesystem.
