import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isSameDay, isToday } from "date-fns";
import CalendarEventCard from "./CalendarEventCard";

interface MonthViewProps {
    date: Date;
    tasks: any[];
    onDateClick?: (date: Date) => void;
    onTaskClick?: (task: any) => void;
}

export default function MonthView({ date, tasks, onDateClick, onTaskClick }: MonthViewProps) {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const range = eachDayOfInterval({ start: startDate, end: endDate });
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="flex flex-col h-full border rounded-lg bg-background shadow-sm overflow-hidden">
            {/* Day Headers */}
            <div className="grid grid-cols-7 border-b bg-muted/40">
                {days.map(day => (
                    <div key={day} className="py-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 auto-rows-fr h-full divide-x divide-y">
                {range.map((day) => {
                    // Filter tasks for this day
                    const dayTasks = tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), day));
                    // Sort by time?
                    dayTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

                    const isCurrentMonth = isSameMonth(day, monthStart);
                    const isCurrentDay = isToday(day);

                    return (
                        <div
                            key={day.toISOString()}
                            onClick={() => onDateClick?.(day)}
                            className={`
                                min-h-[140px] p-1 flex flex-col group transition-colors hover:bg-accent/5 cursor-pointer relative
                                ${!isCurrentMonth ? 'bg-muted/10 text-muted-foreground' : 'bg-background'}
                            `}
                        >
                            {/* Date Number */}
                            <div className="flex justify-center pt-1 mb-1">
                                <span className={`
                                    h-7 w-7 text-xs font-semibold flex items-center justify-center rounded-full
                                    ${isCurrentDay ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground group-hover:text-foreground'}
                                `}>
                                    {format(day, 'd')}
                                </span>
                            </div>

                            {/* Tasks Container */}
                            <div className="flex-1 overflow-y-auto px-1 space-y-0.5 scrollbar-none">
                                {dayTasks.slice(0, 4).map(task => (
                                    <CalendarEventCard
                                        key={task.id}
                                        task={task}
                                        compact
                                        onClick={(e: any) => {
                                            e.stopPropagation();
                                            onTaskClick?.(task);
                                        }}
                                    />
                                ))}
                                {dayTasks.length > 4 && (
                                    <div className="text-[10px] text-muted-foreground font-medium text-center hover:text-primary mt-1">
                                        + {dayTasks.length - 4} more
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
