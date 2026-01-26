export type PlanId = "free" | "basic" | "pro";

export interface Plan {
    id: PlanId;
    name: string;
    description: string;
    price: number;
    boardLimit: number;
    features: string[];
}

export const PLANS: Record<PlanId, Plan> = {
    free: {
        id: "free",
        name: "Free",
        description: "For small teams just getting started",
        price: 0,
        boardLimit: 5,
        features: [
            "Up to 5 boards",
            "Basic features",
            "Individual workspace"
        ]
    },
    basic: {
        id: "basic",
        name: "Basic",
        description: "For growing teams",
        price: 9900, // R99.00
        boardLimit: 20,
        features: [
            "Up to 20 boards",
            "Basic Activity Log",
            "Priority Support"
        ]
    },
    pro: {
        id: "pro",
        name: "Pro",
        description: "For established production teams",
        price: 29900, // R299.00
        boardLimit: Infinity,
        features: [
            "Unlimited boards",
            "Full Activity Log",
            "Advanced Checklists",
            "Admin & Security features"
        ]
    }
};
