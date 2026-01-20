import { z } from "zod";

export const CreateBoardSchema = z.object({
    title: z.string().min(3, {
        message: "Title is too short",
    }),
    image: z.string().min(1, {
        message: "Image is required",
    }),
});
