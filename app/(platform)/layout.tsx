import { auth } from "@clerk/nextjs/server";
import { ModalProvider } from "@/components/providers/modal-provider";

export default async function PlatformLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await auth.protect();

    return (
        <div className="h-full">
            <ModalProvider />
            {children}
        </div>
    );
}
