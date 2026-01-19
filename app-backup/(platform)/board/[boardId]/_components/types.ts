
import {type Card } from "@/app/generated/prisma/wasm";
import { type List } from "@/app/generated/prisma/wasm";

// This is our shared, decoupled type.
export type ListWithCards = List & { cards: Card[] };