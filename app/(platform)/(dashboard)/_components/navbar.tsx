import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import Link from "next/link";

import { getSubscriptionDetails } from "@/lib/subscription";
import { getAvailableCount } from "@/lib/org-limit";
import { MobileSidebar } from "./mobile-sidebar";
import { Logo } from "@/components/logo";

export const Navbar = async () => {
    const subscription = await getSubscriptionDetails();
    const availableCount = await getAvailableCount();

    return (
        <nav className="fixed z-50 top-0 px-4 w-full h-14 border-b border-neutral-200 bg-white/80 backdrop-blur-md flex items-center">
            <MobileSidebar
                isPro={subscription.isPro}
                availableCount={availableCount}
                plan={subscription.plan}
            />
            <div className="flex items-center gap-x-4">
                <div className="hidden md:flex">
                    <Logo />
                </div>
                <button className="bg-primary hover:bg-primary/90 text-white rounded-sm px-2 py-1.5 text-sm hidden md:block">
                    Create
                </button>
                <button className="bg-primary hover:bg-primary/90 text-white rounded-sm p-1.5 md:hidden block">
                    <Plus className="h-4 w-4" />
                </button>
            </div>
            <div className="ml-auto flex items-center gap-x-2">
                <OrganizationSwitcher
                    hidePersonal
                    afterCreateOrganizationUrl="/organization/:id"
                    afterLeaveOrganizationUrl="/select-org"
                    afterSelectOrganizationUrl="/organization/:id"
                    appearance={{
                        elements: {
                            rootBox: {
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            },
                        },
                    }}
                />
                <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                        elements: {
                            avatarBox: {
                                height: 30,
                                width: 30,
                            }
                        }
                    }}
                />
            </div>
        </nav>
    );
};
