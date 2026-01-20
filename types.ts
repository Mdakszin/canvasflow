import { Card, List } from "@prisma/client";

export type CardWithList = Card & { list: { title: string } };
export type ListWithCards = List & { cards: Card[] };
