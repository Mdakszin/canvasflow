"use client";

import { Copy, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useBroadcastEvent } from "@/lib/liveblocks";

import { useAction } from "@/hooks/use-action";
import { copyCard } from "@/actions/copy-card";
import { deleteCard } from "@/actions/delete-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CardWithList } from "@/types";
import { useCardModal } from "@/hooks/use-card-modal";
import { AuditLog } from "@prisma/client";

interface ActionsProps {
    data: CardWithList;
}

export const Actions = ({ data }: ActionsProps) => {
    const params = useParams();
    const cardModal = useCardModal();
    const broadcast = useBroadcastEvent();

    const { execute: executeCopy, isLoading: isLoadingCopy } = useAction(copyCard, {
        onSuccess: (data) => {
            toast.success(`Card "${data.title}" copied`);
            broadcast({ type: "BOARD_UPDATED" });
            cardModal.onClose();
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const { execute: executeDelete, isLoading: isLoadingDelete } = useAction(deleteCard, {
        onSuccess: (data) => {
            toast.success(`Card "${data.title}" deleted`);
            broadcast({ type: "BOARD_UPDATED" });
            cardModal.onClose();
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const onCopy = () => {
        const boardId = params.boardId as string;

        executeCopy({
            id: data.id,
            boardId,
        });
    };

    const onDelete = () => {
        const boardId = params.boardId as string;

        executeDelete({
            id: data.id,
            boardId,
        });
    };

    return (
        <div className="space-y-2 mt-2">
            <p className="text-xs font-semibold text-neutral-700">Actions</p>
            <Button
                onClick={onCopy}
                disabled={isLoadingCopy}
                variant="secondary"
                className="w-full justify-start"
                size="sm"
            >
                <Copy className="h-4 w-4 mr-2" />
                Copy
            </Button>
            <Button
                onClick={onDelete}
                disabled={isLoadingDelete}
                variant="destructive"
                className="w-full justify-start"
                size="sm"
            >
                <Trash className="h-4 w-4 mr-2" />
                Delete
            </Button>
        </div>
    );
};

Actions.Skeleton = function ActionsSkeleton() {
    return (
        <div className="space-y-2 mt-2">
            <Skeleton className="w-20 h-4 bg-neutral-200" />
            <Skeleton className="w-full h-8 bg-neutral-200" />
            <Skeleton className="w-full h-8 bg-neutral-200" />
        </div>
    );
};
