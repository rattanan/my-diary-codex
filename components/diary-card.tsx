import type { DiaryEntry } from "@/lib/types";
import { Button } from "./ui/button";

const moodStyles = {
  Happy: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Normal: "border-sky-200 bg-sky-50 text-sky-800",
  Sad: "border-violet-200 bg-violet-50 text-violet-800",
};

export function DiaryCard({
  deleting,
  entry,
  onDelete,
  onEdit,
}: {
  deleting?: boolean;
  entry: DiaryEntry;
  onDelete?: (id: string) => void;
  onEdit?: (entry: DiaryEntry) => void;
}) {
  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="break-words text-xl font-semibold text-zinc-950">
            {entry.title}
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            {new Intl.DateTimeFormat("en", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(new Date(entry.createdAt))}
          </p>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-medium ${moodStyles[entry.mood]}`}
        >
          {entry.mood}
        </span>
      </div>
      <p className="mt-4 whitespace-pre-wrap break-words leading-7 text-zinc-700">
        {entry.content}
      </p>
      {onEdit || onDelete ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {onEdit ? (
            <Button onClick={() => onEdit(entry)} variant="outline">
              Edit
            </Button>
          ) : null}
          {onDelete ? (
            <Button
              disabled={deleting}
              onClick={() => onDelete(entry.id)}
              variant="danger"
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
