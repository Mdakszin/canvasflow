import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Medal } from "lucide-react";

const textFont = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default async function MarketingPage() {
    const { userId, orgId } = await auth();

    if (userId) {
        if (orgId) {
            redirect(`/organization/${orgId}`);
        }
        redirect("/select-org");
    }
    return (
        <div className="flex items-center justify-center flex-col">
            <div className={cn("flex items-center justify-center flex-col", textFont.className)}>
                <div className="mb-4 flex items-center border shadow-sm p-4 bg-amber-100 text-amber-700 rounded-full uppercase">
                    <Medal className="h-6 w-6 mr-2" />
                    No. 1 task managment
                </div>
                <h1 className="text-3xl md:text-6xl text-center text-neutral-800 mb-6">
                    CanvasFlow helps team move
                </h1>
                <div className="text-3xl md:text-6xl bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white px-4 p-2 rounded-md w-fit">
                    work forward.
                </div>
            </div>
            <div className="text-sm md:text-xl text-neutral-400 mt-4 max-w-xs md:max-w-2xl text-center mx-auto">
                Collaborate, manage projects, and reach new productivity peaks. From high rises to the home office, the way your team works is unique - accomplish it all with CanvasFlow.
            </div>
            <Link href="/sign-up" className="mt-6 bg-black text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-black/90 transition">
                Get CanvasFlow for free
            </Link>
        </div>
    );
}
