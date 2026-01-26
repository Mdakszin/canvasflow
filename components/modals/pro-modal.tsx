"use client";

import Image from "next/image";
import { Check, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useProModal } from "@/hooks/use-pro-modal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAction } from "@/hooks/use-action";
import { processYocoPayment } from "@/actions/process-yoco-payment";
import { PLANS, PlanId } from "@/constants/tiers";
import { cn } from "@/lib/utils";

export const ProModal = () => {
    const proModal = useProModal();
    const [selectedPlan, setSelectedPlan] = useState<PlanId>("pro");

    const { execute, isLoading } = useAction(processYocoPayment, {
        onSuccess: (data) => {
            if (data.redirectUrl) {
                window.location.href = data.redirectUrl;
            } else {
                toast.error("Failed to get payment redirect URL.");
            }
        },
        onError: (error) => {
            toast.error(error);
        }
    });

    const onUpgrade = () => {
        execute({ planId: selectedPlan });
    };

    return (
        <Dialog
            open={proModal.isOpen}
            onOpenChange={proModal.onClose}
        >
            <DialogContent className="max-w-4xl p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-x-2 justify-center">
                        Upgrade Your Workspace <Zap className="h-5 w-5 text-sky-500 fill-sky-500" />
                    </DialogTitle>
                    <DialogDescription className="text-center pt-2">
                        Unlock powerful features and increase your project capacity
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.values(PLANS).map((plan) => (
                        <div
                            key={plan.id}
                            onClick={() => plan.id !== "free" && setSelectedPlan(plan.id)}
                            className={cn(
                                "relative flex flex-col p-6 rounded-xl border-2 transition cursor-pointer group",
                                selectedPlan === plan.id
                                    ? "border-sky-500 bg-sky-50/50 shadow-md"
                                    : "border-neutral-200 hover:border-neutral-300 bg-white",
                                plan.id === "free" && "opacity-80 cursor-not-allowed grayscale"
                            )}
                        >
                            {plan.id === "pro" && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-sky-600 to-indigo-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                                    Best Value
                                </div>
                            )}

                            <div className="mb-4">
                                <h3 className="font-bold text-lg">{plan.name}</h3>
                                <p className="text-xs text-muted-foreground line-clamp-2 h-8">
                                    {plan.description}
                                </p>
                            </div>

                            <div className="mb-6">
                                <span className="text-2xl font-bold">R{plan.price / 100}</span>
                                <span className="text-sm text-muted-foreground">/year</span>
                            </div>

                            <div className="flex-1 space-y-3 mb-6">
                                {plan.features.map((feature) => (
                                    <div key={feature} className="flex items-start gap-x-2 text-xs">
                                        <Check className="h-3 w-3 text-emerald-500 mt-0.5 shrink-0" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-auto">
                                {plan.id === "free" ? (
                                    <Button variant="outline" className="w-full text-xs" disabled>
                                        Current Plan
                                    </Button>
                                ) : (
                                    <Button
                                        variant={selectedPlan === plan.id ? "default" : "outline"}
                                        className={cn(
                                            "w-full text-xs",
                                            selectedPlan === plan.id && "bg-sky-600 hover:bg-sky-700"
                                        )}
                                    >
                                        {selectedPlan === plan.id ? "Selected" : "Select Plan"}
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-neutral-50 p-6 flex flex-col items-center gap-y-4 border-t">
                    <p className="text-xs text-muted-foreground">
                        All plans include 1 year of access from the date of purchase.
                    </p>
                    <Button
                        disabled={isLoading || selectedPlan === "free"}
                        onClick={onUpgrade}
                        size="lg"
                        className="w-full md:max-w-xs bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white shadow-lg"
                    >
                        {isLoading ? "Redirecting..." : `Upgrade with Yoco`}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
