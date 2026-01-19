"use client";

import { useState, useRef, ElementRef } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { type List } from "@prisma/client";
import { useParams } from "next/navigation";
import { toast } from "sonner"; // Let's add a toast library for better feedback

import { FormInput } from "@/components/form/form-input";
import { updateList } from "@/actions/update-list";

interface ListItemHeaderProps {
  data: List;
}

export const ListItemHeader = ({ data }: ListItemHeaderProps) => {
  const params = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.title);

  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null); 
  
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

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      // Revert title and disable editing
      setTitle(data.title);
      disableEditing();
    }
  };

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef, disableEditing); // Only disable editing, don't submit
  
  const onSubmit = (formData: FormData) => {
    const newTitle = formData.get("title") as string;
    const id = data.id; // Get from props for safety
    const boardId = params.boardId as string;

    if (newTitle === data.title) {
      return disableEditing();
    }

    // Execute the server action
    updateList({ title: newTitle, id, boardId })
      .then((res) => {
        if (res.data) {
          setTitle(res.data.title);
          toast.success(`Renamed list to "${res.data.title}"`);
        }
        if (res.error) {
          toast.error(res.error);
          setTitle(data.title); // Revert on error
        }
      })
      .finally(disableEditing);
  };

  const onBlur = () => {
    formRef.current?.requestSubmit();
  };
  
  if (isEditing) {
    return (
      <form ref={formRef} action={onSubmit} className="flex-1 px-[2px]">
        <FormInput
          ref={inputRef}
          id="title"
          name="title"
          onBlur={onBlur} // Submit when the user clicks away or tabs out
          defaultValue={title}
          className="text-sm px-[7px] py-1 h-7 font-medium border-transparent focus:border-input focus:bg-background transition truncate"
        />
      </form>
    );
  }

  return (
    <div
      onClick={enableEditing}
      className="w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent cursor-pointer text-primary"
    >
      {title}
    </div>
  );
};