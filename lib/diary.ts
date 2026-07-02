import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { moods, type DiaryEntry, type DiaryReadResult } from "./types";
import type { DiaryEntryInput } from "./validation";

function toDiaryEntry(row: {
  id: string;
  title: string;
  content: string;
  mood: string;
  createdAt: Date;
  updatedAt: Date;
}): DiaryEntry {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    mood: row.mood as (typeof moods)[number],
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function readDiaryEntries(): Promise<DiaryReadResult> {
  try {
    const entries = await prisma.diaryEntry.findMany({
      orderBy: { createdAt: "desc" },
    });

    return {
      entries: entries.map(toDiaryEntry),
    };
  } catch {
    return {
      entries: [],
      error: "Something went wrong while loading your diary entries.",
    };
  }
}

export async function createDiaryEntry(input: DiaryEntryInput) {
  const entry = await prisma.diaryEntry.create({
    data: input,
  });

  return toDiaryEntry(entry);
}

export async function updateDiaryEntry(id: string, input: DiaryEntryInput) {
  try {
    const entry = await prisma.diaryEntry.update({
      where: { id },
      data: input,
    });

    return toDiaryEntry(entry);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new Error("That diary entry could not be found.");
    }

    throw error;
  }
}

export async function deleteDiaryEntry(id: string) {
  try {
    await prisma.diaryEntry.delete({
      where: { id },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new Error("That diary entry could not be found.");
    }

    throw error;
  }
}
