import { z } from "zod";
import { Board } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-action"; // This might fail if I didn't export ActionState. 
// Actually next-safe-action v7 uses inferred types usually. 
// I'll define simple Input/Output types here.

import { CreateBoardSchema } from "./schema";

export type InputType = z.infer<typeof CreateBoardSchema>;
export type ReturnType = ActionState<InputType, Board>;
