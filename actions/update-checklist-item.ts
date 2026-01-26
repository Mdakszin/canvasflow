"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/lib/db";
import { ActionState } from "@/lib/create-safe-action";
import { ChecklistItem, ENTITY_TYPE, ACTION } from "@prisma/client";
import { createAuditLog } from "@/lib/create-audit-log";

const UpdateChecklistItemSchema = z.object({
    id: z.string(),
    boardId: z.string(),
    title: z.string().min(1, { message: "Title is required" }).optional(),
    isCompleted: z.boolean().optional(),
});

type InputType = z.infer<typeof UpdateChecklistItemSchema>;
type ReturnType = ActionState<InputType, ChecklistItem>;

export async function updateChecklistItem(data: InputType): Promise<ReturnType> {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
        return { error: "Unauthorized" };
    }

    const validatedFields = UpdateChecklistItemSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            fieldErrors: validatedFields.error.flatten().fieldErrors as ReturnType["fieldErrors"],
        };
    }

    const { id, boardId, ...values } = validatedFields.data;

    let checklistItem;

    try {
        checklistItem = await db.checklistItem.update({
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
            data: {
                ...values,
            },
        });

        await createAuditLog({
            entityId: checklistItem.id,
            entityTitle: checklistItem.title,
            entityType: ENTITY_TYPE.CHECKLIST_ITEM,
            action: ACTION.UPDATE,
        });
    } catch (error) {
        console.error("[UPDATE_CHECKLIST_ITEM_ERROR]", error);
        return { error: "Failed to update." };
    }

    revalidatePath(`/board/${boardId}`);
    return { data: checklistItem };
}
