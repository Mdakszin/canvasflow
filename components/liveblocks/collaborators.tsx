"use client";

import { useOthers, useSelf } from "@/lib/liveblocks";

const MAX_SHOWN_USERS = 4;

// Type for user info from Liveblocks
type UserInfo = {
    name: string;
    picture: string;
    color: string;
};

export const Collaborators = () => {
    const users = useOthers();
    const currentUser = useSelf();

    const hasMoreUsers = users.length > MAX_SHOWN_USERS;

    // Type assertion for current user info
    const currentUserInfo = currentUser?.info as UserInfo | undefined;

    return (
        <div className="flex items-center gap-1">
            {/* Current user */}
            {currentUser && currentUserInfo && (
                <div
                    className="relative h-8 w-8 rounded-full ring-2 ring-white overflow-hidden"
                    style={{ borderColor: currentUserInfo.color }}
                    title={`${currentUserInfo.name} (You)`}
                >
                    <img
                        src={currentUserInfo.picture}
                        alt={currentUserInfo.name}
                        className="h-full w-full object-cover"
                    />
                </div>
            )}

            {/* Other users */}
            {users.slice(0, MAX_SHOWN_USERS).map((user) => {
                const info = user.info as UserInfo | undefined;
                if (!info) return null;

                return (
                    <div
                        key={user.connectionId}
                        className="relative h-8 w-8 rounded-full ring-2 ring-white overflow-hidden -ml-2 first:ml-0"
                        style={{ borderColor: info.color }}
                        title={info.name}
                    >
                        <img
                            src={info.picture}
                            alt={info.name}
                            className="h-full w-full object-cover"
                        />
                    </div>
                );
            })}

            {/* More users indicator */}
            {hasMoreUsers && (
                <div className="relative h-8 w-8 rounded-full ring-2 ring-white overflow-hidden -ml-2 bg-slate-600 flex items-center justify-center text-white text-xs font-semibold">
                    +{users.length - MAX_SHOWN_USERS}
                </div>
            )}
        </div>
    );
};
