"use client";

import { ReactNode } from "react";
import { RoomProvider as LiveblocksRoomProvider } from "@/lib/liveblocks";

interface RoomProps {
    roomId: string;
    children: ReactNode;
}

export const Room = ({ roomId, children }: RoomProps) => {
    return (
        <LiveblocksRoomProvider
            id={roomId}
            initialPresence={{ cursor: null }}
        >
            {children}
        </LiveblocksRoomProvider>
    );
};
