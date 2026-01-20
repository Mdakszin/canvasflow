"use client";

import { KeyboardEventHandler, forwardRef } from "react";
import { useFormStatus } from "react-dom";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface FormTextareaProps {
    id: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    errors?: Record<string, string[] | undefined>;
    className?: string;
    onBlur?: () => void;
    onClick?: () => void;
    onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement> | undefined;
    defaultValue?: string;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
    ({
        id,
        label,
        placeholder,
        required,
        disabled,
        errors,
        onBlur,
        onClick,
        onKeyDown,
        className,
        defaultValue,
    }, ref) => {
        const { pending } = useFormStatus();

        return (
            <div className="space-y-2 w-full">
                <div className="space-y-1 w-full">
                    {label ? (
                        <label
                            htmlFor={id}
                            className="text-xs font-semibold text-neutral-700"
                        >
                            {label}
                        </label>
                    ) : null}
                    <Textarea
                        onKeyDown={onKeyDown}
                        onBlur={onBlur}
                        onClick={onClick}
                        ref={ref}
                        required={required}
                        placeholder={placeholder}
                        name={id}
                        id={id}
                        disabled={pending || disabled}
                        className={cn(
                            "resize-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm",
                            className
                        )}
                        aria-describedby={`${id}-error`}
                        defaultValue={defaultValue}
                    />
                </div>
                {errors?.[id] ? (
                    <div id={`${id}-error`} className="text-xs text-rose-500">
                        {errors[id]?.map((error: string) => (
                            <div
                                key={error}
                                className="flex items-center font-medium p-2 border border-rose-500 bg-rose-50/10 rounded-sm"
                            >
                                {error}
                            </div>
                        ))}
                    </div>
                ) : null}
            </div>
        );
    }
);

FormTextarea.displayName = "FormTextarea";
