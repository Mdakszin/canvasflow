"use client";

import { useFormState } from "react-dom";
import { createList } from "@/actions/create-list";
import { Plus, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export const ListForm = ({ boardId }: { boardId: string }) => {
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [state, dispatch] = useFormState(createList, { errors: {} });

  // Reset form on successful submission
  useEffect(() => {
    if (!state.errors) {
      setIsEditing(false);
    }
  }, [state]);

  if (isEditing) {
    return (
      <form ref={formRef} action={dispatch} className="shrink-0 w-[272px] p-2 bg-secondary/60 rounded-md space-y-2">
        <input name="boardId" value={boardId} type="hidden" />
        <input
          ref={inputRef}
          name="title"
          placeholder="Enter list title..."
          className="bg-background text-sm px-2 py-1 h-8 font-medium border-2 focus:border-primary transition rounded-md w-full focus:outline-none"
        />
        <div className="flex items-center gap-x-2">
          <button type="submit" className="bg-primary text-background px-3 py-1.5 rounded-md text-sm hover:opacity-90">
            Add List
          </button>
          <button onClick={() => setIsEditing(false)} type="button">
            <X className="h-5 w-5 text-text/70" />
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="shrink-0 w-[272px]">
      <button
        onClick={() => { setIsEditing(true); setTimeout(() => inputRef.current?.focus()); }}
        className="w-full rounded-md bg-secondary/40 hover:bg-secondary/60 transition p-2 flex items-center gap-x-2 text-sm text-text/80"
      >
        <Plus className="h-4 w-4" /> Add a list
      </button>
    </div>
  );
};