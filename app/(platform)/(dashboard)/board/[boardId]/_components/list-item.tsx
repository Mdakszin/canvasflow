"use client";

import { ElementRef, useRef, useState } from "react";

import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { cn } from "@/lib/utils";
import { List, Card } from "@prisma/client";
import { CardItem } from "./card-item";
import { CardForm } from "./card-form";

type ListWithCards = List & { cards: Card[] };

interface ListItemProps {
    list: ListWithCards;
    index: number;
}

export const ListItem = ({ list, index }: ListItemProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: list.id,
        data: {
            type: "list",
            list,
        },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    return (
        <li
            ref={setNodeRef}
            style={style}
            className="shrink-0 h-full w-[272px] select-none"
        >
            <div
                {...attributes}
                {...listeners}
                className={cn(
                    "w-full rounded-md bg-[#f1f2f4] shadow-md pb-2",
                    isDragging ? "opacity-50" : ""
                )}
            >
                <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2">
                    <div className="w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent">
                        {list.title}
                    </div>
                </div>
                <SortableContext
                    items={list.cards.map((card) => card.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <ol
                        className={cn(
                            "mx-1 px-1 py-0.5 flex flex-col gap-y-2",
                            list.cards.length > 0 ? "mt-2" : "mt-0"
                        )}
                    >
                        {list.cards.map((card, index) => (
                            <CardItem
                                key={card.id}
                                index={index}
                                card={card}
                            />
                        ))}
                    </ol>
                </SortableContext>
                <CardForm
                    listId={list.id}
                    boardId={list.boardId}
                />
            </div>
        </li>
    );
};
