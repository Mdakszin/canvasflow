// Define Card type manually if not exported from @prisma/client
export interface Card {
  id: string;
  title: string;
  // Add other fields as needed
}

interface CardItemProps {
  data: Card;
}

export const CardItem = ({ data }: CardItemProps) => {
  return (
    <div
      // TODO: Add onClick handler to open card modal
      className="truncate border-2 border-transparent hover:border-black/10 py-2 px-3 text-sm bg-background rounded-md shadow-sm"
    >
      {data.title}
    </div>
  );
};