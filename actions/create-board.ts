"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/lib/db";

// Define the schema for our form input
const CreateBoardSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters long.",
  }),
});

// Define the state that our form hook will use
export type State = {
  errors?: {
    title?: string[];
  };
  message?: string | null;
};

export async function createBoard(prevState: State, formData: FormData): Promise<State> {
  const { userId, sessionClaims } = await auth();
  const orgId = sessionClaims?.org_id as string | undefined;

  // 1. Authenticate and authorize the user
  if (!userId || !orgId) {
    return {
      message: "Unauthorized: You must be logged in to create a board.",
    };
  }

  // 2. Validate the form fields
  const validatedFields = CreateBoardSchema.safeParse({
    title: formData.get("title"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid fields. Failed to create board.",
    };
  }

  const { title } = validatedFields.data;

  // 3. Perform the database mutation
  try {
    await db.board.create({
      data: {
        title,
        orgId,
        userId,
      },
    });
  } catch (error) {
    return {
      message: "Database Error: Failed to create the board.",
    };
  }

  // 4. Revalidate the cache for the dashboard path
  revalidatePath("/dashboard");
  return { message: "Board created successfully." };
}