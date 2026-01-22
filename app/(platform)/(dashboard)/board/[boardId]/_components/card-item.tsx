"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@prisma/client";
import { useCardModal } from "@/hooks/use-card-modal";

import { cn } from "@/lib/utils"; // Assuming utils exists
import { useOthers } from "@/lib/liveblocks";


interface CardItemProps {
    card: Card;
    index: number;
}

export const CardItem = ({ card, index }: CardItemProps) => {
    const cardModal = useCardModal();

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

    const others = useOthers();
    const draggingCollaborator = others.find((u) => u.presence.activeId === card.id);
    const isBeingDraggedByOther = !!draggingCollaborator;

    return (
        <div
            onClick={() => cardModal.onOpen(card.id)}
            ref={setNodeRef}
            style={{
                ...style,
                boxShadow: isBeingDraggedByOther ? `0 0 0 2px white, 0 0 0 4px ${draggingCollaborator.info.color}` : undefined
            }}
            {...attributes}
            {...listeners}
            className={cn(
                "truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-sm transition-shadow",
                isDragging ? "opacity-50" : ""
            )}
            role="button"
        >


            {card.title}
        </div>
    );
};
