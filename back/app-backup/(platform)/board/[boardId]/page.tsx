import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { ListContainer } from "./_components/list-container";
import { Room } from "@/components/providers/room-provider";
import { db } from "@/lib/db";

interface BoardPageProps {
  params: { boardId: string };
}

export default async function BoardPage({ params }: BoardPageProps) {
  const { orgId } = await auth();

  if (!orgId) {
    // This could be a redirect to organization selection
    return <div>Unauthorized</div>;
  }

  // Fetch the board and all of its nested lists and cards in a single query.
  // This is a key pattern for performance.
  const board = await db.board.findUnique({
    where: {
      id: params.boardId,
      orgId, // Security: Ensures the user can only access boards in their org.
    },
    include: {
      lists: {
        orderBy: { order: "asc" },
        include: {
          cards: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  if (!board) {
    notFound(); // Use Next.js's built-in 404 handling.
  }

  return (
    <Room roomId={params.boardId}>
      <div className="h-full overflow-x-auto p-4">
        <h1 className="text-2xl font-bold text-primary mb-4 px-2">
          {board.title}
        </h1>
        <ListContainer boardId={params.boardId} data={board.lists} />
      </div>
    </Room>
  );
}
