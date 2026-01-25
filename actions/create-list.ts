"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { ActionState } from "@/lib/create-safe-action";
import { List, ACTION, ENTITY_TYPE } from "@prisma/client";
import { createAuditLog } from "@/lib/create-audit-log";


const CreateListSchema = z.object({
  title: z.string().min(1, { message: "Title cannot be empty." }),
  boardId: z.string(),
});

type InputType = z.infer<typeof CreateListSchema>;
type ReturnType = ActionState<InputType, List>;

export async function createList(data: InputType): Promise<ReturnType> {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return { error: "Unauthorized" };
  }

  const validatedFields = CreateListSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      fieldErrors: validatedFields.error.flatten().fieldErrors as ReturnType["fieldErrors"],
    };
  }

  const { title, boardId } = validatedFields.data;

  let list;

  try {
    const board = await db.board.findUnique({
      where: { id: boardId, orgId },
    });

    if (!board) {
      return { error: "Board not found." };
    }

    const lastList = await db.list.findFirst({
      where: { boardId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastList ? lastList.order + 1 : 1;

    list = await db.list.create({
      data: { title, boardId, order: newOrder },
    });

    await createAuditLog({
      entityId: list.id,
      entityTitle: list.title,
      entityType: ENTITY_TYPE.LIST,
      action: ACTION.CREATE,
    });
  } catch (error) {
    return { error: "Failed to create list." };
  }


  revalidatePath(`/board/${boardId}`);
  return { data: list };
}