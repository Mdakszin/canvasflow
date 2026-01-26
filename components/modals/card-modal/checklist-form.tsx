"use client";

import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useRef, ComponentRef } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

import { useAction } from "@/hooks/use-action";
import { Button } from "@/components/ui/button";
import { FormTextarea } from "@/components/form/form-textarea";
import { FormSubmit } from "@/components/form/form-submit";
import { createChecklistItem } from "@/actions/create-checklist-item";
import { useBroadcastEvent } from "@/lib/liveblocks";

interface ChecklistFormProps {
    cardId: string;
}

export const ChecklistForm = ({
    cardId,
}: ChecklistFormProps) => {
    const params = useParams();
    const broadcast = useBroadcastEvent();
    const [isEditing, setIsEditing] = useState(false);

    const formRef = useRef<ComponentRef<"form">>(null);
    const textareaRef = useRef<ComponentRef<"textarea">>(null);

    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            textareaRef.current?.focus();
        });
    };

    const disableEditing = () => {
        setIsEditing(false);
    };

    const onKeyDown = (e: React.KeyboardEvent | KeyboardEvent) => {
        if (e.key === "Escape") {
            disableEditing();
        }
    };

    useEventListener("keydown", onKeyDown);
    useOnClickOutside(formRef as any, disableEditing);

    const { execute, fieldErrors } = useAction(createChecklistItem, {
        onSuccess: (data) => {
            toast.success(`Checklist item "${data.title}" created`);
            broadcast({ type: "CARD_UPDATED", cardId });
            disableEditing();
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        const boardId = params.boardId as string;

        execute({ title, boardId, cardId });
    };

    if (isEditing) {
        return (
            <form
                ref={formRef}
                action={onSubmit}
                className="space-y-2 px-1 py-0.5"
            >
                <FormTextarea
                    id="title"
                    onKeyDown={onKeyDown as any}
                    ref={textareaRef}
                    placeholder="Add an item..."
                    errors={fieldErrors}
                />
                <div className="flex items-center gap-x-2">
                    <FormSubmit>
                        Add item
                    </FormSubmit>
                    <Button
                        type="button"
                        onClick={disableEditing}
                        size="sm"
                        variant="ghost"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </form>
        );
    }

    return (
        <div className="px-2 pt-2">
            <Button
                onClick={enableEditing}
                className="h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm"
                variant="ghost"
                size="sm"
            >
                <Plus className="h-4 w-4 mr-2" />
                Add an item
            </Button>
        </div>
    );
};
