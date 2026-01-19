import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { BoardList } from "./_components/board-list";

export default async function OrganizationIdPage() {
    const { orgId } = await auth();

    if (!orgId) {
        return redirect("/select-org");
    }

    return (
        <div className="w-full mb-20">
            <BoardList />
        </div>
    );
}
