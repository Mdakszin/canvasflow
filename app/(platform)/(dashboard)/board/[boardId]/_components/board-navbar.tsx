"use client";

import { Board } from "@prisma/client";
import { Collaborators } from "@/components/liveblocks";

interface BoardNavbarProps {
    board: Board;
}

export const BoardNavbar = ({ board }: BoardNavbarProps) => {
    return (
        <div className="w-full h-14 z-[40] bg-white/70 backdrop-blur-md fixed top-14 flex items-center justify-between px-6 gap-x-4 text-slate-900 border-b border-slate-200/50">
            <span className="font-bold text-lg">{board.title}</span>
            <Collaborators />
        </div>
    );
};

