

import { ModalProvider } from "@/components/providers/modal-provider";

export default function PlatformLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-full">
            <ModalProvider />
            {children}
        </div>
    );
}
