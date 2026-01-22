import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export const Footer = () => {
    return (
        <div className="w-full p-4 border-t bg-white">
            <div className="md:max-w-screen-2xl mx-auto flex flex-col md:flex-row items-center w-full justify-between gap-y-4 md:gap-y-0">
                <Logo />
                <div className="flex flex-wrap justify-center items-center gap-x-4 text-sm text-neutral-500 font-medium">
                    <Button size="sm" variant="ghost" className="hover:bg-transparent hover:text-black">
                        Privacy Policy
                    </Button>
                    <Button size="sm" variant="ghost" className="hover:bg-transparent hover:text-black">
                        Terms of Service
                    </Button>
                    <div className="hidden md:block">
                        © 2024 CanvasFlow. All rights reserved.
                    </div>
                </div>
            </div>
        </div>
    );
};
