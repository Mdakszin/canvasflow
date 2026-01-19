"use server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
// ... (imports for auth, prisma, z, revalidatePath)

const UpdateListSchema = z.object({
  title: z.string().min(1, { message: "Title cannot be empty." }),
  id: z.string(),
  boardId: z.string(),
});

export async function updateList(formData: FormData) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) return { error: "Unauthorized" };

  const { title, id, boardId } = UpdateListSchema.parse({
    title: formData.get("title"),
    id: formData.get("id"),
    boardId: formData.get("boardId"),
  });

  let list;
  try {
    list = await PrismaClient.list.update({
      where: { id, board: { orgId } },
      data: { title },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: "Invalid input." };
    }
    return { error: "Failed to update list." };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: list };
}