"use client";

import { format } from "date-fns";
import { CreditCard, CheckCircle, XCircle, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useProModal } from "@/hooks/use-pro-modal";
import { Plan } from "@/constants/tiers";

interface SubscriptionCardProps {
    isPro: boolean;
    status: string | null;
    plan: Plan;
    currentPeriodEnd: Date | null;
}

export const SubscriptionCard = ({
    isPro,
    status,
    plan,
    currentPeriodEnd,
}: SubscriptionCardProps) => {
    const proModal = useProModal();

    return (
        <div className="border rounded-lg p-6 bg-white shadow-sm">
            <div className="flex items-center gap-x-4 mb-6">
                <div className="p-3 rounded-full bg-sky-100">
                    <CreditCard className="h-6 w-6 text-sky-600" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold">Subscription</h2>
                    <p className="text-sm text-muted-foreground">
                        Manage your subscription and billing
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <div className="flex items-center gap-x-2">
                        {isPro ? (
                            <>
                                <CheckCircle className="h-4 w-4 text-emerald-500" />
                                <span className="text-sm font-medium text-emerald-600">Active</span>
                            </>
                        ) : (
                            <>
                                <XCircle className="h-4 w-4 text-rose-500" />
                                <span className="text-sm font-medium text-rose-600">Inactive</span>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                    <span className="text-sm text-muted-foreground">Plan</span>
                    <span className="text-sm font-medium">
                        {isPro ? (
                            <span className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                                {plan.name}
                            </span>
                        ) : (
                            <span className="bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                                Free
                            </span>
                        )}
                    </span>
                </div>

                <div className="py-3 border-b">
                    <span className="text-sm text-muted-foreground block mb-2">Included Features</span>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {plan.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-x-2 text-xs text-neutral-600">
                                <CheckCircle className="h-3 w-3 text-emerald-500 shrink-0" />
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>

                {isPro && currentPeriodEnd && (
                    <>
                        <div className="flex items-center justify-between py-3 border-b">
                            <span className="text-sm text-muted-foreground flex items-center gap-x-2">
                                <Calendar className="h-4 w-4" />
                                Expires
                            </span>
                            <span className="text-sm font-medium">
                                {format(new Date(currentPeriodEnd), "MMMM dd, yyyy")}
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b">
                            <span className="text-sm text-muted-foreground">Remaining Time</span>
                            <span className="text-sm font-medium text-sky-600">
                                {(() => {
                                    const now = new Date();
                                    const end = new Date(currentPeriodEnd);
                                    const diff = end.getTime() - now.getTime();
                                    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

                                    if (days <= 0) return "Expiring soon";
                                    if (days > 365) return "Over 1 year";

                                    const months = Math.floor(days / 30);
                                    const remainingDays = days % 30;

                                    return `${months} months, ${remainingDays} days`;
                                })()}
                            </span>
                        </div>
                    </>
                )}

                {!isPro && (
                    <div className="pt-4">
                        <Button
                            onClick={proModal.onOpen}
                            className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600"
                        >
                            Upgrade to Pro
                        </Button>
                        <p className="text-xs text-center text-muted-foreground mt-2">
                            Unlock unlimited boards and premium features
                        </p>
                    </div>
                )}

                {isPro && (
                    <div className="pt-4 text-center">
                        <p className="text-sm text-emerald-600 font-medium">
                            🎉 You have full access to all Pro features!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
