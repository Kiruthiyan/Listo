'use client';
import { useState, useEffect } from 'react';
import { addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, format, startOfWeek, endOfWeek } from 'date-fns';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TaskForm from '@/components/features/tasks/TaskForm';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function CalendarPage() {
    const [date, setDate] = useState(new Date());
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Modal State
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<any | null>(null);

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks');
            setTasks(res.data);
        } catch (error) {
            console.error("Failed to fetch tasks");
            toast.error("Failed to sync calendar");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // Calendar Generation Logic
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    const handleCreateTask = () => {
        setSelectedTask(null);
        setIsTaskModalOpen(true);
    }

    const handleDayClick = (day: Date) => {
        setSelectedDate(day);
    }

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-4rem)] gap-4 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Schedule</h2>
                    <p className="text-xs md:text-base text-muted-foreground">Stay organized.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-secondary/50 rounded-full p-1 border border-border/50">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setDate(subMonths(date, 1))}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-semibold w-24 text-center">{format(date, 'MMMM yyyy')}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setDate(addMonths(date, 1))}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile/Desktop Split View */}
            <div className="flex flex-col lg:flex-row gap-6 h-full min-h-0">

                {/* Calendar Grid */}
                <Card className="flex-1 border-none shadow-sm bg-card/50 ring-1 ring-inset ring-muted/50 overflow-hidden flex flex-col">
                    <CardContent className="p-2 md:p-4 flex-1 flex flex-col">
                        {/* Weekday Headers */}
                        <div className="grid grid-cols-7 mb-2">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider py-1">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Days Grid */}
                        <div className="grid grid-cols-7 flex-1 auto-rows-fr gap-1 md:gap-2">
                            {calendarDays.map((day, idx) => {
                                const isCurrentMonth = isSameMonth(day, date);
                                const isSelected = isSameDay(day, selectedDate);
                                const isTodayDate = isToday(day);
                                const dayTasks = tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), day));

                                return (
                                    <div
                                        key={day.toString()}
                                        onClick={() => handleDayClick(day)}
                                        className={`
                                            relative flex flex-col items-center justify-start py-1 rounded-lg cursor-pointer transition-all border
                                            ${!isCurrentMonth ? 'opacity-30 bg-muted/20 border-transparent' : 'bg-card border-border/40'}
                                            ${isSelected ? 'ring-2 ring-primary border-primary/50 shadow-md z-10' : 'hover:bg-accent/50'}
                                            ${isTodayDate && !isSelected ? 'bg-primary/5 border-primary/20 font-semibold' : ''}
                                        `}
                                    >
                                        <span className={`text-xs md:text-sm h-6 w-6 flex items-center justify-center rounded-full mb-1 ${isTodayDate ? 'bg-primary text-primary-foreground' : ''}`}>
                                            {format(day, 'd')}
                                        </span>

                                        {/* Task Dots/Bars */}
                                        <div className="flex flex-col gap-0.5 w-full px-1">
                                            {/* Mobile: Dots */}
                                            <div className="flex gap-0.5 justify-center md:hidden flex-wrap">
                                                {dayTasks.slice(0, 4).map((t, i) => (
                                                    <div key={i} className={`h-1 w-1 rounded-full ${t.priority === 'HIGH' ? 'bg-red-500' : t.priority === 'MEDIUM' ? 'bg-orange-500' : 'bg-blue-500'
                                                        }`} />
                                                ))}
                                            </div>
                                            {/* Desktop: Bars */}
                                            <div className="hidden md:flex flex-col gap-1 w-full overflow-hidden">
                                                {dayTasks.slice(0, 3).map((t, i) => (
                                                    <div key={i} className={`h-4 text-[9px] px-1 rounded truncate flex items-center ${t.priority === 'HIGH' ? 'bg-red-500/10 text-red-600' :
                                                            t.priority === 'MEDIUM' ? 'bg-orange-500/10 text-orange-600' : 'bg-blue-500/10 text-blue-600'
                                                        }`}>
                                                        {t.title}
                                                    </div>
                                                ))}
                                                {dayTasks.length > 3 && <span className="text-[9px] text-muted-foreground text-center">+{dayTasks.length - 3} more</span>}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Selected Day Agenda (Bottom on Mobile, Right on Desktop) */}
                <Card className="h-[35vh] lg:h-auto lg:w-96 border-none shadow-sm bg-card/50 ring-1 ring-inset ring-muted/50 flex flex-col shrink-0">
                    <CardContent className="p-4 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold flex items-center gap-2 text-lg">
                                <CalendarIcon className="h-5 w-5 text-primary" />
                                {isToday(selectedDate) ? 'Today' : format(selectedDate, 'EEEE, MMM d')}
                            </h3>
                            <Button size="sm" onClick={handleCreateTask} className="h-8 px-3 text-xs rounded-full">
                                <Plus className="mr-1.5 h-3.5 w-3.5" /> Add
                            </Button>
                        </div>

                        <ScrollArea className="flex-1 -mr-3 pr-3">
                            <div className="space-y-3">
                                {tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), selectedDate)).length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-40 text-muted-foreground opacity-60">
                                        <Clock className="h-10 w-10 mb-2 stroke-1" />
                                        <p className="text-sm">No tasks for this day</p>
                                    </div>
                                ) : (
                                    tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), selectedDate))
                                        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                                        .map(task => (
                                            <div key={task.id} className="group flex items-start gap-3 p-3 rounded-xl bg-background border border-border/60 hover:border-primary/50 transition-colors shadow-sm cursor-pointer" onClick={() => { setSelectedTask(task); setIsTaskModalOpen(true); }}>
                                                <div className={`mt-1 h-3 w-3 rounded-full border-2 ${task.status === 'DONE' ? 'bg-green-500 border-green-500' : 'border-muted-foreground'}`} />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className={`text-sm font-medium leading-none ${task.status === 'DONE' ? 'line-through text-muted-foreground' : ''}`}>{task.title}</h4>
                                                    <div className="flex items-center gap-2 mt-1.5">
                                                        <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-normal">{format(new Date(task.dueDate), 'h:mm a')}</Badge>
                                                        {task.priority === 'HIGH' && <Badge variant="destructive" className="text-[10px] h-5 px-1.5 font-normal">High</Badge>}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>

            {/* Task Modal */}
            <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{selectedTask ? "Edit Task" : "Create Event"}</DialogTitle>
                    </DialogHeader>
                    <TaskForm
                        onSuccess={() => {
                            setIsTaskModalOpen(false);
                            fetchTasks();
                        }}
                        initialData={selectedTask ? {
                            title: selectedTask.title,
                            description: selectedTask.description,
                            subject: selectedTask.subject,
                            status: selectedTask.status,
                            priority: selectedTask.priority,
                            dueDate: selectedTask.dueDate
                        } : undefined}
                        taskId={selectedTask?.id}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
