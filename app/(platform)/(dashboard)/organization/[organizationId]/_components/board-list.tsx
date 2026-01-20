import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { User2 } from "lucide-react";
import Link from "next/link"; // Ensure Link is imported

import { db } from "@/lib/db"; // Use the singleton
import { FormPopover } from "./form-popover";
import { Board } from "@prisma/client";

export const BoardList = async () => {
    const { orgId } = await auth();

    if (!orgId) {
        return redirect("/select-org");
    }

    const boards = await db.board.findMany({
        where: {
            orgId,
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return (
        <div className="space-y-4">
            <div className="flex items-center font-semibold text-lg text-neutral-700">
                <User2 className="h-6 w-6 mr-2" />
                Your Boards
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {boards.map((board: Board) => (
                    <Link
                        key={board.id}
                        href={`/board/${board.id}`}
                        className="group relative aspect-video bg-teal-600 rounded-sm h-full w-full p-2 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
                        <p className="relative font-semibold text-white">
                            {board.title}
                        </p>
                    </Link>
                ))}
                <FormPopover />
            </div>
        </div>
    );
};
