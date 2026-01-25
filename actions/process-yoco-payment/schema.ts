import { z } from "zod";

export const ProcessYocoPaymentSchema = z.object({
    token: z.string(),
    amountInCents: z.number(),
});
