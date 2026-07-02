import { deleteDiaryEntry, updateDiaryEntry } from "@/lib/diary";
import { updateDiaryEntrySchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const payload = updateDiaryEntrySchema.parse(await request.json());
    const entry = await updateDiaryEntry(id, payload);

    revalidatePath("/");
    return Response.json({ entry });
  } catch (error) {
    return Response.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "We could not update that diary entry.",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    await deleteDiaryEntry(id);

    revalidatePath("/");
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "We could not delete that diary entry.",
      },
      { status: 400 },
    );
  }
}
