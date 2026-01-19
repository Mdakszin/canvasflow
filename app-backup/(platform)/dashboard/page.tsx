import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { CreateBoardForm } from "./_components/create-board-form";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";
import { db } from "@/lib/db";

export default async function DashboardPage() {
  const { orgId } = await auth();
  const user = await currentUser();

  if (!orgId || !user) {
    // This can be a more elegant component or a redirect in a real app
    return (
      <div className="text-center p-8">
        <h2 className="text-xl text-primary font-semibold">
          Please select or create an organization to continue.
        </h2>
      </div>
    );
  }

  // Ensure the user from Clerk exists in our local database.
  // This is an idempotent operation (safe to run multiple times).
  await db.user.upsert({
    where: { id: user.id },
    update: {},
    create: {
      id: user.id,
      email: user.emailAddresses[0].emailAddress,
    }
  });

  const boards = await db.board.findMany({
    where: { orgId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">
        Your Boards
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {boards.map((board: { id: Key | null | undefined; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<unknown>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<unknown>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
          <Link
            key={board.id}
            href={`/board/${board.id}`}
            className="group relative aspect-video bg-secondary rounded-md p-4 flex flex-col justify-end overflow-hidden hover:scale-105 transition"
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
            <p className="relative font-semibold text-text drop-shadow-sm">{board.title}</p>
          </Link>
        ))}
        <CreateBoardForm />
      </div>
    </div>
  );
}