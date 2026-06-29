import { z } from "zod";
import { moods } from "./types";

export const createDiaryEntrySchema = z.object({
  title: z.string().trim().min(1, "Please add a title.").max(120),
  content: z.string().trim().min(1, "Please write something first.").max(5000),
  mood: z.enum(moods, { error: "Please choose a mood." }),
});

export const updateDiaryEntrySchema = createDiaryEntrySchema;

export type DiaryEntryInput = z.infer<typeof createDiaryEntrySchema>;
