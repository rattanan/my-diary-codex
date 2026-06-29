import { CalendarDays, Pencil, Trash2 } from "lucide-react";
import type { DiaryEntry } from "@/lib/types";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

const moodStyles = {
  Happy: "success",
  Normal: "info",
  Sad: "warning",
} as const;

const moodDots = {
  Happy: "bg-emerald-500",
  Normal: "bg-sky-500",
  Sad: "bg-amber-500",
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
    <Card className="group p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-zinc-200/80">
      <article>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="break-words text-xl font-semibold leading-7 tracking-tight text-zinc-950">
            {entry.title}
          </h2>
          <p className="mt-2 flex items-center gap-2 text-sm text-zinc-500">
            <CalendarDays aria-hidden="true" className="size-4" />
            {new Intl.DateTimeFormat("en", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(new Date(entry.createdAt))}
          </p>
        </div>
        <Badge variant={moodStyles[entry.mood]}>
          <span
            aria-hidden="true"
            className={`size-1.5 rounded-full ${moodDots[entry.mood]}`}
          />
          {entry.mood}
        </Badge>
      </div>
      <p className="mt-5 whitespace-pre-wrap break-words text-sm leading-7 text-zinc-700 sm:text-base">
        {entry.content}
      </p>
      {onEdit || onDelete ? (
        <div className="mt-6 flex flex-wrap gap-2 border-t border-zinc-100 pt-4">
          {onEdit ? (
            <Button onClick={() => onEdit(entry)} size="sm" variant="outline">
              <Pencil aria-hidden="true" className="size-4" />
              Edit
            </Button>
          ) : null}
          {onDelete ? (
            <Button
              disabled={deleting}
              onClick={() => onDelete(entry.id)}
              size="sm"
              variant="destructive"
            >
              <Trash2 aria-hidden="true" className="size-4" />
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          ) : null}
        </div>
      ) : null}
      </article>
    </Card>
  );
}
