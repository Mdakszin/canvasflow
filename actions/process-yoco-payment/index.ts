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

    try {
        const response = await fetch("https://payments.yoco.com/api/checkouts", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.YOCO_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                amount: 20000, // R200.00
                currency: "ZAR",
                successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/organization/${orgId}?payment=success`,
                cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/organization/${orgId}?payment=cancelled`,
                failureUrl: `${process.env.NEXT_PUBLIC_APP_URL}/organization/${orgId}?payment=failed`,
                metadata: {
                    orgId,
                    userId
                }
            }),
        });

        let result;
        try {
            result = await response.json();
        } catch (jsonError) {
            console.error("Yoco API returned non-JSON response");
            result = { message: "Invalid response from payment provider" };
        }

        if (!response.ok) {
            console.error("Yoco Checkout Error - Status:", response.status);
            console.error("Yoco Checkout Error - Body:", result);
            return {
                error: "Failed to create payment session: " + (result.errorMessage || result.message || "Unknown error")
            };
        }

        console.log("Yoco Checkout Success:", result);
        return { data: { redirectUrl: result.redirectUrl } };

    } catch (error) {
        return {
            error: "An error occurred while creating the payment session."
        }
    }
};

export const processYocoPayment = createSafeAction(ProcessYocoPaymentSchema, handler);
