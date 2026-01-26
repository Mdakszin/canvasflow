"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { CardWithList } from "@/types";

export const getCard = async (id: string): Promise<CardWithList | null> => {
    const { orgId } = await auth();

    if (!orgId) {
        return null;
    }

    const card = await db.card.findUnique({
        where: {
            id,
            list: {
                board: {
                    orgId,
                },
            },
        },
        include: {
            list: {
                select: {
                    title: true,
                },
            },
            checklist: {
                orderBy: {
                    order: "asc",
                },
            },
        },
    });

    return card as CardWithList;
};
