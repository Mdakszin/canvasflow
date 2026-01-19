"use client";

import { useAction } from "@/hooks/use-action";
import { createBoard } from "@/actions/create-board";
import { FormInput } from "@/components/form/form-input";
import { FormSubmit } from "@/components/form/form-submit";
import { toast } from "sonner";

export const FormPopover = () => {
    const { execute, fieldErrors } = useAction(createBoard, {
        onSuccess: (data) => {
            toast.success("Board created!");
            // Close popover if I had one
        },
        onError: (error) => {
            toast.error(error);
        }
    });

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        const image = formData.get("image") as string || "https://images.unsplash.com/photo-1707343843437-caacff5cfa74"; // Placeholder image

        execute({ title, image });
    }

    return (
        <div className="relative aspect-video h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition p-4">
            <p className="text-sm">Create New Board</p>
            <form action={onSubmit} className="flex flex-col gap-2 w-full">
                <FormInput id="title" errors={fieldErrors} placeholder="Board Title" />
                {/* Hidden image input for now */}
                <input name="image" type="hidden" value="https://images.unsplash.com/photo-1707343843437-caacff5cfa74" />
                <FormSubmit className="w-full">Create</FormSubmit>
            </form>
        </div>
    );
};
