

export default function PlatformLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-full">
            {children}
        </div>
    );
}
