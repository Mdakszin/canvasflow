"use client";

import { List, Card } from "@prisma/client";
import { ListItem } from "./list-item";
import { ListForm } from "./list-form";

type ListWithCards = List & { cards: Card[] };

interface ListContainerProps {
    boardId: string;
    lists: ListWithCards[];
}

export const ListContainer = ({ boardId, lists }: ListContainerProps) => {
    return (
        <ol className="flex gap-x-3 h-full">
            {lists.map((list) => (
                <ListItem
                    key={list.id}
                    list={list}
                />
            ))}
            <ListForm boardId={boardId} />
            <div className="flex-shrink-0 w-1" />
        </ol>
    );
};
