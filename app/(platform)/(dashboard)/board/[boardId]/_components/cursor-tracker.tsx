"use client";

import { useCallback } from "react";
import { useUpdateMyPresence } from "@/lib/liveblocks";
import { Cursors } from "@/components/liveblocks";

interface CursorTrackerProps {
    children: React.ReactNode;
}

export const CursorTracker = ({ children }: CursorTrackerProps) => {
    const updateMyPresence = useUpdateMyPresence();

    const handlePointerMove = useCallback(
        (e: React.PointerEvent) => {
            // Get cursor position relative to the board
            const x = e.clientX;
            const y = e.clientY;
            updateMyPresence({ cursor: { x, y } });
        },
        [updateMyPresence]
    );

    const handlePointerLeave = useCallback(() => {
        updateMyPresence({ cursor: null });
    }, [updateMyPresence]);

    return (
        <div
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            className="h-full"
        >
            <Cursors />
            {children}
        </div>
    );
};
