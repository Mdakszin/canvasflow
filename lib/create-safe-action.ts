import { createSafeActionClient } from "next-safe-action";

export const action = createSafeActionClient();

export type ActionState<TInput, TOutput> = {
    fieldErrors?: {
        [K in keyof TInput]?: string[];
    };
    error?: string | null;
    data?: TOutput;
};
