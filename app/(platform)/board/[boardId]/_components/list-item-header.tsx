// Define the List type locally or import from the correct module
type List = {
  id: string;
  title: string;
  // Add other fields as needed
};
import { MoreHorizontal } from "lucide-react";

interface ListItemHeaderProps {
  data: List;
}

export const ListItemHeader = ({ data }: ListItemHeaderProps) => {
  // TODO: Add editing functionality
  return (
    <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2">
      <div className="w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent text-primary">
        {data.title}
      </div>
      <button className="h-7 w-7 hover:bg-black/10 rounded-md transition flex items-center justify-center">
        <MoreHorizontal className="h-4 w-4" />
      </button>
    </div>
  );
};