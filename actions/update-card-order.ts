"use server";

import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Define the shape of the input data we expect from the client
type Input = {
  id: string;      // ID of the card being moved
  order: number;   // Its new order (position) in the list
  listId: string;  // The ID of the list it now belongs to
  boardId: string; // The board ID for revalidation and context
};

export async function updateCardOrder(items: Input[]) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return { error: "Unauthorized" };
  }

  // We only need the boardId from the first item since all cards are on the same board
  const boardId = items.length > 0 ? items[0].boardId : undefined;
  if (!boardId) {
    return { error: "Board ID is missing." };
  }

  // Create an array of update promises to be executed in a transaction
  const transaction = items.map((card) =>
    prisma.card.update({
      where: {
        id: card.id,
        // Security check: Ensure the card's list is on a board in the user's org.
        // This is a crucial multi-tenancy check.
        list: {
          board: {
            orgId,
          },
        },
      },
      data: {
        order: card.order,
        listId: card.listId, // This handles both reordering and moving between lists
      },
    })
  );

  try {
    // Execute all the update operations as a single atomic transaction
    await prisma.$transaction(transaction);
  } catch (error) {
    console.error("Failed to reorder cards:", error);
    return { error: "Database error: Failed to reorder cards." };
  }

  // Again, no revalidation here. Liveblocks will handle the refresh.
  return { data: "Cards reordered successfully." };
}