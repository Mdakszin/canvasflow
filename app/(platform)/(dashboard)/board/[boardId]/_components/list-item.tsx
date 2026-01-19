"use client";

import { List, Card } from "@prisma/client";
import { CardItem } from "./card-item";
import { CardForm } from "./card-form";

type ListWithCards = List & { cards: Card[] };

interface ListItemProps {
    list: ListWithCards;
}

export const ListItem = ({ list }: ListItemProps) => {
    return (
        <li className="shrink-0 h-full w-[272px] select-none">
            <div className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2">
                <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2">
                    <div className="w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent">
                        {list.title}
                    </div>
                </div>
                <ol className="mx-1 px-1 py-0.5 flex flex-col gap-y-2">
                    {list.cards.map((card) => (
                        <CardItem
                            key={card.id}
                            card={card}
                        />
                    ))}
                </ol>
                <CardForm
                    listId={list.id}
                    boardId={list.boardId}
                />
            </div>
        </li>
    );
};
