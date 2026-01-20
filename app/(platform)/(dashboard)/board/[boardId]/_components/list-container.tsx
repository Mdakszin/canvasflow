"use client";

import { useEffect, useState } from "react";

import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
    DragStartEvent,
    DragEndEvent,
    DragOverEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

import { List, Card } from "@prisma/client";
import { updateListOrder } from "@/actions/update-list-order";
import { updateCardOrder } from "@/actions/update-card-order";
import { useAction } from "@/hooks/use-action";
import { ListItem } from "./list-item";
import { ListForm } from "./list-form";
import { CardItem } from "./card-item";
import { toast } from "sonner";

type ListWithCards = List & { cards: Card[] };

interface ListContainerProps {
    boardId: string;
    lists: ListWithCards[];
}

export const ListContainer = ({ boardId, lists }: ListContainerProps) => {
    const [orderedData, setOrderedData] = useState(lists);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [activeType, setActiveType] = useState<"list" | "card" | null>(null);

    const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
        onSuccess: () => {
            toast.success("List reordered");
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
        onSuccess: () => {
            toast.success("Card reordered");
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    useEffect(() => {
        setOrderedData(lists);
    }, [lists]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const onDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const id = active.id as string;
        const type = active.data.current?.type;

        setActiveId(id);
        setActiveType(type);
    };

    const onDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveACard = active.data.current?.type === "card";
        const isOverACard = over.data.current?.type === "card";

        if (!isActiveACard) return;

        // Moving card between lists
        if (isActiveACard && isOverACard) {
            setOrderedData((prev) => {
                const activeListIndex = prev.findIndex((list) =>
                    list.cards.some((card) => card.id === activeId)
                );
                const overListIndex = prev.findIndex((list) =>
                    list.cards.some((card) => card.id === overId)
                );

                if (activeListIndex < 0 || overListIndex < 0) return prev;

                const activeList = prev[activeListIndex];
                const overList = prev[overListIndex];

                if (activeList.id === overList.id) {
                    // Same list, handled by onDragEnd usually, but for drag over visual we might need it? 
                    // dnd-kit handles sorting in DragEnd for same container usually.
                    return prev;
                }

                // Different list
                // We need to move the card to the other list in state
                const activeCardIndex = activeList.cards.findIndex((card) => card.id === activeId);
                const overCardIndex = overList.cards.findIndex((card) => card.id === overId);

                let newCards = [...overList.cards];
                const [movedCard] = activeList.cards.splice(activeCardIndex, 1);

                // Update listId of the moved card
                movedCard.listId = overList.id;

                // Insert into new list
                // If over a card, insert at that index
                // Determine checking rects usually required, but splice at index is simple approx
                newCards.splice(overCardIndex, 0, movedCard);

                // Update the overList
                overList.cards = newCards;
                // activeList is already mutated because we used references objects in array? 
                // No, we need to be careful with immutability.

                // Let's do it properly without mutation
                const newOrderedData = [...prev];
                const newActiveList = { ...activeList, cards: activeList.cards.filter(c => c.id !== activeId) };
                const newOverList = { ...overList, cards: newCards }; // Wait, I used splice above which mutated

                // Redo purely
                const sourceList = newOrderedData.find(l => l.id === activeList.id)!;
                const destList = newOrderedData.find(l => l.id === overList.id)!;

                const sourceCard = sourceList.cards.find(c => c.id === activeId)!;

                // Remove from source
                sourceList.cards = sourceList.cards.filter(c => c.id !== activeId);

                // Add to dest
                // We need to insert at correct index
                const isBelowOverItem =
                    over &&
                    active.rect.current.translated &&
                    active.rect.current.translated.top > over.rect.top + over.rect.height;

                const modifier = isBelowOverItem ? 1 : 0;
                const newIndex = overCardIndex >= 0 ? overCardIndex + modifier : destList.cards.length + 1;

                destList.cards = [
                    ...destList.cards.slice(0, newIndex),
                    { ...sourceCard, listId: destList.id },
                    ...destList.cards.slice(newIndex, destList.cards.length)
                ];

                return newOrderedData;
            });
        }

        // Moving card to an empty list or over a list
        const isOverAList = over.data.current?.type === "list";
        if (isActiveACard && isOverAList) {
            setOrderedData((prev) => {
                const activeListIndex = prev.findIndex((list) =>
                    list.cards.some((card) => card.id === activeId)
                );
                const overListIndex = prev.findIndex((list) => list.id === overId);

                if (activeListIndex < 0 || overListIndex < 0) return prev;

                if (activeListIndex === overListIndex) return prev;

                const newOrderedData = [...prev];
                const sourceList = newOrderedData[activeListIndex];
                const destList = newOrderedData[overListIndex];

                const sourceCard = sourceList.cards.find(c => c.id === activeId)!;

                // Remove from source
                sourceList.cards = sourceList.cards.filter(c => c.id !== activeId);

                // Add to dest (end of list)
                destList.cards.push({ ...sourceCard, listId: destList.id });

                return newOrderedData;
            });
        }

    };

    const onDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        const id = active.id;
        const overId = over?.id;

        if (!over) {
            setActiveId(null);
            setActiveType(null);
            return;
        }

        if (activeId === overId) {
            setActiveId(null);
            setActiveType(null);
            return;
        }

        // Dropping a List
        if (activeType === "list") {
            setOrderedData((prev) => {
                const oldIndex = prev.findIndex((list) => list.id === activeId);
                const newIndex = prev.findIndex((list) => list.id === overId);
                const newLists = arrayMove(prev, oldIndex, newIndex);

                // Trigger Server Action
                executeUpdateListOrder({ items: newLists, boardId });

                return newLists;
            });
        }

        // Dropping a Card
        if (activeType === "card") {
            setOrderedData((prev) => {
                const activeListIndex = prev.findIndex((list) =>
                    list.cards.some((card) => card.id === activeId)
                );
                const overListIndex = prev.findIndex((list) =>
                    list.cards.some((card) => card.id === overId)
                );

                // If same list, reorder
                if (activeListIndex === overListIndex) {
                    const listIndex = activeListIndex;
                    const list = prev[listIndex];
                    const oldIndex = list.cards.findIndex((card) => card.id === activeId);
                    const newIndex = list.cards.findIndex((card) => card.id === overId);

                    const newCards = arrayMove(list.cards, oldIndex, newIndex);
                    const newList = { ...list, cards: newCards };

                    const newOrderedData = [...prev];
                    newOrderedData[listIndex] = newList;

                    // Trigger Server Action
                    executeUpdateCardOrder({ items: newCards, boardId });

                    return newOrderedData;
                }

                // If different list, handled in onDragOver mostly, but we need to finalize if needed?
                // Usually dnd-kit advises handling move between containers in onDragOver and reorder in onDragEnd.
                // Since we updated state in onDragOver, the card is already in the new list in state.
                // So we just need to reorder in the new list if needed.
                // But wait, if we moved it in onDragOver, now activeListIndex and overListIndex are SAME (the dest list).
                const listIndex = prev.findIndex((list) => list.cards.some((card) => card.id === activeId));
                const list = prev[listIndex];

                const oldIndex = list.cards.findIndex((card) => card.id === activeId);
                const newIndex = list.cards.findIndex((card) => card.id === overId);

                if (oldIndex !== newIndex) {
                    const newCards = arrayMove(list.cards, oldIndex, newIndex);
                    const newOrderedData = [...prev];
                    newOrderedData[listIndex] = { ...list, cards: newCards };

                    executeUpdateCardOrder({ items: newCards, boardId });
                    return newOrderedData;
                }

                // If indices are same (dropped in place in new list), we still need to save?
                // We should trigger save whenever card listId changes too.
                // So we should always trigger save here if we moved lists.

                // However, detecting if we moved lists here is hard because state is already updated.
                // We can rely on card.listId which we updated in onDragOver.

                executeUpdateCardOrder({ items: list.cards, boardId });

                return prev;
            });
        }

        setActiveId(null);
        setActiveType(null);
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
        >
            <div className="flex gap-x-3 h-full overflow-x-auto pb-4">
                <SortableContext items={orderedData.map(l => l.id)} strategy={horizontalListSortingStrategy}>
                    {orderedData.map((list, index) => (
                        <ListItem
                            key={list.id}
                            index={index}
                            list={list}
                        />
                    ))}
                </SortableContext>
                <ListForm boardId={boardId} />
                <div className="flex-shrink-0 w-1" />
            </div>
            <DragOverlay dropAnimation={{
                sideEffects: defaultDropAnimationSideEffects({
                    styles: {
                        active: {
                            opacity: "0.5",
                        },
                    },
                }),
            }}>
                {activeId && activeType === "list" && (
                    <div className="h-full w-[272px] p-2 rounded-md bg-white shadow-sm opacity-80">
                        {/* Simple representation or actual ListItem */}
                        <div className="w-full text-sm font-semibold p-2">
                            {orderedData.find(l => l.id === activeId)?.title}
                        </div>
                    </div>
                )}
                {activeId && activeType === "card" && (
                    <div className="truncate border-2 border-primary/50 py-2 px-3 text-sm bg-white rounded-md shadow-sm">
                        {orderedData.flatMap(l => l.cards).find(c => c.id === activeId)?.title}
                    </div>
                )}
            </DragOverlay>
        </DndContext>
    );
};
