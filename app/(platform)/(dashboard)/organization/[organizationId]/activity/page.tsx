import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { db } from "@/lib/db";
import { ActivityList } from "./_components/activity-list";

const ActivityPage = async () => {
    const { orgId } = await auth();

    if (!orgId) {
        redirect("/select-org");
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-semibold">Activity</h1>
            </div>
            <Suspense fallback={<ActivityList.Skeleton />}>
                <ActivityList />
            </Suspense>
        </div>
    );
};

export default ActivityPage;
