"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { getSubscriptionDetails } from "@/lib/subscription";
import { PLANS, PlanId } from "@/constants/tiers";

import { InputType, ReturnType } from "./types";
import { ProcessYocoPaymentSchema } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized",
        };
    }

    const { planId: requestedPlanId = "pro" } = data;
    const planToBuy = PLANS[requestedPlanId as PlanId] || PLANS.pro;

    const { plan: currentPlan, isPro } = await getSubscriptionDetails();

    // Prevent downgrades or duplicate same-tier purchases for now
    // Pro is higher than Basic, which is higher than Free
    const tierPriority = { free: 0, basic: 1, pro: 2 };
    if (isPro && tierPriority[currentPlan.id] >= tierPriority[planToBuy.id]) {
        return {
            error: `You already have an active ${currentPlan.name} subscription or higher.`,
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
                amount: planToBuy.price,
                currency: "ZAR",
                successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/organization/${orgId}?payment=success`,
                cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/organization/${orgId}?payment=cancelled`,
                failureUrl: `${process.env.NEXT_PUBLIC_APP_URL}/organization/${orgId}?payment=failed`,
                metadata: {
                    orgId,
                    userId,
                    planId: planToBuy.id,
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
