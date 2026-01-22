"use client";

import { useOthers } from "@/lib/liveblocks";
import { Cursor } from "./cursor";

// Type for user info from Liveblocks
type UserInfo = {
    name: string;
    picture: string;
    color: string;
};

export const Cursors = () => {
    const others = useOthers();

    return (
        <>
            {others.map((user) => {
                const presence = user.presence as { cursor: { x: number; y: number } | null };
                const info = user.info as UserInfo | undefined;

                if (!presence?.cursor || !info) return null;

                return (
                    <Cursor
                        key={user.connectionId}
                        color={info.color}
                        x={presence.cursor.x}
                        y={presence.cursor.y}
                        name={info.name}
                    />
                );
            })}
        </>
    );
};
