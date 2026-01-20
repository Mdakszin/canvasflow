import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
    return (
        <div className="fixed top-0 w-full h-14 px-4 border-b shadow-sm bg-white/70 backdrop-blur-md flex items-center z-50">
            <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
                <Logo />
                <div className="space-x-2 md:space-x-4 flex items-center">
                    <Button size="sm" variant="ghost" asChild>
                        <Link href="/sign-in">
                            Login
                        </Link>
                    </Button>
                    <Button size="sm" asChild className="bg-teal-600 hover:bg-teal-700">
                        <Link href="/sign-up">
                            <span className="hidden sm:inline">Get CanvasFlow for free</span>
                            <span className="sm:hidden">Sign up</span>
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};
