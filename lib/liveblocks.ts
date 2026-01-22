"use client";

import { createClient } from "@liveblocks/client";
import { createRoomContext, createLiveblocksContext } from "@liveblocks/react";

// Create the Liveblocks client with proper typing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const client = createClient({
    authEndpoint: "/api/liveblocks-auth",
});

// Create Liveblocks context (for global features)
// Using type assertion to work around Liveblocks generic typing complexity
// The actual types are correctly defined in liveblocks.config.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const { LiveblocksProvider } = createLiveblocksContext(client as any);

// Create room context with typed hooks  
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const {
    RoomProvider,
    useMyPresence,
    useUpdateMyPresence,
    useOthers,
    useOthersMapped,
    useSelf,
    useBroadcastEvent,
    useEventListener,
    useRoom,
} = createRoomContext(client as any);
