// Define Liveblocks types for your application
// https://liveblocks.io/docs/api-reference/liveblocks-react#Typing-your-data
declare global {
  interface Liveblocks {
    // Each user's Presence, for useMyPresence, useOthers, etc.
    Presence: {
      // Real-time cursor coordinates (null when cursor is outside the board)
      cursor: { x: number; y: number } | null;
      // The ID of the item (list or card) currently being dragged
      activeId: string | null;
    };


    // The Storage tree for the room, for useMutation, useStorage, etc.
    // We use database for persistence, so this is empty
    Storage: {};

    // Custom user info set when authenticating with a secret key
    UserMeta: {
      id: string;
      info: {
        name: string;
        picture: string;
        color: string;
      };
    };

    // Custom events, for useBroadcastEvent, useEventListener
    RoomEvent:
    | { type: "CARD_UPDATED"; cardId: string }
    | { type: "LIST_UPDATED"; listId: string }
    | { type: "BOARD_UPDATED" };

    // Custom metadata set on threads, for useThreads, useCreateThread, etc.
    ThreadMetadata: {};

    // Custom room info set with resolveRoomsInfo, for useRoomInfo
    RoomInfo: {
      title: string;
    };
  }
}

export { };

