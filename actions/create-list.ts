"use server";

import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const prisma = new PrismaClient();

const CreateListSchema = z.object({
  title: z.string().min(1, { message: "Title cannot be empty." }),
  boardId: z.string(),
});

export type State = { errors?: { title?: string[] }; message?: string | null };

export async function createList(prevState: State, formData: FormData): Promise<State> {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) return { message: "Unauthorized" };

  const validatedFields = CreateListSchema.safeParse({
    title: formData.get("title"),
    boardId: formData.get("boardId"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { title, boardId } = validatedFields.data;

  try {
    const board = await prisma.board.findUnique({ where: { id: boardId, orgId } });
    if (!board) return { message: "Board not found." };

    const lastList = await prisma.list.findFirst({
      where: { boardId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastList ? lastList.order + 1 : 1;

    await prisma.list.create({ data: { title, boardId, order: newOrder } });
  } catch (error) {
    return { message: "Database Error: Failed to create list." };
  }

  revalidatePath(`/board/${boardId}`);
  return { message: "List created." };
}