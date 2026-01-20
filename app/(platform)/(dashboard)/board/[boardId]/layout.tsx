import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";

import { db } from "@/lib/db";
import { BoardNavbar } from "./_components/board-navbar";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ boardId: string }>;
}) {
    const { orgId } = await auth();
    const { boardId } = await params;

    if (!orgId) {
        return {
            title: "Board",
        };
    }

    const board = await db.board.findUnique({
        where: {
            id: boardId,
            orgId,
        },
    });

    return {
        title: board?.title || "Board",
    };
}

export default async function BoardIdLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ boardId: string }>;
}) {
    const { orgId } = await auth();
    const { boardId } = await params;

    if (!orgId) {
        redirect("/select-org");
    }

    const board = await db.board.findUnique({
        where: {
            id: boardId,
            orgId,
        },
    });

    if (!board) {
        notFound();
    }

    return (
        <div
            className="relative h-full bg-no-repeat bg-cover bg-center"
            style={{ backgroundImage: `url(${board.imageFullUrl})` }}
        >
            <BoardNavbar board={board} />
            <main className="relative pt-28 h-full">
                {children}
            </main>
        </div>
    );
}
