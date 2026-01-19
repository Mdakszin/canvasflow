import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import Link from "next/link";

export const Navbar = () => {
    return (
        <nav className="fixed z-50 top-0 px-4 w-full h-14 border-b shadow-sm bg-white flex items-center">
            {/* Mobile Sidebar Trigger (TODO) */}
            <div className="flex items-center gap-x-4">
                <div className="hidden md:flex">
                    {/* Logo would go here */}
                    <Link href="/" className="font-bold text-lg text-slate-700">CanvasFlow</Link>
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
