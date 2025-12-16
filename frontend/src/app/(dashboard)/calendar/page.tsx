'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalIcon } from 'lucide-react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    isToday
} from 'date-fns';
import api from '@/lib/axios';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import TaskForm from '@/components/features/tasks/TaskForm';

export default function CalendarPage() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const onNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const onPrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await api.get('/tasks');
                setTasks(res.data);
            } catch (error) {
                console.error("Failed to fetch tasks");
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    const renderHeader = () => {
        return (
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">{format(currentMonth, 'MMMM yyyy')}</h2>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={onPrevMonth}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={onNextMonth}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        );
    };

    const renderDays = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return (
            <div className="grid grid-cols-7 mb-2">
                {days.map(day => (
                    <div key={day} className="text-center font-medium text-sm text-muted-foreground">
                        {day}
                    </div>
                ))}
            </div>
        );
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const dateFormat = "d";
        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = "";

        // Collect all days in the view
        const range = eachDayOfInterval({ start: startDate, end: endDate });

        return (
            <div className="grid grid-cols-7 gap-2 auto-rows-[minmax(100px,_1fr)]">
                {range.map((dayItem, idx) => {
                    const dateKey = format(dayItem, 'yyyy-MM-dd');
                    const dayTasks = tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), dayItem));

                    return (
                        <div
                            key={dayItem.toString()}
                            className={`min-h-[120px] p-2 border rounded-lg bg-card hover:bg-accent/5 transition-colors overflow-hidden flex flex-col gap-1 
                                ${!isSameMonth(dayItem, monthStart) ? "text-muted-foreground opacity-50" : ""}
                                ${isToday(dayItem) ? "border-primary" : "border-border"}
                            `}
                            onClick={() => setSelectedDate(dayItem)}
                        >
                            <div className="flex justify-between items-start">
                                <span className={`text-sm font-semibold h-7 w-7 flex items-center justify-center rounded-full ${isToday(dayItem) ? "bg-primary text-primary-foreground" : ""}`}>
                                    {format(dayItem, 'd')}
                                </span>
                            </div>
                            <div className="space-y-1 overflow-y-auto max-h-[80px]">
                                {dayTasks.map(task => (
                                    <div key={task.id} className="text-xs truncate px-1 py-0.5 rounded bg-secondary text-secondary-foreground border border-border">
                                        {task.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
                    <p className="text-muted-foreground">View your academic schedule at a glance.</p>
                </div>
                {/* Can add add task button here too */}
            </div>

            <Card className="flex-1">
                <CardContent className="p-6">
                    {renderHeader()}
                    {renderDays()}
                    {renderCells()}
                </CardContent>
            </Card>
        </div>
    );
}
