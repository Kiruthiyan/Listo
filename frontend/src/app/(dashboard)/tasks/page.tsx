'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Filter, Calendar as CalendarIcon, Trash2, BookOpen, AlertCircle, Pencil, LayoutGrid, List as ListIcon, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'sonner';
import TaskForm from '@/components/features/tasks/TaskForm';
import { format, isPast, isToday, isThisWeek } from 'date-fns';
import SubtaskList, { Subtask } from '@/components/features/tasks/SubtaskList';
import TaskListView from '@/components/features/tasks/TaskListView';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter, DrawerClose } from "@/components/ui/drawer"

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

    // Filters
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [priorityFilter, setPriorityFilter] = useState('ALL');
    const [dateFilter, setDateFilter] = useState('ALL');

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
        if (newSet.has(taskId)) newSet.delete(taskId);
        else newSet.add(taskId);
        setExpandedTasks(newSet);
    };

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
        setTasks(tasks.map(t => t.id === task.id ? task : t));
        try {
            await api.put(`/tasks/${task.id}`, { status: task.status });
        } catch (error) {
            fetchTasks();
            toast.error("Failed to update status");
        }
    }

    const filteredTasks = tasks.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
            t.description?.toLowerCase().includes(search.toLowerCase()) ||
            t.subject?.toLowerCase().includes(search.toLowerCase());

        if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
        if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) return false;
        if (dateFilter !== 'ALL') {
            if (!t.dueDate) return false;
            const date = new Date(t.dueDate);
            if (dateFilter === 'TODAY' && !isToday(date)) return false;
            if (dateFilter === 'WEEK' && !isThisWeek(date)) return false;
        }

        return matchesSearch;
    });

    const activeFiltersCount = [
        statusFilter !== 'ALL',
        priorityFilter !== 'ALL',
        dateFilter !== 'ALL'
    ].filter(Boolean).length;

    const clearFilters = () => {
        setStatusFilter('ALL');
        setPriorityFilter('ALL');
        setDateFilter('ALL');
    }

    return (
        <div className="space-y-6 h-full flex flex-col">
            {/* Header Section */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Tasks</h2>
                    <p className="text-xs md:text-base text-muted-foreground hidden md:block">Manage your academic assignments and to-dos.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setEditingTask(null)} className="shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 transition-all active:scale-95">
                            <Plus className="mr-2 h-4 w-4" /> New Task
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

            {/* Mobile: One-Line Filter Bar (Drawer Approach) */}
            <div className="md:hidden">
                <div className="flex items-center gap-3">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search..."
                            className="h-10 pl-9 text-sm rounded-full bg-secondary/30 border-none focus-visible:ring-1 focus-visible:ring-sky-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Filter Button (Opens Drawer) */}
                    <Drawer>
                        <DrawerTrigger asChild>
                            <Button variant={activeFiltersCount > 0 ? "default" : "secondary"} size="icon" className={`h-10 w-10 rounded-full shrink-0 relative ${activeFiltersCount > 0 ? 'bg-sky-500 shadow-lg shadow-sky-500/20' : 'bg-secondary/30 text-muted-foreground'}`}>
                                <SlidersHorizontal className="h-4 w-4" />
                                {activeFiltersCount > 0 && (
                                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center border-2 border-background">
                                        {activeFiltersCount}
                                    </span>
                                )}
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                            <div className="mx-auto w-full max-w-sm">
                                <DrawerHeader className="flex justify-between items-center pb-4">
                                    <DrawerTitle className="text-lg font-bold">Filter Tasks</DrawerTitle>
                                    <DrawerClose asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><X className="h-4 w-4" /></Button>
                                    </DrawerClose>
                                </DrawerHeader>
                                <div className="px-4 pb-8 space-y-6">
                                    {/* Status Filter */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Status</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['ALL', 'TODO', 'IN_PROGRESS', 'DONE'].map(s => (
                                                <div
                                                    key={s}
                                                    onClick={() => setStatusFilter(s)}
                                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer border ${statusFilter === s ? 'bg-sky-500 text-white border-transparent shadow-md shadow-sky-500/20' : 'bg-background border-border text-muted-foreground hover:bg-secondary'}`}
                                                >
                                                    {s === 'ALL' ? 'All' : s.replace('_', ' ')}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Priority Filter */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Priority</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map(p => (
                                                <div
                                                    key={p}
                                                    onClick={() => setPriorityFilter(p)}
                                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer border ${priorityFilter === p
                                                        ? (p === 'HIGH' ? 'bg-red-500 text-white' : p === 'MEDIUM' ? 'bg-orange-500 text-white' : p === 'LOW' ? 'bg-blue-500 text-white' : 'bg-primary text-white')
                                                        : 'bg-background border-border text-muted-foreground hover:bg-secondary'}`}
                                                >
                                                    {p === 'ALL' ? 'Any' : p}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Date Filter */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Due Date</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['ALL', 'TODAY', 'WEEK'].map(d => (
                                                <div
                                                    key={d}
                                                    onClick={() => setDateFilter(d)}
                                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer border ${dateFilter === d ? 'bg-indigo-500 text-white border-transparent' : 'bg-background border-border text-muted-foreground hover:bg-secondary'}`}
                                                >
                                                    {d === 'ALL' ? 'Any Time' : d === 'TODAY' ? 'Due Today' : 'This Week'}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <DrawerFooter className="border-t pt-4">
                                    <div className="flex gap-3">
                                        <Button variant="outline" className="flex-1 rounded-full" onClick={clearFilters}>Reset</Button>
                                        <DrawerClose asChild>
                                            <Button className="flex-1 rounded-full bg-primary text-primary-foreground">Apply Filters</Button>
                                        </DrawerClose>
                                    </div>
                                </DrawerFooter>
                            </div>
                        </DrawerContent>
                    </Drawer>

                    {/* View Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full shrink-0 text-muted-foreground bg-secondary/30"
                        onClick={() => setViewMode(viewMode === 'LIST' ? 'GRID' : 'LIST')}
                    >
                        {viewMode === 'LIST' ? <LayoutGrid className="h-4 w-4" /> : <ListIcon className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            {/* Desktop Filters (Original) */}
            <div className="hidden md:flex flex-col sm:flex-row gap-4 sm:items-center">
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
                    <Button variant={viewMode === 'LIST' ? 'secondary' : 'ghost'} size="sm" className={`h-9 px-3 ${viewMode === 'LIST' ? 'bg-background shadow-sm' : ''}`} onClick={() => setViewMode('LIST')}>
                        <ListIcon className="h-4 w-4 mr-2" /> List
                    </Button>
                    <Button variant={viewMode === 'GRID' ? 'secondary' : 'ghost'} size="sm" className={`h-9 px-3 ${viewMode === 'GRID' ? 'bg-background shadow-sm' : ''}`} onClick={() => setViewMode('GRID')}>
                        <LayoutGrid className="h-4 w-4 mr-2" /> Board
                    </Button>
                </div>
                {/* Selects */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Status</SelectItem>
                        <SelectItem value="TODO">To Do</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="DONE">Done</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-[140px]"><SelectValue placeholder="Priority" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Priority</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="LOW">Low</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Tasks List */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-20 md:pb-0">
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-24 rounded-lg bg-secondary/50 animate-pulse" />
                        ))}
                    </div>
                ) : filteredTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border-2 border-dashed rounded-lg">
                        <p>No tasks found.</p>
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
                            <Card key={task.id} className={`transition-all hover:bg-accent/50 group ${task.status === 'DONE' ? 'opacity-60' : ''}`}>
                                <CardContent className="p-4 relative">
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant={task.priority === 'HIGH' ? 'destructive' : 'secondary'}>{task.priority}</Badge>
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openEditDialog(task)}><Pencil className="h-3 w-3" /></Button>
                                    </div>
                                    <h3 className="font-semibold">{task.title}</h3>
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                                        <span>{task.dueDate ? format(new Date(task.dueDate), 'MMM d') : 'No date'}</span>
                                        <Select defaultValue={task.status} onValueChange={(v) => toggleStatus({ ...task, status: v as any })}>
                                            <SelectTrigger className="h-6 w-[100px] text-[10px]"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="TODO">Todo</SelectItem>
                                                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                                <SelectItem value="DONE">Done</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
