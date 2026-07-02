# My Diary

A simple diary web app built with Next.js 16, TypeScript, Tailwind CSS, App Router, Prisma, and shadcn-style UI components.

The app stores entries in Google Cloud Postgres through Prisma. It is intentionally small, readable, and easy to run locally against a Postgres database.

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
- Prisma ORM with Postgres storage
- shadcn-style reusable UI primitives

## Database

Diary entries are stored in a Postgres table named `diary_entries` through Prisma.

Set `DATABASE_URL` to your Google Cloud Postgres connection string before running the app.

Prisma configuration lives in `prisma/schema.prisma` and `prisma.config.ts`.

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
prisma/
  schema.prisma       Prisma schema for diary entries
lib/
  diary.ts            Prisma-backed diary read/write helpers
  prisma.ts           Shared Prisma client
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

This app is designed for local use and learning. Because entries are stored in Postgres, concurrent writes are handled by the database rather than the filesystem.
