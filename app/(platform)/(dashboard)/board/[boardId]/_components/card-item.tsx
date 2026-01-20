"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@prisma/client";

import { cn } from "@/lib/utils"; // Assuming utils exists

interface CardItemProps {
    card: Card;
    index: number;
}

export const CardItem = ({ card, index }: CardItemProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: card.id,
        data: {
            type: "card",
            card,
        },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn(
                "truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-sm",
                isDragging ? "opacity-50" : ""
            )}
            role="button"
        >
            {card.title}
        </div>
    );
};
