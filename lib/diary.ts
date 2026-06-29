import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { z } from "zod";
import { moods, type DiaryEntry, type DiaryReadResult } from "./types";
import type { DiaryEntryInput } from "./validation";

const diaryPath = path.join(process.cwd(), "data", "diary.json");

const diaryEntrySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
  mood: z.enum(moods),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

const diaryFileSchema = z.array(diaryEntrySchema);

async function ensureDiaryFile() {
  await mkdir(path.dirname(diaryPath), { recursive: true });
}

export async function readDiaryEntries(): Promise<DiaryReadResult> {
  try {
    await ensureDiaryFile();
    const raw = await readFile(diaryPath, "utf8");
    const parsed = JSON.parse(raw);
    const entries = diaryFileSchema.parse(parsed);

    return {
      entries: entries.toSorted(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    };
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof z.ZodError) {
      return {
        entries: [],
        error:
          "Your diary file could not be read. Please check data/diary.json for valid diary entries.",
      };
    }

    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      await writeDiaryEntries([]);
      return { entries: [] };
    }

    return {
      entries: [],
      error: "Something went wrong while loading your diary entries.",
    };
  }
}

export async function writeDiaryEntries(entries: DiaryEntry[]) {
  await ensureDiaryFile();
  await writeFile(diaryPath, `${JSON.stringify(entries, null, 2)}\n`, "utf8");
}

async function readEntriesForMutation() {
  const { entries, error } = await readDiaryEntries();

  if (error) {
    throw new Error(error);
  }

  return entries;
}

export async function createDiaryEntry(input: DiaryEntryInput) {
  const entries = await readEntriesForMutation();
  const now = new Date().toISOString();
  const entry: DiaryEntry = {
    id: crypto.randomUUID(),
    ...input,
    createdAt: now,
    updatedAt: now,
  };

  await writeDiaryEntries([entry, ...entries]);
  return entry;
}

export async function updateDiaryEntry(id: string, input: DiaryEntryInput) {
  const entries = await readEntriesForMutation();
  const entry = entries.find((item) => item.id === id);

  if (!entry) {
    throw new Error("That diary entry could not be found.");
  }

  const updatedEntry: DiaryEntry = {
    ...entry,
    ...input,
    updatedAt: new Date().toISOString(),
  };

  await writeDiaryEntries(
    entries.map((item) => (item.id === id ? updatedEntry : item)),
  );

  return updatedEntry;
}

export async function deleteDiaryEntry(id: string) {
  const entries = await readEntriesForMutation();
  const nextEntries = entries.filter((entry) => entry.id !== id);

  if (nextEntries.length === entries.length) {
    throw new Error("That diary entry could not be found.");
  }

  await writeDiaryEntries(nextEntries);
}
