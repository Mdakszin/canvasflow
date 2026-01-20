"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCardModal } from "@/hooks/use-card-modal";
import { getCard } from "@/actions/get-card";
import { Header } from "./header";
import { Description } from "./description";
import { Actions } from "./actions";
import { CardWithList } from "@/types";

export const CardModal = () => {
    const { id, isOpen, onClose } = useCardModal();
    const [cardData, setCardData] = useState<CardWithList | null>(null);

    useEffect(() => {
        if (id) {
            const fetchCard = async () => {
                const data = await getCard(id);
                setCardData(data);
            };
            fetchCard();
        } else {
            setCardData(null);
        }
    }, [id, isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
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
