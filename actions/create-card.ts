"use server";

import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const prisma = new PrismaClient();

const CreateCardSchema = z.object({
  title: z.string().min(1, {
    message: "Title cannot be empty.",
  }),
  boardId: z.string(),
  listId: z.string(),
});

export type State = {
  errors?: {
    title?: string[];
  };
  message?: string | null;
};

export async function createCard(prevState: State, formData: FormData): Promise<State> {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return { message: "Unauthorized" };
  }

  const validatedFields = CreateCardSchema.safeParse({
    title: formData.get("title"),
    boardId: formData.get("boardId"),
    listId: formData.get("listId"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { title, boardId, listId } = validatedFields.data;

  try {
    // Verify that the list exists and belongs to the user's organization
    const list = await prisma.list.findUnique({
      where: {
        id: listId,
        board: {
          orgId,
        },
      },
    });

    if (!list) {
      return { message: "List not found." };
    }

    // Find the last card in the list to determine the new order
    const lastCard = await prisma.card.findFirst({
      where: { listId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastCard ? lastCard.order + 1 : 1;

    await prisma.card.create({
      data: {
        title,
        listId,
        order: newOrder,
      },
    });

  } catch (error) {
    return { message: "Database Error: Failed to create card." };
  }

  // Revalidate the entire board path to update the UI
  revalidatePath(`/board/${boardId}`);
  return { message: "Card created." };
}