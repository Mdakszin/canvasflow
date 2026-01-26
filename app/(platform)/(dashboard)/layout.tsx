import { Navbar } from "./_components/navbar";
import { OrgControl } from "@/components/org-control";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-full">
            <OrgControl />
            <Navbar />
            {children}
        </div>
    );
}
