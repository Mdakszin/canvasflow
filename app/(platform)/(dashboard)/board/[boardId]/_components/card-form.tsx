"use client";

import { useState, useRef, ComponentRef, forwardRef } from "react";
import { Plus, X } from "lucide-react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

import { FormInput } from "@/components/form/form-input";
import { FormSubmit } from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { createCard } from "@/actions/create-card";
import { toast } from "sonner";
import { useBroadcastEvent } from "@/lib/liveblocks";

interface CardFormProps {
    listId: string;
    boardId: string;
}

export const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(
    ({ listId, boardId }, ref) => {
        const broadcast = useBroadcastEvent();
        const formRef = useRef<ComponentRef<"form">>(null);
        const [isEditing, setIsEditing] = useState(false);

        const enableEditing = () => {
            setIsEditing(true);
        };

        const disableEditing = () => {
            setIsEditing(false);
        };

        const { execute, fieldErrors } = useAction(createCard, {
            onSuccess: () => {
                toast.success("Card created");
                broadcast({ type: "BOARD_UPDATED" });
                disableEditing();
            },
            onError: (error) => {
                toast.error(error);
            },
        });

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                disableEditing();
            }
        };

        useEventListener("keydown", onKeyDown);
        useOnClickOutside(formRef as React.RefObject<HTMLElement>, disableEditing);

        const onSubmit = (formData: FormData) => {
            const title = formData.get("title") as string;

            execute({ title, listId, boardId });
        };

        if (isEditing) {
            return (
                <form
                    ref={formRef}
                    action={onSubmit}
                    className="m-1 py-0.5 px-1 space-y-4"
                >
                    <FormInput
                        id="title"
                        errors={fieldErrors}
                        placeholder="Enter a title for this card..."
                        className="text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition"
                    />
                    <input hidden name="listId" value={listId} readOnly />
                    <input hidden name="boardId" value={boardId} readOnly />
                    <div className="flex items-center gap-x-1">
                        <FormSubmit>
                            Add card
                        </FormSubmit>
                        <Button onClick={disableEditing} size="sm" variant="ghost">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </form>
            );
        }

        return (
            <div className="pt-2 px-2">
                <Button
                    onClick={enableEditing}
                    className="h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm"
                    size="sm"
                    variant="ghost"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add a card
                </Button>
            </div>
        );
    }
);

CardForm.displayName = "CardForm";
