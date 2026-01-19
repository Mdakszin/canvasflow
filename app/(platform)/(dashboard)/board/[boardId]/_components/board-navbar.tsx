"use client";

import { Board } from "@prisma/client";

interface BoardNavbarProps {
    board: Board;
}

export const BoardNavbar = ({ board }: BoardNavbarProps) => {
    return (
        <div className="w-full h-14 z-[40] bg-black/50 fixed top-14 flex items-center px-6 gap-x-4 text-white">
            <span className="font-bold text-lg">{board.title}</span>
        </div>
    );
};
