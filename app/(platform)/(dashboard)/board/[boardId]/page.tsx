import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { ListContainer } from "./_components/list-container";
import { CursorTracker } from "./_components/cursor-tracker";

export default async function BoardIdPage({
    params,
}: {
    params: Promise<{ boardId: string }>;
}) {
    const { orgId } = await auth();
    const { boardId } = await params;

    if (!orgId) {
        redirect("/select-org");
    }

    const lists = await db.list.findMany({
        where: {
            boardId,
            board: {
                orgId,
            },
        },
        include: {
            cards: {
                orderBy: {
                    order: "asc",
                },
            },
        },
        orderBy: {
            order: "asc",
        },
    });

    return (
        <CursorTracker>
            <div className="p-4 h-full overflow-x-auto">
                <ListContainer
                    boardId={boardId}
                    lists={lists}
                />
            </div>
        </CursorTracker>
    );
}
