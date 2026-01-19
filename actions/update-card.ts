"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";

// Define the schema for the form data
const UpdateCardSchema = z.object({
  title: z.string().min(1, {
    message: "Title cannot be empty.",
  }),
  id: z.string(), // The ID of the card to update
  boardId: z.string(), // The ID of the board for revalidation
});

// Define the return type for our action
type ReturnType = {
  data?: { id: string; title: string }; // Return only what's needed
  error?: string;
};

export async function updateCard(formData: FormData): Promise<ReturnType> {
  const { userId, orgId } = await auth();

  // 1. Authentication & Authorization Check
  if (!userId || !orgId) {
    return { error: "Unauthorized" };
  }

  // 2. Validation
  const validatedFields = UpdateCardSchema.safeParse({
    title: formData.get("title"),
    id: formData.get("id"),
    boardId: formData.get("boardId"),
  });

  if (!validatedFields.success) {
    return { error: "Invalid fields." };
  }

  const { title, id, boardId } = validatedFields.data;

  let card;
  try {
    // 3. Database Mutation with Security Check
    card = await db.card.update({
      where: {
        id,
        // Ensure the card's list's board belongs to the user's organization
        list: {
          board: {
            orgId,
          },
        },
      },
      data: {
        title,
      },
    });
  } catch (error) {
    console.error("Failed to update card:", error);
    return { error: "Failed to update card." };
  }

  // 4. Cache Revalidation
  revalidatePath(`/board/${boardId}`);

  // 5. Return Success Data
  return { data: card };
}