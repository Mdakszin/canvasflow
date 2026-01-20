"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { ActionState } from "@/lib/create-safe-action";
import { Card } from "@prisma/client";

const UpdateCardOrderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      order: z.number(),
      listId: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
  ),
  boardId: z.string(),
});

type InputType = z.infer<typeof UpdateCardOrderSchema>;
type ReturnType = ActionState<InputType, Card[]>;

export async function updateCardOrder(data: InputType): Promise<ReturnType> {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return { error: "Unauthorized" };
  }

  const validatedFields = UpdateCardOrderSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      fieldErrors: validatedFields.error.flatten().fieldErrors as ReturnType["fieldErrors"],
    };
  }

  const { items, boardId } = validatedFields.data;
  let updatedCards;

  try {
    const transaction = items.map((card) =>
      db.card.update({
        where: {
          id: card.id,
          list: {
            board: {
              orgId,
            },
          },
        },
        data: {
          order: card.order,
          listId: card.listId,
        },
      })
    );

    updatedCards = await db.$transaction(transaction);
  } catch (error) {
    return {
      error: "Failed to reorder."
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: updatedCards };
}