"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { action } from "@/lib/create-safe-action";
import { CreateBoardSchema } from "./schema";

const handler = async (getInput: { parsedInput: { title: string; image: string } }) => {
    const { title, image } = getInput.parsedInput;
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized",
        };
    }

    let board;

    try {
        board = await db.board.create({
            data: {
                title,
                orgId,
                // imageId: ... (TODO: Add unsplash image handling later)
            },
        });
    } catch (error) {
        return {
            error: "Failed to create.",
        };
    }

    revalidatePath(`/board/${board.id}`);
    return { data: board };
};

export const createBoard = action
    .schema(CreateBoardSchema)
    .action(handler);
