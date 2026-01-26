"use client";

import { ChecklistItem } from "@prisma/client";
import { CheckSquare } from "lucide-react";
import { useState } from "react";

import { Progress } from "@/components/ui/progress";
import { ChecklistItemComponent } from "./checklist-item";
import { ChecklistForm } from "./checklist-form";

interface ChecklistProps {
    cardId: string;
    items: ChecklistItem[];
}

export const Checklist = ({
    cardId,
    items,
}: ChecklistProps) => {
    const completedCount = items.filter((item) => item.isCompleted).length;
    const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

    return (
        <div className="flex items-start gap-x-3 w-full">
            <CheckSquare className="h-5 w-5 mt-0.5 text-neutral-700" />
            <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-neutral-700">Checklist</p>
                </div>
                <div className="flex items-center gap-x-3 mb-2">
                    <span className="text-xs text-muted-foreground min-w-[30px] font-medium">
                        {Math.round(progress)}%
                    </span>
                    <Progress value={progress} className="h-2 flex-1" />
                </div>
                <div className="space-y-1">
                    {items.map((item) => (
                        <ChecklistItemComponent
                            key={item.id}
                            data={item}
                            cardId={cardId}
                        />
                    ))}
                    <ChecklistForm cardId={cardId} />
                </div>
            </div>
        </div>
    );
};
