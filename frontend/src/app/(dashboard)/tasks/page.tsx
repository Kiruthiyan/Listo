'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Filter, Calendar as CalendarIcon, Trash2, BookOpen, AlertCircle, Pencil, LayoutGrid, List as ListIcon } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'sonner';
import TaskForm from '@/components/features/tasks/TaskForm';
import { format, isPast, isToday, isThisWeek } from 'date-fns';
import SubtaskList, { Subtask } from '@/components/features/tasks/SubtaskList';
import TaskListView from '@/components/features/tasks/TaskListView';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Task {
    id: string;
    title: string;
    description: string;
    subject?: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    dueDate: string;
    subtasks: Subtask[];
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
    const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('LIST');

    const openEditDialog = (task: Task) => {
        setEditingTask(task);
        setIsDialogOpen(true);
    };

    const handleDialogClose = (open: boolean) => {
        setIsDialogOpen(open);
        if (!open) setEditingTask(null);
    };

    const toggleExpand = (taskId: string) => {
        const newSet = new Set(expandedTasks);
        if (newSet.has(taskId)) {
            newSet.delete(taskId);
        } else {
            newSet.add(taskId);
        }
        setExpandedTasks(newSet);
    };

    // Filters
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [priorityFilter, setPriorityFilter] = useState('ALL');
    const [dateFilter, setDateFilter] = useState('ALL');

    const fetchTasks = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/tasks');
            setTasks(res.data);
        } catch (error) {
            toast.error('Failed to load tasks');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const deleteTask = async (id: string) => {
        const previousTasks = [...tasks];
        setTasks(tasks.filter(t => t.id !== id));
        try {
            await api.delete(`/tasks/${id}`);
            toast.success("Task deleted");
        } catch (error) {
            setTasks(previousTasks);
            toast.error("Failed to delete task");
        }
    };

    const toggleStatus = async (task: Task) => {
        // This function is now used by Select to set specific status
        const updatedTask = { ...task };
        // Logic: if task status passed is different, update.
        // Actually, the Select calls this with { ...task, status: value }.
        // So 'task' argument ALREADY has new status. 
        // But let's rename it for clarity in a real refactor, but here keeping name 'toggleStatus' to minimize diffs 
        // or just accept we are passing updated object.

        setTasks(tasks.map(t => t.id === task.id ? task : t));
        try {
            await api.put(`/tasks/${task.id}`, { status: task.status });
        } catch (error) {
            setTasks(tasks); // Revert needs original state.. simpler to just fetch or ignore optimistic for now or logic better.
            fetchTasks();
            toast.error("Failed to update status");
        }
    }

    const filteredTasks = tasks.filter(t => {
        // Search
        const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
            t.description?.toLowerCase().includes(search.toLowerCase()) ||
            t.subject?.toLowerCase().includes(search.toLowerCase());

        // Status Filter
        if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;

        // Priority Filter
        if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) return false;

        // Date Filter
        if (dateFilter !== 'ALL') {
            if (!t.dueDate) return false;
            const date = new Date(t.dueDate);
            if (dateFilter === 'TODAY' && !isToday(date)) return false;
            if (dateFilter === 'WEEK' && !isThisWeek(date)) return false;
        }

        return matchesSearch;
    });

    const getPriorityColor = (p: string) => {
        switch (p) {
            case 'HIGH': return 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
            case 'MEDIUM': return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
            case 'LOW': return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
            default: return 'bg-secondary text-secondary-foreground';
        }
    }

    const isOverdue = (task: Task) => {
        if (task.status === 'DONE' || !task.dueDate) return false;
        return isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate));
    }

    return (
        <div className="space-y-8 h-full flex flex-col">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
                    <p className="text-muted-foreground">Manage your academic assignments and to-dos.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setEditingTask(null)}>
                            <Plus className="mr-2 h-4 w-4" />
                            New Task
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
                        </DialogHeader>
                        <TaskForm
                            onSuccess={() => { setIsDialogOpen(false); fetchTasks(); }}
                            initialData={editingTask ? {
                                title: editingTask.title,
                                description: editingTask.description,
                                subject: editingTask.subject,
                                status: editingTask.status,
                                priority: editingTask.priority,
                                dueDate: editingTask.dueDate
                            } : undefined}
                            taskId={editingTask?.id}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search tasks..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* View Toggle */}
                <div className="flex items-center bg-secondary/50 rounded-lg p-1 border border-border/50 shrink-0">
                    <Button
                        variant={viewMode === 'LIST' ? 'secondary' : 'ghost'}
                        size="sm"
                        className={`h-9 px-3 ${viewMode === 'LIST' ? 'bg-background shadow-sm' : ''}`}
                        onClick={() => setViewMode('LIST')}
                    >
                        <ListIcon className="h-4 w-4 mr-2" /> List
                    </Button>
                    <Button
                        variant={viewMode === 'GRID' ? 'secondary' : 'ghost'}
                        size="sm"
                        className={`h-9 px-3 ${viewMode === 'GRID' ? 'bg-background shadow-sm' : ''}`}
                        onClick={() => setViewMode('GRID')}
                    >
                        <LayoutGrid className="h-4 w-4 mr-2" /> Board
                    </Button>
                </div>

                {/* Filters */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Status</SelectItem>
                        <SelectItem value="TODO">To Do</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="DONE">Done</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Priority</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="LOW">Low</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Due Date" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Dates</SelectItem>
                        <SelectItem value="TODAY">Due Today</SelectItem>
                        <SelectItem value="WEEK">This Week</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-24 rounded-lg bg-secondary/50 animate-pulse" />
                        ))}
                    </div>
                ) : filteredTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border-2 border-dashed rounded-lg">
                        <p>No tasks found matching your filters.</p>
                        <Button variant="link" onClick={() => { setSearch(''); setStatusFilter('ALL'); setPriorityFilter('ALL'); setDateFilter('ALL') }}>Clear filters</Button>
                    </div>
                ) : viewMode === 'LIST' ? (
                    <TaskListView
                        tasks={filteredTasks}
                        onEdit={openEditDialog}
                        onDelete={deleteTask}
                        onUpdateStatus={(task, status) => toggleStatus({ ...task, status })}
                        onUpdate={fetchTasks}
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredTasks.map(task => (
                            <Card
                                key={task.id}
                                className={`transition-all hover:bg-accent/50 group 
                                ${task.status === 'DONE' ? 'opacity-60' : ''}
                                ${isOverdue(task) ? 'border-red-400 ring-1 ring-red-400/20' : ''}
                            `}
                            >
                                <CardContent className="p-4 flex items-center gap-4">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={`rounded-full border-2 h-6 w-6 p-0 ${task.status === 'DONE' ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground'}`}
                                        onClick={() => toggleStatus(task)}
                                    >
                                        {task.status === 'DONE' && <div className="h-3 w-3 bg-current rounded-full" />}
                                    </Button>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            {task.subject && (
                                                <Badge variant="outline" className="text-xs font-normal bg-secondary/50 text-foreground flex items-center gap-1">
                                                    <BookOpen className="h-3 w-3" />
                                                    {task.subject}
                                                </Badge>
                                            )}
                                            {/* Status Dropdown */}
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <Select
                                                    defaultValue={task.status}
                                                    onValueChange={(value) => toggleStatus({ ...task, status: value as any })}
                                                >
                                                    <SelectTrigger className="h-5 text-[10px] w-auto px-2 gap-1 border-0 bg-secondary/50 focus:ring-0">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="TODO">Todo</SelectItem>
                                                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                                        <SelectItem value="DONE">Done</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <Badge variant="secondary" className={`text-[10px] h-5 px-1.5 ${getPriorityColor(task.priority)}`}>
                                                {task.priority.toLowerCase()}
                                            </Badge>
                                            {isOverdue(task) && (
                                                <Badge variant="destructive" className="text-[10px] h-5 px-1.5 flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" />
                                                    Overdue
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className={`font-medium truncate flex-1 ${task.status === 'DONE' ? 'line-through text-muted-foreground' : ''}`}>
                                                {task.title}
                                            </h3>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100"
                                                onClick={(e) => { e.stopPropagation(); openEditDialog(task); }}
                                            >
                                                <Pencil className="h-3 w-3" />
                                            </Button>
                                        </div>
                                        {task.description && <p className="text-sm text-muted-foreground truncate">{task.description}</p>}
                                        {task.dueDate && (
                                            <div className={`flex items-center text-xs mt-1 ${isOverdue(task) ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
                                                <CalendarIcon className="mr-1 h-3 w-3" />
                                                {format(new Date(task.dueDate), "MMM d, h:mm a")}
                                            </div>
                                        )}

                                        <div className="mt-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 px-1.5 text-xs text-muted-foreground hover:bg-transparent hover:text-primary p-0"
                                                onClick={(e) => { e.stopPropagation(); toggleExpand(task.id); }}
                                            >
                                                {expandedTasks.has(task.id) ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
                                                {task.subtasks?.length > 0
                                                    ? `${task.subtasks.filter(s => s.completed).length}/${task.subtasks.length} Subtasks`
                                                    : "Add Subtasks"}
                                            </Button>
                                        </div>

                                        {expandedTasks.has(task.id) && (
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <SubtaskList
                                                    taskId={task.id}
                                                    subtasks={task.subtasks || []}
                                                    onUpdate={fetchTasks}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => deleteTask(task.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
