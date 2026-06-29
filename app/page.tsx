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

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 text-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <header className="flex flex-col gap-3">
          <p className="text-sm font-medium uppercase tracking-wider text-zinc-500">
            My Diary
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Today&apos;s thoughts
              </h1>
              <p className="mt-2 max-w-2xl text-zinc-600">
                Keep small memories, moods, and notes in one quiet place.
              </p>
            </div>
          </div>
        </header>

        {error ? <Alert>{error}</Alert> : null}

        <form className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <label
            className="mb-2 block text-sm font-medium text-zinc-700"
            htmlFor="search"
          >
            Search by title
          </label>
          <Input
            defaultValue={query}
            id="search"
            name="q"
            placeholder="Search entries..."
            type="search"
          />
        </form>

        <DiaryWorkspace entries={visibleEntries} />
      </div>
      </main>
  );
}
