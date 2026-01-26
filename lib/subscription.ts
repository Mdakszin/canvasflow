import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

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
    planType: string | null;
    currentPeriodEnd: Date | null;
}

export const getSubscriptionDetails = async (): Promise<SubscriptionDetails> => {
    const { orgId } = await auth();

    if (!orgId) {
        return {
            isPro: false,
            status: null,
            planType: null,
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
            planType: null,
            currentPeriodEnd: null,
        };
    }

    const isValid =
        orgSubscription.status === "active" &&
        orgSubscription.currentPeriodEnd &&
        orgSubscription.currentPeriodEnd.getTime() + DAY_IN_MS > Date.now();

    return {
        isPro: !!isValid,
        status: orgSubscription.status,
        planType: orgSubscription.planType,
        currentPeriodEnd: orgSubscription.currentPeriodEnd,
    };
};
