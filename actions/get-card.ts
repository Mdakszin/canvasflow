"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { Card, List } from "@prisma/client";

type ReturnType = (Card & { list: { title: string } }) | null;

export const getCard = async (id: string): Promise<ReturnType> => {
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
        },
    });

    return card;
};
