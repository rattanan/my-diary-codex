"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <div className="grid gap-6 lg:grid-cols-[minmax(280px,360px)_1fr]">
      <section className="h-fit rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-zinc-950">
            {editingEntry ? "Edit entry" : "Create entry"}
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Capture the title, mood, and what happened.
          </p>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="title">
              Title
            </label>
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
            <label className="mb-2 block text-sm font-medium" htmlFor="mood">
              Mood
            </label>
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
            <label className="mb-2 block text-sm font-medium" htmlFor="content">
              Content
            </label>
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
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {message}
            </p>
          ) : null}

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button className="w-full" disabled={isSaving} type="submit">
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
                variant="outline"
              >
                Cancel
              </Button>
            ) : null}
          </div>
        </form>
      </section>

      <DiaryList
        deletingId={deletingId}
        entries={entries}
        onDelete={handleDelete}
        onEdit={startEditing}
      />
    </div>
  );
}
