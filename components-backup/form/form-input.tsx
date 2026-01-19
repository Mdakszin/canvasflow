"use client";

import { forwardRef } from "react";
import { useFormStatus } from "react-dom";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ... (Interface definition is the same)
interface FormInputProps {
  id: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  onBlur?: () => void;
  disabled?: boolean;
}


export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ id, name, defaultValue = "", placeholder, className, onBlur, disabled }, ref) => {
    const { pending } = useFormStatus();

    return (
      <Input
        id={id}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={cn("text-sm px-2 py-1 h-7", className)}
        onBlur={onBlur}
        disabled={pending || disabled}
        ref={ref} // Pass the ref to the underlying Input component
        aria-describedby={`${id}-error`}
      />
    );
  }
);

FormInput.displayName = "FormInput";