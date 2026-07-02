import { supabase } from "./supabase";
import { moods, type DiaryEntry, type DiaryReadResult } from "./types";
import type { DiaryEntryInput } from "./validation";

function toDiaryEntry(row: {
  id: string;
  title: string;
  content: string;
  mood: string;
  created_at: string;
  updated_at: string;
}): DiaryEntry {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    mood: row.mood as (typeof moods)[number],
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

export async function readDiaryEntries(): Promise<DiaryReadResult> {
  try {
    const { data, error } = await supabase
      .from("diary_entries")
      .select("id,title,content,mood,created_at,updated_at")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return {
      entries: (data ?? []).map((entry) =>
        toDiaryEntry(entry as {
          id: string;
          title: string;
          content: string;
          mood: string;
          created_at: string;
          updated_at: string;
        }),
      ),
    };
  } catch {
    return {
      entries: [],
      error: "Something went wrong while loading your diary entries.",
    };
  }
}

export async function createDiaryEntry(input: DiaryEntryInput) {
  const now = new Date().toISOString();
  const payload = {
    id: crypto.randomUUID(),
    ...input,
    created_at: now,
    updated_at: now,
  };

  const { data, error } = await supabase
    .from("diary_entries")
    .insert(payload)
    .select("id,title,content,mood,created_at,updated_at")
    .single();

  if (error) {
    throw error;
  }

  return toDiaryEntry({
    ...(data as {
      id: string;
      title: string;
      content: string;
      mood: string;
      created_at: string;
      updated_at: string;
    }),
  });
}

export async function updateDiaryEntry(id: string, input: DiaryEntryInput) {
  const { data, error } = await supabase
    .from("diary_entries")
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id,title,content,mood,created_at,updated_at")
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("That diary entry could not be found.");
  }

  return toDiaryEntry({
    ...(data as {
      id: string;
      title: string;
      content: string;
      mood: string;
      created_at: string;
      updated_at: string;
    }),
  });
}

export async function deleteDiaryEntry(id: string) {
  const { data, error } = await supabase
    .from("diary_entries")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("That diary entry could not be found.");
  }
}
