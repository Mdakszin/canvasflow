import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { PLANS, PlanId } from "@/constants/tiers";

const DAY_IN_MS = 86_400_000;

export const checkSubscription = async () => {
    const { orgId } = await auth();

    if (!orgId) {
        return false;
    }

    const orgSubscription = await db.orgSubscription.findUnique({
        where: { orgId },
        select: {
            status: true,
            currentPeriodEnd: true,
        },
    });

    if (!orgSubscription) {
        return false;
    }

    const isValid =
        orgSubscription.status === "active" &&
        orgSubscription.currentPeriodEnd &&
        orgSubscription.currentPeriodEnd.getTime() + DAY_IN_MS > Date.now();

    return !!isValid;
};

export interface SubscriptionDetails {
    isPro: boolean;
    status: string | null;
    plan: typeof PLANS.free;
    currentPeriodEnd: Date | null;
}

export const getSubscriptionDetails = async (): Promise<SubscriptionDetails> => {
    const { orgId } = await auth();

    if (!orgId) {
        return {
            isPro: false,
            status: null,
            plan: PLANS.free,
            currentPeriodEnd: null,
        };
    }

    const orgSubscription = await db.orgSubscription.findUnique({
        where: { orgId },
        select: {
            status: true,
            planType: true,
            currentPeriodEnd: true,
        },
    });

    if (!orgSubscription) {
        return {
            isPro: false,
            status: null,
            plan: PLANS.free,
            currentPeriodEnd: null,
        };
    }

    const isValid =
        orgSubscription.status === "active" &&
        orgSubscription.currentPeriodEnd &&
        orgSubscription.currentPeriodEnd.getTime() + DAY_IN_MS > Date.now();

    // Map DB planType to our PLANS constant
    const planId = (orgSubscription.planType as PlanId) || "free";
    const plan = PLANS[planId] || PLANS.free;

    return {
        isPro: !!isValid,
        status: orgSubscription.status,
        plan: plan,
        currentPeriodEnd: orgSubscription.currentPeriodEnd,
    };
};
