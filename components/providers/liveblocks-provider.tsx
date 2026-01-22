"use client";

import { ReactNode } from "react";
import { LiveblocksProvider as Provider } from "@/lib/liveblocks";

interface LiveblocksProviderProps {
    children: ReactNode;
}

export const LiveblocksProvider = ({ children }: LiveblocksProviderProps) => {
    return <Provider>{children}</Provider>;
};
