"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { ActionState } from "@/lib/create-safe-action";
import { Card } from "@prisma/client";

const DeleteCardSchema = z.object({
    id: z.string(),
    boardId: z.string(),
});

type InputType = z.infer<typeof DeleteCardSchema>;
type ReturnType = ActionState<InputType, Card>;

export async function deleteCard(data: InputType): Promise<ReturnType> {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized",
        };
    }

    const validatedFields = DeleteCardSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            fieldErrors: validatedFields.error.flatten().fieldErrors as ReturnType["fieldErrors"],
        };
    }

    const { id, boardId } = validatedFields.data;

    let card;

    try {
        card = await db.card.delete({
            where: {
                id,
                list: {
                    board: {
                        orgId,
                    },
                },
            },
        });
    } catch (error) {
        return {
            error: "Failed to delete.",
        };
    }

    revalidatePath(`/board/${boardId}`);
    return { data: card };
}
