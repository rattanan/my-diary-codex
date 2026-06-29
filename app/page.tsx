import { BookOpen, CalendarDays, Search } from "lucide-react";
import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { DiaryWorkspace } from "@/components/diary-workspace";
import { readDiaryEntries } from "@/lib/diary";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const [{ entries, error }, params] = await Promise.all([
    readDiaryEntries(),
    searchParams,
  ]);
  const query = params.q?.trim() ?? "";
  const visibleEntries = query
    ? entries.filter((entry) =>
        entry.title.toLowerCase().includes(query.toLowerCase()),
      )
    : entries;
  const totalEntries = entries.length;
  const lastUpdated = entries[0]?.updatedAt ?? entries[0]?.createdAt;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#ffffff_0,#f8fafc_34%,#eef2ff_100%)] px-4 py-6 text-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="rounded-3xl border border-white/70 bg-white/85 p-5 shadow-xl shadow-zinc-200/70 backdrop-blur sm:p-8">
          <nav
            aria-label="Primary"
            className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <Link
              aria-current="page"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-zinc-950 px-3 py-2 text-sm font-medium text-white shadow-sm"
              href="/"
            >
              <BookOpen aria-hidden="true" className="size-4" />
              My Diary
            </Link>
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Local JSON storage
            </div>
          </nav>

          <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-zinc-600">
                <CalendarDays aria-hidden="true" className="size-3.5" />
                Personal journal
              </p>
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-zinc-950 sm:text-5xl">
                Today&apos;s thoughts, beautifully organized.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
                Capture moments, track your mood, and find past entries quickly
                in a calm workspace designed for daily writing.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                <p className="text-sm text-zinc-500">Entries</p>
                <p className="mt-2 text-3xl font-semibold text-zinc-950">
                  {totalEntries}
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                <p className="text-sm text-zinc-500">Latest</p>
                <p className="mt-2 truncate text-sm font-semibold text-zinc-950">
                  {lastUpdated
                    ? new Intl.DateTimeFormat("en", {
                        dateStyle: "medium",
                      }).format(new Date(lastUpdated))
                    : "No entries"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {error ? <Alert>{error}</Alert> : null}

        <form className="rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm shadow-zinc-200/70 sm:p-4">
          <label
            className="sr-only"
            htmlFor="search"
          >
            Search by title
          </label>
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400"
            />
            <Input
              className="pl-10"
              defaultValue={query}
              id="search"
              name="q"
              placeholder="Search entries by title..."
              type="search"
            />
          </div>
        </form>

        <DiaryWorkspace entries={visibleEntries} />
      </div>
    </main>
  );
}
