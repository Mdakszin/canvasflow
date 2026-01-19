import { ListWithCards } from "./types";
import { ListForm } from "./list-form";
import { ListItem } from "./list-item";
// <-- CORRECT: Import from the new types file

interface ListContainerProps {
  boardId: string;
  data: ListWithCards[];
}

export const ListContainer = ({ boardId, data }: ListContainerProps) => {
  return (
    <div className="flex gap-x-3 h-full">
      {data.map((list) => (
        <ListItem key={list.id} data={list} />
      ))}
      <ListForm boardId={boardId} />
    </div>
  );
};