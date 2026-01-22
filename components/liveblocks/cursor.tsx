"use client";

import { memo } from "react";

interface CursorProps {
    color: string;
    x: number;
    y: number;
    name: string;
}

export const Cursor = memo(({ color, x, y, name }: CursorProps) => {
    return (
        <div
            className="pointer-events-none absolute top-0 left-0 z-50"
            style={{
                transform: `translate(${x}px, ${y}px)`,
                transition: "transform 0.15s ease-out",
            }}
        >
            {/* Cursor SVG */}
            <svg
                width="24"
                height="36"
                viewBox="0 0 24 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-md"
            >
                <path
                    d="M5.65376 12.4863L0.165489 2.98976C-0.386618 1.97826 0.372953 0.75 1.52296 0.75H15.4742C17.3896 0.75 18.4574 2.94697 17.2872 4.44974L10.0077 13.6715C8.86166 15.1437 6.55217 14.9149 5.65376 12.4863Z"
                    fill={color}
                />
            </svg>

            {/* Name label */}
            <div
                className="absolute left-4 top-5 px-2 py-1 rounded-lg text-xs font-medium text-white whitespace-nowrap shadow-md"
                style={{ backgroundColor: color }}
            >
                {name}
            </div>
        </div>
    );
});

Cursor.displayName = "Cursor";
