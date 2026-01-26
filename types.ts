import { Card, ChecklistItem, List } from "@prisma/client";

export type CardWithList = Card & {
    list: { title: string },
    checklist: ChecklistItem[]
};
export type ListWithCards = List & { cards: Card[] };
