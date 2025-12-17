import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, MapPin } from "lucide-react";
import { format, isSameDay, isToday, isTomorrow, parseISO } from "date-fns";

interface DashboardCalendarProps {
    tasks: any[];
}

export default function DashboardCalendar({ tasks = [] }: DashboardCalendarProps) {
    // 1. Filter Future Tasks (including today)
    // 2. Sort by Date
    // 3. Group by Date

    const upcomingTasks = tasks
        .filter(t => t.dueDate && t.status !== 'DONE') // Only pending tasks with dates
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    const groupedTasks = upcomingTasks.reduce((acc: any, task: any) => {
        const dateStr = new Date(task.dueDate).toDateString();
        if (!acc[dateStr]) acc[dateStr] = [];
        acc[dateStr].push(task);
        return acc;
    }, {});

    const dates = Object.keys(groupedTasks);

    return (
        <Card className="h-full border-none shadow-lg bg-card text-card-foreground ring-1 ring-border/50 overflow-hidden flex flex-col hover:shadow-xl">
            <div className="p-4 border-b bg-gradient-to-r from-background to-muted/20 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                        <CalendarIcon className="h-5 w-5" />
                    </div>
                    <span className="font-semibold text-lg tracking-tight">Upcoming Schedule</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                    {upcomingTasks.length} Events
                </Badge>
            </div>

            <div className="flex-1 bg-muted/5 p-0 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted min-h-[300px]">
                {dates.length > 0 ? (
                    <div className="flex flex-col">
                        {dates.map((dateStr) => {
                            const date = new Date(dateStr);
                            const dayTasks = groupedTasks[dateStr];

                            let dateLabel = format(date, 'EEE, MMM do');
                            if (isToday(date)) dateLabel = "Today";
                            if (isTomorrow(date)) dateLabel = "Tomorrow";

                            return (
                                <div key={dateStr} className="flex flex-col border-b last:border-b-0">
                                    {/* Date Header: Sticky? No, simple block */}
                                    <div className="bg-muted/30 px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground bg-white/50 dark:bg-black/20 backdrop-blur-sm sticky top-0 z-10 border-y border-transparent">
                                        {dateLabel}
                                    </div>
                                    <div className="divide-y divide-border/50">
                                        {dayTasks.map((task: any) => (
                                            <div key={task.id} className="p-4 hover:bg-muted/50 transition-colors flex items-start gap-4 group">
                                                {/* Time Column */}
                                                <div className="flex flex-col items-end min-w-[60px] text-xs text-muted-foreground pt-0.5">
                                                    <span>{format(new Date(task.dueDate), 'h:mm a')}</span>
                                                </div>

                                                {/* Task Details */}
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <p className={`text-sm font-medium ${task.priority === 'HIGH' ? 'text-destructive' : 'text-foreground'}`}>
                                                            {task.title}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        {task.subject && (
                                                            <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-normal text-muted-foreground">
                                                                {task.subject}
                                                            </Badge>
                                                        )}
                                                        {task.priority === 'HIGH' && (
                                                            <span className="text-destructive font-semibold text-[10px] uppercase">High Priority</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60 min-h-[200px]">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                            <CalendarIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium">Your schedule is clear</p>
                        <p className="text-xs text-muted-foreground">Relax or plan ahead!</p>
                    </div>
                )}
            </div>
        </Card>
    );
}
