import type { DiaryEntry } from "@/lib/types";
import { DiaryCard } from "./diary-card";

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
      <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-600">
        No diary entries found.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {entries.map((entry) => (
        <DiaryCard
          deleting={deletingId === entry.id}
          entry={entry}
          key={entry.id}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
