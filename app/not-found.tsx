import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="h-full flex flex-col items-center justify-center space-y-4 bg-[#F0F4F8]">
            <h1 className="text-4xl font-bold text-neutral-800 text-center">
                404
            </h1>
            <p className="text-xl text-neutral-600">
                Page not found
            </p>
            <Button asChild className="bg-teal-600 hover:bg-teal-700">
                <Link href="/select-org">
                    Go to Boards
                </Link>
            </Button>
        </div>
    );
}
