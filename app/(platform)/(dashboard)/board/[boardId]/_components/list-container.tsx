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
import { useRouter } from "next/navigation";
import {
    useUpdateMyPresence,
    useBroadcastEvent,
    useEventListener,
    useOthers
} from "@/lib/liveblocks";
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
    const router = useRouter();
    const updateMyPresence = useUpdateMyPresence();
    const broadcast = useBroadcastEvent();

    const [orderedData, setOrderedData] = useState(lists);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [activeType, setActiveType] = useState<"list" | "card" | null>(null);

    useEventListener(({ event }) => {
        if (event.type === "BOARD_UPDATED") {
            router.refresh();
        }
    });

    const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
        onSuccess: () => {
            toast.success("List reordered");
            broadcast({ type: "BOARD_UPDATED" });
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
        onSuccess: () => {
            toast.success("Card reordered");
            broadcast({ type: "BOARD_UPDATED" });
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
        updateMyPresence({ activeId: id });
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
        const overId = over?.id;

        if (!over || activeId === overId) {
            setActiveId(null);
            setActiveType(null);
            return;
        }

        // Dropping a List
        if (activeType === "list") {
            const oldIndex = orderedData.findIndex((list) => list.id === activeId);
            const newIndex = orderedData.findIndex((list) => list.id === overId);

            if (oldIndex !== -1 && newIndex !== -1) {
                const newLists = arrayMove(orderedData, oldIndex, newIndex).map((item, index) => ({
                    ...item,
                    order: index,
                }));

                // Update local state
                setOrderedData(newLists);

                // Trigger Server Action
                executeUpdateListOrder({ items: newLists, boardId });
            }
        }

        // Dropping a Card
        if (activeType === "card") {
            const activeListIndex = orderedData.findIndex((list) =>
                list.cards.some((card) => card.id === activeId)
            );
            const overListIndex = orderedData.findIndex((list) =>
                list.cards.some((card) => card.id === overId)
            );

            if (activeListIndex !== -1 && overListIndex !== -1) {
                // Same list, reorder
                if (activeListIndex === overListIndex) {
                    const list = orderedData[activeListIndex];
                    const oldIndex = list.cards.findIndex((card) => card.id === activeId);
                    const newIndex = list.cards.findIndex((card) => card.id === overId);

                    if (oldIndex !== -1 && newIndex !== -1) {
                        const newCards = arrayMove(list.cards, oldIndex, newIndex).map((item, index) => ({
                            ...item,
                            order: index,
                        }));

                        const newOrderedData = [...orderedData];
                        newOrderedData[activeListIndex] = { ...list, cards: newCards };

                        setOrderedData(newOrderedData);
                        executeUpdateCardOrder({ items: newCards, boardId });
                    }
                } else {
                    // Different list, it was moved in onDragOver
                    const destList = orderedData.find((list) => list.cards.some((card) => card.id === activeId));
                    const sourceList = orderedData[activeListIndex];

                    if (destList && sourceList) {
                        const newDestCards = destList.cards.map((item, index) => ({
                            ...item,
                            order: index,
                        }));

                        const newSourceCards = sourceList.cards.map((item, index) => ({
                            ...item,
                            order: index,
                        }));

                        const newOrderedData = [...orderedData];
                        const destListIndex = newOrderedData.findIndex((l) => l.id === destList.id);
                        const sourceListIndex = newOrderedData.findIndex((l) => l.id === sourceList.id);

                        newOrderedData[destListIndex] = { ...destList, cards: newDestCards };
                        newOrderedData[sourceListIndex] = { ...sourceList, cards: newSourceCards };

                        setOrderedData(newOrderedData);
                        executeUpdateCardOrder({ items: newDestCards, boardId });
                        executeUpdateCardOrder({ items: newSourceCards, boardId });
                    }
                }
            }
        }


        setActiveId(null);
        setActiveType(null);
        updateMyPresence({ activeId: null });
    };



    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="flex gap-x-3 h-full overflow-x-auto pb-4">
                {orderedData.map((list, index) => (
                    <ListItem
                        key={list.id}
                        index={index}
                        list={list}
                    />
                ))}
                <ListForm boardId={boardId} />
                <div className="shrink-0 w-1" />

            </div>
        );
    }

    return (
        <DndContext
            id="board-context"
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
                <div className="shrink-0 w-1" />

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
