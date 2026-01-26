"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useCardModal } from "@/hooks/use-card-modal";
import { getCard } from "@/actions/get-card";
import { getDescription } from "@/actions/get-description";
import { Header } from "./header";
import { Description } from "./description";
import { Checklist } from "./checklist";
import { Actions } from "./actions";
import { Activity } from "./activity";
import { CardWithList } from "@/types";
import { AuditLog } from "@prisma/client";
import { getActivity } from "@/actions/get-activity";

export const CardModal = () => {
    const { id, isOpen, onClose } = useCardModal();
    const [cardData, setCardData] = useState<CardWithList | null>(null);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                const [cardData, auditLogs] = await Promise.all([
                    getCard(id),
                    getActivity(id),
                ]);
                setCardData(cardData);
                setAuditLogs(auditLogs);
            };
            fetchData();
        } else {
            setCardData(null);
        }
    }, [id, isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogTitle className="sr-only">
                    {cardData?.title || "Card details"}
                </DialogTitle>
                <DialogDescription className="sr-only">
                    Card details and activity
                </DialogDescription>
                {!cardData ? (
                    <div className="w-full h-full flex items-center justify-center p-6">
                        <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-neutral-600" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        <Header data={cardData} />
                        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
                            <div className="col-span-3">
                                <div className="w-full space-y-6">
                                    <Description data={cardData} />
                                    <Checklist cardId={cardData.id} items={cardData.checklist} />
                                    <Activity items={auditLogs} />
                                </div>
                            </div>
                            <div className="col-span-1">
                                <Actions data={cardData} />
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};
