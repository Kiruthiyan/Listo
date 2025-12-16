'use client';

import { format, isPast, isToday } from 'date-fns';
import { Calendar as CalendarIcon, MoreVertical, Edit, Trash2, ChevronDown, ChevronUp, BookOpen, AlertCircle, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SubtaskList, { Subtask } from '@/components/features/tasks/SubtaskList';
import { useState } from 'react';

// Reusing interface (should export from a types file optimally)
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

interface TaskListViewProps {
    tasks: Task[];
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
    onUpdateStatus: (task: Task, status: 'TODO' | 'IN_PROGRESS' | 'DONE') => void;
    onUpdate: () => void;
}

export default function TaskListView({ tasks, onEdit, onDelete, onUpdateStatus, onUpdate }: TaskListViewProps) {
    const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

    const toggleExpand = (taskId: string) => {
        const newSet = new Set(expandedTasks);
        if (newSet.has(taskId)) newSet.delete(taskId);
        else newSet.add(taskId);
        setExpandedTasks(newSet);
    };

    const getPriorityColor = (p: string) => {
        switch (p) {
            case 'HIGH': return 'text-red-500 bg-red-500/10';
            case 'MEDIUM': return 'text-yellow-500 bg-yellow-500/10';
            case 'LOW': return 'text-blue-500 bg-blue-500/10';
            default: return 'text-muted-foreground';
        }
    };

    return (
        <div className="rounded-md border border-border/50 bg-card">
            {/* Header */}
            <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 p-3 border-b border-border/50 text-xs font-medium text-muted-foreground items-center px-4">
                <div className="w-6"></div> {/* Expand Icon */}
                <div>Title</div>
                <div className="hidden sm:block">Subject</div>
                <div className="hidden sm:block">Status</div>
                <div className="hidden md:block">Priority</div>
                <div>Due Date</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-border/50">
                {tasks.map((task) => (
                    <div key={task.id} className="group bg-card transition-colors hover:bg-accent/30">
                        <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 p-3 items-center px-4 cursor-pointer" onClick={() => toggleExpand(task.id)}>

                            {/* Expand Toggle */}
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); toggleExpand(task.id); }}>
                                {expandedTasks.has(task.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>

                            {/* Title */}
                            <div className="min-w-0">
                                <span className={`font-medium text-sm block truncate ${task.status === 'DONE' ? 'line-through text-muted-foreground' : ''}`}>
                                    {task.title}
                                </span>
                                {task.subtasks?.length > 0 && (
                                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                        <div className="h-1 w-1 rounded-full bg-primary/50" />
                                        {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} subtasks
                                    </span>
                                )}
                            </div>

                            {/* Subject */}
                            <div className="hidden sm:block">
                                {task.subject ? (
                                    <Badge variant="outline" className="font-normal text-[10px] bg-secondary/30">
                                        {task.subject}
                                    </Badge>
                                ) : <span className="text-muted-foreground text-[10px]">-</span>}
                            </div>

                            {/* Status */}
                            <div className="hidden sm:block" onClick={(e) => e.stopPropagation()}>
                                <Select defaultValue={task.status} onValueChange={(v) => onUpdateStatus(task, v as any)}>
                                    <SelectTrigger className="h-6 text-[10px] w-[100px] border-border/50 bg-secondary/20">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="TODO">Todo</SelectItem>
                                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                        <SelectItem value="DONE">Done</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Priority */}
                            <div className="hidden md:block">
                                <Badge variant="secondary" className={`text-[10px] px-1.5 h-5 ${getPriorityColor(task.priority)}`}>
                                    {task.priority}
                                </Badge>
                            </div>

                            {/* Due Date & Actions */}
                            <div className="flex items-center gap-4 justify-end min-w-[120px]">
                                {task.dueDate && (
                                    <span className={`text-xs flex items-center gap-1 ${isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate)) && task.status !== 'DONE' ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                                        {format(new Date(task.dueDate), "MMM d")}
                                    </span>
                                )}

                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); onEdit(task); }}>
                                        <Pencil className="h-3 w-3" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}>
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Expanded Content (Subtasks) */}
                        {expandedTasks.has(task.id) && (
                            <div className="bg-secondary/5 px-4 pb-4 pt-0 pl-12 border-t border-border/30">
                                <SubtaskList taskId={task.id} subtasks={task.subtasks} onUpdate={onUpdate} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
