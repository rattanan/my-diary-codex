import { createDiaryEntry } from "@/lib/diary";
import { createDiaryEntrySchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const payload = createDiaryEntrySchema.parse(await request.json());
    const entry = await createDiaryEntry(payload);

    revalidatePath("/");
    return Response.json({ entry }, { status: 201 });
  } catch (error) {
    return Response.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "We could not create that diary entry.",
      },
      { status: 400 },
    );
  }
}
