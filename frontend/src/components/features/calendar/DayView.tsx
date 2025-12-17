import { format, isSameDay, startOfDay, endOfDay, eachHourOfInterval, isToday } from "date-fns";
import CalendarEventCard from "./CalendarEventCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface DayViewProps {
    date: Date;
    tasks: any[];
    onTaskClick?: (task: any) => void;
}

export default function DayView({ date, tasks, onTaskClick }: DayViewProps) {
    // Filter tasks for the selected date
    const dayTasks = tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), date));
    dayTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    // Generate hours
    const start = startOfDay(date);
    const end = endOfDay(date);
    const hours = eachHourOfInterval({ start, end });

    // Helper: Find tasks in this hour
    const getTasksForHour = (hour: Date) => {
        return dayTasks.filter(t => {
            const d = new Date(t.dueDate);
            return d.getHours() === hour.getHours();
        });
    };

    return (
        <div className="flex flex-col h-full bg-background rounded-lg border shadow-sm">
            <div className="p-4 border-b bg-muted/20">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                    {format(date, 'EEEE, MMMM do')}
                    {isToday(date) && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Today</span>}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                    {dayTasks.length} tasks scheduled
                </p>
            </div>

            <ScrollArea className="flex-1">
                <div className="flex flex-col min-h-full py-4 space-y-2">
                    {/* If no tasks */}
                    {dayTasks.length === 0 && (
                        <div className="flex flex-col items-center justify-center p-12 text-muted-foreground opacity-60">
                            <p>No tasks for this day.</p>
                            <p className="text-sm">Enjoy your freedom!</p>
                        </div>
                    )}

                    {hours.map((hour) => {
                        const hourTasks = getTasksForHour(hour);
                        // Only show hours with tasks? OR Show full grid?
                        // Premium feel usually shows full timeline or at least active period (8am-8pm).
                        // Let's show full grid but collapsed if empty? NO, Full Grid is standard.

                        // Skip early morning/late night if empty? Simple logic: Show 7am-11pm? 
                        // Or simple list:
                        if (hourTasks.length === 0) return null; // Compact Agenda Mode

                        return (
                            <div key={hour.toString()} className="flex items-start px-4 gap-4 group">
                                {/* Time Column */}
                                <div className="w-16 flex-shrink-0 text-right text-xs text-muted-foreground pt-2 group-hover:text-primary transition-colors">
                                    {format(hour, 'h aa')}
                                </div>

                                {/* Timeline Line/Node */}
                                <div className="w-4 flex flex-col items-center pt-2.5 relative">
                                    <div className="h-2 w-2 rounded-full bg-primary/50 ring-2 ring-background z-10" />
                                    <div className="w-0.5 h-full bg-border absolute top-4 -ml-px" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 pb-6 space-y-3">
                                    {hourTasks.map(task => (
                                        <CalendarEventCard key={task.id} task={task} onClick={() => onTaskClick?.(task)} />
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    {/* If compact mode hides all hours (empty), we handled it above. 
                        But if user wants to see 'gaps', pure agenda is better for "Tasks" (ToDo list) vs "Events" (Cal).
                        Since this is a "To-Do App" primarily, Agenda View (Compact) is superior.
                    */}
                </div>
            </ScrollArea>
        </div>
    );
}
