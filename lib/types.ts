export const moods = ["Happy", "Normal", "Sad"] as const;

export type Mood = (typeof moods)[number];

export type DiaryEntry = {
  id: string;
  title: string;
  content: string;
  mood: Mood;
  createdAt: string;
  updatedAt: string;
};

export type DiaryReadResult = {
  entries: DiaryEntry[];
  error?: string;
};
