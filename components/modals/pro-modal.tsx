"use client";

import Image from "next/image";
import Script from "next/script";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useProModal } from "@/hooks/use-pro-modal";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAction } from "@/hooks/use-action";
import { processYocoPayment } from "@/actions/process-yoco-payment";

declare global {
    interface Window {
        YocoSDK: any;
    }
}

export const ProModal = () => {
    const proModal = useProModal();
    const [sdkLoaded, setSdkLoaded] = useState(false);

    const { execute, isLoading } = useAction(processYocoPayment, {
        onSuccess: () => {
            toast.success("Success! You've upgraded to CanvasFlow Pro for 1 year.");
            proModal.onClose();
        },
        onError: (error) => {
            toast.error(error);
        }
    });

    const onClick = () => {
        if (!sdkLoaded) {
            toast.error("Payment system is still loading. Please wait a moment.");
            return;
        }

        const yoco = new window.YocoSDK({
            publicKey: process.env.NEXT_PUBLIC_YOCO_PUBLIC_KEY!,
        });

        yoco.showPopup({
            amountInCents: 20000, // R200.00
            currency: 'ZAR',
            name: 'CanvasFlow Pro',
            description: '1 Year Unlimited Access',
            callback: (result: any) => {
                if (result.error) {
                    toast.error(result.error.message);
                } else {
                    execute({
                        token: result.id,
                        amountInCents: 20000,
                    });
                }
            },
        });
    };

    return (
        <>
            <Script
                src="https://js.yoco.com/sdk/v1/yoco.js"
                onLoad={() => setSdkLoaded(true)}
            />
            <Dialog
                open={proModal.isOpen}
                onOpenChange={proModal.onClose}
            >
                <DialogContent className="max-w-md p-0 overflow-hidden">
                    <DialogTitle className="sr-only">Upgrade to CanvasFlow Pro</DialogTitle>
                    <DialogDescription className="sr-only">
                        Upgrade to Pro to create unlimited boards and unlock more features for 1 year.
                    </DialogDescription>
                    <div className="aspect-video relative flex items-center justify-center">
                        <Image
                            src="/hero-pro.png"
                            alt="Hero"
                            className="object-cover"
                            fill
                        />
                    </div>
                    <div className="text-neutral-700 mx-auto p-6 space-y-6">
                        <h2 className="font-semibold text-xl">
                            Upgrade to CanvasFlow Pro Today!
                        </h2>
                        <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
                            Support Local • Built for South Africa
                        </p>
                        <div className="pl-3">
                            <ul className="text-sm list-disc space-y-1">
                                <li>Unlimited boards</li>
                                <li>Advanced checklists</li>
                                <li>Admin and security features</li>
                                <li><strong>1 Year of full access</strong></li>
                            </ul>
                        </div>
                        <Button
                            disabled={isLoading}
                            onClick={onClick}
                            className="w-full"
                            variant="default"
                        >
                            Upgrade for R200
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};
