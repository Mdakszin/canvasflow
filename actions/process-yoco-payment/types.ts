import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { ProcessYocoPaymentSchema } from "./schema";

export type InputType = z.infer<typeof ProcessYocoPaymentSchema>;
export type ReturnType = ActionState<InputType, { redirectUrl: string }>;
