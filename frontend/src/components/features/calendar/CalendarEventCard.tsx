import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Clock } from "lucide-react";

interface CalendarEventCardProps {
    task: any;
    onClick?: (e?: React.MouseEvent) => void;
    compact?: boolean; // For Month View (very small)
}

export default function CalendarEventCard({ task, onClick, compact = false }: CalendarEventCardProps) {
    const priorityColor =
        task.priority === 'HIGH' ? 'border-l-destructive bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30' :
            task.priority === 'MEDIUM' ? 'border-l-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/30' :
                'border-l-sky-500 bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/30';

    if (compact) {
        return (
            <div
                onClick={onClick}
                className={cn(
                    "text-[10px] truncate px-1.5 py-0.5 rounded-sm border-l-2 cursor-pointer transition-colors mb-1 font-medium select-none",
                    priorityColor
                )}
                title={task.title}
            >
                {task.title}
            </div>
        );
    }

    // Full Card (Week/Day View)
    return (
        <div
            onClick={onClick}
            className={cn(
                "p-2 rounded border border-l-4 cursor-pointer transition-all shadow-sm hover:shadow-md group",
                priorityColor
            )}
        >
            <div className="flex justify-between items-start gap-2">
                <span className="font-semibold text-xs line-clamp-2 leading-tight">
                    {task.title}
                </span>
                {task.status === 'DONE' && (
                    <Badge variant="secondary" className="text-[9px] h-4 px-1">Done</Badge>
                )}
            </div>
            <div className="flex items-center gap-2 mt-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center text-[10px] text-muted-foreground">
                    <Clock className="h-3 w-3 mr-0.5" />
                    {task.dueDate ? format(new Date(task.dueDate), 'h:mm a') : 'All Day'}
                </div>
                {task.subject && (
                    <span className="text-[9px] font-medium text-muted-foreground truncate max-w-[60px]">
                        {task.subject}
                    </span>
                )}
            </div>
        </div>
    );
}
