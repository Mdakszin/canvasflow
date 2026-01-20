import { AuditLog } from "@prisma/client";
import { format } from "date-fns";
import { generateLogMessage } from "@/lib/generate-log-message";

interface ActivityItemProps {
    data: AuditLog;
}

export const ActivityItem = ({ data }: ActivityItemProps) => {
    return (
        <li className="flex items-center gap-x-2">
            <div className="h-8 w-8 relative overflow-hidden rounded-full">
                <img
                    src={data.userImage}
                    alt={data.userName}
                    className="object-cover h-full w-full"
                />
            </div>
            <div className="flex flex-col space-y-0.5">
                <p className="text-sm text-muted-foreground">
                    <span className="font-semibold lowercase text-neutral-700">
                        {data.userName}
                    </span> {generateLogMessage(data)}
                </p>
                <p className="text-xs text-muted-foreground">
                    {format(new Date(data.createdAt), "MMM d, yyyy 'at' h:mm a")}
                </p>
            </div>
        </li>
    );
};
