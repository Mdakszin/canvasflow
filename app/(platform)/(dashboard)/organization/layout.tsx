import { checkSubscription } from "@/lib/subscription";
import { getAvailableCount } from "@/lib/org-limit";
import { Sidebar } from "../_components/sidebar";

export default async function OrganizationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const isPro = await checkSubscription();
    const availableCount = await getAvailableCount();

    return (
        <main className="pt-20 md:pt-24 px-4 max-w-6xl 2xl:max-w-screen-xl mx-auto">
            <div className="flex gap-x-7">
                <div className="w-64 shrink-0 hidden md:block">
                    <Sidebar
                        isPro={isPro}
                        availableCount={availableCount}
                    />
                </div>
                {children}
            </div>
        </main>
    );
}
