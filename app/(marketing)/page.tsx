import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Medal, Layout, Zap, Users, ShieldCheck, ArrowRight } from "lucide-react";

const textFont = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default async function MarketingPage() {
    const { userId, orgId } = await auth();

    if (userId) {
        if (orgId) {
            redirect(`/organization/${orgId}`);
        }
        redirect("/select-org");
    }

    return (
        <div className="flex flex-col items-center">
            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center text-center px-4 max-w-6xl mx-auto mb-32">
                <div className={cn("flex items-center justify-center flex-col", textFont.className)}>
                    <div className="mb-6 flex items-center border shadow-sm p-4 bg-amber-100 text-amber-700 rounded-full uppercase font-bold text-xs tracking-widest animate-fade-in">
                        <Medal className="h-5 w-5 mr-2" />
                        No. 1 task managment for teams
                    </div>
                    <h1 className="text-4xl md:text-7xl text-neutral-800 mb-6 font-extrabold max-w-4xl tracking-tight leading-tight">
                        CanvasFlow helps teams <br className="hidden md:block" />
                        <span className="bg-gradient-to-r from-teal-500 via-emerald-600 to-cyan-600 text-transparent bg-clip-text">
                            move work forward.
                        </span>
                    </h1>
                </div>
                <p className="text-xl md:text-2xl text-neutral-500 mt-2 max-w-3xl leading-relaxed">
                    Collaborate, manage projects, and reach new productivity peaks.
                    From high rises to the home office, the way your team works is unique
                    - accomplish it all with CanvasFlow.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-10">
                    <Link href="/sign-up" className="bg-neutral-900 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-neutral-800 transition shadow-xl hover:shadow-neutral-200 flex items-center group">
                        Get Started for Free
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link href="/sign-in" className="bg-white border-2 border-neutral-200 text-neutral-900 px-10 py-4 rounded-full text-lg font-bold hover:border-neutral-300 transition shadow-sm">
                        Login
                    </Link>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="w-full bg-white py-24 px-4 overflow-hidden">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-neutral-800 mb-4">
                            Powerful features for every team
                        </h2>
                        <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
                            Everything you need to manage projects and stay synchronized with your team in real-time.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition group">
                            <div className="h-12 w-12 rounded-lg bg-teal-100 flex items-center justify-center mb-6 group-hover:bg-teal-500 transition-colors">
                                <Zap className="h-6 w-6 text-teal-600 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-neutral-800">Real-Time Sync</h3>
                            <p className="text-neutral-500 leading-relaxed">
                                See changes exactly when they happen. Boards and cards update instantly for everyone in the room.
                            </p>
                        </div>

                        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition group">
                            <div className="h-12 w-12 rounded-lg bg-fuchsia-100 flex items-center justify-center mb-6 group-hover:bg-fuchsia-500 transition-colors">
                                <Users className="h-6 w-6 text-fuchsia-600 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-neutral-800">Multiplayer Presence</h3>
                            <p className="text-neutral-500 leading-relaxed">
                                Never cross paths unknowingly. See collaborator cursors and who's currently active on your board.
                            </p>
                        </div>

                        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition group">
                            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-6 group-hover:bg-blue-500 transition-colors">
                                <Layout className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-neutral-800">Intuitive Boards</h3>
                            <p className="text-neutral-500 leading-relaxed">
                                Organize work into beautiful, visual boards. Drag and drop lists and cards to keep projects on track.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Collaboration Section */}
            <section id="collaboration" className="w-full py-24 px-4 bg-slate-50 border-y border-slate-200">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1 space-y-6">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs uppercase tracking-widest">
                            Multiplayer Experience
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-neutral-800 leading-tight">
                            Work together as if you're <br className="hidden md:block" />
                            in the same room.
                        </h2>
                        <p className="text-lg text-neutral-500 leading-relaxed max-w-xl">
                            With Liveblocks integration, CanvasFlow offers a true multiplayer experience.
                            Watch cursors glide across the screen and see instant ring highlights when
                            collaborators interact with board elements.
                        </p>
                        <div className="pt-4 space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="mt-1 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                    <ShieldCheck className="h-3 w-3 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-neutral-800">Deterministic Colors</p>
                                    <p className="text-sm text-neutral-500">Each collaborator is assigned a unique, consistent color.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="mt-1 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                    <ShieldCheck className="h-3 w-3 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-neutral-800">Live Presence Stack</p>
                                    <p className="text-sm text-neutral-500">Avatar stacks show you exactly who's currently viewing the board.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 w-full flex justify-center">
                        <div className="relative w-full max-w-lg aspect-video bg-white rounded-3xl shadow-2xl border-8 border-neutral-100 overflow-hidden flex items-center justify-center group">
                            <div className="absolute inset-0 bg-neutral-50 group-hover:scale-105 transition-transform duration-700" />
                            {/* Decorative elements representing board UI */}
                            <div className="absolute top-4 left-4 right-4 flex gap-2">
                                <div className="h-3 w-3 rounded-full bg-rose-400" />
                                <div className="h-3 w-3 rounded-full bg-amber-400" />
                                <div className="h-3 w-3 rounded-full bg-emerald-400" />
                            </div>
                            <div className="relative text-neutral-300 font-bold text-lg select-none">
                                Real-Time Board Preview
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="w-full py-32 px-4 text-center">
                <div className="max-w-4xl mx-auto rounded-3xl bg-neutral-900 py-16 px-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

                    <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">
                        Start your productivity journey <br className="hidden md:block" /> with CanvasFlow today.
                    </h2>
                    <p className="text-neutral-400 text-lg mb-10 max-w-md mx-auto relative z-10">
                        Join thousands of teams already moving faster and more efficiently.
                        No credit card required.
                    </p>
                    <Link href="/sign-up" className="relative z-10 bg-white text-neutral-900 px-12 py-5 rounded-full text-xl font-bold hover:bg-neutral-100 transition shadow-xl inline-flex items-center group">
                        Sign up for free
                        <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>
        </div>
    );
}

