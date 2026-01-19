"use client";

import { createCard } from "@/actions/create-card";
import { useFormState } from "react-dom";
import { Plus, X } from "lucide-react";
import { useState, useRef, useEffect, KeyboardEventHandler } from "react";
import { useParams } from "next/navigation";

interface CardFormProps {
  listId: string;
}

export const CardForm = ({ listId }: CardFormProps) => {
  const params = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [state, dispatch] = useFormState(createCard, { errors: {} });
  
  // Reset form and disable editing on successful submission
  useEffect(() => {
    if (!state.errors) {
      setIsEditing(false);
    }
  }, [state]);

  const onTextareaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  if (isEditing) {
    return (
      <form ref={formRef} action={dispatch} className="m-1 py-0.5 px-1 space-y-4">
        <textarea
          ref={textareaRef}
          name="title"
          placeholder="Enter a title for this card..."
          className="w-full p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          onKeyDown={onTextareaKeyDown}
        />
        <input name="listId" value={listId} type="hidden" />
        <input name="boardId" value={params.boardId} type="hidden" />
        <div className="flex items-center gap-x-2">
          <button type-="submit" className="bg-primary text-background px-3 py-1.5 rounded-md text-sm hover:opacity-90">
            Add card
          </button>
          <button onClick={() => setIsEditing(false)} type="button">
            <X className="h-5 w-5 text-text/70" />
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="pt-2 px-2">
      <button
        onClick={() => { setIsEditing(true); setTimeout(() => textareaRef.current?.focus()); }}
        className="h-auto px-2 py-1.5 w-full justify-start text-text/80 text-sm hover:bg-black/10 rounded-md transition flex items-center gap-x-2"
      >
        <Plus className="h-4 w-4" />
        Add a card
      </button>
    </div>
  );
};