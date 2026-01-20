"use server";

import { auth } from "@clerk/nextjs/server";
import { ENTITY_TYPE } from "@prisma/client";

import { db } from "@/lib/db";

export const getActivity = async (id: string) => {
    const { orgId } = await auth();

    if (!orgId) {
        return [];
    }

    const auditLogs = await db.auditLog.findMany({
        where: {
            orgId,
            entityId: id,
            entityType: ENTITY_TYPE.CARD,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 3,
    });

    return auditLogs;
};
