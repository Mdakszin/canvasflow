"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { InputType, ReturnType } from "./types";
import { ProcessYocoPaymentSchema } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized",
        };
    }

    const { token, amountInCents } = data;

    try {
        const response = await fetch("https://online.yoco.africa/v1/charges/", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.YOCO_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token,
                amountInCents,
                currency: "ZAR",
            }),
        });

        const result = await response.json();

        if (!response.ok || result.status !== "successful") {
            console.error("Yoco Error:", result);
            return {
                error: "Payment failed. Please try again or contact support."
            };
        }

        // Update subscription in database
        const currentPeriodEnd = new Date();
        currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);

        await db.orgSubscription.upsert({
            where: { orgId },
            update: {
                status: "active",
                planType: "pro",
                externalId: result.id,
                currentPeriodEnd,
            },
            create: {
                orgId,
                status: "active",
                planType: "pro",
                externalId: result.id,
                currentPeriodEnd,
            },
        });

    } catch (error) {
        return {
            error: "An error occurred while processing your payment."
        }
    }

    revalidatePath(`/organization/${orgId}`);
    return { data: { success: true } };
};

export const processYocoPayment = createSafeAction(ProcessYocoPaymentSchema, handler);
