"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

import { Plan } from "@/constants/tiers";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProModal } from "@/hooks/use-pro-modal";

interface AvailableCountProps {
    availableCount: number;
    isPro: boolean;
    plan: Plan;
};

export const AvailableCount = ({
    availableCount = 0,
    isPro = false,
    plan,
}: AvailableCountProps) => {
    const proModal = useProModal();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    if (isPro && plan.boardLimit === Infinity) {
        return null;
    }

    return (
        <div className="px-3">
            <div className="bg-white rounded-md p-3 border shadow-sm">
                <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] text-neutral-700 font-bold uppercase tracking-wider">
                        {plan.name} Plan
                    </p>
                    <p className="text-[10px] text-neutral-500 font-medium">
                        {availableCount} / {plan.boardLimit === Infinity ? "∞" : plan.boardLimit}
                    </p>
                </div>
                <Progress
                    value={(availableCount / plan.boardLimit) * 100}
                    className="h-1.5"
                />
                {!isPro && (
                    <Button
                        onClick={proModal.onOpen}
                        variant="default"
                        className="w-full mt-3 h-8 text-[10px] font-bold uppercase bg-teal-600 hover:bg-teal-700 shadow-sm"
                    >
                        <Zap className="h-3 w-3 mr-2 fill-white" />
                        Upgrade
                    </Button>
                )}
            </div>
        </div>
    );
};

AvailableCount.Skeleton = function AvailableCountSkeleton() {
    return (
        <div className="px-3">
            <Skeleton className="h-24 w-full" />
        </div>
    );
};
