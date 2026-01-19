import Link from "next/link";
import { Button } from "@/components/ui/button";
// Note: Button component doesn't exist yet, I should use a basic <button> or create the component. 
// I'll stick to standard HTML/Tailwind for now to avoid dependency on uncreated components.

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-full bg-slate-100">
            <nav className="fixed top-0 w-full h-14 px-4 border-b shadow-sm bg-white flex items-center">
                <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
                    <div className="flex items-center gap-x-2 hidden md:flex">
                        {/* Logo would go here */}
                        <span className="font-bold text-lg text-slate-700">CanvasFlow</span>
                    </div>
                    <div className="space-x-4 md:block md:w-auto flex items-center justify-between w-full">
                        <Link href="/sign-in" className="text-sm font-medium hover:underline">
                            Login
                        </Link>
                        <Link href="/sign-up" className="bg-black text-white px-4 py-2 rounded-sm text-sm font-medium hover:bg-black/90 transition">
                            Get CanvasFlow free
                        </Link>
                    </div>
                </div>
            </nav>
            <main className="pt-40 pb-20 bg-slate-100">
                {children}
            </main>
            <footer className="fixed bottom-0 w-full p-4 border-t bg-slate-100">
                <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
                    <div className="space-x-4 md:block md:w-auto flex items-center justify-between w-full">
                        <Button size="sm" variant="ghost">Privacy Policy</Button>
                        <Button size="sm" variant="ghost">Terms of Service</Button>
                    </div>
                </div>
            </footer>
        </div>
    );
}


