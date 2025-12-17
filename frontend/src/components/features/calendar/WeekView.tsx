import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday } from "date-fns";
import CalendarEventCard from "./CalendarEventCard";
import { ScrollArea } from "@/components/ui/scroll-area";

interface WeekViewProps {
    date: Date;
    tasks: any[];
    onTaskClick?: (task: any) => void;
    onDateClick?: (date: Date) => void;
}

export default function WeekView({ date, tasks, onTaskClick, onDateClick }: WeekViewProps) {
    const start = startOfWeek(date);
    const end = endOfWeek(date);
    const range = eachDayOfInterval({ start, end });
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="flex flex-col h-full bg-background rounded-lg border shadow-sm overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-7 border-b bg-muted/20 divide-x">
                {range.map((day, idx) => {
                    const isCurrentDay = isToday(day);
                    return (
                        <div
                            key={day.toISOString()}
                            className={`py-3 text-center cursor-pointer hover:bg-muted/50 transition-colors ${isCurrentDay ? 'bg-primary/5' : ''}`}
                            onClick={() => onDateClick?.(day)}
                        >
                            <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isCurrentDay ? 'text-primary' : 'text-muted-foreground'}`}>
                                {format(day, 'EEE')}
                            </div>
                            <div className={`
                                inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold
                                ${isCurrentDay ? 'bg-primary text-primary-foreground' : 'text-foreground'}
                            `}>
                                {format(day, 'd')}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Content Columns */}
            <div className="flex-1 overflow-hidden">
                <div className="grid grid-cols-7 h-full divide-x">
                    {range.map((day) => {
                        const dayTasks = tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), day));
                        dayTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

                        return (
                            <div key={day.toISOString()} className="h-full bg-background flex flex-col hover:bg-muted/5 transition-colors">
                                <ScrollArea className="flex-1 px-2 py-3">
                                    <div className="space-y-2">
                                        {dayTasks.map(task => (
                                            <CalendarEventCard
                                                key={task.id}
                                                task={task}
                                                onClick={() => onTaskClick?.(task)}
                                            />
                                        ))}
                                    </div>
                                </ScrollArea>
                                {/* Add Task Button (Optional per col) */}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
