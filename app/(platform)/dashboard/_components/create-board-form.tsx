"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createBoard } from "@/actions/create-board";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-primary text-background px-4 py-2 rounded-md text-sm font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed w-full"
    >
      {pending ? "Creating..." : "Create Board"}
    </button>
  );
}

export function CreateBoardForm() {
  const initialState: { message: null; errors: object } = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createBoard, initialState);

  return (
    <form
      action={dispatch}
      className="aspect-video bg-background border-2 border-dashed border-secondary/80 rounded-md p-4 flex flex-col items-center justify-center space-y-4"
    >
      <div className="w-full">
        <input
          id="title"
          name="title"
          placeholder="Board title..."
          className="bg-transparent border-b-2 border-accent focus:outline-none focus:border-primary w-full text-center text-sm p-1"
          aria-describedby="title-error"
        />
        <div id="title-error" aria-live="polite" aria-atomic="true">
          {state.errors?.title?.map((error: string) => (
            <p className="mt-2 text-xs text-red-500 text-center" key={error}>
              {error}
            </p>
          ))}
        </div>
      </div>
      <SubmitButton />
    </form>
  );
}