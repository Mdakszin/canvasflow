"use server";

import { auth } from "@clerk/nextjs/server";

 // Adjust the path if your prisma client is elsewhere
import { ZodError } from "zod";
import { PrismaClient } from "@prisma/client";
// ... (imports for auth, prisma, z, etc.)

type Input = { id: string; order: number; boardId: string; }[];

export async function updateListOrder(items: Input) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) return { error: "Unauthorized" };

  // Use a transaction to update all lists in a single database call
  const transaction = items.map((list) =>
    PrismaClient.Lists.updated({
      where: { id: list.id, board: { orgId } }, // Security check
      data: { order: list.order },
    })
  );

  try {
    await PrismaClient.$transaction(transaction);
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: "Validation error: Failed to reorder lists." };
    }
    return { error: "Database error: Failed to reorder lists." };
  }

  // We don't revalidate here. Liveblocks will trigger the refresh.
  return { data: "Success" };
}