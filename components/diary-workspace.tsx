"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Check,
  FilePenLine,
  LoaderCircle,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { DiaryEntry, Mood } from "@/lib/types";
import { moods } from "@/lib/types";
import { DiaryList } from "./diary-list";

type FormState = {
  title: string;
  content: string;
  mood: Mood;
};

const emptyForm: FormState = {
  title: "",
  content: "",
  mood: "Normal",
};

async function parseResponse(response: Response) {
  const body = (await response.json().catch(() => null)) as {
    message?: string;
  } | null;

  if (!response.ok) {
    throw new Error(body?.message ?? "Something went wrong. Please try again.");
  }
}

export function DiaryWorkspace({ entries }: { entries: DiaryEntry[] }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const editingEntry = useMemo(
    () => entries.find((entry) => entry.id === editingId),
    [editingId, entries],
  );

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch(
        editingId ? `/api/diary/${editingId}` : "/api/diary",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );

      await parseResponse(response);
      resetForm();
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "We could not save your diary entry.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function startEditing(entry: DiaryEntry) {
    setEditingId(entry.id);
    setForm({
      title: entry.title,
      content: entry.content,
      mood: entry.mood,
    });
    setMessage(null);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    setMessage(null);

    try {
      const response = await fetch(`/api/diary/${id}`, { method: "DELETE" });
      await parseResponse(response);

      if (editingId === id) {
        resetForm();
      }

      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "We could not delete your diary entry.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(300px,400px)_1fr] lg:items-start">
      <Card className="sticky top-6 h-fit overflow-hidden">
        <CardHeader className="border-b border-zinc-100 bg-zinc-50/70">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Badge>
                <Sparkles aria-hidden="true" className="size-3.5" />
                Writer
              </Badge>
              <h2 className="mt-4 text-xl font-semibold tracking-tight text-zinc-950">
                {editingEntry ? "Refine this entry" : "Create a new entry"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Capture the title, mood, and the details worth remembering.
              </p>
            </div>
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-sm">
              <FilePenLine aria-hidden="true" className="size-5" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
        <form className="grid gap-5" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="title">
              Title
            </Label>
            <Input
              id="title"
              maxLength={120}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              placeholder="A quiet morning"
              required
              value={form.title}
            />
          </div>

          <div>
            <Label htmlFor="mood">
              Mood
            </Label>
            <Select
              id="mood"
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  mood: event.target.value as Mood,
                }))
              }
              value={form.mood}
            >
              {moods.map((mood) => (
                <option key={mood} value={mood}>
                  {mood}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="content">
              Content
            </Label>
            <Textarea
              id="content"
              maxLength={5000}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  content: event.target.value,
                }))
              }
              placeholder="Write the moment down..."
              required
              value={form.content}
            />
          </div>

          {message ? (
            <div
              className="flex gap-3 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm leading-6 text-red-700"
              role="alert"
            >
              <AlertCircle
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0"
              />
              <p>{message}</p>
            </div>
          ) : null}

          <div className="flex flex-col gap-2 pt-1 sm:flex-row">
            <Button className="w-full" disabled={isSaving} type="submit">
              {isSaving ? (
                <LoaderCircle
                  aria-hidden="true"
                  className="size-4 animate-spin"
                />
              ) : editingEntry ? (
                <Check aria-hidden="true" className="size-4" />
              ) : (
                <Plus aria-hidden="true" className="size-4" />
              )}
              {isSaving
                ? "Saving..."
                : editingEntry
                  ? "Save changes"
                  : "Create entry"}
            </Button>
            {editingEntry ? (
              <Button
                className="w-full"
                onClick={resetForm}
                type="button"
                variant="secondary"
              >
                <X aria-hidden="true" className="size-4" />
                Cancel
              </Button>
            ) : null}
          </div>
        </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <div className="flex flex-col gap-1 px-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
              Entries
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Newest entries appear first.
            </p>
          </div>
          <Badge>{entries.length} shown</Badge>
        </div>

        <DiaryList
          deletingId={deletingId}
          entries={entries}
          onDelete={handleDelete}
          onEdit={startEditing}
        />
      </div>
    </div>
  );
}
