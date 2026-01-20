import Link from "next/link";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { SquareKanban } from "lucide-react";

const headingFont = Poppins({
    subsets: ["latin"],
    weight: ["700"],
});

export const Logo = () => {
    return (
        <Link href="/">
            <div className="hover:opacity-75 transition items-center gap-x-2 flex">
                <SquareKanban className="h-8 w-8 text-teal-600" />
                <p className={cn(
                    "text-lg text-neutral-700 pb-1",
                    headingFont.className,
                )}>
                    CanvasFlow
                </p>
            </div>
        </Link>
    );
};
