"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { ActionState } from "@/lib/create-safe-action";
import { Card } from "@prisma/client";

const CopyCardSchema = z.object({
    id: z.string(),
    boardId: z.string(),
});

type InputType = z.infer<typeof CopyCardSchema>;
type ReturnType = ActionState<InputType, Card>;

export async function copyCard(data: InputType): Promise<ReturnType> {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized",
        };
    }

    const validatedFields = CopyCardSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            fieldErrors: validatedFields.error.flatten().fieldErrors as ReturnType["fieldErrors"],
        };
    }

    const { id, boardId } = validatedFields.data;

    let card;

    try {
        const cardToCopy = await db.card.findUnique({
            where: {
                id,
                list: {
                    board: {
                        orgId,
                    },
                },
            },
        });

        if (!cardToCopy) {
            return { error: "Card not found" };
        }

        const lastCard = await db.card.findFirst({
            where: { listId: cardToCopy.listId },
            orderBy: { order: "desc" },
            select: { order: true },
        });

        const newOrder = lastCard ? lastCard.order + 1 : 1;

        card = await db.card.create({
            data: {
                title: `${cardToCopy.title} - Copy`,
                description: cardToCopy.description,
                order: newOrder,
                listId: cardToCopy.listId,
            },
        });
    } catch (error) {
        return {
            error: "Failed to copy.",
        };
    }

    revalidatePath(`/board/${boardId}`);
    return { data: card };
}
