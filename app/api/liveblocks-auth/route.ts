import { auth, currentUser } from "@clerk/nextjs/server";
import { Liveblocks } from "@liveblocks/node";
import { db } from "@/lib/db";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: Request) {
  const { userId, orgId } = await auth();
  const user = await currentUser();

  if (!userId || !orgId || !user) {
    return new Response("Unauthorized", { status: 403 });
  }

  const { room } = await request.json();

  // Security Check: Does this user have access to this board (room)?
  const board = await db.board.findUnique({
    where: { id: room, orgId }
  });

  if (!board) {
    return new Response("Unauthorized: Board not found or access denied.", { status: 403 });
  }

  // Provide user info to Liveblocks for presence features (e.g., cursors, avatars)
  const userInfo = {
    name: user.firstName || "Teammate",
    picture: user.imageUrl,
  };

  // Create a session for the user and grant them access to the room
  const session = liveblocks.prepareSession(userId, { userInfo });
  session.allow(room, session.FULL_ACCESS);

  // Authorize the session and return the response
  const { status, body } = await session.authorize();
  return new Response(body, { status });
}