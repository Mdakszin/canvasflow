"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/lib/db";
import { ActionState } from "@/lib/create-safe-action";
import { ChecklistItem } from "@prisma/client";

const UpdateChecklistItemOrderSchema = z.object({
    items: z.array(
        z.object({
            id: z.string(),
            title: z.string(),
            order: z.number(),
            isCompleted: z.boolean(),
            createdAt: z.date(),
            updatedAt: z.date(),
            cardId: z.string(),
        })
    ),
    boardId: z.string(),
});

type InputType = z.infer<typeof UpdateChecklistItemOrderSchema>;
type ReturnType = ActionState<InputType, ChecklistItem[]>;

export async function updateChecklistItemOrder(data: InputType): Promise<ReturnType> {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
        return { error: "Unauthorized" };
    }

    const validatedFields = UpdateChecklistItemOrderSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            fieldErrors: validatedFields.error.flatten().fieldErrors as ReturnType["fieldErrors"],
        };
    }

    const { items, boardId } = validatedFields.data;

    let updatedItems;

    try {
        const transaction = items.map((item) =>
            db.checklistItem.update({
                where: {
                    id: item.id,
                    card: {
                        list: {
                            board: {
                                orgId,
                            },
                        },
                    },
                },
                data: {
                    order: item.order,
                },
            })
        );

        updatedItems = await db.$transaction(transaction);
    } catch (error) {
        console.error("[UPDATE_CHECKLIST_ITEM_ORDER_ERROR]", error);
        return { error: "Failed to reorder." };
    }

    revalidatePath(`/board/${boardId}`);
    return { data: updatedItems };
}
