"use client";

import { RoomProvider } from "@liveblocks/react/suspense";
import { ReactNode } from "react";


interface RoomProps {
  roomId: string;
  children: ReactNode;
}

export const Room = ({ roomId, children }: RoomProps) => {
  

  return (
    <RoomProvider
      id={roomId}
      initialPresence={{}}
      // This is the key for real-time updates without complex state management.
      // When another user makes a change, we just refresh the server component data.
      
    >
      {/* You can add a loading skeleton here as a fallback */}
      {children}
    </RoomProvider>
  );
};