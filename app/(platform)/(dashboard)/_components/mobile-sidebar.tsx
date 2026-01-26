"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { Plan } from "@/constants/tiers";

interface MobileSidebarProps {
    isPro: boolean;
    availableCount: number;
    plan: Plan;
}

export const MobileSidebar = ({
    isPro,
    availableCount,
    plan,
}: MobileSidebarProps) => {
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    if (!isMounted) {
        return (
            <Button size="sm" variant="ghost" className="block md:hidden mr-2">
                <Menu className="h-4 w-4" />
            </Button>
        )
    }

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                className="block md:hidden mr-2"
                variant="ghost"
                size="sm"
            >
                <Menu className="h-4 w-4" />
            </Button>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetContent side="left" className="p-2 pt-10">
                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                    <Sidebar
                        storageKey="t-sidebar-mobile-state"
                        isPro={isPro}
                        availableCount={availableCount}
                        plan={plan}
                    />
                </SheetContent>
            </Sheet>
        </>
    );
};
