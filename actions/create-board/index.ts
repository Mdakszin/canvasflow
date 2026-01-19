"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { CreateBoardSchema } from "./schema";
import { InputType, ReturnType } from "./types";

export async function createBoard(data: InputType): Promise<ReturnType> {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized",
        };
    }

    const validatedFields = CreateBoardSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            fieldErrors: validatedFields.error.flatten().fieldErrors as ReturnType["fieldErrors"],
        };
    }

    const { title, image } = validatedFields.data;

    let board;

    try {
        board = await db.board.create({
            data: {
                title,
                orgId,
                // imageId can be added later when you handle images
            },
        });
    } catch (error) {
        return {
            error: "Failed to create board.",
        };
    }

    revalidatePath(`/organization/${orgId}`);
    return { data: board };
}
