import { ListItemHeader } from "./list-item-header";

import { Card, CardItem } from "./card-item";
import { CardForm } from "./card-form";
import { ListWithCards } from "./types";

interface ListItemProps {
  data: ListWithCards;
}

export const ListItem = ({ data }: ListItemProps) => {
  return (
    <div className="shrink-0 h-full w-[272px]">
      <div className="w-full rounded-md bg-secondary/60 shadow-md p-2 flex flex-col gap-y-2">
        <ListItemHeader data={data} />
        {data.cards.map((card: Card) => (
          <CardItem key={card.id} data={card} />
        ))}
        <CardForm listId={data.id} />
      </div>
    </div>
  );
};