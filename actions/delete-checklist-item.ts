"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/lib/db";
import { ActionState } from "@/lib/create-safe-action";
import { ChecklistItem, ENTITY_TYPE, ACTION } from "@prisma/client";
import { createAuditLog } from "@/lib/create-audit-log";

const DeleteChecklistItemSchema = z.object({
    id: z.string(),
    boardId: z.string(),
});

type InputType = z.infer<typeof DeleteChecklistItemSchema>;
type ReturnType = ActionState<InputType, ChecklistItem>;

export async function deleteChecklistItem(data: InputType): Promise<ReturnType> {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
        return { error: "Unauthorized" };
    }

    const validatedFields = DeleteChecklistItemSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            fieldErrors: validatedFields.error.flatten().fieldErrors as ReturnType["fieldErrors"],
        };
    }

    const { id, boardId } = validatedFields.data;

    let checklistItem;

    try {
        checklistItem = await db.checklistItem.delete({
            where: {
                id,
                card: {
                    list: {
                        board: {
                            orgId,
                        },
                    },
                },
            },
        });

        await createAuditLog({
            entityId: checklistItem.id,
            entityTitle: checklistItem.title,
            entityType: ENTITY_TYPE.CHECKLIST_ITEM,
            action: ACTION.DELETE,
        });
    } catch (error) {
        console.error("[DELETE_CHECKLIST_ITEM_ERROR]", error);
        return { error: "Failed to delete." };
    }

    revalidatePath(`/board/${boardId}`);
    return { data: checklistItem };
}
