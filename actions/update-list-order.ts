"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { ActionState } from "@/lib/create-safe-action";
import { List, ACTION, ENTITY_TYPE } from "@prisma/client";
import { createAuditLog } from "@/lib/create-audit-log";

const UpdateListOrderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      order: z.number(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
  ),
  boardId: z.string(),
});

type InputType = z.infer<typeof UpdateListOrderSchema>;
type ReturnType = ActionState<InputType, List[]>;

export async function updateListOrder(data: InputType): Promise<ReturnType> {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return { error: "Unauthorized" };
  }

  const validatedFields = UpdateListOrderSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      fieldErrors: validatedFields.error.flatten().fieldErrors as ReturnType["fieldErrors"],
    };
  }

  const { items, boardId } = validatedFields.data;
  let lists;

  try {
    const transaction = items.map((list) =>
      db.list.update({
        where: {
          id: list.id,
          board: {
            orgId,
          },
        },
        data: {
          order: list.order,
        },
      })
    );

    lists = await db.$transaction(transaction);

    await createAuditLog({
      entityId: boardId,
      entityTitle: "List Reordered",
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.UPDATE,
    });
  } catch (error) {
    return {
      error: "Failed to reorder."
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: lists };
}