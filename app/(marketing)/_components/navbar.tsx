import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
    return (
        <div className="fixed top-0 w-full h-14 px-4 border-b shadow-sm bg-white/70 backdrop-blur-md flex items-center z-50">
            <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
                <Logo />
                <div className="space-x-4 md:block flex items-center justify-between w-full md:w-auto ml-4 md:ml-0">
                    <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-neutral-600 mr-8">
                        <Link href="#features" className="hover:text-black transition">Features</Link>
                        <Link href="#collaboration" className="hover:text-black transition">Collaboration</Link>
                    </div>
                    <div className="space-x-2 md:space-x-4 flex items-center">
                        <Button size="sm" variant="ghost" asChild>
                            <Link href="/sign-in">
                                Login
                            </Link>
                        </Button>
                        <Button size="sm" asChild className="bg-neutral-900 hover:bg-neutral-800 text-white">
                            <Link href="/sign-up">
                                Get CanvasFlow for free
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
