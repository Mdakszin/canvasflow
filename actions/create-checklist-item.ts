"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/lib/db";
import { ActionState } from "@/lib/create-safe-action";
import { ChecklistItem, ENTITY_TYPE, ACTION } from "@prisma/client";
import { createAuditLog } from "@/lib/create-audit-log";

const CreateChecklistItemSchema = z.object({
    title: z.string().min(1, { message: "Title cannot be empty." }),
    boardId: z.string(),
    cardId: z.string(),
});

type InputType = z.infer<typeof CreateChecklistItemSchema>;
type ReturnType = ActionState<InputType, ChecklistItem>;

export async function createChecklistItem(data: InputType): Promise<ReturnType> {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
        return { error: "Unauthorized" };
    }

    const validatedFields = CreateChecklistItemSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            fieldErrors: validatedFields.error.flatten().fieldErrors as ReturnType["fieldErrors"],
        };
    }

    const { title, boardId, cardId } = validatedFields.data;

    let checklistItem;

    try {
        const card = await db.card.findUnique({
            where: {
                id: cardId,
                list: {
                    board: {
                        orgId,
                    },
                },
            },
        });

        if (!card) {
            return { error: "Card not found." };
        }

        const lastItem = await db.checklistItem.findFirst({
            where: { cardId },
            orderBy: { order: "desc" },
            select: { order: true },
        });

        const newOrder = lastItem ? lastItem.order + 1 : 1;

        checklistItem = await db.checklistItem.create({
            data: {
                title,
                cardId,
                order: newOrder,
                isCompleted: false,
            },
        });

        await createAuditLog({
            entityId: checklistItem.id,
            entityTitle: checklistItem.title,
            entityType: ENTITY_TYPE.CHECKLIST_ITEM,
            action: ACTION.CREATE,
        });
    } catch (error) {
        console.error("[CREATE_CHECKLIST_ITEM_ERROR]", error);
        return { error: "Failed to create checklist item." };
    }

    revalidatePath(`/board/${boardId}`);
    return { data: checklistItem };
}
