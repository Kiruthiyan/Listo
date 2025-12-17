'use client';

import { Task, SubTask } from '@/types/task';
import { format, isPast } from 'date-fns';
import { Calendar, Check, ChevronDown, ChevronRight, Clock, MoreVertical, Pencil, Trash2, AlertCircle, CalendarIcon, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import SubtaskList from './SubtaskList';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TaskListViewProps {
    tasks: Task[];
    onUpdateStatus: (task: Task, status: 'TODO' | 'IN_PROGRESS' | 'DONE') => void;
    onDelete: (taskId: string) => void;
    onEdit: (task: Task) => void;
    onUpdate: () => void;
}

export default function TaskListView({ tasks, onUpdateStatus, onDelete, onEdit, onUpdate }: TaskListViewProps) {
    const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set());

    const toggleExpand = (taskId: number) => {
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
        <div className="bg-card">
            {/* Desktop Header */}
            <div className="hidden md:grid grid-cols-[30px_1fr_120px_130px_100px_140px] gap-4 p-4 border-b border-border/50 text-sm font-semibold text-muted-foreground items-center bg-secondary/10 rounded-t-md">
                <div className="w-6"></div>
                <div>Title</div>
                <div>Subject</div>
                <div>Status</div>
                <div>Priority</div>
                <div>Due Date</div>
            </div>

            {/* List Container */}
            <div className="divide-y divide-border/50">
                {tasks.map((task) => (
                    <div key={task.id} className="group transition-colors hover:bg-muted/30">

                        {/* DESKTOP ROW */}
                        <div className="hidden md:grid grid-cols-[30px_1fr_120px_130px_100px_140px] gap-4 p-4 items-center" onClick={() => toggleExpand(task.id)}>
                            <button onClick={(e) => { e.stopPropagation(); toggleExpand(task.id); }} className="text-muted-foreground hover:text-foreground">
                                {expandedTasks.has(task.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </button>

                            <div className="font-medium text-sm text-foreground truncate">{task.title}</div>

                            <div>
                                {task.subject ? (
                                    <Badge variant="outline" className="text-xs font-normal text-muted-foreground bg-secondary/20 border-secondary-foreground/20">
                                        {task.subject}
                                    </Badge>
                                ) : <span className="text-muted-foreground text-xs">-</span>}
                            </div>

                            <div onClick={(e) => e.stopPropagation()}>
                                <Select defaultValue={task.status} onValueChange={(v) => onUpdateStatus(task, v as any)}>
                                    <SelectTrigger className="h-8 w-[110px] text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="TODO">Todo</SelectItem>
                                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                        <SelectItem value="DONE">Done</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Badge variant="secondary" className={`text-xs px-2 py-0.5 ${getPriorityColor(task.priority)} border-0`}>
                                    {task.priority}
                                </Badge>
                            </div>

                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                                {task.dueDate && (
                                    <>
                                        <Calendar className="h-3 w-3" />
                                        <span className={isPast(new Date(task.dueDate)) ? 'text-destructive' : ''}>
                                            {format(new Date(task.dueDate), 'MMM d')}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* MOBILE FEED CARD */}
                        <div className="md:hidden group relative bg-card/80 backdrop-blur-sm p-4 rounded-xl border-b border-border/50 hover:bg-muted/50 transition-all active:scale-[0.99]" onClick={() => toggleExpand(task.id)}>
                            <div className="flex items-start justify-between gap-3">
                                {/* Left: Priority Indicator */}
                                <div className={`h-10 w-10 flex-shrink-0 rounded-full flex items-center justify-center ${task.priority === 'HIGH' ? 'bg-red-100 text-red-600' :
                                    task.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                                    }`}>
                                    <div className={`h-3 w-3 rounded-full ${task.priority === 'HIGH' ? 'bg-red-500' :
                                        task.priority === 'MEDIUM' ? 'bg-amber-500' : 'bg-blue-500'
                                        }`} />
                                </div>

                                {/* Center: Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{task.subject || 'General'}</p>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${task.status === 'DONE' ? 'bg-green-100 text-green-700' :
                                            task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                                                'bg-slate-100 text-slate-600'
                                            }`}>
                                            {task.status === 'DONE' ? 'Completed' : task.status === 'IN_PROGRESS' ? 'In Progress' : 'To Do'}
                                        </span>
                                    </div>
                                    <h3 className={`text-base font-semibold leading-tight mb-1 text-foreground ${task.status === 'DONE' ? 'line-through opacity-70' : ''}`}>
                                        {task.title}
                                    </h3>

                                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                                        {task.dueDate && (
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                <span>{format(new Date(task.dueDate), 'MMM d')}</span>
                                            </div>
                                        )}
                                        {task.subtasks?.length > 0 && (
                                            <div className="flex items-center gap-1">
                                                <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                                                <span>{task.subtasks.filter((s: SubTask) => s.completed).length}/{task.subtasks.length}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div onClick={(e) => { e.stopPropagation(); onEdit(task); }}>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><Pencil className="h-4 w-4" /></Button>
                                </div>
                            </div>
                        </div>

                        {/* Expanded Subtasks */}
                        {expandedTasks.has(task.id) && (
                            <div className="bg-secondary/5 px-4 pb-4 pt-0 md:pl-14 border-t border-border/30">
                                <SubtaskList taskId={task.id} subtasks={task.subtasks} onUpdate={onUpdate} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
