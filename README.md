# My Diary

A simple local diary web app built with Next.js 16, TypeScript, Tailwind CSS, App Router, and shadcn-style UI components.

The app stores entries in a local JSON file instead of using a database. It is intentionally small, readable, and easy to run locally.

## Features

- View all diary entries, sorted newest first
- Create entries with a title, content, and mood
- Edit existing entries
- Delete entries
- Search entries by title
- Friendly error messages for validation and file issues
- Responsive layout for desktop and mobile

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Zod for API request validation
- Local JSON file storage with `fs/promises`
- shadcn-style reusable UI primitives

## Local Storage

Diary entries are stored in:

```text
data/diary.json
```

There is no Prisma setup and no database. The server reads and writes this file directly through `fs/promises`.

If the JSON file is missing, the app recreates it with an empty diary. If the file contains invalid JSON or malformed entries, the app shows a friendly message instead of crashing.

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

Run TypeScript checks:

```bash
npx tsc --noEmit
```

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
data/
  diary.json          Local diary entry storage
lib/
  diary.ts            File-backed diary read/write helpers
  validation.ts       Zod schemas
  types.ts            Shared TypeScript types
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

This app is designed for local use and learning. Because entries are stored in a JSON file, concurrent writes are not handled like they would be in a real database-backed application.
