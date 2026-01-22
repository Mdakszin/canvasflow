import { auth, currentUser } from "@clerk/nextjs/server";
import { Liveblocks } from "@liveblocks/node";
import { db } from "@/lib/db";

const liveblocks = new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

// Predefined colors for user cursors
const CURSOR_COLORS = [
    "#E57373", // Red
    "#81C784", // Green
    "#64B5F6", // Blue
    "#FFB74D", // Orange
    "#BA68C8", // Purple
    "#4DD0E1", // Cyan
    "#F06292", // Pink
    "#AED581", // Light Green
    "#FFD54F", // Amber
    "#7986CB", // Indigo
];

// Generate consistent color from user ID
function getUserColor(userId: string): string {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
        hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return CURSOR_COLORS[Math.abs(hash) % CURSOR_COLORS.length];
}

export async function POST(request: Request) {
    const { userId, orgId } = await auth();
    const user = await currentUser();

    if (!userId || !orgId || !user) {
        return new Response("Unauthorized", { status: 403 });
    }

    const { room } = await request.json();

    // Security Check: Does this user have access to this board (room)?
    const board = await db.board.findUnique({
        where: { id: room, orgId },
    });

    if (!board) {
        return new Response("Unauthorized: Board not found or access denied.", {
            status: 403,
        });
    }

    // Provide user info to Liveblocks for presence features
    const userInfo = {
        name: user.firstName || user.username || "Teammate",
        picture: user.imageUrl,
        color: getUserColor(userId),
    };

    // Create a session for the user and grant them access to the room
    const session = liveblocks.prepareSession(userId, { userInfo });
    session.allow(room, session.FULL_ACCESS);

    // Authorize the session and return the response
    const { status, body } = await session.authorize();
    return new Response(body, { status });
}
