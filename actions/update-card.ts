"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { ActionState } from "@/lib/create-safe-action";
import { Card, ENTITY_TYPE, ACTION } from "@prisma/client";
import { createAuditLog } from "@/lib/create-audit-log";

const UpdateCardSchema = z.object({
  boardId: z.string(),
  description: z.optional(
    z.string().min(3, {
      message: "Description is too short.",
    })
  ),
  title: z.optional(
    z.string().min(1, {
      message: "Title is too short.",
    })
  ),
  id: z.string(),
});

type InputType = z.infer<typeof UpdateCardSchema>;
type ReturnType = ActionState<InputType, Card>;

export async function updateCard(data: InputType): Promise<ReturnType> {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return { error: "Unauthorized" };
  }

  const validatedFields = UpdateCardSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      fieldErrors: validatedFields.error.flatten().fieldErrors as ReturnType["fieldErrors"],
    };
  }

  const { id, boardId, ...values } = validatedFields.data;

  let card;

  try {
    card = await db.card.update({
      where: {
        id,
        list: {
          board: {
            orgId,
          },
        },
      },
      data: {
        ...values,
      },
    });

    await createAuditLog({
      entityId: card.id,
      entityTitle: card.title,
      entityType: ENTITY_TYPE.CARD,
      action: ACTION.UPDATE,
    });
  } catch (error) {
    return {
      error: "Failed to update.",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: card };
}