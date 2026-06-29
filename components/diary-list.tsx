import { BookOpen, Plus } from "lucide-react";
import type { DiaryEntry } from "@/lib/types";
import { DiaryCard } from "./diary-card";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export function DiaryList({
  deletingId,
  entries,
  onDelete,
  onEdit,
}: {
  deletingId?: string | null;
  entries: DiaryEntry[];
  onDelete?: (id: string) => void;
  onEdit?: (entry: DiaryEntry) => void;
}) {
  if (entries.length === 0) {
    return (
      <Card className="flex min-h-80 items-center justify-center border-dashed p-8 text-center">
        <div className="mx-auto max-w-sm">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700">
            <BookOpen aria-hidden="true" className="size-7" />
          </div>
          <h2 className="mt-5 text-xl font-semibold text-zinc-950">
            No diary entries found
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Start a new entry or adjust your search to bring your thoughts back
            into view.
          </p>
          <Button
            className="mt-6"
            onClick={() => document.getElementById("title")?.focus()}
          >
            <Plus aria-hidden="true" className="size-4" />
            New entry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <section aria-label="Diary entries" className="grid gap-4">
      {entries.map((entry) => (
        <DiaryCard
          deleting={deletingId === entry.id}
          entry={entry}
          key={entry.id}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </section>
  );
}
