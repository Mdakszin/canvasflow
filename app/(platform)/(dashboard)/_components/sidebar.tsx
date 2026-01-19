"use client";

import Link from "next/link";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { useLocalStorage } from "usehooks-ts";
import { Skeleton } from "@/components/ui/skeleton";

export const Sidebar = ({
    storageKey = "t-sidebar-state",
}: {
    storageKey?: string;
}) => {
    // Simplifying for now to just show static links until I add the full accordion logic
    return (
        <>
            <div className="font-medium text-xs flex items-center mb-1">
                <span className="pl-4">Workspaces</span>
                {/* Create Workspace Button */}
            </div>
            <div className="space-y-2">
                <div className="pl-4 text-sm">
                    <p className="text-slate-500 italic">Sidebar Items Placeholder</p>
                </div>
            </div>
        </>
    )

    // TODO: Implement full Accordion sidebar with Clerk's useOrganizationList
};
