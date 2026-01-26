"use client";

import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useRef, ComponentRef } from "react";
import { ChecklistItem } from "@prisma/client";

import { cn } from "@/lib/utils";
import { useAction } from "@/hooks/use-action";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/form/form-input";
import { updateChecklistItem } from "@/actions/update-checklist-item";
import { deleteChecklistItem } from "@/actions/delete-checklist-item";
import { useBroadcastEvent } from "@/lib/liveblocks";

interface ChecklistItemProps {
    data: ChecklistItem;
    cardId: string;
}

export const ChecklistItemComponent = ({
    data,
    cardId,
}: ChecklistItemProps) => {
    const params = useParams();
    const broadcast = useBroadcastEvent();
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(data.title);

    const inputRef = useRef<ComponentRef<"input">>(null);

    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.select();
        });
    };

    const disableEditing = () => {
        setIsEditing(false);
    };

    const { execute: executeUpdate } = useAction(updateChecklistItem, {
        onSuccess: (data) => {
            toast.success(`Renamed to "${data.title}"`);
            setTitle(data.title);
            broadcast({ type: "CARD_UPDATED", cardId });
            disableEditing();
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const { execute: executeDelete, isLoading: isDeleting } = useAction(deleteChecklistItem, {
        onSuccess: (data) => {
            toast.success(`Checklist item "${data.title}" deleted`);
            broadcast({ type: "CARD_UPDATED", cardId });
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const onBlur = () => {
        if (title === data.title) {
            disableEditing();
            return;
        }

        executeUpdate({
            id: data.id,
            boardId: params.boardId as string,
            title,
        });
    };

    const toggleCompleted = (checked: boolean) => {
        executeUpdate({
            id: data.id,
            boardId: params.boardId as string,
            isCompleted: checked,
        });
        broadcast({ type: "CARD_UPDATED", cardId });
    };

    const onDelete = () => {
        executeDelete({
            id: data.id,
            boardId: params.boardId as string,
        });
    };

    return (
        <div className="flex items-center gap-x-2 w-full group py-1">
            <Checkbox
                checked={data.isCompleted}
                onCheckedChange={toggleCompleted}
                className="h-4 w-4"
            />
            {isEditing ? (
                <form className="flex-1">
                    <FormInput
                        id="title"
                        ref={inputRef}
                        onBlur={onBlur}
                        defaultValue={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-sm px-[7px] py-1 h-8 font-medium bg-transparent border-transparent focus-visible:bg-white focus-visible:border-input mb-0.5 truncate"
                    />
                </form>
            ) : (
                <div
                    onClick={enableEditing}
                    className={cn(
                        "flex-1 text-sm py-1.5 px-2 rounded-lg hover:bg-neutral-50 cursor-pointer transition-colors font-medium text-neutral-700",
                        data.isCompleted && "text-neutral-400 line-through decoration-neutral-300"
                    )}
                >
                    {data.title}
                </div>
            )}
            <Button
                onClick={onDelete}
                disabled={isDeleting}
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition p-1 h-auto"
            >
                <Trash2 className="h-3 w-3 text-muted-foreground" />
            </Button>
        </div>
    );
};
