"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

import { MAX_FREE_BOARDS } from "@/constants/boards";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProModal } from "@/hooks/use-pro-modal";

interface AvailableCountProps {
    availableCount: number;
    isPro: boolean;
};

export const AvailableCount = ({
    availableCount = 0,
    isPro = false,
}: AvailableCountProps) => {
    const proModal = useProModal();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    if (isPro) {
        return null;
    }

    return (
        <div className="px-3">
            <div className="bg-white rounded-md p-3 border">
                <p className="text-xs text-neutral-700 mb-1 font-semibold">
                    {availableCount} / {MAX_FREE_BOARDS} free boards
                </p>
                <Progress
                    value={(availableCount / MAX_FREE_BOARDS) * 100}
                    className="h-2"
                />
                <Button
                    onClick={proModal.onOpen}
                    variant="default"
                    className="w-full mt-3 h-8 text-xs bg-teal-600 hover:bg-teal-700"
                >
                    <Zap className="h-3 w-3 mr-2 fill-white" />
                    Upgrade
                </Button>
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
